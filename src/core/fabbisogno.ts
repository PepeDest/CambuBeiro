import type { Aggiustamento, Assegnazione, Ricetta, RigaFabbisogno, Unita } from './types';

export function fabbisognoRicetta(ricetta: Ricetta, porzioni: number): RigaFabbisogno[] {
  return ricetta.ingredienti.map((r) => ({
    ingredienteId: r.ingredienteId,
    quantita: r.dosePersona * porzioni,
    unita: r.unita,
  }));
}

/** Chiave per sommare: stesso ingrediente E stessa unità. */
export const chiaveRiga = (r: { ingredienteId: string; unita: Unita }): string => `${r.ingredienteId}|${r.unita}`;

/**
 * Somma la riga a quelle con lo stesso ingrediente e la stessa unità. Unità diverse (solo per
 * un ingrediente fuori catalogo: per gli altri le sistema ripulisciProgetto) restano righe
 * separate, perché non c'è un'unità giusta in cui convertirle.
 */
export function accumula(acc: Map<string, RigaFabbisogno>, riga: RigaFabbisogno): void {
  const k = chiaveRiga(riga);
  const found = acc.get(k);
  if (found) found.quantita += riga.quantita;
  else acc.set(k, { ...riga });
}

/** Le porzioni avanzate dai conti con la virgola (es. 1,8e-13) contano zero: in Spesa diventerebbero una confezione. */
const senzaBriciole = (porzioni: number): number => (porzioni < 1e-9 ? 0 : porzioni);

/**
 * Ingredienti di un piatto per `porzioni` porzioni, con i suoi aggiustamenti.
 * Gli aggiustamenti contano persone: `porzioniPerPersona` (la porzione media del giorno,
 * perché non sappiamo se sono adulti o bambini) le trasforma in porzioni. Varianti e
 * sostituzioni spostano porzioni del piatto, non ne aggiungono: il totale non supera mai `porzioni`.
 */
export function fabbisognoAssegnazione(
  assegnazione: Assegnazione,
  porzioni: number,
  ricetteById: Map<string, Ricetta>,
  porzioniPerPersona = 1,
): RigaFabbisogno[] {
  // Una ricetta sconosciuta (es. file creato con un'altra versione dell'app) non deve
  // bloccare Dosi e Spesa: il piatto non conta, e il Menu lo segnala come "non trovata".
  const base = ricetteById.get(assegnazione.ricettaId);
  if (!base) return [];

  // Una variante sconosciuta si ignora: quelle persone restano sul piatto base.
  const varianti = assegnazione.aggiustamenti.filter(
    (a): a is Extract<Aggiustamento, { tipo: 'variante' }> => a.tipo === 'variante' && ricetteById.has(a.ricettaVarianteId),
  );
  const porzioniDi = (persone: number): number => persone * porzioniPerPersona;
  const porzioniVarianti = varianti.reduce((s, a) => s + porzioniDi(a.numeroPersone), 0);
  // Varianti per più persone di quelle presenti (solo da un file fatto a mano): si riducono in proporzione.
  const scalaVarianti = porzioniVarianti > porzioni ? porzioni / porzioniVarianti : 1;
  const porzioniBaseNette = senzaBriciole(porzioni - Math.min(porzioniVarianti, porzioni));

  const acc = new Map<string, RigaFabbisogno>();

  // base recipe, ingredient by ingredient, applying removals/substitutions
  for (const riga of base.ingredienti) {
    let porzioniIng = porzioniBaseNette;
    for (const a of assegnazione.aggiustamenti) {
      if (a.tipo === 'rimozione' && a.ingredienteId === riga.ingredienteId) {
        porzioniIng = senzaBriciole(Math.max(0, porzioniIng - porzioniDi(a.numeroPersone)));
      }
      if (a.tipo === 'sostituzione' && a.ingredienteDaId === riga.ingredienteId) {
        // Il sostituto prende solo le porzioni che toglie davvero all'ingrediente (mai di più).
        const tolte = Math.min(porzioniIng, porzioniDi(a.numeroPersone));
        porzioniIng = senzaBriciole(porzioniIng - tolte);
        if (tolte > 0) accumula(acc, { ingredienteId: a.ingredienteAId, quantita: riga.dosePersona * tolte, unita: riga.unita });
      }
    }
    if (porzioniIng > 0) {
      accumula(acc, { ingredienteId: riga.ingredienteId, quantita: riga.dosePersona * porzioniIng, unita: riga.unita });
    }
  }

  // variant recipes
  for (const a of varianti) {
    const porzioniVariante = porzioniDi(a.numeroPersone) * scalaVarianti;
    for (const riga of fabbisognoRicetta(ricetteById.get(a.ricettaVarianteId)!, porzioniVariante)) accumula(acc, riga);
  }

  return [...acc.values()].filter((r) => r.quantita > 0);
}

import type { Aggiustamento, Assegnazione, Ricetta, RigaFabbisogno } from './types';

export function fabbisognoRicetta(ricetta: Ricetta, porzioni: number): RigaFabbisogno[] {
  return ricetta.ingredienti.map((r) => ({
    ingredienteId: r.ingredienteId,
    quantita: r.dosePersona * porzioni,
    unita: r.unita,
  }));
}

export function accumula(acc: Map<string, RigaFabbisogno>, riga: RigaFabbisogno): void {
  const found = acc.get(riga.ingredienteId);
  if (found) {
    if (found.unita !== riga.unita) {
      throw new Error(`Unità incompatibili per ${riga.ingredienteId}: ${found.unita} vs ${riga.unita}`);
    }
    found.quantita += riga.quantita;
  } else {
    acc.set(riga.ingredienteId, { ...riga });
  }
}

export function fabbisognoAssegnazione(
  assegnazione: Assegnazione,
  porzioni: number,
  ricetteById: Map<string, Ricetta>,
): RigaFabbisogno[] {
  // Una ricetta sconosciuta (es. file creato con un'altra versione dell'app) non deve
  // bloccare Dosi e Spesa: il piatto non conta, e il Menu lo segnala come "non trovata".
  const base = ricetteById.get(assegnazione.ricettaId);
  if (!base) return [];

  // Una variante sconosciuta si ignora: quelle persone restano sul piatto base.
  const varianti = assegnazione.aggiustamenti.filter(
    (a): a is Extract<Aggiustamento, { tipo: 'variante' }> => a.tipo === 'variante' && ricetteById.has(a.ricettaVarianteId),
  );
  const porzioniVarianti = varianti.reduce((s, a) => s + a.numeroPersone, 0);
  const porzioniBaseNette = Math.max(0, porzioni - porzioniVarianti);

  const acc = new Map<string, RigaFabbisogno>();

  // base recipe, ingredient by ingredient, applying removals/substitutions
  for (const riga of base.ingredienti) {
    let porzioniIng = porzioniBaseNette;
    for (const a of assegnazione.aggiustamenti) {
      if (a.tipo === 'rimozione' && a.ingredienteId === riga.ingredienteId) {
        porzioniIng -= a.numeroPersone;
      }
      if (a.tipo === 'sostituzione' && a.ingredienteDaId === riga.ingredienteId) {
        porzioniIng -= a.numeroPersone;
        accumula(acc, { ingredienteId: a.ingredienteAId, quantita: riga.dosePersona * a.numeroPersone, unita: riga.unita });
      }
    }
    porzioniIng = Math.max(0, porzioniIng);
    if (porzioniIng > 0) {
      accumula(acc, { ingredienteId: riga.ingredienteId, quantita: riga.dosePersona * porzioniIng, unita: riga.unita });
    }
  }

  // variant recipes
  for (const a of varianti) {
    for (const riga of fabbisognoRicetta(ricetteById.get(a.ricettaVarianteId)!, a.numeroPersone)) accumula(acc, riga);
  }

  return [...acc.values()].filter((r) => r.quantita > 0);
}

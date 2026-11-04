import type { Progetto, Menu } from '../core';
import { databaseBase } from '../data';
import { indiceIngredienti } from './catalogo';

/** "A", "B", "C" */
const elencoNomi = (nomi: string[]): string => nomi.map((n) => `"${n}"`).join(', ');

/**
 * Un ingrediente del ricettario che l'utente ha cambiato di unità (es. farina "a pezzi"),
 * mentre le ricette del ricettario lo usano ancora nella sua unità: torna all'unità del
 * ricettario, con la confezione del ricettario. Le ricette personalizzate non contano:
 * le sistema `unitaRicetteUtente`.
 */
function unitaIngredientiBase(p: Progetto, avvisi: string[]): Progetto {
  const personalizzate = new Set(p.ricetteUtente.map((r) => r.id));
  const usati = new Set(databaseBase.ricette
    .filter((r) => !personalizzate.has(r.id))
    .flatMap((r) => r.ingredienti.map((riga) => riga.ingredienteId)));
  const base = new Map(databaseBase.ingredienti.map((i) => [i.id, i]));

  const rimessi: string[] = [];
  const ingredientiUtente = p.ingredientiUtente.map((i) => {
    const b = base.get(i.id);
    if (!b || b.unita === i.unita || !usati.has(i.id)) return i;
    rimessi.push(i.nome);
    return { ...i, unita: b.unita, confezione: { ...i.confezione, quantita: b.confezione.quantita, unita: b.confezione.unita } };
  });

  if (rimessi.length === 0) return p;
  avvisi.push(rimessi.length === 1
    ? `L’ingrediente ${elencoNomi(rimessi)} aveva un’unità diversa da quella usata dalle ricette del ricettario: ho rimesso quella del ricettario. Controlla la sua confezione.`
    : `Gli ingredienti ${elencoNomi(rimessi)} avevano un’unità diversa da quella usata dalle ricette del ricettario: ho rimesso quella del ricettario. Controlla le loro confezioni.`);
  return { ...p, ingredientiUtente };
}

/** Le righe delle ricette dell'utente prendono l'unità dell'ingrediente (la dose va ricontrollata). */
function unitaRicetteUtente(p: Progetto, avvisi: string[]): Progetto {
  const ingredienti = indiceIngredienti(p);
  const corrette: string[] = [];
  const ricetteUtente = p.ricetteUtente.map((r) => {
    let cambiata = false;
    const righe = r.ingredienti.map((riga) => {
      // Un ingrediente sconosciuto non ha un'unità di riferimento: resta com'è.
      const unita = ingredienti.get(riga.ingredienteId)?.unita;
      if (!unita || unita === riga.unita) return riga;
      cambiata = true;
      return { ...riga, unita };
    });
    if (!cambiata) return r;
    corrette.push(r.nome);
    return { ...r, ingredienti: righe };
  });

  if (corrette.length === 0) return p;
  const dove = corrette.length === 1 ? `Nella ricetta ${elencoNomi(corrette)}` : `Nelle ricette ${elencoNomi(corrette)}`;
  avvisi.push(`${dove} c’erano dosi in un’unità diversa da quella dell’ingrediente (es. grammi invece di pezzi): ho messo l’unità giusta, controlla le dosi.`);
  return { ...p, ricetteUtente };
}

/**
 * Sostituzione tra unità diverse (es. uova in pezzi -> farina in grammi): la dose passa
 * tale e quale al nuovo ingrediente, quindi il risultato non avrebbe senso.
 */
function sostituzioniTraUnita(p: Progetto, avvisi: string[]): Progetto {
  const ingredienti = indiceIngredienti(p);
  const unitaDiversa = (da: string, a: string): boolean => {
    const u1 = ingredienti.get(da)?.unita;
    const u2 = ingredienti.get(a)?.unita;
    return !!u1 && !!u2 && u1 !== u2;
  };

  let tolte = 0;
  const menu: Menu = {};
  for (const [giorno, pasti] of Object.entries(p.menu)) {
    const nuoviPasti: Menu[number] = {};
    for (const [pasto, piatti] of Object.entries(pasti)) {
      nuoviPasti[pasto as keyof typeof pasti] = (piatti ?? []).map((a) => {
        const aggiustamenti = a.aggiustamenti.filter(
          (x) => !(x.tipo === 'sostituzione' && unitaDiversa(x.ingredienteDaId, x.ingredienteAId)),
        );
        tolte += a.aggiustamenti.length - aggiustamenti.length;
        return aggiustamenti.length === a.aggiustamenti.length ? a : { ...a, aggiustamenti };
      });
    }
    menu[Number(giorno)] = nuoviPasti;
  }

  if (tolte === 0) return p;
  const testo = tolte === 1 ? 'Tolta 1 sostituzione' : `Tolte ${tolte} sostituzioni`;
  avvisi.push(`${testo} tra ingredienti che si misurano in modo diverso (es. pezzi e grammi).`);
  return { ...p, menu };
}

/**
 * Sistema i progetti salvati con versioni vecchie dell'app o modificati a mano, che
 * contengono cose oggi bloccate perché rompevano i calcoli (unità che non tornano).
 * Restituisce lo stesso oggetto se non c'è niente da cambiare, e gli avvisi da mostrare all'utente.
 */
export function ripulisciProgetto(p: Progetto): { progetto: Progetto; avvisi: string[] } {
  const avvisi: string[] = [];
  // L'ordine conta: prima le unità degli ingredienti, poi le ricette che li usano, e solo
  // alla fine le sostituzioni, che vanno controllate con le unità definitive.
  let progetto = unitaIngredientiBase(p, avvisi);
  progetto = unitaRicetteUtente(progetto, avvisi);
  progetto = sostituzioniTraUnita(progetto, avvisi);
  return { progetto, avvisi };
}

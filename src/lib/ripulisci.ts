import type { Progetto, Menu } from '../core';
import { indiceIngredienti } from './catalogo';

/**
 * Sistema i progetti salvati con versioni vecchie dell'app, che permettevano cose oggi
 * bloccate perché rompevano i calcoli. Restituisce lo stesso oggetto se non c'è niente
 * da cambiare, e gli avvisi da mostrare all'utente.
 */
export function ripulisciProgetto(p: Progetto): { progetto: Progetto; avvisi: string[] } {
  // Sostituzione tra unità diverse (es. uova in pezzi -> farina in grammi): la dose passa
  // tale e quale al nuovo ingrediente, quindi il risultato non avrebbe senso.
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

  if (tolte === 0) return { progetto: p, avvisi: [] };
  const testo = tolte === 1 ? 'Tolta 1 sostituzione' : `Tolte ${tolte} sostituzioni`;
  return {
    progetto: { ...p, menu },
    avvisi: [`${testo} tra ingredienti che si misurano in modo diverso (es. pezzi e grammi).`],
  };
}

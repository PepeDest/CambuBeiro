import type { Progetto, Ricetta, Ingrediente, Allergene, Pasto, Assegnazione } from './types';
import { PASTI } from './types';
import { presenzeGiorno } from './lookup';

export type TipoConflitto = 'allergene' | 'vegetariano';
export interface Conflitto {
  giorno: number; pasto: Pasto; ricettaId: string;
  tipo: TipoConflitto; dettaglio: string; personeInteressate: number;
}

export function allergeniRicetta(ricetta: Ricetta, ingredientiById: Map<string, Ingrediente>): Allergene[] {
  const set = new Set<Allergene>();
  for (const riga of ricetta.ingredienti) {
    const ing = ingredientiById.get(riga.ingredienteId);
    // Un ingrediente sconosciuto conta come privo di allergeni (fallback permissivo).
    for (const a of ing?.allergeni ?? []) set.add(a);
  }
  return [...set];
}

export function ricettaVegetariana(ricetta: Ricetta, ingredientiById: Map<string, Ingrediente>): boolean {
  // Un ingrediente sconosciuto conta come vegetariano (fallback permissivo).
  return ricetta.ingredienti.every((riga) => ingredientiById.get(riga.ingredienteId)?.vegetariano ?? true);
}

export function rilevaConflitti(
  progetto: Progetto,
  ricetteById: Map<string, Ricetta>,
  ingredientiById: Map<string, Ingrediente>,
): Conflitto[] {
  const out: Conflitto[] = [];
  for (let giorno = 1; giorno <= progetto.campo.numeroGiorni; giorno++) {
    const presenze = presenzeGiorno(progetto, giorno);
    const menuGiorno = progetto.menu[giorno] ?? {};
    for (const pasto of PASTI) {
      for (const a of menuGiorno[pasto] ?? []) {
        const ricetta = ricetteById.get(a.ricettaId);
        if (!ricetta) continue;
        for (const allergene of allergeniRicetta(ricetta, ingredientiById)) {
          const n = presenze.allergici[allergene] ?? 0;
          if (n > 0) out.push({ giorno, pasto, ricettaId: a.ricettaId, tipo: 'allergene', dettaglio: allergene, personeInteressate: n });
        }
        if (presenze.vegetariani > 0 && !ricettaVegetariana(ricetta, ingredientiById)) {
          out.push({ giorno, pasto, ricettaId: a.ricettaId, tipo: 'vegetariano', dettaglio: 'vegetariani', personeInteressate: presenze.vegetariani });
        }
      }
    }
  }
  return out;
}

/**
 * Quante delle persone di un conflitto sono davvero protette dagli aggiustamenti del piatto.
 * - Una variante protegge le sue persone solo se NON contiene il problema (allergene o carne/pesce).
 * - Rimozioni e sostituzioni lavorano ingrediente per ingrediente: una persona è protetta solo
 *   se TUTTI gli ingredienti problematici sono tolti o cambiati con uno senza il problema.
 * Le persone delle varianti e quelle del piatto modificato sono distinte, quindi si sommano.
 */
export function personeCoperte(
  conflitto: Pick<Conflitto, 'tipo' | 'dettaglio'>,
  assegnazione: Assegnazione,
  ricetteById: Map<string, Ricetta>,
  ingredientiById: Map<string, Ingrediente>,
): number {
  // Stesso criterio permissivo di rilevaConflitti per gli ingredienti sconosciuti.
  const problematico = (ingredienteId: string): boolean => {
    const ing = ingredientiById.get(ingredienteId);
    return conflitto.tipo === 'allergene'
      ? (ing?.allergeni ?? []).includes(conflitto.dettaglio as Allergene)
      : !(ing?.vegetariano ?? true);
  };

  let coperte = 0;
  for (const a of assegnazione.aggiustamenti) {
    if (a.tipo !== 'variante') continue;
    const variante = ricetteById.get(a.ricettaVarianteId);
    if (variante && !variante.ingredienti.some((r) => problematico(r.ingredienteId))) coperte += a.numeroPersone;
  }

  const base = ricetteById.get(assegnazione.ricettaId);
  const daSistemare = [...new Set((base?.ingredienti ?? []).map((r) => r.ingredienteId).filter(problematico))];
  if (daSistemare.length === 0) return coperte;
  const sistemate = daSistemare.map((id) =>
    assegnazione.aggiustamenti.reduce((s, a) => {
      if (a.tipo === 'rimozione' && a.ingredienteId === id) return s + a.numeroPersone;
      if (a.tipo === 'sostituzione' && a.ingredienteDaId === id && !problematico(a.ingredienteAId)) return s + a.numeroPersone;
      return s;
    }, 0));
  return coperte + Math.min(...sistemate);
}

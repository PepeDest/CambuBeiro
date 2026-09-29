import type { Progetto, Ricetta, Ingrediente, Allergene, Pasto } from './types';
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

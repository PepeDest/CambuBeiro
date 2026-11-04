import type { Progetto, Ricetta, Ingrediente, Allergene, Pasto, Assegnazione } from './types';
import { presenzeGiorno, pastiAttiviCampo } from './lookup';

export type TipoConflitto = 'allergene' | 'vegetariano';
/** Da dove viene il problema, se non dal piatto: una sua variante o un ingrediente sostituto. */
export type OrigineConflitto = { tipo: 'variante'; ricettaId: string } | { tipo: 'sostituzione'; ingredienteId: string };
export interface Conflitto {
  giorno: number; pasto: Pasto; ricettaId: string;
  tipo: TipoConflitto; dettaglio: string; personeInteressate: number;
  /** Assente per i conflitti del piatto. Con origine il conflitto non si può coprire: va cambiata o tolta la variante/sostituzione. */
  origine?: OrigineConflitto;
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
    for (const pasto of pastiAttiviCampo(progetto.campo)) {
      for (const a of menuGiorno[pasto] ?? []) {
        const ricetta = ricetteById.get(a.ricettaId);
        if (!ricetta) continue;
        const allergeniBase = allergeniRicetta(ricetta, ingredientiById);
        const vegetarianoBase = ricettaVegetariana(ricetta, ingredientiById);
        for (const allergene of allergeniBase) {
          const n = presenze.allergici[allergene] ?? 0;
          if (n > 0) out.push({ giorno, pasto, ricettaId: a.ricettaId, tipo: 'allergene', dettaglio: allergene, personeInteressate: n });
        }
        if (presenze.vegetariani > 0 && !vegetarianoBase) {
          out.push({ giorno, pasto, ricettaId: a.ricettaId, tipo: 'vegetariano', dettaglio: 'vegetariani', personeInteressate: presenze.vegetariani });
        }

        // Varianti e sostituti con un problema che il piatto non ha: chi li mangia potrebbe essere
        // tra gli allergici (o i vegetariani). Se il piatto ha già il problema basta il suo conflitto.
        const ingredientiBase = new Set(ricetta.ingredienti.map((r) => r.ingredienteId));
        for (const agg of a.aggiustamenti) {
          let origine: OrigineConflitto, allergeni: Allergene[], vegetariano: boolean;
          if (agg.tipo === 'variante') {
            const variante = ricetteById.get(agg.ricettaVarianteId);
            if (!variante) continue;
            origine = { tipo: 'variante', ricettaId: agg.ricettaVarianteId };
            allergeni = allergeniRicetta(variante, ingredientiById);
            vegetariano = ricettaVegetariana(variante, ingredientiById);
          } else if (agg.tipo === 'sostituzione' && ingredientiBase.has(agg.ingredienteDaId)) {
            // Stesso criterio permissivo per un sostituto sconosciuto.
            const sostituto = ingredientiById.get(agg.ingredienteAId);
            origine = { tipo: 'sostituzione', ingredienteId: agg.ingredienteAId };
            allergeni = sostituto?.allergeni ?? [];
            vegetariano = sostituto?.vegetariano ?? true;
          } else continue;

          const aggiungi = (tipo: TipoConflitto, dettaglio: string, n: number) => {
            const persone = Math.min(n, agg.numeroPersone);
            if (persone > 0) out.push({ giorno, pasto, ricettaId: a.ricettaId, tipo, dettaglio, personeInteressate: persone, origine });
          };
          for (const allergene of allergeni) {
            if (!allergeniBase.includes(allergene)) aggiungi('allergene', allergene, presenze.allergici[allergene] ?? 0);
          }
          if (vegetarianoBase && !vegetariano) aggiungi('vegetariano', 'vegetariani', presenze.vegetariani);
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

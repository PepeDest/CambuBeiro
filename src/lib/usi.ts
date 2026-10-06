import type { Progetto, Assegnazione, Pasto } from '../core';
import { PASTI, ETICHETTE_PASTO, giorniCampo } from '../core';
import { ricetteDisponibili, nomeRicetta } from './catalogo';

// Dove è usata una ricetta o un ingrediente: serve a non cancellarli mentre sono in uso.

/** Tutti i piatti del menu, in ordine di giorno e di pasto. */
function piattiDelMenu(p: Progetto): { giorno: number; pasto: Pasto; a: Assegnazione }[] {
  return giorniCampo(p.campo).flatMap((giorno) =>
    PASTI.flatMap((pasto) => (p.menu[giorno]?.[pasto] ?? []).map((a) => ({ giorno, pasto, a }))));
}

const dove = (giorno: number, pasto: Pasto) => `Giorno ${giorno} · ${ETICHETTE_PASTO[pasto]}`;

export function usiRicetta(p: Progetto, id: string): string[] {
  const out: string[] = [];
  for (const { giorno, pasto, a } of piattiDelMenu(p)) {
    if (a.ricettaId === id) out.push(dove(giorno, pasto));
    if (a.aggiustamenti.some((x) => x.tipo === 'variante' && x.ricettaVarianteId === id)) {
      out.push(`${dove(giorno, pasto)} (variante di ${nomeRicetta(p, a.ricettaId)})`);
    }
  }
  return out;
}

export function usiIngrediente(p: Progetto, id: string): string[] {
  const out = ricetteDisponibili(p)
    .filter((r) => r.ingredienti.some((x) => x.ingredienteId === id))
    .map((r) => `Ricetta: ${r.nome}`);
  for (const { giorno, pasto, a } of piattiDelMenu(p)) {
    const usato = a.aggiustamenti.some((x) =>
      (x.tipo === 'rimozione' && x.ingredienteId === id) ||
      (x.tipo === 'sostituzione' && (x.ingredienteDaId === id || x.ingredienteAId === id)));
    if (usato) out.push(`${dove(giorno, pasto)} (${nomeRicetta(p, a.ricettaId)})`);
  }
  return out;
}

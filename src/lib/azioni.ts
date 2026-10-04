import type {
  Progetto, Campo, Presenze, Pasto, Ricetta, Ingrediente, Aggiustamento, Assegnazione, Allergene,
} from '../core';

export function conCampo(p: Progetto, campo: Campo): Progetto {
  return { ...p, campo };
}

export function conGiornoTipo(p: Progetto, giornoTipo: Presenze): Progetto {
  return { ...p, campo: { ...p.campo, giornoTipo } };
}

export function conPresenzeGiorno(p: Progetto, giorno: number, presenze: Presenze): Progetto {
  return { ...p, giorni: { ...p.giorni, [giorno]: presenze } };
}

export function rimuoviPresenzeGiorno(p: Progetto, giorno: number): Progetto {
  const giorni = { ...p.giorni };
  delete giorni[giorno];
  return { ...p, giorni };
}

// --- Campo ---

/** Giorni di spesa da testo ("1, 5, 9"): interi ≥ 1, senza doppioni, ordinati; mai vuoto (default [1]). */
export function parseGiorniSpesa(testo: string): number[] {
  const nums = testo.split(/[,\s]+/).map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n) && n >= 1);
  const ordinati = [...new Set(nums)].sort((a, b) => a - b);
  return ordinati.length > 0 ? ordinati : [1];
}

export function impostaNumeroGiorni(p: Progetto, valore: number): Progetto {
  return conCampo(p, { ...p.campo, numeroGiorni: Math.max(1, Math.round(valore || 1)) });
}

/** La riduzione si inserisce in percentuale (0-100) e si salva come frazione (0-1). */
export function impostaRiduzioneBambini(p: Progetto, percentuale: number): Progetto {
  return conCampo(p, { ...p.campo, riduzioneBambini: Math.min(100, Math.max(0, percentuale || 0)) / 100 });
}

export function impostaGiorniSpesa(p: Progetto, testo: string): Progetto {
  return conCampo(p, { ...p.campo, giorniSpesa: parseGiorniSpesa(testo) });
}

// --- Presenze ---

/** Un conteggio di persone valido: intero ≥ 0 (campo vuoto → 0). */
export function conteggio(valore: number): number {
  return Math.max(0, Math.round(valore || 0));
}

export type CampoPresenze = 'adulti' | 'bambini' | 'vegetariani';

export function impostaPresenza(base: Presenze, campo: CampoPresenze, valore: number): Presenze {
  return { ...base, [campo]: conteggio(valore) };
}

export function impostaAllergene(base: Presenze, allergene: Allergene, valore: number): Presenze {
  return { ...base, allergici: { ...base.allergici, [allergene]: conteggio(valore) } };
}

// --- Menu ---

function conPasto(p: Progetto, giorno: number, pasto: Pasto, lista: Assegnazione[]): Progetto {
  return { ...p, menu: { ...p.menu, [giorno]: { ...(p.menu[giorno] ?? {}), [pasto]: lista } } };
}

export function assegnaPiatto(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): Progetto {
  const lista = p.menu[giorno]?.[pasto] ?? [];
  if (lista.some((a) => a.ricettaId === ricettaId)) return conPasto(p, giorno, pasto, lista);
  return conPasto(p, giorno, pasto, [...lista, { ricettaId, aggiustamenti: [] }]);
}

export function rimuoviPiatto(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): Progetto {
  return conPasto(p, giorno, pasto, (p.menu[giorno]?.[pasto] ?? []).filter((a) => a.ricettaId !== ricettaId));
}

function mappaAssegnazione(
  p: Progetto, giorno: number, pasto: Pasto, ricettaId: string,
  trasforma: (a: Assegnazione) => Assegnazione,
): Progetto {
  const lista = p.menu[giorno]?.[pasto];
  if (!lista || !lista.some((a) => a.ricettaId === ricettaId)) return p;
  return conPasto(p, giorno, pasto, lista.map((a) => (a.ricettaId === ricettaId ? trasforma(a) : a)));
}

export function aggiungiAggiustamento(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string, aggiustamento: Aggiustamento): Progetto {
  return mappaAssegnazione(p, giorno, pasto, ricettaId, (a) => ({ ...a, aggiustamenti: [...a.aggiustamenti, aggiustamento] }));
}

export function rimuoviAggiustamento(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string, indice: number): Progetto {
  return mappaAssegnazione(p, giorno, pasto, ricettaId, (a) => ({ ...a, aggiustamenti: a.aggiustamenti.filter((_, i) => i !== indice) }));
}

// --- Ricette e ingredienti dell'utente ---

export function aggiungiRicettaUtente(p: Progetto, r: Ricetta): Progetto {
  return { ...p, ricetteUtente: [...p.ricetteUtente.filter((x) => x.id !== r.id), r] };
}

export function aggiungiIngredienteUtente(p: Progetto, i: Ingrediente): Progetto {
  return { ...p, ingredientiUtente: [...p.ingredientiUtente.filter((x) => x.id !== i.id), i] };
}

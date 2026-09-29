import type { Unita } from '../core';

export function formatNumeroIt(valore: number, decimali = 1): string {
  const fisso = valore.toFixed(decimali);           // es. "1.20"
  const parti = fisso.split('.');
  const intero = parti[0] ?? '0';
  let frazione = parti[1] ?? '';
  frazione = frazione.replace(/0+$/, '');            // toglie gli zeri finali
  return frazione ? `${intero},${frazione}` : intero;
}

export function formatQuantita(quantita: number, unita: Unita): string {
  if (unita === 'pz') return `${Math.round(quantita)} pz`;
  if (unita === 'g') {
    return quantita >= 1000 ? `${formatNumeroIt(quantita / 1000, 2)} kg` : `${formatNumeroIt(quantita, 0)} g`;
  }
  return quantita >= 1000 ? `${formatNumeroIt(quantita / 1000, 2)} l` : `${formatNumeroIt(quantita, 0)} ml`;
}

export function testoConfezione(cc: { numeroConfezioni: number; etichetta: string; quantitaReale: number; unita: Unita }): string {
  return `${cc.numeroConfezioni} × ${cc.etichetta} (${formatQuantita(cc.quantitaReale, cc.unita)})`;
}

/** Intestazione di un'ondata di spesa (schermo ed Excel). */
export function titoloSpesa(giornoSpesa: number): string {
  return `Spesa del giorno ${giornoSpesa}`;
}

/** Testo di un avviso di freschezza (schermo ed Excel). */
export function testoAvviso(a: { nome: string; giornoConsumo: number; giornoSpesa: number }): string {
  return `${a.nome}: serve il giorno ${a.giornoConsumo}, ma la spesa più vicina è il giorno ${a.giornoSpesa}`;
}

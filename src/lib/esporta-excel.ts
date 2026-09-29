import type { Progetto, Pasto } from '../core';
import { PASTI, ETICHETTE_PASTO, giorniCampo } from '../core';
import { nomeRicetta } from './catalogo';
import { righeDosiCampo, sezioniSpesa } from './derivati';
import { formatQuantita, testoConfezione, testoAvviso, titoloSpesa } from './formato';
import { statoConflitti, descriviAggiustamento } from './conflitti-vista';
import * as XLSX from 'xlsx';

export function datiFoglioMenu(progetto: Progetto): string[][] {
  const stato = statoConflitti(progetto);
  const pasti = PASTI.filter((p) => progetto.campo.pastiAttivi[p]);
  const giorni = giorniCampo(progetto.campo);

  const cella = (giorno: number, pasto: Pasto): string =>
    (progetto.menu[giorno]?.[pasto] ?? [])
      .map((a) => {
        const warn = stato.statoPiatto(giorno, pasto, a.ricettaId) === 'warn' ? '⚠️ ' : '';
        const note = a.aggiustamenti.length
          ? ' (' + a.aggiustamenti.map((x) => descriviAggiustamento(x, progetto)).join('; ') + ')'
          : '';
        return `${warn}${nomeRicetta(progetto, a.ricettaId)}${note}`;
      })
      .join('\n');

  const intest = ['Pasto \\ Giorno', ...giorni.map((g) => `Giorno ${g}`)];
  const righe = pasti.map((pasto) => [ETICHETTE_PASTO[pasto], ...giorni.map((g) => cella(g, pasto))]);
  return [intest, ...righe];
}

export function datiFoglioSpesa(progetto: Progetto): string[][] {
  const { sezioni, avvisi } = sezioniSpesa(progetto);
  if (sezioni.length === 0) return [['Nessuna spesa']];
  const out: string[][] = [];
  sezioni.forEach((s, i) => {
    out.push([titoloSpesa(s.giornoSpesa)]);
    out.push(['Ingrediente', 'Totale', 'Confezioni']);
    for (const r of s.righe) out.push([r.nome, formatQuantita(r.quantita, r.unita), testoConfezione(r)]);
    if (i < sezioni.length - 1) out.push([]);
  });
  if (avvisi.length > 0) {
    out.push(['Avvisi freschezza']);
    for (const a of avvisi) out.push([testoAvviso(a)]);
  }
  return out;
}

export function datiFoglioDosi(progetto: Progetto): string[][] {
  const righe = righeDosiCampo(progetto);
  if (righe.length === 0) return [['Nessuna dose']];
  return [['Ingrediente', 'Quantità'], ...righe.map((r) => [r.nome, formatQuantita(r.quantita, r.unita)])];
}

export function creaCartellaExcel(progetto: Progetto): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datiFoglioMenu(progetto)), 'Menu');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datiFoglioSpesa(progetto)), 'Spesa');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datiFoglioDosi(progetto)), 'Dosi');
  return wb;
}

/** Il file .xlsx pronto da scaricare. */
export function creaFileExcel(progetto: Progetto): Blob {
  // Con type 'array' SheetJS restituisce un Uint8Array.
  const dati = XLSX.write(creaCartellaExcel(progetto), { type: 'array', bookType: 'xlsx' }) as Uint8Array<ArrayBuffer>;
  return new Blob([dati], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

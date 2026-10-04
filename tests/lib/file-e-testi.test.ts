import { describe, it, expect } from 'vitest';
import { nomeFile } from '../../src/lib/file';
import { testoAvviso, titoloSpesa } from '../../src/lib/formato';
import { creaFileExcel } from '../../src/lib/esporta-excel';
import { progettoVuoto } from '../../src/core';

describe('nomeFile', () => {
  it("ripulisce il nome del campo e aggiunge l'estensione", () => {
    expect(nomeFile('Campo Estivo 2026!', 'xlsx')).toBe('Campo_Estivo_2026_.xlsx');
    expect(nomeFile('', 'cambusa')).toBe('campo.cambusa');
  });
});

describe('testi condivisi schermo/Excel', () => {
  it('titoloSpesa e testoAvviso', () => {
    expect(titoloSpesa(5)).toBe('Spesa del giorno 5');
    expect(testoAvviso({ nome: 'Insalata', giornoConsumo: 6, giornoSpesa: 1 }))
      .toBe('Insalata: serve il giorno 6, ma la spesa più vicina è il giorno 1');
  });
});

describe('creaFileExcel', () => {
  it('produce un file .xlsx non vuoto', () => {
    const file = creaFileExcel(progettoVuoto());
    expect(file.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(file.size).toBeGreaterThan(0);
  });
});

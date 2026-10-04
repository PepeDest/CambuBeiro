import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { datiFoglioMenu, datiFoglioSpesa, datiFoglioDosi, creaCartellaExcel } from '../../src/lib/esporta-excel';
import { assegnaPiatto, aggiungiAggiustamento } from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import { databaseBase } from '../../src/data';

function progettoConMenu() {
  let p = progettoVuoto();
  p.campo.numeroGiorni = 2;
  p.campo.pastiAttivi = { colazione: false, pranzo: true, cena: true, merenda: false };
  p.campo.giorniSpesa = [1];
  p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: {} };
  const primo = databaseBase.ricette.find((r) => r.categoria === 'primo')!;
  p = assegnaPiatto(p, 1, 'pranzo', primo.id);
  return { p, primo };
}

describe('datiFoglioMenu', () => {
  it('intestazioni: Pasto\\Giorno + Giorno 1..N; righe solo per pasti attivi', () => {
    const { p } = progettoConMenu();
    const m = datiFoglioMenu(p);
    expect(m[0]).toEqual(['Pasto \\ Giorno', 'Giorno 1', 'Giorno 2']);
    // pranzo e cena attivi (2 righe dati), non colazione/merenda
    expect(m.length).toBe(3);
    expect(m[1]![0]).toBe('Pranzo');
    expect(m[2]![0]).toBe('Cena');
  });
  it('il piatto assegnato compare nella cella del giorno giusto', () => {
    const { p, primo } = progettoConMenu();
    const m = datiFoglioMenu(p);
    expect(m[1]![1]).toContain(primo.nome); // Pranzo, Giorno 1
    expect(m[1]![2]).toBe('');              // Pranzo, Giorno 2 vuoto
  });
  it('un aggiustamento appare come nota e un conflitto non gestito mette ⚠️', () => {
    let p = progettoVuoto();
    p.campo.numeroGiorni = 1;
    p.campo.pastiAttivi = { colazione: false, pranzo: true, cena: false, merenda: false };
    p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: { lattosio: 2 } };
    p.ingredientiUtente = [{ id: 'form', nome: 'Formaggio', unita: 'g', categoria: 'fresco', durataGiorni: 10, confezione: { quantita: 200, unita: 'g', etichetta: 'confezione' }, allergeni: ['lattosio'], vegetariano: true } as any];
    p.ricetteUtente = [{ id: 'piatto_form', nome: 'Piatto formaggio', categoria: 'primo', pasti: ['pranzo'], origine: 'utente', ingredienti: [{ ingredienteId: 'form', dosePersona: 50, unita: 'g' }] } as any];
    p = assegnaPiatto(p, 1, 'pranzo', 'piatto_form');
    // conflitto non gestito → ⚠️
    expect(datiFoglioMenu(p)[1]![1]).toContain('⚠️');
    // aggiungo un aggiustamento → compare la nota e sparisce ⚠️
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'piatto_form', { tipo: 'rimozione', ingredienteId: 'form', numeroPersone: 2 });
    const cella = datiFoglioMenu(p)[1]![1]!;
    expect(cella).toContain('Rimozione: Formaggio');
    expect(cella).not.toContain('⚠️');
  });
});

describe('datiFoglioSpesa / datiFoglioDosi', () => {
  it('spesa: intestazione ondata + righe; dosi: intestazione + righe', () => {
    const { p } = progettoConMenu();
    const spesa = datiFoglioSpesa(p);
    expect(spesa[0]).toEqual(['Spesa del giorno 1']);
    expect(spesa[1]).toEqual(['Ingrediente', 'Totale', 'Confezioni']);
    expect(spesa.length).toBeGreaterThan(2);
    const dosi = datiFoglioDosi(p);
    expect(dosi[0]).toEqual(['Ingrediente', 'Quantità']);
    expect(dosi.length).toBeGreaterThan(1);
  });
  it('progetto vuoto: messaggi "Nessuna…"', () => {
    const p = progettoVuoto();
    expect(datiFoglioSpesa(p)).toEqual([['Nessuna spesa']]);
    expect(datiFoglioDosi(p)).toEqual([['Nessuna dose']]);
  });
  it('il foglio Spesa include gli avvisi di freschezza quando presenti', () => {
    let p = progettoVuoto();
    p.campo.numeroGiorni = 6;
    p.campo.pastiAttivi = { colazione: false, pranzo: true, cena: false, merenda: false };
    p.campo.giorniSpesa = [1];
    p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: {} };
    p.ingredientiUtente = [{ id: 'insalata_test', nome: 'Insalata', unita: 'g', categoria: 'fresco', durataGiorni: 2, confezione: { quantita: 300, unita: 'g', etichetta: 'busta' }, allergeni: [], vegetariano: true } as any];
    p.ricetteUtente = [{ id: 'insalatona', nome: 'Insalatona', categoria: 'contorno', pasti: ['pranzo'], origine: 'utente', ingredienti: [{ ingredienteId: 'insalata_test', dosePersona: 50, unita: 'g' }] } as any];
    p = assegnaPiatto(p, 6, 'pranzo', 'insalatona'); // consumato giorno 6, spesa giorno 1, durata 2 → avviso
    const spesa = datiFoglioSpesa(p);
    expect(spesa.some((r) => r[0] === 'Avvisi freschezza')).toBe(true);
  });
});

describe('creaCartellaExcel', () => {
  it('ha i tre fogli Menu, Spesa, Dosi con la cella A1 attesa del Menu', () => {
    const { p } = progettoConMenu();
    const wb = creaCartellaExcel(p);
    expect(wb.SheetNames).toEqual(['Menu', 'Spesa', 'Dosi']);
    expect(wb.Sheets['Menu']!['A1']!.v).toBe('Pasto \\ Giorno');
  });
});

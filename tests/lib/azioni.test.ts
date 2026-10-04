import { describe, it, expect } from 'vitest';
import {
  conCampo, conGiornoTipo, conPresenzeGiorno, rimuoviPresenzeGiorno,
  assegnaPiatto, rimuoviPiatto, aggiungiRicettaUtente, aggiungiIngredienteUtente,
} from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import type { Ricetta, Ingrediente } from '../../src/core';

describe('azioni (immutabili)', () => {
  it('conPresenzeGiorno non muta l\'originale', () => {
    const p = progettoVuoto();
    const q = conPresenzeGiorno(p, 2, { adulti: 20, bambini: 5, vegetariani: 1, allergici: {} });
    expect(q.giorni[2]!.adulti).toBe(20);
    expect(p.giorni[2]).toBeUndefined(); // originale intatto
  });
  it('rimuoviPresenzeGiorno toglie il giorno', () => {
    let p = progettoVuoto();
    p = conPresenzeGiorno(p, 3, { adulti: 10, bambini: 0, vegetariani: 0, allergici: {} });
    p = rimuoviPresenzeGiorno(p, 3);
    expect(p.giorni[3]).toBeUndefined();
  });
  it('assegnaPiatto aggiunge e non duplica', () => {
    let p = progettoVuoto();
    p = assegnaPiatto(p, 1, 'pranzo', 'pasta_al_sugo');
    p = assegnaPiatto(p, 1, 'pranzo', 'pasta_al_sugo'); // stesso → no duplicato
    expect(p.menu[1]!.pranzo!.map((a) => a.ricettaId)).toEqual(['pasta_al_sugo']);
  });
  it('rimuoviPiatto toglie solo quello', () => {
    let p = progettoVuoto();
    p = assegnaPiatto(p, 1, 'pranzo', 'pasta_al_sugo');
    p = assegnaPiatto(p, 1, 'pranzo', 'insalata_mista');
    p = rimuoviPiatto(p, 1, 'pranzo', 'pasta_al_sugo');
    expect(p.menu[1]!.pranzo!.map((a) => a.ricettaId)).toEqual(['insalata_mista']);
  });
  it('aggiungiRicettaUtente sostituisce a parità di id', () => {
    let p = progettoVuoto();
    const r1 = { id: 'mia', nome: 'V1', categoria: 'primo', pasti: ['pranzo'], ingredienti: [], origine: 'utente' } as Ricetta;
    const r2 = { ...r1, nome: 'V2' } as Ricetta;
    p = aggiungiRicettaUtente(p, r1);
    p = aggiungiRicettaUtente(p, r2);
    expect(p.ricetteUtente).toHaveLength(1);
    expect(p.ricetteUtente[0]!.nome).toBe('V2');
  });
  it('conCampo e conGiornoTipo aggiornano il campo', () => {
    const p = progettoVuoto();
    const q = conGiornoTipo(p, { adulti: 30, bambini: 0, vegetariani: 0, allergici: {} });
    expect(q.campo.giornoTipo.adulti).toBe(30);
    expect(p.campo.giornoTipo.adulti).toBe(0);
  });
});

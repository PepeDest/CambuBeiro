import { describe, it, expect } from 'vitest';
import { aggiungiAggiustamento, rimuoviAggiustamento } from '../../src/lib/azioni';
import { assegnaPiatto } from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import type { Aggiustamento } from '../../src/core';

function base() {
  let p = progettoVuoto();
  p = assegnaPiatto(p, 1, 'pranzo', 'lasagne');
  return p;
}
const rimozione: Aggiustamento = { tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 };
const variante: Aggiustamento = { tipo: 'variante', ricettaVarianteId: 'lasagne_veg', numeroPersone: 3 };

describe('aggiungiAggiustamento / rimuoviAggiustamento', () => {
  it('aggiunge un aggiustamento al piatto giusto, senza mutare l\'originale', () => {
    const p = base();
    const q = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', rimozione);
    expect(q.menu[1]!.pranzo!.find((a) => a.ricettaId === 'lasagne')!.aggiustamenti).toEqual([rimozione]);
    expect(p.menu[1]!.pranzo!.find((a) => a.ricettaId === 'lasagne')!.aggiustamenti).toEqual([]); // originale intatto
  });
  it('accumula più aggiustamenti in ordine', () => {
    let p = base();
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', rimozione);
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', variante);
    expect(p.menu[1]!.pranzo!.find((a) => a.ricettaId === 'lasagne')!.aggiustamenti).toEqual([rimozione, variante]);
  });
  it('rimuove per indice', () => {
    let p = base();
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', rimozione);
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', variante);
    p = rimuoviAggiustamento(p, 1, 'pranzo', 'lasagne', 0);
    expect(p.menu[1]!.pranzo!.find((a) => a.ricettaId === 'lasagne')!.aggiustamenti).toEqual([variante]);
  });
  it('piatto inesistente → progetto invariato', () => {
    const p = base();
    const q = aggiungiAggiustamento(p, 1, 'cena', 'inesistente', rimozione);
    expect(q).toEqual(p);
  });
});

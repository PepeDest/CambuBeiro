import { describe, it, expect } from 'vitest';
import {
  piattoGestito, conflittiVista, statoConflitti, personeImpegnate, personePresenti, personeDisponibili,
  puoAggiungereAggiustamento, creaAggiustamento, descriviAggiustamento,
} from '../../src/lib/conflitti-vista';
import { assegnaPiatto, aggiungiAggiustamento } from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import type { Ricetta, Ingrediente } from '../../src/core';

// Scenario: 1 giorno, 10 adulti, 2 intolleranti al lattosio; piatto "lasagne" con besciamella (lattosio).
function scenario() {
  let p = progettoVuoto();
  p.campo.numeroGiorni = 1;
  p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: { lattosio: 2 } };
  p.ingredientiUtente = [
    { id: 'besciamella', nome: 'Besciamella', unita: 'g', categoria: 'fresco', durataGiorni: 5, confezione: { quantita: 500, unita: 'g', etichetta: 'confezione' }, allergeni: ['lattosio'], vegetariano: true } as Ingrediente,
    { id: 'pasta_lasagne', nome: 'Pasta per lasagne', unita: 'g', categoria: 'secco', durataGiorni: 365, confezione: { quantita: 500, unita: 'g', etichetta: 'confezione' }, allergeni: ['glutine'], vegetariano: true } as Ingrediente,
  ];
  p.ricetteUtente = [
    { id: 'lasagne', nome: 'Lasagne', categoria: 'primo', pasti: ['pranzo'], origine: 'utente', ingredienti: [
      { ingredienteId: 'pasta_lasagne', dosePersona: 100, unita: 'g' }, { ingredienteId: 'besciamella', dosePersona: 50, unita: 'g' },
    ] } as Ricetta,
  ];
  p = assegnaPiatto(p, 1, 'pranzo', 'lasagne');
  return p;
}

describe('conflitti-vista', () => {
  it('un piatto in conflitto senza aggiustamenti è NON gestito e compare nel riepilogo', () => {
    const p = scenario();
    expect(piattoGestito(p, 1, 'pranzo', 'lasagne')).toBe(false);
    const stato = statoConflitti(p);
    const ng = stato.nonGestiti;
    expect(ng.some((c) => c.ricettaId === 'lasagne' && c.dettaglio === 'lattosio' && c.personeInteressate === 2)).toBe(true);
    expect(ng[0]!.nomeRicetta).toBe('Lasagne');
    expect(stato.cellaAttiva(1, 'pranzo')).toBe(true);
    expect(stato.statoPiatto(1, 'pranzo', 'lasagne')).toBe('warn');
    expect(stato.cellaAttiva(1, 'cena')).toBe(false);
    expect(stato.statoPiatto(1, 'cena', 'lasagne')).toBe('');
  });
  it('con un aggiustamento il piatto è gestito e sparisce dai non gestiti', () => {
    let p = scenario();
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', { tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 });
    expect(piattoGestito(p, 1, 'pranzo', 'lasagne')).toBe(true);
    const stato = statoConflitti(p);
    expect(stato.nonGestiti.length).toBe(0);
    expect(stato.cellaAttiva(1, 'pranzo')).toBe(false);
    expect(stato.statoPiatto(1, 'pranzo', 'lasagne')).toBe('ok');
    // ma resta nella vista completa, marcato gestito
    expect(conflittiVista(p).every((c) => c.gestito)).toBe(true);
  });
  it('personePresenti = adulti + bambini; il cap blocca oltre il limite', () => {
    const p = scenario();
    expect(personePresenti(p, 1)).toBe(10);
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 10)).toBe(true);
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 11)).toBe(false);
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 0)).toBe(false);
  });
  it('personeImpegnate somma e il cap tiene conto di quelli già messi', () => {
    let p = scenario();
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', { tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 7 });
    const a = p.menu[1]!.pranzo!.find((x) => x.ricettaId === 'lasagne')!;
    expect(personeImpegnate(a)).toBe(7);
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 3)).toBe(true);  // 7+3=10 ok
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 4)).toBe(false); // 7+4=11 oltre
    expect(personeDisponibili(p, 1, 'pranzo', 'lasagne')).toBe(3);
  });
  it('personeDisponibili non va mai sotto zero se le presenze calano', () => {
    let p = scenario();
    p = aggiungiAggiustamento(p, 1, 'pranzo', 'lasagne', { tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 8 });
    p.campo.giornoTipo = { ...p.campo.giornoTipo, adulti: 5 }; // presenze ridotte dopo l'aggiustamento
    expect(personeDisponibili(p, 1, 'pranzo', 'lasagne')).toBe(0);
    expect(puoAggiungereAggiustamento(p, 1, 'pranzo', 'lasagne', 1)).toBe(false);
  });
  it('creaAggiustamento costruisce i tre tipi o segnala il campo mancante', () => {
    const vuoti = { varianteId: '', ingDaId: '', ingAId: '', ingRimId: '' };
    expect(creaAggiustamento('rimozione', { ...vuoti, ingRimId: 'besciamella' }, 2))
      .toEqual({ tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 });
    expect(creaAggiustamento('sostituzione', { ...vuoti, ingDaId: 'a', ingAId: 'b' }, 1))
      .toEqual({ tipo: 'sostituzione', ingredienteDaId: 'a', ingredienteAId: 'b', numeroPersone: 1 });
    expect(creaAggiustamento('variante', { ...vuoti, varianteId: 'lasagne_veg' }, 3))
      .toEqual({ tipo: 'variante', ricettaVarianteId: 'lasagne_veg', numeroPersone: 3 });
    expect(creaAggiustamento('rimozione', vuoti, 2)).toEqual({ errore: 'Scegli un ingrediente da togliere.' });
    expect(creaAggiustamento('sostituzione', { ...vuoti, ingDaId: 'a' }, 2)).toEqual({ errore: 'Scegli entrambi gli ingredienti.' });
    expect(creaAggiustamento('variante', vuoti, 2)).toEqual({ errore: 'Scegli un piatto alternativo.' });
  });
  it('descriviAggiustamento produce testo leggibile in italiano', () => {
    const p = scenario();
    expect(descriviAggiustamento({ tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 }, p)).toBe('Rimozione: Besciamella per 2 persone');
  });
});

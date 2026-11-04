import { describe, it, expect } from 'vitest';
import { ripulisciProgetto } from '../../src/lib/ripulisci';
import { righeDosiCampo, sezioniSpesa } from '../../src/lib/derivati';
import { progettoVuoto } from '../../src/core';
import type { Progetto } from '../../src/core';
import { makeIngrediente, makeRicetta } from '../helpers/factories';

// Un progetto salvato con una versione vecchia dell'app, quando si poteva sostituire
// un ingrediente a pezzi con uno a grammi (uova -> farina): bloccava Dosi e Spesa.
function vecchioProgetto(): Progetto {
  const p = progettoVuoto();
  p.campo.numeroGiorni = 1;
  p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: {} };
  p.menu = { 1: {
    pranzo: [{ ricettaId: 'frittata_classica', aggiustamenti: [
      { tipo: 'sostituzione', ingredienteDaId: 'uova', ingredienteAId: 'farina', numeroPersone: 2 },
      { tipo: 'rimozione', ingredienteId: 'parmigiano', numeroPersone: 1 },
    ] }],
    merenda: [{ ricettaId: 'pancake', aggiustamenti: [] }],
  } };
  return p;
}

describe('ripulisciProgetto', () => {
  it('toglie le sostituzioni tra unità diverse e dice quante', () => {
    const { progetto, avvisi } = ripulisciProgetto(vecchioProgetto());
    expect(progetto.menu[1]!.pranzo![0]!.aggiustamenti).toEqual([{ tipo: 'rimozione', ingredienteId: 'parmigiano', numeroPersone: 1 }]);
    expect(avvisi).toEqual(['Tolta 1 sostituzione tra ingredienti che si misurano in modo diverso (es. pezzi e grammi).']);
    expect(() => righeDosiCampo(progetto)).not.toThrow();
  });
  it('un progetto già a posto resta identico (stesso oggetto) e senza avvisi', () => {
    const p = progettoVuoto();
    expect(ripulisciProgetto(p)).toEqual({ progetto: p, avvisi: [] });
    expect(ripulisciProgetto(p).progetto).toBe(p);
  });
});

// Unità che non tornano, da un file modificato a mano o salvato da una versione vecchia:
// Dosi, Spesa ed Excel si bloccavano con "Unità incompatibili".
describe('ripulisciProgetto: unità delle ricette e degli ingredienti', () => {
  function progettoUnita(): Progetto {
    const p = progettoVuoto();
    p.campo.numeroGiorni = 1;
    p.campo.giornoTipo = { adulti: 10, bambini: 0, vegetariani: 0, allergici: {} };
    return p;
  }

  it('una riga di ricetta con unità diversa dall’ingrediente prende quella dell’ingrediente, con un avviso', () => {
    const p = progettoUnita();
    // uova sono a pezzi; frittata_classica (ricettario) le usa a pezzi
    p.ricetteUtente = [makeRicetta({ id: 'mia_frittata', nome: 'Mia frittata', origine: 'utente', ingredienti: [
      { ingredienteId: 'uova', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
    ] })];
    p.menu = { 1: { pranzo: [{ ricettaId: 'frittata_classica', aggiustamenti: [] }, { ricettaId: 'mia_frittata', aggiustamenti: [] }] } };
    expect(() => righeDosiCampo(p)).toThrow('Unità incompatibili');

    const { progetto, avvisi } = ripulisciProgetto(p);
    expect(progetto.ricetteUtente[0]!.ingredienti).toEqual([
      { ingredienteId: 'uova', dosePersona: 3, unita: 'pz' },
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
    ]);
    expect(avvisi).toHaveLength(1);
    expect(avvisi[0]).toContain('"Mia frittata"');
    expect(avvisi[0]).toContain('controlla le dosi');
    expect(() => righeDosiCampo(progetto)).not.toThrow();
    expect(() => sezioniSpesa(progetto)).not.toThrow();
    expect(righeDosiCampo(progetto).find((r) => r.ingredienteId === 'uova')).toMatchObject({ quantita: 50, unita: 'pz' }); // (2+3)*10
  });

  it('un ingrediente del ricettario cambiato di unità torna alla sua, se le ricette del ricettario lo usano', () => {
    const p = progettoUnita();
    // farina diventata "a pezzi"; scaloppine_limone (ricettario) la usa in grammi
    p.ingredientiUtente = [makeIngrediente({ id: 'farina', nome: 'Farina mia', unita: 'pz', confezione: { quantita: 6, unita: 'pz', etichetta: 'sacchetto' } })];
    p.ricetteUtente = [makeRicetta({ id: 'mia_torta', nome: 'Mia torta', origine: 'utente', ingredienti: [{ ingredienteId: 'farina', dosePersona: 1, unita: 'pz' }] })];
    p.menu = { 1: {
      pranzo: [{ ricettaId: 'scaloppine_limone', aggiustamenti: [] }],
      // uova (pz) -> farina: con farina a pezzi sembrava accettabile, con farina in grammi no
      cena: [{ ricettaId: 'frittata_classica', aggiustamenti: [{ tipo: 'sostituzione', ingredienteDaId: 'uova', ingredienteAId: 'farina', numeroPersone: 2 }] },
        { ricettaId: 'mia_torta', aggiustamenti: [] }],
    } };
    expect(() => righeDosiCampo(p)).toThrow('Unità incompatibili');

    const { progetto, avvisi } = ripulisciProgetto(p);
    expect(progetto.ingredientiUtente[0]).toMatchObject({
      id: 'farina', nome: 'Farina mia', unita: 'g', confezione: { quantita: 1000, unita: 'g', etichetta: 'sacchetto' },
    });
    expect(progetto.ricetteUtente[0]!.ingredienti[0]!.unita).toBe('g');
    expect(progetto.menu[1]!.cena![0]!.aggiustamenti).toEqual([]);
    expect(avvisi).toHaveLength(3);
    expect(avvisi[0]).toContain('"Farina mia"');
    expect(avvisi[1]).toContain('"Mia torta"');
    expect(avvisi[2]).toContain('Tolta 1 sostituzione');
    expect(() => righeDosiCampo(progetto)).not.toThrow();
    expect(() => sezioniSpesa(progetto)).not.toThrow();
  });

  it('un ingrediente del ricettario cambiato di unità ma usato solo dalle ricette tue resta com’è', () => {
    const p = progettoUnita();
    // pinoli: nessuna ricetta del ricettario; zafferano: solo risotto_milanese, che qui è personalizzato
    const aPezzi = { unita: 'pz' as const, confezione: { quantita: 10, unita: 'pz' as const, etichetta: 'bustina' } };
    p.ingredientiUtente = [makeIngrediente({ id: 'pinoli', ...aPezzi }), makeIngrediente({ id: 'zafferano', ...aPezzi })];
    p.ricetteUtente = [makeRicetta({ id: 'risotto_milanese', origine: 'utente', ingredienti: [
      { ingredienteId: 'zafferano', dosePersona: 0.1, unita: 'pz' },
      { ingredienteId: 'pinoli', dosePersona: 1, unita: 'pz' },
    ] })];
    p.menu = { 1: { pranzo: [{ ricettaId: 'risotto_milanese', aggiustamenti: [] }] } };
    expect(ripulisciProgetto(p)).toEqual({ progetto: p, avvisi: [] });
    expect(ripulisciProgetto(p).progetto).toBe(p);
  });

  it('ingredienti e ricette tue con le unità giuste: stesso oggetto, nessun avviso', () => {
    const p = progettoUnita();
    p.ingredientiUtente = [makeIngrediente({ id: 'farina', nome: 'Farina mia', unita: 'g' }), makeIngrediente({ id: 'tofu', unita: 'pz', confezione: { quantita: 2, unita: 'pz', etichetta: 'panetto' } })];
    p.ricetteUtente = [makeRicetta({ id: 'mia', origine: 'utente', ingredienti: [
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'tofu', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'sconosciuto', dosePersona: 1, unita: 'ml' },
    ] })];
    expect(ripulisciProgetto(p)).toEqual({ progetto: p, avvisi: [] });
    expect(ripulisciProgetto(p).progetto).toBe(p);
  });
});

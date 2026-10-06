import { describe, it, expect } from 'vitest';
import { ripulisciProgetto } from '../../src/lib/ripulisci';
import { righeDosiCampo } from '../../src/lib/derivati';
import { progettoVuoto } from '../../src/core';
import type { Progetto } from '../../src/core';

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

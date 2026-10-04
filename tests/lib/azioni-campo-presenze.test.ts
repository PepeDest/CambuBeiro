import { describe, it, expect } from 'vitest';
import {
  conteggio, impostaPresenza, impostaAllergene, parseGiorniSpesa,
  impostaNumeroGiorni, impostaRiduzioneBambini, impostaGiorniSpesa,
} from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import type { Presenze } from '../../src/core';

const base: Presenze = { adulti: 10, bambini: 2, vegetariani: 1, allergici: { glutine: 1 } };

describe('presenze', () => {
  it('conteggio: intero non negativo, campo vuoto → 0', () => {
    expect(conteggio(3.6)).toBe(4);
    expect(conteggio(-2)).toBe(0);
    expect(conteggio(NaN)).toBe(0);
  });
  it('impostaPresenza cambia solo il campo indicato, senza modificare la base', () => {
    expect(impostaPresenza(base, 'adulti', 15)).toEqual({ ...base, adulti: 15 });
    expect(base.adulti).toBe(10);
  });
  it('impostaAllergene aggiorna un allergene e mantiene gli altri', () => {
    expect(impostaAllergene(base, 'lattosio', 2).allergici).toEqual({ glutine: 1, lattosio: 2 });
    expect(base.allergici).toEqual({ glutine: 1 });
  });
});

describe('campo', () => {
  it('parseGiorniSpesa: interi ≥ 1, ordinati, senza doppioni; mai vuoto', () => {
    expect(parseGiorniSpesa('9, 1, 5 5')).toEqual([1, 5, 9]);
    expect(parseGiorniSpesa('0, -3, abc')).toEqual([1]);
    expect(parseGiorniSpesa('')).toEqual([1]);
  });
  it('impostaNumeroGiorni: almeno 1', () => {
    expect(impostaNumeroGiorni(progettoVuoto(), 5).campo.numeroGiorni).toBe(5);
    expect(impostaNumeroGiorni(progettoVuoto(), 0).campo.numeroGiorni).toBe(1);
  });
  it('impostaRiduzioneBambini: percentuale → frazione, limitata a 0-100', () => {
    expect(impostaRiduzioneBambini(progettoVuoto(), 25).campo.riduzioneBambini).toBe(0.25);
    expect(impostaRiduzioneBambini(progettoVuoto(), 150).campo.riduzioneBambini).toBe(1);
    expect(impostaRiduzioneBambini(progettoVuoto(), NaN).campo.riduzioneBambini).toBe(0);
  });
  it('impostaGiorniSpesa normalizza il testo', () => {
    expect(impostaGiorniSpesa(progettoVuoto(), '3,1').campo.giorniSpesa).toEqual([1, 3]);
  });
});

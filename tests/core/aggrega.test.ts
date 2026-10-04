import { describe, it, expect } from 'vitest';
import { indicizzaRicette, presenzeGiorno } from '../../src/core/lookup';
import { progettoVuoto } from '../../src/core/progetto';
import { makeCampo, makePresenze, makeRicetta } from '../helpers/factories';
import { fabbisognoGiorno, fabbisognoCampoTotale } from '../../src/core/aggrega';

describe('aggrega', () => {
  it('sums the same ingredient across two dishes in one day', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 1, giornoTipo: makePresenze({ adulti: 10, bambini: 0 }) });
    p.ricetteUtente = [
      makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' }] }),
      makeRicetta({ id: 'b', ingredienti: [{ ingredienteId: 'passata_pomodoro', dosePersona: 50, unita: 'g' }] }),
    ];
    p.menu = { 1: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }], cena: [{ ricettaId: 'b', aggiustamenti: [] }] } };
    const rows = fabbisognoGiorno(p, 1, indicizzaRicette(p, []));
    expect(rows.find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(1300); // (80+50)*10
  });

  it('sums the same ingredient across different days into camp total', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 2, giornoTipo: makePresenze({ adulti: 10 }) });
    p.ricetteUtente = [makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' }] })];
    p.menu = { 1: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }] }, 2: { cena: [{ ricettaId: 'a', aggiustamenti: [] }] } };
    const rows = fabbisognoCampoTotale(p, indicizzaRicette(p, []));
    expect(rows.find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(1600); // 800 + 800
  });

  it('throws when merging the same ingredient id with mismatched units across dishes', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 1, giornoTipo: makePresenze({ adulti: 10, bambini: 0 }) });
    p.ricetteUtente = [
      makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'x', dosePersona: 80, unita: 'g' }] }),
      makeRicetta({ id: 'b', ingredienti: [{ ingredienteId: 'x', dosePersona: 50, unita: 'ml' }] }),
    ];
    p.menu = { 1: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }], cena: [{ ricettaId: 'b', aggiustamenti: [] }] } };
    expect(() => fabbisognoGiorno(p, 1, indicizzaRicette(p, []))).toThrow();
  });
});

describe('lookup', () => {
  it('presenzeGiorno falls back to giornoTipo', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ giornoTipo: makePresenze({ adulti: 30 }) });
    expect(presenzeGiorno(p, 3).adulti).toBe(30);
  });
  it('presenzeGiorno uses per-day override when present', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ giornoTipo: makePresenze({ adulti: 30 }) });
    p.giorni[3] = makePresenze({ adulti: 25 });
    expect(presenzeGiorno(p, 3).adulti).toBe(25);
  });
  it('user recipe overrides base recipe with same id', () => {
    const p = progettoVuoto();
    p.ricetteUtente = [makeRicetta({ id: 'shared', nome: 'Mia' })];
    const map = indicizzaRicette(p, [makeRicetta({ id: 'shared', nome: 'Base' })]);
    expect(map.get('shared')!.nome).toBe('Mia');
  });
});

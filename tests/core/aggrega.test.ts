import { describe, it, expect } from 'vitest';
import { indicizzaRicette, presenzeGiorno } from '../../src/core/lookup';
import { progettoVuoto } from '../../src/core/progetto';
import { makeCampo, makePresenze, makeRicetta } from '../helpers/factories';
import { fabbisognoGiorno, fabbisognoCampoTotale } from '../../src/core/aggrega';
import type { Aggiustamento } from '../../src/core/types';

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

  it('un ingrediente fuori catalogo usato con unità diverse non blocca: una riga per unità', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 2, giornoTipo: makePresenze({ adulti: 10, bambini: 0 }) });
    p.ricetteUtente = [
      makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'xyz', dosePersona: 80, unita: 'g' }] }),
      makeRicetta({ id: 'b', ingredienti: [{ ingredienteId: 'xyz', dosePersona: 0.5, unita: 'pz' }] }),
    ];
    p.menu = {
      1: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }], cena: [{ ricettaId: 'b', aggiustamenti: [] }] },
      2: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }] },
    };
    const ricette = indicizzaRicette(p, []);
    expect(fabbisognoGiorno(p, 1, ricette)).toEqual([
      { ingredienteId: 'xyz', quantita: 800, unita: 'g' },
      { ingredienteId: 'xyz', quantita: 5, unita: 'pz' },
    ]);
    // stesso ingrediente e stessa unità si sommano come sempre
    expect(fabbisognoCampoTotale(p, ricette)).toEqual([
      { ingredienteId: 'xyz', quantita: 1600, unita: 'g' },
      { ingredienteId: 'xyz', quantita: 5, unita: 'pz' },
    ]);
  });

  describe('aggiustamenti: le persone diventano porzioni del giorno', () => {
    function giorno(adulti: number, bambini: number, aggiustamenti: Aggiustamento[]) {
      const p = progettoVuoto();
      p.campo = makeCampo({ numeroGiorni: 1, riduzioneBambini: 0.3, giornoTipo: makePresenze({ adulti, bambini }) });
      p.ricetteUtente = [
        makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'pasta', dosePersona: 100, unita: 'g' }, { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' }] }),
        makeRicetta({ id: 'v', ingredienti: [{ ingredienteId: 'riso', dosePersona: 90, unita: 'g' }] }),
      ];
      p.menu = { 1: { pranzo: [{ ricettaId: 'a', aggiustamenti }] } };
      const righe = fabbisognoGiorno(p, 1, indicizzaRicette(p, []));
      return (id: string) => righe.find((r) => r.ingredienteId === id)?.quantita ?? 0;
    }

    it('10 bambini: variante e sostituzione per tutti e 10 comprano 7 porzioni, come il piatto', () => {
      expect(giorno(0, 10, [{ tipo: 'variante', ricettaVarianteId: 'v', numeroPersone: 10 }])('riso')).toBeCloseTo(630);
      const q = giorno(0, 10, [{ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_senza_glutine', numeroPersone: 10 }]);
      expect(q('pasta_senza_glutine')).toBeCloseTo(700);
      expect(q('pasta')).toBe(0);
    });

    it('solo adulti: come prima, una persona è una porzione', () => {
      const q = giorno(10, 0, [
        { tipo: 'variante', ricettaVarianteId: 'v', numeroPersone: 4 },
        { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_senza_glutine', numeroPersone: 3 },
      ]);
      expect([q('riso'), q('pasta'), q('pasta_senza_glutine'), q('passata_pomodoro')]).toEqual([360, 300, 300, 480]);
    });

    it('nessuno presente: niente da comprare, anche con una variante rimasta nel menu', () => {
      const q = giorno(0, 0, [{ tipo: 'variante', ricettaVarianteId: 'v', numeroPersone: 2 }]);
      expect([q('riso'), q('pasta'), q('passata_pomodoro')]).toEqual([0, 0, 0]);
    });
  });

  it('un pasto spento in Campo non conta, ma i suoi piatti tornano se lo si riaccende', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 1, giornoTipo: makePresenze({ adulti: 10 }) }); // merenda spenta
    p.ricetteUtente = [makeRicetta({ id: 'a', ingredienti: [{ ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' }] })];
    p.menu = { 1: { pranzo: [{ ricettaId: 'a', aggiustamenti: [] }], merenda: [{ ricettaId: 'a', aggiustamenti: [] }] } };
    const ricette = indicizzaRicette(p, []);
    expect(fabbisognoGiorno(p, 1, ricette).find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(800);
    expect(fabbisognoCampoTotale(p, ricette).find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(800);
    p.campo.pastiAttivi = { ...p.campo.pastiAttivi, merenda: true };
    expect(fabbisognoGiorno(p, 1, ricette).find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(1600);
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

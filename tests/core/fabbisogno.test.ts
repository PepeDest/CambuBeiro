import { describe, it, expect } from 'vitest';
import { fabbisognoRicetta, fabbisognoAssegnazione } from '../../src/core/fabbisogno';
import { makeRicetta } from '../helpers/factories';
import type { Ricetta } from '../../src/core/types';

describe('fabbisognoRicetta', () => {
  it('scales each ingredient by portions', () => {
    const r = makeRicetta({
      ingredienti: [
        { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' },
        { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
        { ingredienteId: 'olio', dosePersona: 5, unita: 'ml' },
      ],
    });
    const out = fabbisognoRicetta(r, 20);
    expect(out).toEqual([
      { ingredienteId: 'pasta', quantita: 2000, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', quantita: 1600, unita: 'g' },
      { ingredienteId: 'olio', quantita: 100, unita: 'ml' },
    ]);
  });
  it('fractional portions are allowed', () => {
    const r = makeRicetta({ ingredienti: [{ ingredienteId: 'pasta', dosePersona: 100, unita: 'g' }] });
    expect(fabbisognoRicetta(r, 17)[0]!.quantita).toBe(1700);
  });
});

function ricetteMap(...rs: Ricetta[]): Map<string, Ricetta> {
  return new Map(rs.map((r) => [r.id, r]));
}

describe('fabbisognoAssegnazione', () => {
  const sugo = makeRicetta({
    id: 'pasta_sugo',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
    ],
  });

  it('no adjustments equals plain recipe scaling', () => {
    const out = fabbisognoAssegnazione({ ricettaId: 'pasta_sugo', aggiustamenti: [] }, 10, ricetteMap(sugo));
    expect(out).toEqual([
      { ingredienteId: 'pasta', quantita: 1000, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', quantita: 800, unita: 'g' },
    ]);
  });

  it('rimozione reduces only that ingredient for N portions', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'rimozione', ingredienteId: 'passata_pomodoro', numeroPersone: 2 }] },
      10, ricetteMap(sugo),
    );
    // pasta unchanged (1000). passata for 8 portions => 640
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(1000);
    expect(out.find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(640);
  });

  it('sostituzione swaps ingredient for N portions at the same dose', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_senza_glutine', numeroPersone: 3 }] },
      10, ricetteMap(sugo),
    );
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(700);            // 7 portions
    expect(out.find((r) => r.ingredienteId === 'pasta_senza_glutine')!.quantita).toBe(300); // 3 portions
  });

  it('variante moves N portions to another recipe entirely', () => {
    const seitan = makeRicetta({
      id: 'sugo_seitan',
      ingredienti: [{ ingredienteId: 'seitan', dosePersona: 90, unita: 'g' }],
    });
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'sugo_seitan', numeroPersone: 4 }] },
      10, ricetteMap(sugo, seitan),
    );
    // base now for 6 portions
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(600);
    expect(out.find((r) => r.ingredienteId === 'passata_pomodoro')!.quantita).toBe(480);
    expect(out.find((r) => r.ingredienteId === 'seitan')!.quantita).toBe(360); // 4 * 90
  });

  it('throws for an unknown base recipe id', () => {
    expect(() =>
      fabbisognoAssegnazione({ ricettaId: 'nope', aggiustamenti: [] }, 10, new Map()),
    ).toThrow();
  });

  it('throws for an unknown variante recipe id', () => {
    expect(() =>
      fabbisognoAssegnazione(
        { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'nope', numeroPersone: 4 }] },
        10, ricetteMap(sugo),
      ),
    ).toThrow();
  });

  it('rimozione that drops an ingredient to exactly zero omits it from the result', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'rimozione', ingredienteId: 'passata_pomodoro', numeroPersone: 10 }] },
      10, ricetteMap(sugo),
    );
    expect(out.find((r) => r.ingredienteId === 'passata_pomodoro')).toBeUndefined();
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(1000);
  });

  it('sostituzione target that is already a base ingredient merges into it', () => {
    const base = makeRicetta({
      id: 'pasta_parmigiano',
      ingredienti: [
        { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' },
        { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      ],
    });
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_parmigiano', aggiustamenti: [{ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'parmigiano', numeroPersone: 3 }] },
      10, ricetteMap(base),
    );
    // pasta: 7 remaining portions * 100 = 700
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(700);
    // parmigiano: base 10*10=100, plus substituted-in amount at the DA ingredient's dose: 100*3=300 => 400
    expect(out.find((r) => r.ingredienteId === 'parmigiano')!.quantita).toBe(400);
  });
});

import { describe, it, expect } from 'vitest';
import { fabbisognoRicetta, fabbisognoAssegnazione } from '../../src/core/fabbisogno';
import { makeRicetta } from '../helpers/factories';
import type { Ricetta, Aggiustamento } from '../../src/core/types';

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

  it("una ricetta sconosciuta (es. file di un'altra versione) non blocca il calcolo: non conta", () => {
    expect(fabbisognoAssegnazione({ ricettaId: 'nope', aggiustamenti: [] }, 10, new Map())).toEqual([]);
  });

  it('una variante sconosciuta viene ignorata: quelle persone mangiano il piatto base', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'nope', numeroPersone: 4 }] },
      10, ricetteMap(sugo),
    );
    expect(out.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(1000); // tutte e 10 le porzioni
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

// Gli aggiustamenti contano persone (teste), il piatto porzioni: un bambino mangia meno di un adulto.
// Con porzioniPerPersona (media del giorno) le persone diventano porzioni, e il totale non supera il piatto.
describe('fabbisognoAssegnazione: persone e porzioni', () => {
  const sugo = makeRicetta({
    id: 'pasta_sugo',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
    ],
  });
  const seitan = makeRicetta({ id: 'sugo_seitan', ingredienti: [{ ingredienteId: 'seitan', dosePersona: 90, unita: 'g' }] });
  const quanto = (out: { ingredienteId: string; quantita: number }[], id: string) => out.find((r) => r.ingredienteId === id)?.quantita ?? 0;

  it('10 bambini (7 porzioni): una variante per 10 persone compra 7 porzioni, non 10', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'sugo_seitan', numeroPersone: 10 }] },
      7, ricetteMap(sugo, seitan), 0.7,
    );
    expect(quanto(out, 'seitan')).toBeCloseTo(630); // 7 * 90
    expect(quanto(out, 'pasta')).toBe(0);
  });

  it('10 bambini (7 porzioni): una sostituzione per 10 persone compra 7 porzioni del sostituto', () => {
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [{ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_senza_glutine', numeroPersone: 10 }] },
      7, ricetteMap(sugo), 0.7,
    );
    expect(quanto(out, 'pasta_senza_glutine')).toBeCloseTo(700);
    expect(quanto(out, 'pasta')).toBe(0);
    expect(quanto(out, 'passata_pomodoro')).toBeCloseTo(560);
  });

  it('adulti e bambini insieme: le persone degli aggiustamenti valgono la porzione media e il piatto resta di 11 porzioni', () => {
    // 4 adulti + 10 bambini al 30% in meno = 11 porzioni per 14 persone
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [
        { tipo: 'variante', ricettaVarianteId: 'sugo_seitan', numeroPersone: 7 },
        { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_senza_glutine', numeroPersone: 3 },
      ] },
      11, ricetteMap(sugo, seitan), 11 / 14,
    );
    expect(quanto(out, 'seitan') / 90).toBeCloseTo(5.5);
    expect(quanto(out, 'pasta_senza_glutine') / 100).toBeCloseTo(3 * 11 / 14);
    expect((quanto(out, 'pasta') + quanto(out, 'pasta_senza_glutine')) / 100).toBeCloseTo(5.5);
    expect(quanto(out, 'passata_pomodoro') / 80).toBeCloseTo(5.5);
  });

  it('un file con varianti per più persone di quelle presenti non supera le porzioni del piatto', () => {
    const riso = makeRicetta({ id: 'riso_in_bianco', ingredienti: [{ ingredienteId: 'riso', dosePersona: 80, unita: 'g' }] });
    const out = fabbisognoAssegnazione(
      { ricettaId: 'pasta_sugo', aggiustamenti: [
        { tipo: 'variante', ricettaVarianteId: 'sugo_seitan', numeroPersone: 8 },
        { tipo: 'variante', ricettaVarianteId: 'riso_in_bianco', numeroPersone: 12 },
      ] },
      10, ricetteMap(sugo, seitan, riso),
    );
    // 20 porzioni chieste su 10: ridotte in proporzione (4 e 6), niente piatto base
    expect(quanto(out, 'seitan')).toBeCloseTo(360);
    expect(quanto(out, 'riso')).toBeCloseTo(480);
    expect(quanto(out, 'pasta')).toBe(0);
  });

  it('se gli aggiustamenti prendono tutte le persone non restano briciole del piatto (che in Spesa diventerebbero una confezione)', () => {
    // 1 adulto + 19 bambini al 33% in meno: i conti con la virgola lasciavano 1,8e-13 g di pasta
    const porzioni = 1 + 19 * (1 - 0.33);
    const ppp = porzioni / 20;
    const tutti = (agg: Aggiustamento) => fabbisognoAssegnazione({ ricettaId: 'pasta_sugo', aggiustamenti: [agg] }, porzioni, ricetteMap(sugo, seitan), ppp);
    expect(quanto(tutti({ tipo: 'variante', ricettaVarianteId: 'sugo_seitan', numeroPersone: 20 }), 'pasta')).toBe(0);
    expect(quanto(tutti({ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'riso', numeroPersone: 20 }), 'pasta')).toBe(0);
    expect(quanto(tutti({ tipo: 'rimozione', ingredienteId: 'pasta', numeroPersone: 20 }), 'pasta')).toBe(0);
  });

  it('per ogni ingrediente del piatto, piatto + sostituti + varianti non superano mai le porzioni', () => {
    // dosi da 1 g: la quantità è il numero di porzioni
    const piatto = makeRicetta({ id: 'p', ingredienti: [{ ingredienteId: 'a', dosePersona: 1, unita: 'g' }, { ingredienteId: 'b', dosePersona: 1, unita: 'g' }] });
    const variante = makeRicetta({ id: 'v', ingredienti: [{ ingredienteId: 'va', dosePersona: 1, unita: 'g' }] });
    for (const [adulti, bambini] of [[10, 0], [0, 10], [3, 12], [0, 1]] as const) {
      const porzioni = adulti + bambini * 0.7;
      const ppp = porzioni / (adulti + bambini);
      for (const nv of [0, 3, 10, 25]) for (const ns of [0, 4, 10, 30]) for (const nr of [0, 5, 20]) {
        const out = fabbisognoAssegnazione({ ricettaId: 'p', aggiustamenti: [
          { tipo: 'variante', ricettaVarianteId: 'v', numeroPersone: nv },
          { tipo: 'rimozione', ingredienteId: 'a', numeroPersone: nr },
          { tipo: 'sostituzione', ingredienteDaId: 'a', ingredienteAId: 's', numeroPersone: ns },
          { tipo: 'sostituzione', ingredienteDaId: 'b', ingredienteAId: 's2', numeroPersone: ns },
        ] }, porzioni, ricetteMap(piatto, variante), ppp);
        const va = quanto(out, 'va');
        expect(va + quanto(out, 'a') + quanto(out, 's')).toBeLessThanOrEqual(porzioni + 1e-9);
        expect(va + quanto(out, 'b') + quanto(out, 's2')).toBeCloseTo(porzioni); // b non ha rimozioni: torna tutto
      }
    }
  });
});

describe('fabbisognoAssegnazione: ingrediente fuori catalogo con unità diverse', () => {
  it('una riga in pz e un sostituto che arriva in g restano due righe, senza errore', () => {
    const r = makeRicetta({ id: 'r', ingredienti: [
      { ingredienteId: 'xyz', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' },
    ] });
    const out = fabbisognoAssegnazione(
      { ricettaId: 'r', aggiustamenti: [{ tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'xyz', numeroPersone: 2 }] },
      10, ricetteMap(r),
    );
    expect(out).toEqual([
      { ingredienteId: 'xyz', quantita: 10, unita: 'pz' },
      { ingredienteId: 'xyz', quantita: 200, unita: 'g' },
      { ingredienteId: 'pasta', quantita: 800, unita: 'g' },
    ]);
  });
});

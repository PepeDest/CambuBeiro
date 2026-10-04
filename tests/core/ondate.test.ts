import { describe, it, expect } from 'vitest';
import { assegnaOndate } from '../../src/core/ondate';
import { makeIngrediente } from '../helpers/factories';

const ingMap = new Map([
  ['pasta', makeIngrediente({ id: 'pasta', categoria: 'secco', durataGiorni: 300 })],
  ['insalata', makeIngrediente({ id: 'insalata', categoria: 'fresco', durataGiorni: 3, unita: 'g' })],
  ['latte', makeIngrediente({ id: 'latte', categoria: 'fresco', durataGiorni: 5, unita: 'ml' })],
]);

describe('assegnaOndate', () => {
  const perGiorno = [
    { giorno: 1, righe: [{ ingredienteId: 'pasta', quantita: 1000, unita: 'g' as const }, { ingredienteId: 'insalata', quantita: 500, unita: 'g' as const }] },
    { giorno: 6, righe: [{ ingredienteId: 'pasta', quantita: 500, unita: 'g' as const }, { ingredienteId: 'insalata', quantita: 400, unita: 'g' as const }] },
  ];

  it('dry goods all go to the first wave; fresh goes to its window', () => {
    const { ondate } = assegnaOndate(perGiorno, [1, 5], ingMap);
    const w1 = ondate.find((o) => o.giornoSpesa === 1)!;
    const w2 = ondate.find((o) => o.giornoSpesa === 5)!;
    // all pasta (1000+500) in wave 1
    expect(w1.righe.find((r) => r.ingredienteId === 'pasta')!.quantita).toBe(1500);
    // day-1 insalata in wave 1, day-6 insalata in wave 2
    expect(w1.righe.find((r) => r.ingredienteId === 'insalata')!.quantita).toBe(500);
    expect(w2.righe.find((r) => r.ingredienteId === 'insalata')!.quantita).toBe(400);
  });

  it('warns when a fresh item cannot survive to its consumption day', () => {
    // insalata durata 3; consumed day 6 bought at day-5 shop => gap 1, OK. Change shop days to [1] only:
    const { avvisi } = assegnaOndate(perGiorno, [1], ingMap);
    // day-6 insalata bought at day 1 => gap 5 > durata 3 => warning
    expect(avvisi.some((a) => a.ingredienteId === 'insalata' && a.giornoConsumo === 6)).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { giorniCampo, PASTI, ETICHETTE_PASTO, ALLERGENI, ETICHETTE_ALLERGENE, progettoVuoto } from '../../src/core';

describe('giorniCampo e costanti condivise', () => {
  it('giorniCampo restituisce 1..numeroGiorni', () => {
    const p = progettoVuoto();
    p.campo.numeroGiorni = 3;
    expect(giorniCampo(p.campo)).toEqual([1, 2, 3]);
  });
  it('ogni pasto ha la sua etichetta', () => {
    expect(PASTI).toEqual(['colazione', 'pranzo', 'cena', 'merenda']);
    for (const p of PASTI) expect(ETICHETTE_PASTO[p].length).toBeGreaterThan(0);
  });
  it('ogni allergene (tutti e 10) ha la sua etichetta da mostrare', () => {
    expect(ALLERGENI.length).toBe(10);
    for (const a of ALLERGENI) expect(ETICHETTE_ALLERGENE[a].length).toBeGreaterThan(0);
  });
});

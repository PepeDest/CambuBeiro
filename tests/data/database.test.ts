import { describe, it, expect } from 'vitest';
import { INGREDIENTI } from '../../src/data/ingredienti';
import { RICETTE } from '../../src/data/ricette';

describe('database ingredienti', () => {
  it('ids are unique', () => {
    const ids = INGREDIENTI.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every ingredient is plausible', () => {
    for (const i of INGREDIENTI) {
      expect(i.id).toMatch(/^[a-z0-9_]+$/);
      expect(i.nome.length).toBeGreaterThan(0);
      expect(['g', 'ml', 'pz']).toContain(i.unita);
      expect(['fresco', 'secco', 'scatolame']).toContain(i.categoria);
      expect(i.durataGiorni).toBeGreaterThan(0);
      expect(i.confezione.quantita).toBeGreaterThan(0);
      expect(i.confezione.unita).toBe(i.unita); // package unit matches ingredient unit
    }
  });
  it('has a substantial catalog', () => {
    expect(INGREDIENTI.length).toBeGreaterThanOrEqual(60);
  });
});

describe('database ricette', () => {
  const ingIds = new Set(INGREDIENTI.map((i) => i.id));
  const ricIds = new Set(RICETTE.map((r) => r.id));

  it('has at least 80 recipes', () => {
    expect(RICETTE.length).toBeGreaterThanOrEqual(80);
  });
  it('recipe ids are unique', () => {
    expect(ricIds.size).toBe(RICETTE.length);
  });
  it('every ingredient referenced exists', () => {
    for (const r of RICETTE)
      for (const riga of r.ingredienti)
        expect(ingIds.has(riga.ingredienteId), `${r.id} -> ${riga.ingredienteId}`).toBe(true);
  });
  it('every recipe is well-formed', () => {
    for (const r of RICETTE) {
      expect(r.id).toMatch(/^[a-z0-9_]+$/);
      expect(r.nome.length).toBeGreaterThan(0);
      expect(r.pasti.length).toBeGreaterThan(0);
      expect(r.ingredienti.length).toBeGreaterThan(0);
      expect(r.origine).toBe('base');
      for (const riga of r.ingredienti) expect(riga.dosePersona).toBeGreaterThan(0);
      if (r.varianteDi) expect(ricIds.has(r.varianteDi)).toBe(true);
    }
  });
  it('covers the main categories', () => {
    const cat = new Set(RICETTE.map((r) => r.categoria));
    for (const c of ['primo', 'secondo', 'contorno', 'colazione', 'merenda']) expect(cat.has(c)).toBe(true);
  });
  it('every recipe row unit matches its ingredient unit', () => {
    const byId = new Map(INGREDIENTI.map((i) => [i.id, i]));
    for (const r of RICETTE)
      for (const riga of r.ingredienti) {
        const ing = byId.get(riga.ingredienteId);
        expect(ing, `${r.id} -> ${riga.ingredienteId}`).toBeDefined();
        expect(riga.unita, `${r.id} -> ${riga.ingredienteId}`).toBe(ing!.unita);
      }
  });
});

import { describe, it, expect } from 'vitest';
import type { Ingrediente, Ricetta, Presenze } from '../../src/core/types';

describe('types', () => {
  it('shapes are usable', () => {
    const p: Presenze = { adulti: 10, bambini: 5, vegetariani: 1, allergici: { glutine: 1 } };
    expect(p.adulti + p.bambini).toBe(15);
  });
});

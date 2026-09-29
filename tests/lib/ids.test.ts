import { describe, it, expect } from 'vitest';
import { slugId } from '../../src/lib/ids';

describe('slugId', () => {
  it('crea uno snake_case dal nome', () => {
    expect(slugId('Pasta al Pomodoro', [])).toBe('pasta_al_pomodoro');
  });
  it('toglie gli accenti', () => {
    expect(slugId('Purè di patate', [])).toBe('pure_di_patate');
  });
  it('evita le collisioni con un suffisso', () => {
    expect(slugId('Pasta al sugo', ['pasta_al_sugo'])).toBe('pasta_al_sugo_2');
    expect(slugId('Pasta al sugo', ['pasta_al_sugo', 'pasta_al_sugo_2'])).toBe('pasta_al_sugo_3');
  });
  it('nome vuoto → voce', () => {
    expect(slugId('   ', [])).toBe('voce');
    expect(slugId('!!!', ['voce'])).toBe('voce_2');
  });
});

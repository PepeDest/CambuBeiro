import { describe, it, expect } from 'vitest';
import { formatNumeroIt, formatQuantita, testoConfezione } from '../../src/lib/formato';

describe('formatNumeroIt', () => {
  it('usa la virgola e toglie gli zeri inutili', () => {
    expect(formatNumeroIt(1.2)).toBe('1,2');
    expect(formatNumeroIt(1)).toBe('1');
    expect(formatNumeroIt(4.25, 2)).toBe('4,25');
    expect(formatNumeroIt(4.2, 2)).toBe('4,2');
    expect(formatNumeroIt(1000, 0)).toBe('1000');
  });
});

describe('formatQuantita', () => {
  it('grammi diventano kg da 1000 in su', () => {
    expect(formatQuantita(1200, 'g')).toBe('1,2 kg');
    expect(formatQuantita(900, 'g')).toBe('900 g');
    expect(formatQuantita(4900, 'g')).toBe('4,9 kg');
  });
  it('ml diventano litri da 1000 in su', () => {
    expect(formatQuantita(1500, 'ml')).toBe('1,5 l');
    expect(formatQuantita(300, 'ml')).toBe('300 ml');
  });
  it('pezzi interi', () => {
    expect(formatQuantita(3, 'pz')).toBe('3 pz');
  });
});

describe('testoConfezione', () => {
  it('mostra numero, etichetta e totale reale', () => {
    expect(testoConfezione({ numeroConfezioni: 7, etichetta: 'bottiglia', quantitaReale: 4900, unita: 'g' }))
      .toBe('7 × bottiglia (4,9 kg)');
  });
});

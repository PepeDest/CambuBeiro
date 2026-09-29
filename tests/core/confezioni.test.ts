import { describe, it, expect } from 'vitest';
import { calcolaConfezioni } from '../../src/core/confezioni';

describe('calcolaConfezioni', () => {
  it('rounds up to whole packages', () => {
    const r = calcolaConfezioni(4200, { quantita: 700, unita: 'g', etichetta: 'bottiglia' });
    expect(r.numeroConfezioni).toBe(6);       // 4200/700 = 6 exactly
    expect(r.quantitaReale).toBe(4200);
  });
  it('rounds a fractional need up', () => {
    const r = calcolaConfezioni(4201, { quantita: 700, unita: 'g', etichetta: 'bottiglia' });
    expect(r.numeroConfezioni).toBe(7);
    expect(r.quantitaReale).toBe(4900);
  });
  it('zero need => zero packages', () => {
    expect(calcolaConfezioni(0, { quantita: 500, unita: 'g', etichetta: 'confezione' }).numeroConfezioni).toBe(0);
  });
});

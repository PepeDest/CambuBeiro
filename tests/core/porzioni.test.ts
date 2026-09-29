import { describe, it, expect } from 'vitest';
import { porzioniBase } from '../../src/core/porzioni';
import { makePresenze } from '../helpers/factories';

describe('porzioniBase', () => {
  it('no children => equals adults', () => {
    expect(porzioniBase(makePresenze({ adulti: 12, bambini: 0 }), 0.30)).toBe(12);
  });
  it('children reduced by 30%', () => {
    // 10 adults + 10 children*0.7 = 17
    expect(porzioniBase(makePresenze({ adulti: 10, bambini: 10 }), 0.30)).toBeCloseTo(17, 6);
  });
  it('0% reduction => children count fully', () => {
    expect(porzioniBase(makePresenze({ adulti: 0, bambini: 8 }), 0)).toBe(8);
  });
  it('100% reduction => children count as zero', () => {
    expect(porzioniBase(makePresenze({ adulti: 5, bambini: 8 }), 1)).toBe(5);
  });
});

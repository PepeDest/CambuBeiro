import { describe, it, expect } from 'vitest';
import { progettoVuoto, serializzaProgetto, deserializzaProgetto, VERSIONE_FORMATO } from '../../src/core/progetto';
import { makeCampo, makePresenze } from '../helpers/factories';

describe('progetto round-trip', () => {
  it('serialize then deserialize returns identical data', () => {
    const p = progettoVuoto();
    p.campo = makeCampo({ nome: 'Campo Estivo 2026' });
    p.giorni[2] = makePresenze({ adulti: 22, bambini: 8, allergici: { glutine: 1 } });
    const back = deserializzaProgetto(serializzaProgetto(p));
    expect(back).toEqual(p);
  });
  it('rejects incompatible format version', () => {
    const bad = JSON.stringify({ ...progettoVuoto(), versioneFormato: 999 });
    expect(() => deserializzaProgetto(bad)).toThrow();
  });
  it('rejects malformed JSON', () => {
    expect(() => deserializzaProgetto('{ not json')).toThrow();
  });
  it('rejects null', () => {
    expect(() => deserializzaProgetto('null')).toThrow();
  });
  it('rejects a primitive', () => {
    expect(() => deserializzaProgetto('42')).toThrow();
  });
  it('rejects an array', () => {
    expect(() => deserializzaProgetto('[]')).toThrow();
  });
  it('empty project uses current format version', () => {
    expect(progettoVuoto().versioneFormato).toBe(VERSIONE_FORMATO);
  });
});

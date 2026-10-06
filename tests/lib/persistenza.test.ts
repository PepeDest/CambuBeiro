import { describe, it, expect } from 'vitest';
import {
  caricaProgetto, caricaConAvvisi, salvaProgettoLocale, apriStorage, progettoDaAltraScheda,
  CHIAVE_STORAGE, CHIAVE_RISERVA, type StorageLike,
} from '../../src/lib/persistenza';
import { serializzaProgetto } from '../../src/core';
import { progettoVuoto } from '../../src/core';

function fakeStorage(iniziale: Record<string, string> = {}): StorageLike & { dati: Record<string, string> } {
  const dati = { ...iniziale };
  return { dati, getItem: (k) => (k in dati ? dati[k]! : null), setItem: (k, v) => { dati[k] = v; } };
}

describe('persistenza', () => {
  it('storage vuoto → progetto vuoto', () => {
    expect(caricaProgetto(fakeStorage())).toEqual(progettoVuoto());
  });
  it('salva poi carica → stesso progetto', () => {
    const s = fakeStorage();
    const p = progettoVuoto();
    p.campo.nome = 'Campo Estivo';
    salvaProgettoLocale(s, p);
    expect(caricaProgetto(s)).toEqual(p);
    expect(s.dati[CHIAVE_STORAGE]).toBeDefined();
  });
  it('contenuto rovinato → progetto vuoto (nessun crash)', () => {
    const s = fakeStorage({ [CHIAVE_STORAGE]: '{ rotto' });
    expect(caricaProgetto(s)).toEqual(progettoVuoto());
  });
  it('contenuto non valido → ne tiene una copia di riserva prima di ripartire da vuoto', () => {
    const rovinato = JSON.stringify({ ...progettoVuoto(), campo: {} });
    const s = fakeStorage({ [CHIAVE_STORAGE]: rovinato });
    expect(caricaProgetto(s)).toEqual(progettoVuoto());
    expect(s.dati[CHIAVE_RISERVA]).toBe(rovinato);
  });

  it("se il browser blocca la memoria locale, l'app parte lo stesso (senza salvataggio automatico)", () => {
    expect(apriStorage(() => { throw new Error('SecurityError'); })).toBeUndefined();
    const s = fakeStorage();
    expect(apriStorage(() => s as unknown as Storage)).toBe(s);
  });
  it('salvaProgettoLocale dice se il salvataggio è riuscito (es. memoria piena)', () => {
    const piena: StorageLike = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
    expect(salvaProgettoLocale(piena, progettoVuoto())).toBe(false);
    expect(salvaProgettoLocale(fakeStorage(), progettoVuoto())).toBe(true);
  });
  it("caricaConAvvisi avvisa quando il progetto salvato non si poteva aprire e restituisce la copia di riserva", () => {
    const s = fakeStorage({ [CHIAVE_STORAGE]: '{ rotto' });
    const r = caricaConAvvisi(s);
    expect(r.progetto).toEqual(progettoVuoto());
    expect(r.riserva).toBe('{ rotto');
    expect(r.avvisi).toEqual(['Il progetto salvato in questo browser non si poteva aprire: ne ho tenuto una copia di riserva, puoi scaricarla qui.']);
  });
  it('caricaConAvvisi sistema i progetti vecchi (sostituzioni tra unità diverse) e lo dice', () => {
    const p = progettoVuoto();
    p.menu = { 1: { pranzo: [{ ricettaId: 'frittata_classica', aggiustamenti: [
      { tipo: 'sostituzione', ingredienteDaId: 'uova', ingredienteAId: 'farina', numeroPersone: 2 },
    ] }] } };
    const r = caricaConAvvisi(fakeStorage({ [CHIAVE_STORAGE]: serializzaProgetto(p) }));
    expect(r.progetto.menu[1]!.pranzo![0]!.aggiustamenti).toEqual([]);
    expect(r.avvisi).toHaveLength(1);
    expect(r.riserva).toBeNull();
  });
  it('progettoDaAltraScheda: usa le modifiche fatte in un’altra scheda, ignora il resto', () => {
    const p = progettoVuoto();
    p.campo.nome = 'Da un’altra scheda';
    expect(progettoDaAltraScheda({ key: CHIAVE_STORAGE, newValue: serializzaProgetto(p) })).toEqual(p);
    expect(progettoDaAltraScheda({ key: 'altro', newValue: serializzaProgetto(p) })).toBeNull();
    expect(progettoDaAltraScheda({ key: CHIAVE_STORAGE, newValue: null })).toBeNull();
    expect(progettoDaAltraScheda({ key: CHIAVE_STORAGE, newValue: '{ rotto' })).toBeNull();
  });
});

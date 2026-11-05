import { describe, it, expect } from 'vitest';
import {
  caricaProgetto, caricaConAvvisi, salvaProgettoLocale, apriStorage, progettoDaAltraScheda, filtraAvvisoSconosciuti,
  CHIAVE_STORAGE, CHIAVE_RISERVA, CHIAVE_AVVISI_VISTI, type StorageLike,
} from '../../src/lib/persistenza';
import { ripulisciProgetto } from '../../src/lib/ripulisci';
import { makeRicetta } from '../helpers/factories';
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

// L'avviso degli ingredienti fuori catalogo non cambia il progetto, quindi tornerebbe a ogni
// avvio: il browser ricorda quali codici ha già segnalato e lo ripete solo se ne arriva uno nuovo.
describe('persistenza: avviso degli ingredienti fuori catalogo una volta sola', () => {
  function conSconosciuti(...ids: string[]) {
    const p = progettoVuoto();
    p.ricetteUtente = [makeRicetta({ id: 'mia', origine: 'utente', ingredienti: ids.map((id) => ({ ingredienteId: id, dosePersona: 1, unita: 'g' as const })) })];
    return p;
  }
  const eDegliSconosciuti = (a: string) => a.includes('non sono nel ricettario') || a.includes('non è nel ricettario');
  const salvato = (...ids: string[]) => ({ [CHIAVE_STORAGE]: serializzaProgetto(conSconosciuti(...ids)) });

  it('al primo avvio lo mostra e ricorda i codici; al secondo con gli stessi codici no', () => {
    const s = fakeStorage(salvato('xyz', 'abc'));
    expect(caricaConAvvisi(s).avvisi.filter(eDegliSconosciuti)).toHaveLength(1);
    expect(JSON.parse(s.dati[CHIAVE_AVVISI_VISTI]!)).toEqual(['abc', 'xyz']);
    expect(caricaConAvvisi(s).avvisi).toEqual([]);
  });

  it('un codice nuovo lo fa tornare, con tutti i codici di adesso', () => {
    const s = fakeStorage({ ...salvato('xyz', 'abc'), [CHIAVE_AVVISI_VISTI]: JSON.stringify(['abc', 'xyz']) });
    expect(caricaConAvvisi(s).avvisi).toEqual([]);
    s.dati[CHIAVE_STORAGE] = serializzaProgetto(conSconosciuti('xyz', 'abc', 'nuovo'));
    const [avviso, ...altri] = caricaConAvvisi(s).avvisi;
    expect(altri).toEqual([]);
    expect(avviso).toContain('"abc", "nuovo", "xyz"');
    expect(JSON.parse(s.dati[CHIAVE_AVVISI_VISTI]!)).toEqual(['abc', 'nuovo', 'xyz']);
  });

  it('aprendo un file lo mostra sempre, anche se già visto, e lo ricorda per il prossimo avvio', () => {
    const s = fakeStorage({ [CHIAVE_AVVISI_VISTI]: JSON.stringify(['xyz']) });
    const r = ripulisciProgetto(conSconosciuti('xyz'));
    expect(filtraAvvisoSconosciuti(s, r, { sempre: true })).toEqual(r.avvisi);
    expect(r.avvisi).toHaveLength(1);
    const nuovo = fakeStorage();
    filtraAvvisoSconosciuti(nuovo, ripulisciProgetto(conSconosciuti('xyz')), { sempre: true });
    expect(JSON.parse(nuovo.dati[CHIAVE_AVVISI_VISTI]!)).toEqual(['xyz']);
    expect(filtraAvvisoSconosciuti(nuovo, ripulisciProgetto(conSconosciuti('xyz')))).toEqual([]);
  });

  it('se la memoria non si legge o non si scrive (o è rovinata) lo mostra ogni volta, senza bloccarsi', () => {
    const r = ripulisciProgetto(conSconosciuti('xyz'));
    const bloccata: StorageLike = { getItem: () => { throw new Error('SecurityError'); }, setItem: () => { throw new Error('QuotaExceededError'); } };
    expect(filtraAvvisoSconosciuti(bloccata, r)).toEqual(r.avvisi);
    expect(filtraAvvisoSconosciuti(undefined, r)).toEqual(r.avvisi);
    expect(filtraAvvisoSconosciuti(fakeStorage({ [CHIAVE_AVVISI_VISTI]: '{ rotto' }), r)).toEqual(r.avvisi);
    // al caricamento: il progetto si legge, solo la chiave degli avvisi visti dà errore
    const dati: Record<string, string> = salvato('xyz');
    const capricciosa: StorageLike = {
      getItem: (k) => { if (k === CHIAVE_AVVISI_VISTI) throw new Error('SecurityError'); return dati[k] ?? null; },
      setItem: () => { throw new Error('QuotaExceededError'); },
    };
    const c = caricaConAvvisi(capricciosa);
    expect(c.avvisi.filter(eDegliSconosciuti)).toHaveLength(1);
    expect(c.riserva).toBeNull();
    expect(caricaConAvvisi(capricciosa).avvisi.filter(eDegliSconosciuti)).toHaveLength(1);
  });

  it('senza ingredienti fuori catalogo non ricorda niente e non avvisa', () => {
    const s = fakeStorage({ [CHIAVE_STORAGE]: serializzaProgetto(progettoVuoto()) });
    expect(caricaConAvvisi(s).avvisi).toEqual([]);
    expect(s.dati[CHIAVE_AVVISI_VISTI]).toBeUndefined();
  });

  it('gli altri avvisi di ripulisci restano', () => {
    const p = conSconosciuti('xyz');
    p.menu = { 1: { pranzo: [{ ricettaId: 'frittata_classica', aggiustamenti: [
      { tipo: 'sostituzione', ingredienteDaId: 'uova', ingredienteAId: 'farina', numeroPersone: 2 },
    ] }] } };
    const s = fakeStorage({ [CHIAVE_STORAGE]: serializzaProgetto(p), [CHIAVE_AVVISI_VISTI]: JSON.stringify(['xyz']) });
    expect(caricaConAvvisi(s).avvisi).toEqual(['Tolta 1 sostituzione tra ingredienti che si misurano in modo diverso (es. pezzi e grammi).']);
  });
});

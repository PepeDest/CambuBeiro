import { describe, it, expect } from 'vitest';
import { righeDosiCampo, sezioniSpesa } from '../../src/lib/derivati';
import { progettoVuoto } from '../../src/core';
import { databaseBase } from '../../src/data';

function progettoConUnPranzo() {
  const p = progettoVuoto();
  p.campo.numeroGiorni = 1;
  p.campo.giorniSpesa = [1];
  p.campo.giornoTipo = { adulti: 20, bambini: 0, vegetariani: 0, allergici: {} };
  const primo = databaseBase.ricette.find((r) => r.categoria === 'primo')!;
  p.menu = { 1: { pranzo: [{ ricettaId: primo.id, aggiustamenti: [] }] } };
  return { p, primo };
}

describe('derivati', () => {
  it('righeDosiCampo restituisce righe con nome leggibile e quantità > 0', () => {
    const { p } = progettoConUnPranzo();
    const righe = righeDosiCampo(p);
    expect(righe.length).toBeGreaterThan(0);
    for (const r of righe) {
      expect(r.nome.length).toBeGreaterThan(0);
      expect(r.quantita).toBeGreaterThan(0);
      expect(r.nome).not.toBe(r.ingredienteId); // nome risolto dal database, non l'id grezzo
    }
    // ordinato per nome
    const nomi = righe.map((r) => r.nome);
    expect(nomi).toEqual([...nomi].sort((a, b) => a.localeCompare(b, 'it')));
  });

  it('sezioniSpesa produce almeno una sezione con confezioni calcolate', () => {
    const { p } = progettoConUnPranzo();
    const { sezioni } = sezioniSpesa(p);
    expect(sezioni.length).toBeGreaterThan(0);
    const righe = sezioni[0]!.righe;
    expect(righe.length).toBeGreaterThan(0);
    for (const r of righe) {
      expect(r.numeroConfezioni).toBeGreaterThan(0);
      expect(r.etichetta.length).toBeGreaterThan(0);
      expect(r.quantitaReale).toBeGreaterThanOrEqual(r.quantita);
    }
  });

  it('nessun avviso sui giorni di spesa quando la spesa arriva prima dei pasti', () => {
    const { p } = progettoConUnPranzo();
    expect(sezioniSpesa(p).avvisiGiorni).toEqual([]);
  });

  it('avvisa se dei pasti vengono prima della prima spesa', () => {
    const { p, primo } = progettoConUnPranzo();
    p.campo.numeroGiorni = 3;
    p.campo.giorniSpesa = [3];
    p.menu[2] = { cena: [{ ricettaId: primo.id, aggiustamenti: [] }] };
    expect(sezioniSpesa(p).avvisiGiorni).toEqual([
      'I pasti dei giorni 1, 2 vengono prima della prima spesa (giorno 3): aggiungi un giorno di spesa all’inizio del campo.',
    ]);
  });

  it('avvisa se un giorno di spesa è dopo la fine del campo', () => {
    const { p } = progettoConUnPranzo();
    p.campo.giorniSpesa = [1, 10];
    expect(sezioniSpesa(p).avvisiGiorni).toEqual([
      'Il giorno di spesa 10 è dopo l’ultimo giorno del campo (giorno 1): non serve.',
    ]);
  });
});


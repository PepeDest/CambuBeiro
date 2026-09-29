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
});

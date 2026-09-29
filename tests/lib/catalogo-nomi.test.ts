import { describe, it, expect } from 'vitest';
import { nomeRicetta, nomeIngrediente, ricetteDisponibili, indiceRicette } from '../../src/lib/catalogo';
import { aggiungiRicettaUtente } from '../../src/lib/azioni';
import { progettoVuoto } from '../../src/core';
import { databaseBase } from '../../src/data';
import type { Ricetta } from '../../src/core';

describe('catalogo: nomi e cache', () => {
  it("nomeRicetta/nomeIngrediente risolvono il nome, altrimenti restituiscono l'id", () => {
    const p = progettoVuoto();
    const r = databaseBase.ricette[0]!;
    const i = databaseBase.ingredienti[0]!;
    expect(nomeRicetta(p, r.id)).toBe(r.nome);
    expect(nomeIngrediente(p, i.id)).toBe(i.nome);
    expect(nomeRicetta(p, 'sconosciuto')).toBe('sconosciuto');
  });
  it("riusa gli stessi elenchi finché le ricette dell'utente non cambiano", () => {
    const p = progettoVuoto();
    expect(ricetteDisponibili(p)).toBe(ricetteDisponibili(p));
    expect(indiceRicette(p)).toBe(indiceRicette(p));
    const nuova = { id: 'mia', nome: 'AAA mia', categoria: 'primo', pasti: ['pranzo'], ingredienti: [], origine: 'utente' } as Ricetta;
    const q = aggiungiRicettaUtente(p, nuova);
    expect(ricetteDisponibili(q)).not.toBe(ricetteDisponibili(p));
    expect(ricetteDisponibili(q)[0]!.id).toBe('mia'); // "AAA" viene prima in ordine alfabetico
  });
});

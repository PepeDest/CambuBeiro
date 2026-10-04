import { describe, it, expect } from 'vitest';
import { ricetteDisponibili, ingredientiDisponibili, cercaRicette } from '../../src/lib/catalogo';
import { progettoVuoto } from '../../src/core';
import { databaseBase } from '../../src/data';
import type { Ricetta } from '../../src/core';

describe('catalogo', () => {
  it('ricetteDisponibili include tutte le ricette base ordinate per nome', () => {
    const p = progettoVuoto();
    const tutte = ricetteDisponibili(p);
    expect(tutte.length).toBe(databaseBase.ricette.length);
    const nomi = tutte.map((r) => r.nome);
    expect(nomi).toEqual([...nomi].sort((a, b) => a.localeCompare(b, 'it')));
  });

  it('una ricetta utente con id uguale a una base la sostituisce', () => {
    const p = progettoVuoto();
    const baseUno = databaseBase.ricette[0]!;
    p.ricetteUtente = [{ ...baseUno, nome: 'MIA VERSIONE' } as Ricetta];
    const trovata = ricetteDisponibili(p).find((r) => r.id === baseUno.id)!;
    expect(trovata.nome).toBe('MIA VERSIONE');
    expect(ricetteDisponibili(p).length).toBe(databaseBase.ricette.length); // stesso id, non aumenta
  });

  it('cercaRicette filtra per testo e per pasto', () => {
    const p = progettoVuoto();
    const perNome = cercaRicette(p, 'pasta');
    expect(perNome.length).toBeGreaterThan(0);
    expect(perNome.every((r) => r.nome.toLowerCase().includes('pasta'))).toBe(true);

    const soloCena = cercaRicette(p, '', 'cena');
    expect(soloCena.length).toBeGreaterThan(0);
    expect(soloCena.every((r) => r.pasti.includes('cena'))).toBe(true);
  });

  it('ingredientiDisponibili include i base', () => {
    const p = progettoVuoto();
    expect(ingredientiDisponibili(p).length).toBe(databaseBase.ingredienti.length);
  });
});

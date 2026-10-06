import { describe, it, expect } from 'vitest';
import { formDaRicetta, formDaIngrediente, creaRicetta, creaIngrediente } from '../../src/lib/crea';
import { rimuoviRicettaUtente, rimuoviIngredienteUtente, aggiungiRicettaUtente, aggiungiIngredienteUtente } from '../../src/lib/azioni';
import { usiRicetta, usiIngrediente } from '../../src/lib/usi';
import { eRicettaBase, indiceRicette } from '../../src/lib/catalogo';
import { progettoVuoto } from '../../src/core';
import type { Ricetta, Ingrediente, Progetto } from '../../src/core';

const unitaG = () => 'g' as const;

const tofu: Ingrediente = {
  id: 'tofu', nome: 'Tofu', unita: 'g', categoria: 'fresco', durataGiorni: 7,
  confezione: { quantita: 250, unita: 'g', etichetta: 'confezione' }, allergeni: [], vegetariano: true,
};
const mia: Ricetta = {
  id: 'mia', nome: 'Pasta mia', categoria: 'primo', pasti: ['pranzo'], origine: 'utente',
  ingredienti: [{ ingredienteId: 'pasta', dosePersona: 90, unita: 'g' }, { ingredienteId: 'tofu', dosePersona: 50, unita: 'g' }],
};

function progettoConMieVoci(): Progetto {
  let p = progettoVuoto();
  p = aggiungiIngredienteUtente(p, tofu);
  p = aggiungiRicettaUtente(p, mia);
  return p;
}

describe('modificare una ricetta', () => {
  it('il modulo riparte dalla ricetta e salvando tiene lo stesso id', () => {
    const f = formDaRicetta(mia);
    expect(f.nome).toBe('Pasta mia');
    expect(f.pasti).toEqual({ colazione: false, pranzo: true, cena: false, merenda: false });
    f.nome = 'Pasta mia rivista';
    f.righe[0]!.dosePersona = 100;
    expect(creaRicetta(f, unitaG, ['mia'], mia)).toEqual({ ...mia, nome: 'Pasta mia rivista', ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 100, unita: 'g' }, { ingredienteId: 'tofu', dosePersona: 50, unita: 'g' },
    ] });
  });
  it('personalizzare una ricetta del ricettario la sostituisce (stesso id, resta variante della stessa)', () => {
    const base = indiceRicette(progettoVuoto()).get('lasagne_vegetariane')!;
    expect(eRicettaBase(base.id)).toBe(true);
    const f = formDaRicetta(base);
    f.righe = f.righe.filter((r) => r.ingredienteId !== 'besciamella');
    const nuova = creaRicetta(f, unitaG, [base.id], base) as Ricetta;
    expect(nuova.id).toBe(base.id);
    expect(nuova.origine).toBe('utente');
    expect(nuova.varianteDi).toBe(base.varianteDi);
    const p = aggiungiRicettaUtente(progettoVuoto(), nuova);
    expect(indiceRicette(p).get(base.id)!.ingredienti.some((r) => r.ingredienteId === 'besciamella')).toBe(false);
  });
  it('ripristinare l’originale = togliere la ricetta personalizzata', () => {
    const p = progettoConMieVoci();
    expect(rimuoviRicettaUtente(p, 'mia').ricetteUtente).toEqual([]);
  });
});

describe('modificare un ingrediente', () => {
  it('il modulo riparte dall’ingrediente e salvando tiene lo stesso id (es. per aggiungere un allergene dimenticato)', () => {
    const f = formDaIngrediente(tofu);
    f.allergeni.soia = true;
    expect(creaIngrediente(f, ['tofu'], tofu, false)).toEqual({ ...tofu, allergeni: ['soia'] });
  });
  it('non si può cambiare l’unità di un ingrediente già usato nelle ricette', () => {
    const f = formDaIngrediente(tofu);
    f.unita = 'pz';
    expect(creaIngrediente(f, ['tofu'], tofu, true)).toEqual({ errore: 'Questo ingrediente è già usato: non puoi cambiarne l’unità (g).' });
  });
});

describe('dove è usata una voce (per non cancellarla per sbaglio)', () => {
  it('usiRicetta: piatti nel menu e varianti', () => {
    const p = progettoConMieVoci();
    p.menu = { 2: {
      pranzo: [{ ricettaId: 'mia', aggiustamenti: [] }],
      cena: [{ ricettaId: 'pasta_al_sugo', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'mia', numeroPersone: 2 }] }],
    } };
    expect(usiRicetta(p, 'mia')).toEqual(['Giorno 2 · Pranzo', 'Giorno 2 · Cena (variante di Pasta al sugo)']);
    expect(usiRicetta(progettoConMieVoci(), 'mia')).toEqual([]);
  });
  it('usiIngrediente: ricette e aggiustamenti', () => {
    const p = progettoConMieVoci();
    p.menu = { 1: { pranzo: [{ ricettaId: 'pasta_al_sugo', aggiustamenti: [
      { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'tofu', numeroPersone: 1 },
    ] }] } };
    expect(usiIngrediente(p, 'tofu')).toEqual(['Ricetta: Pasta mia', 'Giorno 1 · Pranzo (Pasta al sugo)']);
    expect(usiIngrediente(rimuoviRicettaUtente(progettoVuoto(), 'x'), 'tofu')).toEqual([]);
  });
  it('rimuoviIngredienteUtente toglie l’ingrediente', () => {
    expect(rimuoviIngredienteUtente(progettoConMieVoci(), 'tofu').ingredientiUtente).toEqual([]);
  });
});

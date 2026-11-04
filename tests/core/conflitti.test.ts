import { describe, it, expect } from 'vitest';
import { rilevaConflitti, allergeniRicetta, ricettaVegetariana, personeCoperte } from '../../src/core/conflitti';
import type { Aggiustamento } from '../../src/core/types';
import { progettoVuoto } from '../../src/core/progetto';
import { indicizzaRicette, indicizzaIngredienti } from '../../src/core/lookup';
import { makeCampo, makePresenze, makeRicetta, makeIngrediente } from '../helpers/factories';

describe('conflitti', () => {
  function scenario() {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 1, giornoTipo: makePresenze({ adulti: 10, vegetariani: 2, allergici: { lattosio: 3 } }) });
    p.ingredientiUtente = [
      makeIngrediente({ id: 'besciamella', allergeni: ['lattosio'], vegetariano: true }),
      makeIngrediente({ id: 'carne', allergeni: [], vegetariano: false }),
    ];
    p.ricetteUtente = [makeRicetta({ id: 'lasagne', nome: 'Lasagne', ingredienti: [
      { ingredienteId: 'besciamella', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'carne', dosePersona: 60, unita: 'g' },
    ] })];
    p.menu = { 1: { pranzo: [{ ricettaId: 'lasagne', aggiustamenti: [] }] } };
    return p;
  }

  it('derives allergens and vegetarian flag', () => {
    const p = scenario();
    const ing = indicizzaIngredienti(p, []);
    const r = indicizzaRicette(p, []).get('lasagne')!;
    expect(allergeniRicetta(r, ing)).toContain('lattosio');
    expect(ricettaVegetariana(r, ing)).toBe(false);
  });

  it('flags lactose and vegetarian conflicts', () => {
    const p = scenario();
    const conflitti = rilevaConflitti(p, indicizzaRicette(p, []), indicizzaIngredienti(p, []));
    expect(conflitti.some((c) => c.tipo === 'allergene' && c.dettaglio === 'lattosio' && c.personeInteressate === 3)).toBe(true);
    expect(conflitti.some((c) => c.tipo === 'vegetariano' && c.personeInteressate === 2)).toBe(true);
  });

  it('i piatti di un pasto spento non danno conflitti (tornano se lo si riaccende)', () => {
    const p = scenario(); // merenda spenta
    p.menu = { 1: { merenda: [{ ricettaId: 'lasagne', aggiustamenti: [] }] } };
    expect(rilevaConflitti(p, indicizzaRicette(p, []), indicizzaIngredienti(p, []))).toEqual([]);
    p.campo.pastiAttivi = { ...p.campo.pastiAttivi, merenda: true };
    expect(rilevaConflitti(p, indicizzaRicette(p, []), indicizzaIngredienti(p, [])).map((c) => c.pasto)).toEqual(['merenda', 'merenda']);
  });
});

describe('personeCoperte: quante persone in conflitto sono davvero protette', () => {
  // lasagne = pasta (glutine) + pangrattato (glutine) + besciamella (lattosio) + carne (non vegetariana)
  const p = progettoVuoto();
  p.ingredientiUtente = [
    makeIngrediente({ id: 'pasta', allergeni: ['glutine'] }),
    makeIngrediente({ id: 'pangrattato', allergeni: ['glutine'] }),
    makeIngrediente({ id: 'pasta_sg', allergeni: [] }),
    makeIngrediente({ id: 'besciamella', allergeni: ['lattosio'] }),
    makeIngrediente({ id: 'carne', vegetariano: false }),
    makeIngrediente({ id: 'tonno', vegetariano: false }),
    makeIngrediente({ id: 'ceci' }),
  ];
  const riga = (ingredienteId: string) => ({ ingredienteId, dosePersona: 50, unita: 'g' as const });
  p.ricetteUtente = [
    makeRicetta({ id: 'lasagne', ingredienti: ['pasta', 'pangrattato', 'besciamella', 'carne'].map(riga) }),
    makeRicetta({ id: 'lasagne_veg', ingredienti: ['pasta', 'besciamella'].map(riga) }),
    makeRicetta({ id: 'insalata', ingredienti: ['ceci'].map(riga) }),
  ];
  const ricette = indicizzaRicette(p, []);
  const ingredienti = indicizzaIngredienti(p, []);
  const coperte = (tipo: 'allergene' | 'vegetariano', dettaglio: string, aggiustamenti: Aggiustamento[]) =>
    personeCoperte({ tipo, dettaglio }, { ricettaId: 'lasagne', aggiustamenti }, ricette, ingredienti);

  it('senza aggiustamenti nessuno è protetto', () => {
    expect(coperte('allergene', 'lattosio', [])).toBe(0);
  });
  it("togliere l'ingrediente con l'allergene protegge quelle persone", () => {
    expect(coperte('allergene', 'lattosio', [{ tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 }])).toBe(2);
  });
  it('una variante che contiene lo stesso allergene NON protegge', () => {
    expect(coperte('allergene', 'lattosio', [{ tipo: 'variante', ricettaVarianteId: 'lasagne_veg', numeroPersone: 2 }])).toBe(0);
  });
  it("una variante senza l'allergene protegge", () => {
    expect(coperte('allergene', 'lattosio', [{ tipo: 'variante', ricettaVarianteId: 'insalata', numeroPersone: 2 }])).toBe(2);
  });
  it('con due ingredienti allergenici bisogna sistemarli entrambi', () => {
    const soloPasta: Aggiustamento[] = [{ tipo: 'rimozione', ingredienteId: 'pasta', numeroPersone: 2 }];
    expect(coperte('allergene', 'glutine', soloPasta)).toBe(0);
    expect(coperte('allergene', 'glutine', [...soloPasta, { tipo: 'rimozione', ingredienteId: 'pangrattato', numeroPersone: 2 }])).toBe(2);
  });
  it("una sostituzione protegge solo se il nuovo ingrediente non ha l'allergene", () => {
    const senzaPangrattato: Aggiustamento = { tipo: 'rimozione', ingredienteId: 'pangrattato', numeroPersone: 3 };
    expect(coperte('allergene', 'glutine', [senzaPangrattato, { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pasta_sg', numeroPersone: 3 }])).toBe(3);
    expect(coperte('allergene', 'glutine', [senzaPangrattato, { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'pangrattato', numeroPersone: 3 }])).toBe(0);
  });
  it('vegetariani: protegge una variante vegetariana o il cambio della carne con un ingrediente vegetariano', () => {
    expect(coperte('vegetariano', 'vegetariani', [{ tipo: 'variante', ricettaVarianteId: 'lasagne_veg', numeroPersone: 2 }])).toBe(2);
    expect(coperte('vegetariano', 'vegetariani', [{ tipo: 'sostituzione', ingredienteDaId: 'carne', ingredienteAId: 'ceci', numeroPersone: 2 }])).toBe(2);
    expect(coperte('vegetariano', 'vegetariani', [{ tipo: 'sostituzione', ingredienteDaId: 'carne', ingredienteAId: 'tonno', numeroPersone: 2 }])).toBe(0);
  });
  it('varianti e rimozioni si sommano (sono persone diverse)', () => {
    expect(coperte('allergene', 'lattosio', [
      { tipo: 'variante', ricettaVarianteId: 'insalata', numeroPersone: 1 },
      { tipo: 'rimozione', ingredienteId: 'besciamella', numeroPersone: 2 },
    ])).toBe(3);
  });
});

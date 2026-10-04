import { describe, it, expect } from 'vitest';
import { rilevaConflitti, allergeniRicetta, ricettaVegetariana } from '../../src/core/conflitti';
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
});

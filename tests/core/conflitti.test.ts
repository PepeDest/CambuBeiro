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

describe('conflitti di varianti e sostituti', () => {
  // pasta (glutine), pomodoro, pesto (frutta a guscio), formaggio (lattosio), carne (non vegetariana)
  function scenario(presenze: Partial<Parameters<typeof makePresenze>[0]> = {}, aggiustamenti: Aggiustamento[] = [], base = 'pasta_pomodoro') {
    const p = progettoVuoto();
    p.campo = makeCampo({ numeroGiorni: 1, giornoTipo: makePresenze({ adulti: 10, ...presenze }) });
    p.ingredientiUtente = [
      makeIngrediente({ id: 'pasta', allergeni: ['glutine'] }),
      makeIngrediente({ id: 'pomodoro' }),
      makeIngrediente({ id: 'pesto', allergeni: ['frutta_a_guscio'] }),
      makeIngrediente({ id: 'formaggio', allergeni: ['lattosio'] }),
      makeIngrediente({ id: 'carne', vegetariano: false }),
    ];
    const riga = (ingredienteId: string) => ({ ingredienteId, dosePersona: 50, unita: 'g' as const });
    p.ricetteUtente = [
      makeRicetta({ id: 'pasta_pomodoro', ingredienti: ['pasta', 'pomodoro'].map(riga) }),
      makeRicetta({ id: 'pasta_pesto', ingredienti: ['pasta', 'pesto'].map(riga) }),
      makeRicetta({ id: 'pesto_formaggio', ingredienti: ['pasta', 'pesto', 'formaggio'].map(riga) }),
      makeRicetta({ id: 'ragu', ingredienti: ['pasta', 'carne'].map(riga) }),
    ];
    p.menu = { 1: { pranzo: [{ ricettaId: base, aggiustamenti }] } };
    return p;
  }
  const conflitti = (p: ReturnType<typeof scenario>) => rilevaConflitti(p, indicizzaRicette(p, []), indicizzaIngredienti(p, []));
  const daAggiustamenti = (p: ReturnType<typeof scenario>) => conflitti(p).filter((c) => c.origine);

  it('una variante con un allergene che il piatto non ha è un conflitto, per al più le persone della variante', () => {
    const p = scenario({ allergici: { frutta_a_guscio: 3 } }, [{ tipo: 'variante', ricettaVarianteId: 'pasta_pesto', numeroPersone: 2 }]);
    expect(conflitti(p)).toEqual([{
      giorno: 1, pasto: 'pranzo', ricettaId: 'pasta_pomodoro', tipo: 'allergene', dettaglio: 'frutta_a_guscio',
      personeInteressate: 2, origine: { tipo: 'variante', ricettaId: 'pasta_pesto' },
    }]);
    const tanti = scenario({ allergici: { frutta_a_guscio: 3 } }, [{ tipo: 'variante', ricettaVarianteId: 'pasta_pesto', numeroPersone: 5 }]);
    expect(conflitti(tanti)[0]!.personeInteressate).toBe(3); // min(3 allergici, 5 persone)
  });

  it('una variante con un allergene che il piatto ha già non aggiunge conflitti (c’è già quello del piatto)', () => {
    const p = scenario({ allergici: { glutine: 2, frutta_a_guscio: 1 } }, [{ tipo: 'variante', ricettaVarianteId: 'pesto_formaggio', numeroPersone: 2 }], 'pasta_pesto');
    expect(conflitti(p).map((c) => [c.dettaglio, c.origine])).toEqual([['glutine', undefined], ['frutta_a_guscio', undefined]]);
  });

  it('un sostituto con un allergene è un conflitto, solo se l’ingrediente tolto è nel piatto', () => {
    const p = scenario({ allergici: { lattosio: 4 } }, [{ tipo: 'sostituzione', ingredienteDaId: 'pomodoro', ingredienteAId: 'formaggio', numeroPersone: 1 }]);
    expect(conflitti(p)).toEqual([{
      giorno: 1, pasto: 'pranzo', ricettaId: 'pasta_pomodoro', tipo: 'allergene', dettaglio: 'lattosio',
      personeInteressate: 1, origine: { tipo: 'sostituzione', ingredienteId: 'formaggio' },
    }]);
    const fuoriPiatto = scenario({ allergici: { lattosio: 4 } }, [{ tipo: 'sostituzione', ingredienteDaId: 'carne', ingredienteAId: 'formaggio', numeroPersone: 1 }]);
    expect(conflitti(fuoriPiatto)).toEqual([]);
  });

  it('un sostituto con un allergene che il piatto ha già, o sconosciuto, non aggiunge conflitti', () => {
    const p = scenario({ allergici: { glutine: 2 } }, [
      { tipo: 'sostituzione', ingredienteDaId: 'pomodoro', ingredienteAId: 'pasta', numeroPersone: 1 },
      { tipo: 'sostituzione', ingredienteDaId: 'pomodoro', ingredienteAId: 'sconosciuto', numeroPersone: 1 },
    ]);
    expect(daAggiustamenti(p)).toEqual([]);
  });

  it('con dei vegetariani: una variante o un sostituto non vegetariani di un piatto vegetariano sono conflitti', () => {
    const variante = scenario({ vegetariani: 2 }, [{ tipo: 'variante', ricettaVarianteId: 'ragu', numeroPersone: 4 }]);
    expect(conflitti(variante)).toEqual([{
      giorno: 1, pasto: 'pranzo', ricettaId: 'pasta_pomodoro', tipo: 'vegetariano', dettaglio: 'vegetariani',
      personeInteressate: 2, origine: { tipo: 'variante', ricettaId: 'ragu' },
    }]);
    const sostituto = scenario({ vegetariani: 2 }, [{ tipo: 'sostituzione', ingredienteDaId: 'pomodoro', ingredienteAId: 'carne', numeroPersone: 1 }]);
    expect(daAggiustamenti(sostituto)).toEqual([{
      giorno: 1, pasto: 'pranzo', ricettaId: 'pasta_pomodoro', tipo: 'vegetariano', dettaglio: 'vegetariani',
      personeInteressate: 1, origine: { tipo: 'sostituzione', ingredienteId: 'carne' },
    }]);
    // piatto già non vegetariano: basta il conflitto del piatto
    const giaCarne = scenario({ vegetariani: 2 }, [{ tipo: 'variante', ricettaVarianteId: 'ragu', numeroPersone: 4 }], 'ragu');
    expect(conflitti(giaCarne).map((c) => c.origine)).toEqual([undefined]);
  });

  it('nessun conflitto se quel giorno non ci sono allergici né vegetariani', () => {
    const p = scenario({}, [
      { tipo: 'variante', ricettaVarianteId: 'pesto_formaggio', numeroPersone: 2 },
      { tipo: 'sostituzione', ingredienteDaId: 'pomodoro', ingredienteAId: 'carne', numeroPersone: 1 },
    ]);
    expect(conflitti(p)).toEqual([]);
  });

  it('due varianti con lo stesso allergene danno due conflitti, ognuno con la sua variante', () => {
    const p = scenario({ allergici: { frutta_a_guscio: 3 } }, [
      { tipo: 'variante', ricettaVarianteId: 'pasta_pesto', numeroPersone: 1 },
      { tipo: 'variante', ricettaVarianteId: 'pesto_formaggio', numeroPersone: 1 },
    ]);
    expect(conflitti(p).map((c) => c.origine)).toEqual([
      { tipo: 'variante', ricettaId: 'pasta_pesto' }, { tipo: 'variante', ricettaId: 'pesto_formaggio' },
    ]);
  });

  it('una variante in un pasto spento non dà conflitti', () => {
    const p = scenario({ allergici: { frutta_a_guscio: 3 } });
    p.menu = { 1: { merenda: [{ ricettaId: 'pasta_pomodoro', aggiustamenti: [{ tipo: 'variante', ricettaVarianteId: 'pasta_pesto', numeroPersone: 2 }] }] } };
    expect(conflitti(p)).toEqual([]);
  });
});

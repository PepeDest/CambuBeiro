import type { Ingrediente, Ricetta, Presenze, Campo, Pasto } from '../../src/core/types';

export function makeIngrediente(over: Partial<Ingrediente> = {}): Ingrediente {
  return {
    id: 'ing_test',
    nome: 'Ingrediente test',
    unita: 'g',
    categoria: 'secco',
    durataGiorni: 60,
    confezione: { quantita: 1000, unita: 'g', etichetta: 'confezione' },
    allergeni: [],
    vegetariano: true,
    ...over,
  };
}

export function makeRicetta(over: Partial<Ricetta> = {}): Ricetta {
  return {
    id: 'ric_test',
    nome: 'Ricetta test',
    categoria: 'primo',
    pasti: ['pranzo', 'cena'] as Pasto[],
    ingredienti: [{ ingredienteId: 'ing_test', dosePersona: 100, unita: 'g' }],
    origine: 'base',
    ...over,
  };
}

export function makePresenze(over: Partial<Presenze> = {}): Presenze {
  return { adulti: 10, bambini: 0, vegetariani: 0, allergici: {}, ...over };
}

export function makeCampo(over: Partial<Campo> = {}): Campo {
  return {
    nome: 'Campo test',
    numeroGiorni: 7,
    pastiAttivi: { colazione: true, pranzo: true, cena: true, merenda: false },
    riduzioneBambini: 0.30,
    giorniSpesa: [1],
    giornoTipo: makePresenze(),
    ...over,
  };
}

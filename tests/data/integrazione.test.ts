import { describe, it, expect } from 'vitest';
import { databaseBase } from '../../src/data';
import { progettoVuoto } from '../../src/core/progetto';
import { indicizzaRicette, indicizzaIngredienti } from '../../src/core/lookup';
import { fabbisognoCampoTotale, fabbisognoCampoPerGiorno } from '../../src/core/aggrega';
import { assegnaOndate } from '../../src/core/ondate';

describe('integrazione database + motore', () => {
  it('computes a real menu end-to-end without errors', () => {
    const p = progettoVuoto();
    p.campo.numeroGiorni = 2;
    p.campo.giorniSpesa = [1, 2];
    p.campo.giornoTipo = { adulti: 20, bambini: 6, vegetariani: 2, allergici: { glutine: 1 } };
    const primo = databaseBase.ricette.find((r) => r.categoria === 'primo')!;
    const secondo = databaseBase.ricette.find((r) => r.categoria === 'secondo')!;
    p.menu = {
      1: { pranzo: [{ ricettaId: primo.id, aggiustamenti: [] }] },
      2: { cena: [{ ricettaId: secondo.id, aggiustamenti: [] }] },
    };
    const ric = indicizzaRicette(p, databaseBase.ricette);
    const ing = indicizzaIngredienti(p, databaseBase.ingredienti);
    const totale = fabbisognoCampoTotale(p, ric);
    expect(totale.length).toBeGreaterThan(0);
    const { ondate } = assegnaOndate(fabbisognoCampoPerGiorno(p, ric), p.campo.giorniSpesa, ing);
    expect(ondate.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { progettoVuoto, serializzaProgetto, deserializzaProgetto } from '../../src/core/progetto';
import type { Progetto } from '../../src/core/types';
import { makeIngrediente, makeRicetta, makePresenze } from '../helpers/factories';

// Un progetto completo come lo produce l'app: deve sempre poter essere riaperto.
function progettoCompleto(): Progetto {
  const p = progettoVuoto();
  p.campo.numeroGiorni = 2;
  p.campo.giorniSpesa = [1, 2];
  p.campo.giornoTipo = makePresenze({ adulti: 8, bambini: 20, vegetariani: 2, allergici: { lattosio: 1, soia: 0 } });
  p.giorni[2] = makePresenze({ adulti: 5 });
  p.ingredientiUtente = [makeIngrediente({ id: 'tofu', allergeni: ['soia'] })];
  p.ricetteUtente = [makeRicetta({ id: 'mia', origine: 'utente', varianteDi: 'pasta_al_sugo' })];
  p.menu = {
    1: {
      pranzo: [{ ricettaId: 'pasta_al_sugo', aggiustamenti: [
        { tipo: 'variante', ricettaVarianteId: 'mia', numeroPersone: 2 },
        { tipo: 'sostituzione', ingredienteDaId: 'pasta', ingredienteAId: 'riso', numeroPersone: 1 },
        { tipo: 'rimozione', ingredienteId: 'parmigiano', numeroPersone: 1 },
      ] }],
      cena: [],
    },
  };
  return p;
}

/** Il JSON di un progetto completo, modificato da `rompi`. */
function fileRotto(rompi: (d: any) => void): string {
  const d = JSON.parse(serializzaProgetto(progettoCompleto()));
  rompi(d);
  return JSON.stringify(d);
}

describe('deserializzaProgetto: controllo del contenuto', () => {
  it('riapre un progetto completo identico', () => {
    const p = progettoCompleto();
    expect(deserializzaProgetto(serializzaProgetto(p))).toEqual(p);
  });

  const casiRotti: [string, (d: any) => void, string][] = [
    ['campo vuoto', (d) => { d.campo = {}; }, 'campo.nome'],
    ['numero giorni non valido', (d) => { d.campo.numeroGiorni = 0; }, 'campo.numeroGiorni'],
    ['numero giorni enorme (bloccherebbe l’app)', (d) => { d.campo.numeroGiorni = 100000000; }, 'campo.numeroGiorni'],
    ['pasti attivi mancanti', (d) => { delete d.campo.pastiAttivi; }, 'campo.pastiAttivi'],
    ['riduzione fuori scala', (d) => { d.campo.riduzioneBambini = 30; }, 'campo.riduzioneBambini'],
    ['giorni di spesa vuoti', (d) => { d.campo.giorniSpesa = []; }, 'campo.giorniSpesa'],
    ['giorno tipo senza allergici', (d) => { delete d.campo.giornoTipo.allergici; }, 'campo.giornoTipo.allergici'],
    ['presenze con testo', (d) => { d.giorni[2].adulti = 'tanti'; }, 'giorni.2.adulti'],
    ['giorno non numerico', (d) => { d.giorni.lunedi = d.giorni[2]; }, 'giorni.lunedi'],
    ['pasto sconosciuto', (d) => { d.menu[1].spuntino = []; }, 'menu.1.spuntino'],
    ['piatto senza aggiustamenti', (d) => { delete d.menu[1].pranzo[0].aggiustamenti; }, 'menu.1.pranzo.0.aggiustamenti'],
    ['piatto senza ricetta', (d) => { d.menu[1].pranzo[0].ricettaId = ''; }, 'menu.1.pranzo.0.ricettaId'],
    ['aggiustamento sconosciuto', (d) => { d.menu[1].pranzo[0].aggiustamenti[0].tipo = 'magia'; }, 'menu.1.pranzo.0.aggiustamenti.0'],
    ['aggiustamento senza persone', (d) => { delete d.menu[1].pranzo[0].aggiustamenti[2].numeroPersone; }, 'menu.1.pranzo.0.aggiustamenti.2.numeroPersone'],
    ['ricette utente non lista', (d) => { d.ricetteUtente = {}; }, 'ricetteUtente'],
    ['ricetta senza ingredienti', (d) => { delete d.ricetteUtente[0].ingredienti; }, 'ricetteUtente.0.ingredienti'],
    ['riga ricetta con unità sbagliata', (d) => { d.ricetteUtente[0].ingredienti[0].unita = 'kg'; }, 'ricetteUtente.0.ingredienti.0.unita'],
    ['ingrediente con allergene sconosciuto', (d) => { d.ingredientiUtente[0].allergeni = ['polline']; }, 'ingredientiUtente.0.allergeni'],
    ['ingrediente senza confezione', (d) => { delete d.ingredientiUtente[0].confezione; }, 'ingredientiUtente.0.confezione'],
    ['ingrediente senza vegetariano', (d) => { delete d.ingredientiUtente[0].vegetariano; }, 'ingredientiUtente.0.vegetariano'],
  ];

  for (const [nome, rompi, punto] of casiRotti) {
    it(`rifiuta un file con ${nome}, indicando dove`, () => {
      expect(() => deserializzaProgetto(fileRotto(rompi))).toThrow(punto);
    });
  }
});

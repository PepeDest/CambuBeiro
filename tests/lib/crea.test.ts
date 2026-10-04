import { describe, it, expect } from 'vitest';
import { formRicettaVuota, formIngredienteVuoto, creaRicetta, creaIngrediente } from '../../src/lib/crea';

const unitaG = () => 'g' as const;

describe('creaRicetta', () => {
  it("costruisce la ricetta dell'utente dal modulo, ignorando le righe vuote", () => {
    const f = { ...formRicettaVuota(), nome: '  Pasta mia ', righe: [{ ingredienteId: 'pasta', dosePersona: 100 }, { ingredienteId: '', dosePersona: 50 }] };
    expect(creaRicetta(f, unitaG, [])).toEqual({
      id: 'pasta_mia', nome: 'Pasta mia', categoria: 'primo', pasti: ['pranzo', 'cena'],
      ingredienti: [{ ingredienteId: 'pasta', dosePersona: 100, unita: 'g' }], origine: 'utente',
    });
  });
  it("genera un id nuovo se quello base esiste già", () => {
    const f = { ...formRicettaVuota(), nome: 'Pasta mia', righe: [{ ingredienteId: 'pasta', dosePersona: 100 }] };
    expect((creaRicetta(f, unitaG, ['pasta_mia']) as { id: string }).id).toBe('pasta_mia_2');
  });
  it('errore senza nome, senza pasti o senza ingredienti validi', () => {
    const errore = { errore: 'Servono: un nome, almeno un pasto e almeno un ingrediente.' };
    expect(creaRicetta(formRicettaVuota(), unitaG, [])).toEqual(errore);
    const senzaPasti = {
      ...formRicettaVuota(), nome: 'X',
      pasti: { colazione: false, pranzo: false, cena: false, merenda: false },
      righe: [{ ingredienteId: 'pasta', dosePersona: 100 }],
    };
    expect(creaRicetta(senzaPasti, unitaG, [])).toEqual(errore);
  });
});

describe('creaIngrediente', () => {
  it('costruisce l\'ingrediente con confezione nella stessa unità e gli allergeni scelti', () => {
    const f = formIngredienteVuoto();
    f.nome = 'Tofu'; f.categoria = 'fresco'; f.durataGiorni = 7; f.confQuantita = 250; f.allergeni.soia = true;
    expect(creaIngrediente(f, [])).toEqual({
      id: 'tofu', nome: 'Tofu', unita: 'g', categoria: 'fresco', durataGiorni: 7,
      confezione: { quantita: 250, unita: 'g', etichetta: 'confezione' }, allergeni: ['soia'], vegetariano: true,
    });
  });
  it('errore senza nome', () => {
    expect(creaIngrediente(formIngredienteVuoto(), [])).toEqual({ errore: "Serve un nome per l'ingrediente." });
  });
});

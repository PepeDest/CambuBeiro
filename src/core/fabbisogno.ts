import type { Assegnazione, Ricetta, RigaFabbisogno } from './types';

export function fabbisognoRicetta(ricetta: Ricetta, porzioni: number): RigaFabbisogno[] {
  return ricetta.ingredienti.map((r) => ({
    ingredienteId: r.ingredienteId,
    quantita: r.dosePersona * porzioni,
    unita: r.unita,
  }));
}

export function accumula(acc: Map<string, RigaFabbisogno>, riga: RigaFabbisogno): void {
  const found = acc.get(riga.ingredienteId);
  if (found) {
    if (found.unita !== riga.unita) {
      throw new Error(`Unità incompatibili per ${riga.ingredienteId}: ${found.unita} vs ${riga.unita}`);
    }
    found.quantita += riga.quantita;
  } else {
    acc.set(riga.ingredienteId, { ...riga });
  }
}

export function fabbisognoAssegnazione(
  assegnazione: Assegnazione,
  porzioni: number,
  ricetteById: Map<string, Ricetta>,
): RigaFabbisogno[] {
  const base = ricetteById.get(assegnazione.ricettaId);
  if (!base) throw new Error(`Ricetta non trovata: ${assegnazione.ricettaId}`);

  const varianti = assegnazione.aggiustamenti.filter((a) => a.tipo === 'variante');
  const porzioniVarianti = varianti.reduce((s, a) => s + a.numeroPersone, 0);
  const porzioniBaseNette = Math.max(0, porzioni - porzioniVarianti);

  const acc = new Map<string, RigaFabbisogno>();

  // base recipe, ingredient by ingredient, applying removals/substitutions
  for (const riga of base.ingredienti) {
    let porzioniIng = porzioniBaseNette;
    for (const a of assegnazione.aggiustamenti) {
      if (a.tipo === 'rimozione' && a.ingredienteId === riga.ingredienteId) {
        porzioniIng -= a.numeroPersone;
      }
      if (a.tipo === 'sostituzione' && a.ingredienteDaId === riga.ingredienteId) {
        porzioniIng -= a.numeroPersone;
        accumula(acc, { ingredienteId: a.ingredienteAId, quantita: riga.dosePersona * a.numeroPersone, unita: riga.unita });
      }
    }
    porzioniIng = Math.max(0, porzioniIng);
    if (porzioniIng > 0) {
      accumula(acc, { ingredienteId: riga.ingredienteId, quantita: riga.dosePersona * porzioniIng, unita: riga.unita });
    }
  }

  // variant recipes
  for (const a of varianti) {
    const v = ricetteById.get(a.ricettaVarianteId);
    if (!v) throw new Error(`Ricetta variante non trovata: ${a.ricettaVarianteId}`);
    for (const riga of fabbisognoRicetta(v, a.numeroPersone)) accumula(acc, riga);
  }

  return [...acc.values()].filter((r) => r.quantita > 0);
}

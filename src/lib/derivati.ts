import type { Progetto, Unita, RigaFabbisogno } from '../core';
import {
  fabbisognoCampoTotale, fabbisognoCampoPerGiorno, fabbisognoGiorno,
  assegnaOndate, calcolaConfezioni,
} from '../core';
import { indiceRicette, indiceIngredienti, nomeIngrediente, perNome } from './catalogo';

export interface RigaDose { ingredienteId: string; nome: string; quantita: number; unita: Unita; }

function aRigheDose(p: Progetto, fabbisogni: RigaFabbisogno[]): RigaDose[] {
  return fabbisogni
    .map((r) => ({ ingredienteId: r.ingredienteId, nome: nomeIngrediente(p, r.ingredienteId), quantita: r.quantita, unita: r.unita }))
    .sort(perNome);
}

export function righeDosiCampo(p: Progetto): RigaDose[] {
  return aRigheDose(p, fabbisognoCampoTotale(p, indiceRicette(p)));
}

export function righeDosiGiorno(p: Progetto, giorno: number): RigaDose[] {
  return aRigheDose(p, fabbisognoGiorno(p, giorno, indiceRicette(p)));
}

export interface RigaSpesa extends RigaDose { numeroConfezioni: number; etichetta: string; quantitaReale: number; }
export interface AvvisoVista { ingredienteId: string; nome: string; giornoConsumo: number; giornoSpesa: number; }
export interface SezioneSpesa { giornoSpesa: number; righe: RigaSpesa[]; }
export interface SpesaVista { sezioni: SezioneSpesa[]; avvisi: AvvisoVista[]; }

export function sezioniSpesa(p: Progetto): SpesaVista {
  const ingredienti = indiceIngredienti(p);
  const perGiorno = fabbisognoCampoPerGiorno(p, indiceRicette(p));
  const { ondate, avvisi } = assegnaOndate(perGiorno, p.campo.giorniSpesa, ingredienti);

  const sezioni: SezioneSpesa[] = ondate.map((o) => ({
    giornoSpesa: o.giornoSpesa,
    righe: o.righe.map((r) => {
      const ing = ingredienti.get(r.ingredienteId);
      const cc = ing
        ? calcolaConfezioni(r.quantita, ing.confezione)
        : { numeroConfezioni: 0, etichetta: '', quantitaReale: r.quantita };
      return {
        ingredienteId: r.ingredienteId, nome: ing?.nome ?? r.ingredienteId, quantita: r.quantita, unita: r.unita,
        numeroConfezioni: cc.numeroConfezioni, etichetta: cc.etichetta, quantitaReale: cc.quantitaReale,
      };
    }).sort(perNome),
  }));

  const avvisiVista: AvvisoVista[] = avvisi.map((a) => ({
    ingredienteId: a.ingredienteId, nome: nomeIngrediente(p, a.ingredienteId),
    giornoConsumo: a.giornoConsumo, giornoSpesa: a.giornoSpesa,
  }));

  return { sezioni, avvisi: avvisiVista };
}

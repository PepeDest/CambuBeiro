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
export interface SpesaVista {
  sezioni: SezioneSpesa[];
  avvisi: AvvisoVista[];
  /** Problemi dei giorni di spesa (spesa dopo i pasti o dopo la fine del campo). */
  avvisiGiorni: string[];
}

/** Controlla che i giorni di spesa abbiano senso rispetto ai giorni con dei pasti. */
function avvisiGiorniSpesa(p: Progetto, giorniConPasti: number[]): string[] {
  const out: string[] = [];
  const prima = Math.min(...p.campo.giorniSpesa);
  const scoperti = giorniConPasti.filter((g) => g < prima);
  if (scoperti.length > 0) {
    const quali = scoperti.length === 1 ? `del giorno ${scoperti[0]}` : `dei giorni ${scoperti.join(', ')}`;
    out.push(`I pasti ${quali} vengono prima della prima spesa (giorno ${prima}): aggiungi un giorno di spesa all’inizio del campo.`);
  }
  for (const g of p.campo.giorniSpesa) {
    if (g > p.campo.numeroGiorni) {
      out.push(`Il giorno di spesa ${g} è dopo l’ultimo giorno del campo (giorno ${p.campo.numeroGiorni}): non serve.`);
    }
  }
  return out;
}

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

  const giorniConPasti = perGiorno.filter((g) => g.righe.length > 0).map((g) => g.giorno);
  return { sezioni, avvisi: avvisiVista, avvisiGiorni: avvisiGiorniSpesa(p, giorniConPasti) };
}

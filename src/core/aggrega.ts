import type { Progetto, Ricetta, RigaFabbisogno } from './types';
import { porzioniBase } from './porzioni';
import { accumula, fabbisognoAssegnazione } from './fabbisogno';
import { presenzeGiorno, pastiAttiviCampo } from './lookup';

function merge(righe: RigaFabbisogno[]): RigaFabbisogno[] {
  const acc = new Map<string, RigaFabbisogno>();
  for (const r of righe) accumula(acc, r);
  return [...acc.values()];
}

export function fabbisognoGiorno(
  progetto: Progetto, giorno: number, ricetteById: Map<string, Ricetta>,
): RigaFabbisogno[] {
  const presenze = presenzeGiorno(progetto, giorno);
  const porzioni = porzioniBase(presenze, progetto.campo.riduzioneBambini);
  // Porzione media a persona: trasforma le persone degli aggiustamenti in porzioni.
  const persone = presenze.adulti + presenze.bambini;
  const porzioniPerPersona = persone > 0 ? porzioni / persone : 0;
  const giornoMenu = progetto.menu[giorno] ?? {};
  const tutte: RigaFabbisogno[] = [];
  for (const pasto of pastiAttiviCampo(progetto.campo)) {
    for (const a of giornoMenu[pasto] ?? []) {
      tutte.push(...fabbisognoAssegnazione(a, porzioni, ricetteById, porzioniPerPersona));
    }
  }
  return merge(tutte);
}

export interface FabbisognoPerGiorno { giorno: number; righe: RigaFabbisogno[]; }

export function fabbisognoCampoPerGiorno(
  progetto: Progetto, ricetteById: Map<string, Ricetta>,
): FabbisognoPerGiorno[] {
  const out: FabbisognoPerGiorno[] = [];
  for (let g = 1; g <= progetto.campo.numeroGiorni; g++) {
    out.push({ giorno: g, righe: fabbisognoGiorno(progetto, g, ricetteById) });
  }
  return out;
}

export function fabbisognoCampoTotale(
  progetto: Progetto, ricetteById: Map<string, Ricetta>,
): RigaFabbisogno[] {
  const tutte: RigaFabbisogno[] = [];
  for (const g of fabbisognoCampoPerGiorno(progetto, ricetteById)) tutte.push(...g.righe);
  return merge(tutte);
}

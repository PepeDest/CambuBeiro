import type { Ingrediente, RigaFabbisogno } from './types';
import type { FabbisognoPerGiorno } from './aggrega';

export type RigaOndata = RigaFabbisogno;
export interface AvvisoDurata { ingredienteId: string; giornoConsumo: number; giornoSpesa: number; durataGiorni: number; }
export interface Ondata { giornoSpesa: number; righe: RigaOndata[]; }
export interface RisultatoOndate { ondate: Ondata[]; avvisi: AvvisoDurata[]; }

/** L'ultimo giorno di spesa non successivo al consumo (o il primo, se sono tutti dopo). */
function ondataPerGiorno(giorniSpesaOrdinati: number[], giornoConsumo: number): number {
  let scelto = giorniSpesaOrdinati[0]!;
  for (const g of giorniSpesaOrdinati) if (g <= giornoConsumo) scelto = g;
  return scelto;
}

export function assegnaOndate(
  perGiorno: FabbisognoPerGiorno[],
  giorniSpesa: number[],
  ingredientiById: Map<string, Ingrediente>,
): RisultatoOndate {
  // giorniSpesa non è mai vuoto: lo garantisce parseGiorniSpesa (src/lib/azioni.ts).
  const ordinati = [...giorniSpesa].sort((a, b) => a - b);
  const primaSpesa = ordinati[0]!;
  const perOndata = new Map<number, Map<string, RigaOndata>>();
  const avvisi: AvvisoDurata[] = [];

  const bucket = (giornoSpesa: number) => {
    let m = perOndata.get(giornoSpesa);
    if (!m) { m = new Map(); perOndata.set(giornoSpesa, m); }
    return m;
  };

  for (const { giorno, righe } of perGiorno) {
    for (const r of righe) {
      const ing = ingredientiById.get(r.ingredienteId);
      const fresco = ing?.categoria === 'fresco';
      const giornoSpesa = fresco ? ondataPerGiorno(ordinati, giorno) : primaSpesa;
      const m = bucket(giornoSpesa);
      const f = m.get(r.ingredienteId);
      if (f) f.quantita += r.quantita;
      else m.set(r.ingredienteId, { ingredienteId: r.ingredienteId, quantita: r.quantita, unita: r.unita });

      if (fresco && ing && ing.durataGiorni < giorno - giornoSpesa) {
        avvisi.push({ ingredienteId: r.ingredienteId, giornoConsumo: giorno, giornoSpesa, durataGiorni: ing.durataGiorni });
      }
    }
  }

  const ondate: Ondata[] = [...perOndata.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([giornoSpesa, m]) => ({ giornoSpesa, righe: [...m.values()] }));

  return { ondate, avvisi };
}

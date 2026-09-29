import type { Presenze } from './types';

export function porzioniBase(presenze: Presenze, riduzioneBambini: number): number {
  return presenze.adulti + presenze.bambini * (1 - riduzioneBambini);
}

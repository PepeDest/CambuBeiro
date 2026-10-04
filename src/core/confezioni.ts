import type { Confezione, Unita } from './types';

export interface ConfezioniCalcolate {
  totale: number;
  unita: Unita;
  numeroConfezioni: number;
  quantitaReale: number;
  etichetta: string;
}

export function calcolaConfezioni(totale: number, confezione: Confezione): ConfezioniCalcolate {
  const numeroConfezioni = totale <= 0 ? 0 : Math.ceil(totale / confezione.quantita);
  return {
    totale,
    unita: confezione.unita,
    numeroConfezioni,
    quantitaReale: numeroConfezioni * confezione.quantita,
    etichetta: confezione.etichetta,
  };
}

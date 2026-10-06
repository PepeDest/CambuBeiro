import { writable } from 'svelte/store';
import type { Progetto } from '../core';
import { progettoVuoto } from '../core';
import { apriStorage, caricaConAvvisi, salvaProgettoLocale, progettoDaAltraScheda, type Caricamento } from './persistenza';

export type Sezione = 'campo' | 'presenze' | 'ricette' | 'menu' | 'dosi' | 'spesa';

const AVVISO_SENZA_MEMORIA = 'Questo browser non permette il salvataggio automatico: usa «Salva» per non perdere il lavoro.';
const AVVISO_SALVATAGGIO_FALLITO =
  'Il salvataggio automatico non è riuscito (memoria del browser piena o bloccata): usa «Salva» per non perdere il lavoro.';

const storage = apriStorage();
const iniziale: Caricamento = storage
  ? caricaConAvvisi(storage)
  : { progetto: progettoVuoto(), avvisi: [AVVISO_SENZA_MEMORIA], riserva: null };

export const progetto = writable<Progetto>(iniziale.progetto);
export const sezioneAttiva = writable<Sezione>('campo');
/** Messaggi importanti per l'utente, mostrati nella barra gialla in alto. */
export const avvisi = writable<string[]>(iniziale.avvisi);
/** Il progetto salvato che non si è potuto aprire, da far scaricare all'utente. */
export const copiaRiserva = writable<string | null>(iniziale.riserva);

export function aggiungiAvviso(testo: string): void {
  avvisi.update((a) => (a.includes(testo) ? a : [...a, testo]));
}

// Autosalvataggio: attende 300 ms dall'ultima modifica, ma salva subito se la scheda
// viene chiusa (altrimenti le modifiche degli ultimi istanti andrebbero perse).
let timer: ReturnType<typeof setTimeout> | undefined;
let ultimo: Progetto | undefined;

function salvaInSospeso(): void {
  if (timer === undefined) return;
  clearTimeout(timer);
  timer = undefined;
  if (storage && ultimo && !salvaProgettoLocale(storage, ultimo)) aggiungiAvviso(AVVISO_SALVATAGGIO_FALLITO);
}

progetto.subscribe((p) => {
  if (!storage) return;
  ultimo = p;
  if (timer) clearTimeout(timer);
  timer = setTimeout(salvaInSospeso, 300);
});

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', salvaInSospeso);
  // Con l'app aperta in due schede, ognuna riprende le modifiche dell'altra invece di
  // sovrascriverle col proprio progetto vecchio.
  window.addEventListener('storage', (e) => {
    const p = progettoDaAltraScheda(e);
    if (!p) return;
    clearTimeout(timer);
    timer = undefined;
    progetto.set(p);
  });
}

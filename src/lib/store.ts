import { writable } from 'svelte/store';
import type { Progetto } from '../core';
import { progettoVuoto } from '../core';
import { caricaProgetto, salvaProgettoLocale, type StorageLike } from './persistenza';

export type Sezione = 'campo' | 'presenze' | 'ricette' | 'menu' | 'dosi' | 'spesa';

const storage: StorageLike | undefined =
  typeof localStorage !== 'undefined' ? localStorage : undefined;

export const progetto = writable<Progetto>(storage ? caricaProgetto(storage) : progettoVuoto());
export const sezioneAttiva = writable<Sezione>('campo');

// Autosalvataggio: attende 300 ms dall'ultima modifica, ma salva subito se la scheda
// viene chiusa (altrimenti le modifiche degli ultimi istanti andrebbero perse).
let timer: ReturnType<typeof setTimeout> | undefined;
let ultimo: Progetto | undefined;

function salvaInSospeso(): void {
  if (timer === undefined) return;
  clearTimeout(timer);
  timer = undefined;
  if (storage && ultimo) salvaProgettoLocale(storage, ultimo);
}

progetto.subscribe((p) => {
  if (!storage) return;
  ultimo = p;
  if (timer) clearTimeout(timer);
  timer = setTimeout(salvaInSospeso, 300);
});

if (typeof window !== 'undefined') window.addEventListener('pagehide', salvaInSospeso);

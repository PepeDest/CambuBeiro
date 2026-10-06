import { PASTI, ALLERGENI } from './types';

// Controllo del contenuto di un progetto letto da file o dal browser: un file rovinato
// va rifiutato PRIMA di entrare nell'app, altrimenti la blocca (e il salvataggio
// automatico lo renderebbe permanente). Ogni funzione restituisce il primo errore
// trovato, con il punto preciso (es. "menu.1.pranzo.0.ricettaId"), oppure null.

type Errore = string | null;
type Oggetto = Record<string, unknown>;

const UNITA = ['g', 'ml', 'pz'];
const CATEGORIE_INGREDIENTE = ['fresco', 'secco', 'scatolame'];

const eOggetto = (x: unknown): x is Oggetto => typeof x === 'object' && x !== null && !Array.isArray(x);
const eNumero = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const eIntero = (x: unknown, min: number): boolean => eNumero(x) && Number.isInteger(x) && x >= min;
const eChiaveGiorno = (k: string): boolean => /^[1-9][0-9]*$/.test(k);

/** Restituisce il primo errore di una lista di controlli. */
function primo(...controlli: (() => Errore)[]): Errore {
  for (const c of controlli) {
    const e = c();
    if (e) return e;
  }
  return null;
}

function testo(o: Oggetto, campo: string, dove: string, nonVuoto = false): Errore {
  const v = o[campo];
  return typeof v === 'string' && (!nonVuoto || v !== '') ? null : `"${dove}.${campo}" deve essere un testo${nonVuoto ? ' non vuoto' : ''}.`;
}

function numero(o: Oggetto, campo: string, dove: string, min: number, max = Infinity): Errore {
  const v = o[campo];
  return eNumero(v) && v >= min && v <= max ? null : `"${dove}.${campo}" deve essere un numero valido.`;
}

function scelta(o: Oggetto, campo: string, dove: string, ammessi: readonly string[]): Errore {
  return ammessi.includes(o[campo] as string) ? null : `"${dove}.${campo}" ha un valore non valido.`;
}

/** Una lista di elementi tutti validi secondo `controlla`. */
function lista(v: unknown, dove: string, controlla: (x: unknown, dove: string) => Errore): Errore {
  if (!Array.isArray(v)) return `"${dove}" deve essere una lista.`;
  for (let i = 0; i < v.length; i++) {
    const e = controlla(v[i], `${dove}.${i}`);
    if (e) return e;
  }
  return null;
}

function presenze(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" deve contenere le presenze.`;
  return primo(
    () => numero(v, 'adulti', dove, 0),
    () => numero(v, 'bambini', dove, 0),
    () => numero(v, 'vegetariani', dove, 0),
    () => {
      const a = v.allergici;
      if (!eOggetto(a)) return `"${dove}.allergici" deve contenere gli allergici.`;
      for (const k of Object.keys(a)) {
        const e = numero(a, k, `${dove}.allergici`, 0);
        if (e) return e;
      }
      return null;
    },
  );
}

function campo(v: unknown): Errore {
  const dove = 'campo';
  if (!eOggetto(v)) return '"campo" deve contenere i dati del campo.';
  return primo(
    () => testo(v, 'nome', dove),
    () => (eIntero(v.numeroGiorni, 1) ? null : '"campo.numeroGiorni" deve essere un numero intero ≥ 1.'),
    () => {
      const pa = v.pastiAttivi;
      return eOggetto(pa) && PASTI.every((p) => typeof pa[p] === 'boolean')
        ? null : '"campo.pastiAttivi" deve indicare quali pasti sono attivi.';
    },
    () => numero(v, 'riduzioneBambini', dove, 0, 1),
    () => {
      const gs = v.giorniSpesa;
      return Array.isArray(gs) && gs.length > 0 && gs.every((g) => eIntero(g, 1))
        ? null : '"campo.giorniSpesa" deve contenere almeno un giorno di spesa.';
    },
    () => presenze(v.giornoTipo, `${dove}.giornoTipo`),
  );
}

function giorni(v: unknown): Errore {
  if (!eOggetto(v)) return '"giorni" deve contenere le presenze per giorno.';
  for (const [k, pr] of Object.entries(v)) {
    if (!eChiaveGiorno(k)) return `"giorni.${k}" non è un giorno valido.`;
    const e = presenze(pr, `giorni.${k}`);
    if (e) return e;
  }
  return null;
}

function aggiustamento(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" non è un aggiustamento valido.`;
  const persone = () => numero(v, 'numeroPersone', dove, 0);
  switch (v.tipo) {
    case 'variante': return primo(() => testo(v, 'ricettaVarianteId', dove, true), persone);
    case 'sostituzione': return primo(() => testo(v, 'ingredienteDaId', dove, true), () => testo(v, 'ingredienteAId', dove, true), persone);
    case 'rimozione': return primo(() => testo(v, 'ingredienteId', dove, true), persone);
    default: return `"${dove}.tipo" non è un tipo di aggiustamento valido.`;
  }
}

function assegnazione(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" non è un piatto valido.`;
  return primo(
    () => testo(v, 'ricettaId', dove, true),
    () => lista(v.aggiustamenti, `${dove}.aggiustamenti`, aggiustamento),
  );
}

function menu(v: unknown): Errore {
  if (!eOggetto(v)) return '"menu" deve contenere il menu.';
  for (const [k, giorno] of Object.entries(v)) {
    const dove = `menu.${k}`;
    if (!eChiaveGiorno(k)) return `"${dove}" non è un giorno valido.`;
    if (!eOggetto(giorno)) return `"${dove}" deve contenere i pasti del giorno.`;
    for (const [pasto, piatti] of Object.entries(giorno)) {
      if (!(PASTI as string[]).includes(pasto)) return `"${dove}.${pasto}" non è un pasto valido.`;
      const e = lista(piatti, `${dove}.${pasto}`, assegnazione);
      if (e) return e;
    }
  }
  return null;
}

function rigaRicetta(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" non è un ingrediente della ricetta valido.`;
  return primo(
    () => testo(v, 'ingredienteId', dove, true),
    () => numero(v, 'dosePersona', dove, 0),
    () => scelta(v, 'unita', dove, UNITA),
  );
}

function ricetta(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" non è una ricetta valida.`;
  return primo(
    () => testo(v, 'id', dove, true),
    () => testo(v, 'nome', dove),
    () => testo(v, 'categoria', dove),
    () => lista(v.pasti, `${dove}.pasti`, (p, d) => ((PASTI as unknown[]).includes(p) ? null : `"${d}" non è un pasto valido.`)),
    () => lista(v.ingredienti, `${dove}.ingredienti`, rigaRicetta),
    () => scelta(v, 'origine', dove, ['base', 'utente']),
    () => (v.varianteDi === undefined ? null : testo(v, 'varianteDi', dove)),
  );
}

function ingrediente(v: unknown, dove: string): Errore {
  if (!eOggetto(v)) return `"${dove}" non è un ingrediente valido.`;
  return primo(
    () => testo(v, 'id', dove, true),
    () => testo(v, 'nome', dove),
    () => scelta(v, 'unita', dove, UNITA),
    () => scelta(v, 'categoria', dove, CATEGORIE_INGREDIENTE),
    () => numero(v, 'durataGiorni', dove, 0),
    () => {
      const c = v.confezione;
      if (!eOggetto(c)) return `"${dove}.confezione" deve descrivere la confezione.`;
      const d = `${dove}.confezione`;
      return primo(() => numero(c, 'quantita', d, Number.MIN_VALUE), () => scelta(c, 'unita', d, UNITA), () => testo(c, 'etichetta', d));
    },
    () => lista(v.allergeni, `${dove}.allergeni`, (a, d) => ((ALLERGENI as unknown[]).includes(a) ? null : `"${d}" non è un allergene conosciuto.`)),
    () => (typeof v.vegetariano === 'boolean' ? null : `"${dove}.vegetariano" deve essere sì o no.`),
  );
}

/** Il primo problema del contenuto di un progetto (già letto dal JSON), oppure null se è valido. */
export function erroreProgetto(p: Oggetto): Errore {
  return primo(
    () => campo(p.campo),
    () => giorni(p.giorni),
    () => menu(p.menu),
    () => lista(p.ricetteUtente, 'ricetteUtente', ricetta),
    () => lista(p.ingredientiUtente, 'ingredientiUtente', ingrediente),
  );
}

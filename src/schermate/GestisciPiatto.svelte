<script lang="ts">
  import { progetto } from '../lib/store';
  import { aggiungiAggiustamento, rimuoviAggiustamento } from '../lib/azioni';
  import {
    trovaAssegnazione, personePresenti, personeImpegnate, personeDisponibili, puoAggiungereAggiustamento,
    creaAggiustamento, descriviAggiustamento, type StatoConflitti,
  } from '../lib/conflitti-vista';
  import { indiceRicette, ricetteDisponibili, ingredientiDisponibili, nomeIngrediente } from '../lib/catalogo';
  import { ETICHETTE_PASTO, type Pasto, type Aggiustamento } from '../core';

  /** Stato dei conflitti già calcolato dal Menu (così non si ricalcola qui). */
  export let stato: StatoConflitti;

  let dialogo: HTMLDialogElement;
  let giorno = 1;
  let pasto: Pasto = 'pranzo';
  let ricettaId = '';

  // modulo nuovo aggiustamento
  let tipoNuovo: Aggiustamento['tipo'] = 'rimozione';
  let nPersone = 1;
  let varianteId = '';
  let ingDaId = '';
  let ingAId = '';
  let ingRimId = '';

  function svuotaModulo() { nPersone = 1; varianteId = ''; ingDaId = ''; ingAId = ''; ingRimId = ''; }

  export function apri(g: number, p: Pasto, r: string) {
    giorno = g; pasto = p; ricettaId = r;
    tipoNuovo = 'rimozione';
    svuotaModulo();
    dialogo.showModal();
  }

  $: ricetta = indiceRicette($progetto).get(ricettaId);
  $: assegnazione = trovaAssegnazione($progetto, giorno, pasto, ricettaId);
  $: conflittiPiatto = stato.elenco.filter((c) => c.giorno === giorno && c.pasto === pasto && c.ricettaId === ricettaId);
  $: presenti = personePresenti($progetto, giorno);
  $: impegnate = assegnazione ? personeImpegnate(assegnazione) : 0;
  $: disponibili = personeDisponibili($progetto, giorno, pasto, ricettaId);
  $: ingredientiPiatto = (ricetta?.ingredienti ?? []).map((r) => ({ id: r.ingredienteId, nome: nomeIngrediente($progetto, r.ingredienteId) }));
  $: catalogoRicette = ricetteDisponibili($progetto).filter((r) => r.pasti.includes(pasto) && r.id !== ricettaId);
  $: catalogoIngredienti = ingredientiDisponibili($progetto);

  function aggiungi() {
    if (!puoAggiungereAggiustamento($progetto, giorno, pasto, ricettaId, nPersone)) {
      alert(`Numero persone non valido: al massimo ${disponibili} ancora disponibili.`);
      return;
    }
    const agg = creaAggiustamento(tipoNuovo, { varianteId, ingDaId, ingAId, ingRimId }, nPersone);
    if ('errore' in agg) { alert(agg.errore); return; }
    progetto.update((p) => aggiungiAggiustamento(p, giorno, pasto, ricettaId, agg));
    svuotaModulo();
  }

  function togliAgg(indice: number) {
    progetto.update((p) => rimuoviAggiustamento(p, giorno, pasto, ricettaId, indice));
  }
</script>

<dialog bind:this={dialogo} class="gestisci">
  <h3>Gestisci — Giorno {giorno} · {ETICHETTE_PASTO[pasto]} · {ricetta?.nome ?? ricettaId}</h3>

  {#if conflittiPiatto.length > 0}
    <div class="conflitti">
      {#each conflittiPiatto as c}
        <div>{c.tipo === 'allergene' ? `Contiene ${c.dettaglio}` : 'Non vegetariano'} — {c.personeInteressate} persone</div>
      {/each}
    </div>
  {:else}
    <p class="nessuno">Nessun conflitto rilevato per questo piatto.</p>
  {/if}

  <p class="conteggio">Persone: {impegnate} impegnate su {presenti} presenti</p>

  {#if assegnazione && assegnazione.aggiustamenti.length > 0}
    <ul class="lista">
      {#each assegnazione.aggiustamenti as a, i}
        <li>{descriviAggiustamento(a, $progetto)} <button class="x" on:click={() => togliAgg(i)} aria-label="Togli aggiustamento">✕</button></li>
      {/each}
    </ul>
  {/if}

  <div class="aggiungi">
    <h4>Aggiungi aggiustamento</h4>
    <label>Tipo
      <select bind:value={tipoNuovo}>
        <option value="rimozione">Rimozione ingrediente</option>
        <option value="sostituzione">Sostituzione ingrediente</option>
        <option value="variante">Variante (piatto alternativo)</option>
      </select>
    </label>

    {#if tipoNuovo === 'variante'}
      <label>Piatto alternativo
        <select bind:value={varianteId}><option value="">— scegli —</option>{#each catalogoRicette as r}<option value={r.id}>{r.nome}</option>{/each}</select>
      </label>
    {:else if tipoNuovo === 'sostituzione'}
      <label>Togli
        <select bind:value={ingDaId}><option value="">— ingrediente del piatto —</option>{#each ingredientiPiatto as ing}<option value={ing.id}>{ing.nome}</option>{/each}</select>
      </label>
      <label>Metti
        <select bind:value={ingAId}><option value="">— ingrediente —</option>{#each catalogoIngredienti as ing}<option value={ing.id}>{ing.nome}</option>{/each}</select>
      </label>
    {:else}
      <label>Ingrediente da togliere
        <select bind:value={ingRimId}><option value="">— ingrediente del piatto —</option>{#each ingredientiPiatto as ing}<option value={ing.id}>{ing.nome}</option>{/each}</select>
      </label>
    {/if}

    <label>Per quante persone
      <input type="number" min="1" max={disponibili} bind:value={nPersone} />
    </label>
    <button class="ok" on:click={aggiungi}>Aggiungi</button>
  </div>

  <button class="chiudi" on:click={() => dialogo.close()}>Chiudi</button>
</dialog>

<style>
  .gestisci { border: 0; border-radius: 10px; padding: 1rem; width: min(92vw, 520px); }
  .gestisci h3 { margin-top: 0; }
  .conflitti { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 0.5rem 0.8rem; margin-bottom: 0.5rem; }
  .nessuno { color: #6b7280; }
  .conteggio { color: #374151; font-size: 0.9rem; }
  .lista { list-style: none; padding: 0; margin: 0 0 0.8rem; }
  .lista li { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; border-bottom: 1px solid #eee; }
  .lista .x { border: 0; background: transparent; cursor: pointer; color: #b91c1c; }
  .aggiungi { border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.7rem; display: flex; flex-direction: column; gap: 0.5rem; background: #f9fafb; }
  .aggiungi label { display: flex; flex-direction: column; gap: 0.2rem; font-weight: 600; }
  select, input[type="number"] { padding: 0.4rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .ok { background: #15803d; color: #fff; border: 0; border-radius: 6px; padding: 0.45rem 0.9rem; cursor: pointer; font-weight: 600; }
  .chiudi { margin-top: 0.7rem; }
</style>

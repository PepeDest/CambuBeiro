<script lang="ts">
  import { progetto } from '../lib/store';
  import { assegnaPiatto, rimuoviPiatto } from '../lib/azioni';
  import { cercaRicette, nomeRicetta } from '../lib/catalogo';
  import { statoConflitti } from '../lib/conflitti-vista';
  import { PASTI, ETICHETTE_PASTO, giorniCampo, type Pasto } from '../core';
  import GestisciPiatto from './GestisciPiatto.svelte';

  const MAX_RISULTATI = 60; // righe mostrate al massimo nel selettore ricette

  $: pasti = PASTI.filter((p) => $progetto.campo.pastiAttivi[p]);
  $: giorni = giorniCampo($progetto.campo);
  $: stato = statoConflitti($progetto);

  let gestisci: GestisciPiatto;

  // selettore ricette
  let dialogo: HTMLDialogElement;
  let target: { giorno: number; pasto: Pasto } | null = null;
  let cerca = '';
  $: risultati = target ? cercaRicette($progetto, cerca, target.pasto).slice(0, MAX_RISULTATI) : [];

  function apriPicker(giorno: number, pasto: Pasto) { target = { giorno, pasto }; cerca = ''; dialogo.showModal(); }
  function scegli(ricettaId: string) {
    if (!target) return;
    const t = target;
    progetto.update((p) => assegnaPiatto(p, t.giorno, t.pasto, ricettaId));
    dialogo.close();
  }
  function togli(giorno: number, pasto: Pasto, ricettaId: string) {
    progetto.update((p) => rimuoviPiatto(p, giorno, pasto, ricettaId));
  }
</script>

<section class="schermata">
  <h2>🗓️ Menu</h2>
  {#if stato.nonGestiti.length > 0}
    <div class="riepilogo">
      <strong>⚠️ Conflitti da gestire ({stato.nonGestiti.length})</strong>
      <ul>
        {#each stato.nonGestiti as c}
          <li><button class="riga-conflitto" on:click={() => gestisci.apri(c.giorno, c.pasto, c.ricettaId)}>Giorno {c.giorno} · {ETICHETTE_PASTO[c.pasto]} · {c.nomeRicetta} → {c.dettaglio} ({c.personeInteressate} persone)</button></li>
        {/each}
      </ul>
    </div>
  {:else}
    <p class="ok-conflitti">✔ Nessun conflitto da gestire</p>
  {/if}
  {#if giorni.length === 0}
    <p class="vuoto">Imposta il numero di giorni in Campo.</p>
  {:else}
    <div class="griglia">
      <table>
        <thead>
          <tr>
            <th class="angolo">Pasto \ Giorno</th>
            {#each giorni as g}<th class="giorno">Giorno {g}</th>{/each}
          </tr>
        </thead>
        <tbody>
          {#each pasti as pasto}
            <tr>
              <th class="pasto">{ETICHETTE_PASTO[pasto]}</th>
              {#each giorni as g}
                {@const attiva = stato.cellaAttiva(g, pasto)}
                <td class:cella-warn={attiva}>
                  {#if attiva}<span class="cella-badge" title="Conflitto da gestire">⚠️</span>{/if}
                  {#each $progetto.menu[g]?.[pasto] ?? [] as a}
                    {@const statoChip = stato.statoPiatto(g, pasto, a.ricettaId)}
                    <span class="chip">
                      {#if statoChip === 'warn'}<span class="ind warn" title="Conflitto da gestire">⚠️</span>{:else if statoChip === 'ok'}<span class="ind ok" title="Gestito">✓</span>{/if}
                      <button class="nome-piatto" on:click={() => gestisci.apri(g, pasto, a.ricettaId)}>{nomeRicetta($progetto, a.ricettaId)}</button>
                      <button class="x" on:click={() => togli(g, pasto, a.ricettaId)} aria-label="Togli piatto">✕</button>
                    </span>
                  {/each}
                  <button class="add" on:click={() => apriPicker(g, pasto)} aria-label="Aggiungi piatto">＋</button>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <dialog bind:this={dialogo} class="picker">
    {#if target}
      <h3>Aggiungi a Giorno {target.giorno} · {ETICHETTE_PASTO[target.pasto]}</h3>
      <input type="text" placeholder="Cerca…" bind:value={cerca} />
      <ul>
        {#each risultati as r}
          <li><button on:click={() => scegli(r.id)}>{r.nome} <span class="cat">{r.categoria}</span></button></li>
        {/each}
      </ul>
      <button class="chiudi" on:click={() => dialogo.close()}>Chiudi</button>
    {/if}
  </dialog>

  <GestisciPiatto bind:this={gestisci} {stato} />
</section>

<style>
  .schermata { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; height: 100%; }
  .griglia { overflow: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
  table { border-collapse: separate; border-spacing: 0; }
  th, td { border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 0.4rem; vertical-align: top; min-width: 150px; }
  thead th { position: sticky; top: 0; background: #ecfdf5; z-index: 2; }
  th.pasto { position: sticky; left: 0; background: #ecfdf5; z-index: 1; min-width: 110px; text-align: left; }
  th.angolo { position: sticky; left: 0; top: 0; z-index: 3; background: #d1fae5; min-width: 110px; }
  th.giorno { text-align: center; }
  .chip { display: inline-flex; align-items: center; gap: 0.25rem; background: #dbeafe; border-radius: 999px; padding: 0.1rem 0.5rem; margin: 0.1rem; font-size: 0.85rem; }
  .chip .x { border: 0; background: transparent; cursor: pointer; color: #1e3a8a; }
  .add { display: block; margin-top: 0.25rem; background: #e5e7eb; border: 0; border-radius: 6px; padding: 0.15rem 0.5rem; cursor: pointer; }
  .picker { border: 0; border-radius: 10px; padding: 1rem; width: min(90vw, 460px); }
  .picker input { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 0.5rem; }
  .picker ul { list-style: none; padding: 0; margin: 0; max-height: 50vh; overflow: auto; }
  .picker li button { width: 100%; text-align: left; background: transparent; border: 0; border-bottom: 1px solid #eee; padding: 0.5rem; cursor: pointer; }
  .picker li button:hover { background: #f3f4f6; }
  .picker .cat { color: #6b7280; font-size: 0.8rem; }
  .picker .chiudi { margin-top: 0.5rem; }
  .vuoto { color: #6b7280; }
  .riepilogo { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 0.6rem 1rem; }
  .riepilogo ul { margin: 0.3rem 0 0; padding-left: 1.1rem; }
  .ok-conflitti { color: #15803d; font-weight: 600; }
  .cella-warn { background: #fffbeb; }
  .cella-badge { float: right; }
  .ind { margin-right: 0.15rem; }
  .ind.warn { color: #b45309; }
  .ind.ok { color: #15803d; }
  .nome-piatto { background: transparent; border: 0; padding: 0; cursor: pointer; color: #1e3a8a; text-decoration: underline; font: inherit; }
  .riga-conflitto { background: transparent; border: 0; padding: 0.15rem 0; cursor: pointer; text-align: left; color: inherit; font: inherit; text-decoration: underline; }
</style>

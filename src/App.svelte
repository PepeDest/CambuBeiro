<script lang="ts">
  import { progetto, sezioneAttiva, type Sezione } from './lib/store';
  import { serializzaProgetto, deserializzaProgetto, progettoVuoto, type Progetto } from './core';
  import { creaFileExcel } from './lib/esporta-excel';
  import { nomeFile, scaricaFile } from './lib/file';
  import Campo from './schermate/Campo.svelte';
  import Presenze from './schermate/Presenze.svelte';
  import Ricette from './schermate/Ricette.svelte';
  import Menu from './schermate/Menu.svelte';
  import Dosi from './schermate/Dosi.svelte';
  import Spesa from './schermate/Spesa.svelte';

  const voci: { id: Sezione; etichetta: string; icona: string }[] = [
    { id: 'campo', etichetta: 'Campo', icona: '⛺' },
    { id: 'presenze', etichetta: 'Presenze', icona: '👥' },
    { id: 'ricette', etichetta: 'Ricette', icona: '📖' },
    { id: 'menu', etichetta: 'Menu', icona: '🗓️' },
    { id: 'dosi', etichetta: 'Dosi', icona: '⚖️' },
    { id: 'spesa', etichetta: 'Spesa', icona: '🛒' },
  ];

  let inputFile: HTMLInputElement;

  function salva() {
    const blob = new Blob([serializzaProgetto($progetto)], { type: 'application/json' });
    scaricaFile(nomeFile($progetto.campo.nome, 'cambusa'), blob);
  }

  function esporta() {
    scaricaFile(nomeFile($progetto.campo.nome, 'xlsx'), creaFileExcel($progetto));
  }

  function sostituisciProgetto(p: Progetto) {
    progetto.set(p);
    sezioneAttiva.set('campo');
  }

  function nuovo() {
    if (confirm('Creare un nuovo progetto? Le modifiche non salvate su file andranno perse.')) {
      sostituisciProgetto(progettoVuoto());
    }
  }

  async function apri(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      sostituisciProgetto(deserializzaProgetto(await file.text()));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'File non valido.');
    } finally {
      inputFile.value = '';
    }
  }
</script>

<div class="app">
  <header class="barra">
    <div class="titolo">🍲 Cambusa Scout</div>
    <div class="nome-campo">{$progetto.campo.nome || 'Nuovo campo'}</div>
    <div class="azioni">
      <button on:click={nuovo}>Nuovo</button>
      <button on:click={() => inputFile.click()}>Apri</button>
      <button on:click={salva}>Salva</button>
      <button on:click={esporta}>Esporta Excel</button>
      <input bind:this={inputFile} type="file" accept=".cambusa,application/json" on:change={apri} hidden />
    </div>
  </header>

  <div class="corpo">
    <nav class="sidebar">
      {#each voci as v}
        <button class:attiva={$sezioneAttiva === v.id} on:click={() => sezioneAttiva.set(v.id)}>
          <span class="icona">{v.icona}</span> {v.etichetta}
        </button>
      {/each}
    </nav>

    <main class="contenuto">
      {#if $sezioneAttiva === 'campo'}<Campo />
      {:else if $sezioneAttiva === 'presenze'}<Presenze />
      {:else if $sezioneAttiva === 'ricette'}<Ricette />
      {:else if $sezioneAttiva === 'menu'}<Menu />
      {:else if $sezioneAttiva === 'dosi'}<Dosi />
      {:else}<Spesa />{/if}
    </main>
  </div>
</div>

<style>
  :global(body) { margin: 0; font-family: system-ui, sans-serif; color: #1f2937; background: #f9fafb; }
  .app { display: flex; flex-direction: column; height: 100vh; }
  .barra { display: flex; align-items: center; gap: 1rem; background: #15803d; color: #fff; padding: 0.6rem 1rem; }
  .barra .titolo { font-weight: 700; }
  .barra .nome-campo { opacity: 0.9; }
  .barra .azioni { margin-left: auto; display: flex; gap: 0.5rem; }
  .barra button { background: #fff; color: #15803d; border: 0; border-radius: 6px; padding: 0.4rem 0.8rem; cursor: pointer; font-weight: 600; }
  .corpo { display: flex; flex: 1; min-height: 0; }
  .sidebar { width: 200px; background: #ecfdf5; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
  .sidebar button { text-align: left; background: transparent; border: 0; border-radius: 6px; padding: 0.6rem 0.8rem; cursor: pointer; font-size: 1rem; }
  .sidebar button.attiva { background: #15803d; color: #fff; }
  .sidebar .icona { margin-right: 0.4rem; }
  .contenuto { flex: 1; overflow: auto; background: #fff; }
</style>

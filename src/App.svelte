<script lang="ts">
  import { progetto, sezioneAttiva, avvisi, copiaRiserva, type Sezione } from './lib/store';
  import { ripulisciProgetto } from './lib/ripulisci';
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

  function scaricaRiserva() {
    if ($copiaRiserva) scaricaFile('copia-di-riserva.cambusa', new Blob([$copiaRiserva], { type: 'application/json' }));
  }

  const chiudiAvviso = (i: number) => avvisi.update((a) => a.filter((_, k) => k !== i));

  async function apri(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const { progetto: aperto, avvisi: note } = ripulisciProgetto(deserializzaProgetto(await file.text()));
      sostituisciProgetto(aperto);
      if (note.length > 0) alert(note.join('\n'));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'File non valido.');
    } finally {
      inputFile.value = '';
    }
  }
</script>

<div class="app">
  <header class="barra">
    <div class="titolo">🍲 Cambusa</div>
    <div class="nome-campo">{$progetto.campo.nome || 'Nuovo campo'}</div>
    <div class="azioni">
      <button on:click={nuovo}>Nuovo</button>
      <button on:click={() => inputFile.click()}>Apri</button>
      <button on:click={salva}>Salva</button>
      <button on:click={esporta}>Esporta Excel</button>
      <input bind:this={inputFile} type="file" accept=".cambusa,application/json" on:change={apri} hidden />
    </div>
  </header>

  {#if $avvisi.length > 0}
    <div class="avvisi-app" role="alert">
      {#each $avvisi as testo, i}
        <div class="avviso">
          <span>⚠️ {testo}</span>
          {#if $copiaRiserva && testo.includes('copia di riserva')}
            <button on:click={scaricaRiserva}>Scarica la copia di riserva</button>
          {/if}
          <button class="chiudi" on:click={() => chiudiAvviso(i)} aria-label="Chiudi avviso">✕</button>
        </div>
      {/each}
    </div>
  {/if}

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
  .avvisi-app { background: #fef3c7; border-bottom: 1px solid #f59e0b; padding: 0.4rem 1rem; display: flex; flex-direction: column; gap: 0.3rem; }
  .avviso { display: flex; align-items: center; gap: 0.6rem; }
  .avviso button { border: 1px solid #b45309; background: #fff; color: #92400e; border-radius: 6px; padding: 0.2rem 0.6rem; cursor: pointer; }
  .avviso .chiudi { margin-left: auto; border: 0; background: transparent; }
  .corpo { display: flex; flex: 1; min-height: 0; }
  .sidebar { width: 200px; background: #ecfdf5; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
  .sidebar button { text-align: left; background: transparent; border: 0; border-radius: 6px; padding: 0.6rem 0.8rem; cursor: pointer; font-size: 1rem; }
  .sidebar button.attiva { background: #15803d; color: #fff; }
  .sidebar .icona { margin-right: 0.4rem; }
  .contenuto { flex: 1; overflow: auto; background: #fff; }
</style>

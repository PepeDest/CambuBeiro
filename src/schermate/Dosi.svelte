<script lang="ts">
  import { progetto } from '../lib/store';
  import { righeDosiCampo, righeDosiGiorno } from '../lib/derivati';
  import { formatQuantita } from '../lib/formato';
  import { giorniCampo } from '../core';

  let vista: 'campo' | 'giorno' = 'campo';
  let giorno = 1;

  $: giorni = giorniCampo($progetto.campo);
  $: righe = vista === 'campo' ? righeDosiCampo($progetto) : righeDosiGiorno($progetto, giorno);
</script>

<section class="schermata">
  <h2>⚖️ Dosi</h2>

  <div class="controlli">
    <label><input type="radio" bind:group={vista} value="campo" /> Tutto il campo</label>
    <label><input type="radio" bind:group={vista} value="giorno" /> Un giorno</label>
    {#if vista === 'giorno'}
      <select bind:value={giorno}>
        {#each giorni as g}<option value={g}>Giorno {g}</option>{/each}
      </select>
    {/if}
  </div>

  {#if righe.length === 0}
    <p class="vuoto">Nessuna dose da mostrare: assegna dei piatti nella sezione Menu.</p>
  {:else}
    <table>
      <thead><tr><th>Ingrediente</th><th>Quantità totale</th></tr></thead>
      <tbody>
        {#each righe as r}
          <tr><td>{r.nome}</td><td>{formatQuantita(r.quantita, r.unita)}</td></tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  .schermata { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .controlli { display: flex; align-items: center; gap: 1rem; }
  table { border-collapse: collapse; max-width: 520px; }
  th, td { border: 1px solid #e5e7eb; padding: 0.4rem 0.8rem; text-align: left; }
  th:last-child, td:last-child { text-align: right; }
  .vuoto { color: #6b7280; }
</style>

<script lang="ts">
  import { progetto } from '../lib/store';
  import { sezioniSpesa } from '../lib/derivati';
  import { formatQuantita, testoConfezione, testoAvviso, titoloSpesa } from '../lib/formato';

  $: spesa = sezioniSpesa($progetto);

  function stampa() { window.print(); }
</script>

<section class="schermata">
  <div class="intestazione">
    <h2>🛒 Spesa</h2>
    <button class="stampa" on:click={stampa}>🖨️ Stampa</button>
  </div>

  {#if spesa.avvisi.length > 0}
    <div class="avvisi">
      <strong>⚠️ Attenzione freschezza</strong>
      <ul>
        {#each spesa.avvisi as a}
          <li>{testoAvviso(a)}.</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if spesa.sezioni.length === 0}
    <p class="vuoto">Nessuna spesa: assegna dei piatti nel Menu e imposta i giorni di spesa in Campo.</p>
  {:else}
    <div class="stampabile">
      <h1 class="titolo-stampa">Lista della spesa — {$progetto.campo.nome || 'Campo'}</h1>
      {#each spesa.sezioni as s}
        <div class="ondata">
          <h3>{titoloSpesa(s.giornoSpesa)}</h3>
          <table>
            <thead><tr><th>Ingrediente</th><th>Totale</th><th>Confezioni</th></tr></thead>
            <tbody>
              {#each s.righe as r}
                <tr><td>{r.nome}</td><td>{formatQuantita(r.quantita, r.unita)}</td><td>{testoConfezione(r)}</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .schermata { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .intestazione { display: flex; align-items: center; justify-content: space-between; max-width: 720px; }
  .stampa { background: #15803d; color: #fff; border: 0; border-radius: 6px; padding: 0.5rem 0.9rem; cursor: pointer; font-weight: 600; }
  .avvisi { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 0.6rem 1rem; max-width: 720px; }
  .ondata { margin-bottom: 1.2rem; }
  table { border-collapse: collapse; width: 100%; max-width: 720px; }
  th, td { border: 1px solid #e5e7eb; padding: 0.4rem 0.7rem; text-align: left; }
  .titolo-stampa { display: none; }
  .vuoto { color: #6b7280; }

  @media print {
    :global(.barra), :global(.sidebar) { display: none !important; }
    :global(.contenuto) { overflow: visible !important; }
    .intestazione .stampa, .avvisi { display: none; }
    .titolo-stampa { display: block; font-size: 1.3rem; margin-bottom: 0.6rem; }
    table { max-width: none; }
  }
</style>

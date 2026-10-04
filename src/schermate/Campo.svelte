<script lang="ts">
  import { progetto } from '../lib/store';
  import { conCampo, impostaNumeroGiorni, impostaRiduzioneBambini, impostaGiorniSpesa } from '../lib/azioni';
  import { PASTI, ETICHETTE_PASTO, type Pasto } from '../core';

  const setNome = (v: string) => progetto.update((p) => conCampo(p, { ...p.campo, nome: v }));
  const setGiorni = (v: number) => progetto.update((p) => impostaNumeroGiorni(p, v));
  const setRiduzione = (percentuale: number) => progetto.update((p) => impostaRiduzioneBambini(p, percentuale));
  const setGiorniSpesa = (testo: string) => progetto.update((p) => impostaGiorniSpesa(p, testo));
  const togglePasto = (id: Pasto, on: boolean) =>
    progetto.update((p) => conCampo(p, { ...p.campo, pastiAttivi: { ...p.campo.pastiAttivi, [id]: on } }));
</script>

<section class="schermata">
  <h2>⛺ Campo</h2>

  <label>Nome del campo
    <input type="text" value={$progetto.campo.nome} on:input={(e) => setNome(e.currentTarget.value)} />
  </label>

  <label>Numero di giorni
    <input type="number" min="1" value={$progetto.campo.numeroGiorni} on:input={(e) => setGiorni(+e.currentTarget.value)} />
  </label>

  <fieldset>
    <legend>Pasti attivi</legend>
    {#each PASTI as id}
      <label class="inline">
        <input type="checkbox" checked={$progetto.campo.pastiAttivi[id]} on:change={(e) => togglePasto(id, e.currentTarget.checked)} />
        {ETICHETTE_PASTO[id]}
      </label>
    {/each}
  </fieldset>

  <label>Riduzione dose bambini (%)
    <input type="number" min="0" max="100" value={Math.round($progetto.campo.riduzioneBambini * 100)} on:input={(e) => setRiduzione(+e.currentTarget.value)} />
  </label>

  <label>Giorni di spesa (numeri separati da virgola)
    <input type="text" value={$progetto.campo.giorniSpesa.join(', ')} on:change={(e) => setGiorniSpesa(e.currentTarget.value)} />
  </label>
</section>

<style>
  .schermata { padding: 1rem 1.5rem; max-width: 640px; display: flex; flex-direction: column; gap: 1rem; }
  label { display: flex; flex-direction: column; gap: 0.3rem; font-weight: 600; }
  label.inline { flex-direction: row; align-items: center; gap: 0.4rem; font-weight: 400; }
  input[type="text"], input[type="number"] { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
  fieldset { border: 1px solid #d1d5db; border-radius: 6px; }
</style>

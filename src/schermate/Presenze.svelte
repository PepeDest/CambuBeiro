<script lang="ts">
  import { progetto } from '../lib/store';
  import {
    conGiornoTipo, conPresenzeGiorno, rimuoviPresenzeGiorno, impostaPresenza, impostaAllergene, type CampoPresenze,
  } from '../lib/azioni';
  import { presenzeGiorno, giorniCampo, type Allergene } from '../core';

  // Gli allergeni più comuni, mostrati in tabella.
  const allergeni: { id: Allergene; etichetta: string }[] = [
    { id: 'glutine', etichetta: 'Glutine' },
    { id: 'lattosio', etichetta: 'Lattosio' },
    { id: 'uova', etichetta: 'Uova' },
    { id: 'pesce', etichetta: 'Pesce' },
    { id: 'frutta_a_guscio', etichetta: 'Frutta a guscio' },
  ];

  $: giorni = giorniCampo($progetto.campo);

  const setTipo = (campo: CampoPresenze, v: number) =>
    progetto.update((p) => conGiornoTipo(p, impostaPresenza(p.campo.giornoTipo, campo, v)));
  const setTipoAllergene = (a: Allergene, v: number) =>
    progetto.update((p) => conGiornoTipo(p, impostaAllergene(p.campo.giornoTipo, a, v)));
  const setGiorno = (g: number, campo: CampoPresenze, v: number) =>
    progetto.update((p) => conPresenzeGiorno(p, g, impostaPresenza(presenzeGiorno(p, g), campo, v)));
  const setGiornoAllergene = (g: number, a: Allergene, v: number) =>
    progetto.update((p) => conPresenzeGiorno(p, g, impostaAllergene(presenzeGiorno(p, g), a, v)));
  const reset = (g: number) => progetto.update((p) => rimuoviPresenzeGiorno(p, g));
</script>

<section class="schermata">
  <h2>👥 Presenze</h2>

  <fieldset class="tipo">
    <legend>Giorno tipo (vale per tutti i giorni non modificati)</legend>
    <label>Adulti <input type="number" min="0" value={$progetto.campo.giornoTipo.adulti} on:input={(e) => setTipo('adulti', +e.currentTarget.value)} /></label>
    <label>Bambini <input type="number" min="0" value={$progetto.campo.giornoTipo.bambini} on:input={(e) => setTipo('bambini', +e.currentTarget.value)} /></label>
    <label>Vegetariani <input type="number" min="0" value={$progetto.campo.giornoTipo.vegetariani} on:input={(e) => setTipo('vegetariani', +e.currentTarget.value)} /></label>
    {#each allergeni as a}
      <label>{a.etichetta} <input type="number" min="0" value={$progetto.campo.giornoTipo.allergici[a.id] ?? 0} on:input={(e) => setTipoAllergene(a.id, +e.currentTarget.value)} /></label>
    {/each}
  </fieldset>

  <div class="tabella">
    <table>
      <thead>
        <tr>
          <th>Giorno</th><th>Adulti</th><th>Bambini</th><th>Veg.</th>
          {#each allergeni as a}<th>{a.etichetta}</th>{/each}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each giorni as g}
          {@const pr = presenzeGiorno($progetto, g)}
          {@const modificato = $progetto.giorni[g] !== undefined}
          <tr class:override={modificato}>
            <td>{g}</td>
            <td><input type="number" min="0" value={pr.adulti} on:input={(e) => setGiorno(g, 'adulti', +e.currentTarget.value)} /></td>
            <td><input type="number" min="0" value={pr.bambini} on:input={(e) => setGiorno(g, 'bambini', +e.currentTarget.value)} /></td>
            <td><input type="number" min="0" value={pr.vegetariani} on:input={(e) => setGiorno(g, 'vegetariani', +e.currentTarget.value)} /></td>
            {#each allergeni as a}
              <td><input type="number" min="0" value={pr.allergici[a.id] ?? 0} on:input={(e) => setGiornoAllergene(g, a.id, +e.currentTarget.value)} /></td>
            {/each}
            <td>{#if modificato}<button title="Torna al giorno tipo" on:click={() => reset(g)}>↺</button>{/if}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .schermata { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .tipo { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .tipo label { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.9rem; }
  .tabella { overflow-x: auto; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #e5e7eb; padding: 0.3rem 0.4rem; text-align: center; }
  input { width: 56px; padding: 0.3rem; border: 1px solid #d1d5db; border-radius: 4px; }
  tr.override { background: #fefce8; }
</style>

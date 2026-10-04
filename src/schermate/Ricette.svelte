<script lang="ts">
  import { progetto } from '../lib/store';
  import { ricetteDisponibili, ingredientiDisponibili, indiceIngredienti, cercaRicette } from '../lib/catalogo';
  import { aggiungiRicettaUtente, aggiungiIngredienteUtente } from '../lib/azioni';
  import { formRicettaVuota, formIngredienteVuoto, rigaVuota, creaRicetta, creaIngrediente } from '../lib/crea';
  import { PASTI, ETICHETTE_PASTO, ALLERGENI, type Pasto, type Unita } from '../core';

  const CATEGORIE = ['primo', 'secondo', 'contorno', 'piatto_unico', 'colazione', 'merenda'];

  let cerca = '';
  let filtroPasto: Pasto | '' = '';
  $: elenco = cercaRicette($progetto, cerca, filtroPasto || undefined);
  $: ingredienti = ingredientiDisponibili($progetto);
  $: idUtente = new Set($progetto.ricetteUtente.map((r) => r.id));

  // moduli: ricetta nuova (fr) e ingrediente nuovo (fi)
  let formAperto = false;
  let ingFormAperto = false;
  let fr = formRicettaVuota();
  let fi = formIngredienteVuoto();

  function unitaDi(id: string): Unita { return indiceIngredienti($progetto).get(id)?.unita ?? 'g'; }
  function aggiungiRiga() { fr.righe = [...fr.righe, { ...rigaVuota(), ingredienteId: ingredienti[0]?.id ?? '' }]; }
  function togliRiga(i: number) { fr.righe = fr.righe.filter((_, k) => k !== i); }

  function salvaRicetta() {
    const nuova = creaRicetta(fr, unitaDi, ricetteDisponibili($progetto).map((r) => r.id));
    if ('errore' in nuova) { alert(nuova.errore); return; }
    progetto.update((p) => aggiungiRicettaUtente(p, nuova));
    fr = formRicettaVuota();
    formAperto = false;
    ingFormAperto = false;
  }

  function salvaIngrediente() {
    const nuovo = creaIngrediente(fi, ingredientiDisponibili($progetto).map((x) => x.id));
    if ('errore' in nuovo) { alert(nuovo.errore); return; }
    progetto.update((p) => aggiungiIngredienteUtente(p, nuovo));
    fi = formIngredienteVuoto();
    ingFormAperto = false;
    // seleziona il nuovo ingrediente nella prima riga ancora vuota, se c'è
    const vuota = fr.righe.find((r) => !r.ingredienteId);
    if (vuota) { vuota.ingredienteId = nuovo.id; fr = fr; }
  }
</script>

<section class="schermata">
  <div class="intestazione">
    <h2>📖 Ricette</h2>
    <button on:click={() => (formAperto = !formAperto)}>{formAperto ? 'Chiudi' : '➕ Aggiungi ricetta'}</button>
  </div>

  {#if formAperto}
    <div class="form">
      <label>Nome <input type="text" bind:value={fr.nome} /></label>
      <label>Categoria
        <select bind:value={fr.categoria}>{#each CATEGORIE as c}<option value={c}>{c}</option>{/each}</select>
      </label>
      <div class="pasti">
        {#each PASTI as id}<label class="inline"><input type="checkbox" bind:checked={fr.pasti[id]} /> {ETICHETTE_PASTO[id]}</label>{/each}
      </div>

      <h4>Ingredienti (dose a persona)</h4>
      {#each fr.righe as r, i}
        <div class="riga-ing">
          <select bind:value={r.ingredienteId}>
            <option value="">— scegli —</option>
            {#each ingredienti as ing}<option value={ing.id}>{ing.nome}</option>{/each}
          </select>
          <input type="number" min="0" bind:value={r.dosePersona} /> <span class="unita">{unitaDi(r.ingredienteId)}</span>
          <button class="mini" on:click={() => togliRiga(i)} aria-label="Togli ingrediente">✕</button>
        </div>
      {/each}
      <div class="azioni-form">
        <button class="mini" on:click={aggiungiRiga}>+ riga</button>
        <button class="mini" on:click={() => (ingFormAperto = !ingFormAperto)}>➕ Nuovo ingrediente</button>
      </div>

      {#if ingFormAperto}
        <div class="sub-form">
          <label>Nome <input type="text" bind:value={fi.nome} /></label>
          <label>Unità <select bind:value={fi.unita}><option value="g">g</option><option value="ml">ml</option><option value="pz">pz</option></select></label>
          <label>Categoria <select bind:value={fi.categoria}><option value="secco">secco</option><option value="fresco">fresco</option><option value="scatolame">scatolame</option></select></label>
          <label>Durata (giorni) <input type="number" min="1" bind:value={fi.durataGiorni} /></label>
          <label>Confezione (quantità) <input type="number" min="1" bind:value={fi.confQuantita} /></label>
          <label>Confezione (etichetta) <input type="text" bind:value={fi.confEtichetta} /></label>
          <label class="inline"><input type="checkbox" bind:checked={fi.vegetariano} /> Vegetariano</label>
          <div class="allergeni">{#each ALLERGENI as a}<label class="inline"><input type="checkbox" bind:checked={fi.allergeni[a]} /> {a}</label>{/each}</div>
          <button on:click={salvaIngrediente}>Salva ingrediente</button>
        </div>
      {/if}

      <button class="salva" on:click={salvaRicetta}>Salva ricetta</button>
    </div>
  {/if}

  <input class="cerca" type="text" placeholder="Cerca una ricetta…" bind:value={cerca} />
  <select class="filtro-pasto" bind:value={filtroPasto}>
    <option value="">Tutti i pasti</option>
    {#each PASTI as id}<option value={id}>{ETICHETTE_PASTO[id]}</option>{/each}
  </select>

  <ul class="elenco">
    {#each elenco as r}
      <li>
        <span class="nome">{r.nome}</span>
        <span class="tag">{r.categoria}</span>
        {#if idUtente.has(r.id)}<span class="tag tua">tua</span>{/if}
        {#each r.pasti as p}<span class="tag pasto">{ETICHETTE_PASTO[p]}</span>{/each}
        <span class="conta">{r.ingredienti.length} ingredienti</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  .schermata { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; }
  .intestazione { display: flex; align-items: center; justify-content: space-between; max-width: 760px; }
  .intestazione button, .salva { background: #15803d; color: #fff; border: 0; border-radius: 6px; padding: 0.45rem 0.9rem; cursor: pointer; font-weight: 600; }
  .form, .sub-form { border: 1px solid #d1d5db; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; max-width: 760px; background: #f9fafb; }
  .sub-form { background: #eef2ff; }
  label { display: flex; flex-direction: column; gap: 0.2rem; font-weight: 600; }
  label.inline { flex-direction: row; align-items: center; gap: 0.3rem; font-weight: 400; }
  .pasti, .allergeni { display: flex; flex-wrap: wrap; gap: 0.8rem; }
  input[type="text"], input[type="number"], select { padding: 0.4rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .riga-ing { display: flex; align-items: center; gap: 0.5rem; }
  .unita { color: #6b7280; min-width: 24px; }
  .mini { background: #e5e7eb; border: 0; border-radius: 6px; padding: 0.3rem 0.6rem; cursor: pointer; }
  .cerca { max-width: 760px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .filtro-pasto { max-width: 200px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .elenco { list-style: none; padding: 0; margin: 0; max-width: 760px; }
  .elenco li { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem; border-bottom: 1px solid #eee; }
  .nome { font-weight: 600; }
  .tag { background: #e5e7eb; border-radius: 999px; padding: 0.1rem 0.5rem; font-size: 0.8rem; }
  .tag.tua { background: #bbf7d0; }
  .tag.pasto { background: #f3f4f6; color: #6b7280; }
  .conta { margin-left: auto; color: #6b7280; font-size: 0.85rem; }
</style>

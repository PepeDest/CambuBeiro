<script lang="ts">
  import { progetto } from '../lib/store';
  import { ricetteDisponibili, ingredientiDisponibili, indiceIngredienti, cercaRicette, eRicettaBase, perNome } from '../lib/catalogo';
  import {
    aggiungiRicettaUtente, aggiungiIngredienteUtente, rimuoviRicettaUtente, rimuoviIngredienteUtente,
  } from '../lib/azioni';
  import {
    formRicettaVuota, formIngredienteVuoto, formDaRicetta, formDaIngrediente, rigaVuota, creaRicetta, creaIngrediente,
  } from '../lib/crea';
  import { usiRicetta, usiIngrediente } from '../lib/usi';
  import { PASTI, ETICHETTE_PASTO, ALLERGENI, ETICHETTE_ALLERGENE, type Pasto, type Unita, type Ricetta, type Ingrediente } from '../core';

  const CATEGORIE = ['primo', 'secondo', 'contorno', 'piatto_unico', 'colazione', 'merenda'];

  let cerca = '';
  let filtroPasto: Pasto | '' = '';
  $: elenco = cercaRicette($progetto, cerca, filtroPasto || undefined);
  $: ingredienti = ingredientiDisponibili($progetto);
  $: idUtente = new Set($progetto.ricetteUtente.map((r) => r.id));
  $: mieiIngredienti = [...$progetto.ingredientiUtente].sort(perNome);

  // moduli: ricetta (fr) e ingrediente (fi), nuovi oppure in modifica
  let formAperto = false;
  let ingFormAperto = false;
  let fr = formRicettaVuota();
  let fi = formIngredienteVuoto();
  /** La ricetta che si sta modificando o personalizzando (null = ricetta nuova). */
  let ricettaInModifica: Ricetta | null = null;
  /** L'ingrediente che si sta modificando (null = ingrediente nuovo). */
  let ingredienteInModifica: Ingrediente | null = null;
  $: unitaBloccata = ingredienteInModifica !== null && usiIngrediente($progetto, ingredienteInModifica.id).length > 0;

  function unitaDi(id: string): Unita { return indiceIngredienti($progetto).get(id)?.unita ?? 'g'; }
  // Riga senza ingrediente: lo sceglie l'utente (o "Nuovo ingrediente" la riempie).
  function aggiungiRiga() { fr.righe = [...fr.righe, rigaVuota()]; }
  function togliRiga(i: number) { fr.righe = fr.righe.filter((_, k) => k !== i); }

  function nuovaRicetta() {
    if (formAperto && !ricettaInModifica) { formAperto = false; return; }
    fr = formRicettaVuota();
    ricettaInModifica = null;
    formAperto = true;
  }

  /** Modifica una ricetta tua, o personalizza una del ricettario (la tua versione prende il suo posto). */
  function modificaRicetta(r: Ricetta) {
    fr = formDaRicetta(r);
    ricettaInModifica = r;
    formAperto = true;
    window.scrollTo?.({ top: 0 });
  }

  function chiudiForm() {
    formAperto = false;
    ingFormAperto = false;
    ricettaInModifica = null;
  }

  function salvaRicetta() {
    const nuova = creaRicetta(fr, unitaDi, ricetteDisponibili($progetto).map((r) => r.id), ricettaInModifica ?? undefined);
    if ('errore' in nuova) { alert(nuova.errore); return; }
    progetto.update((p) => aggiungiRicettaUtente(p, nuova));
    fr = formRicettaVuota();
    chiudiForm();
  }

  function eliminaRicetta(r: Ricetta) {
    const base = eRicettaBase(r.id);
    if (!base) {
      const usi = usiRicetta($progetto, r.id);
      if (usi.length > 0) { alert(`Non posso eliminarla: è nel menu.\n${usi.join('\n')}\nToglila prima dal menu.`); return; }
    }
    const domanda = base
      ? `Tornare alla versione originale di "${r.nome}"? Le tue modifiche andranno perse.`
      : `Eliminare la ricetta "${r.nome}"?`;
    if (confirm(domanda)) progetto.update((p) => rimuoviRicettaUtente(p, r.id));
  }

  function nuovoIngrediente() {
    if (ingFormAperto && !ingredienteInModifica) { ingFormAperto = false; return; }
    fi = formIngredienteVuoto();
    ingredienteInModifica = null;
    ingFormAperto = true;
  }

  function modificaIngrediente(i: Ingrediente) {
    fi = formDaIngrediente(i);
    ingredienteInModifica = i;
    ingFormAperto = true;
  }

  function salvaIngrediente() {
    const nuovo = creaIngrediente(
      fi, ingredientiDisponibili($progetto).map((x) => x.id), ingredienteInModifica ?? undefined, unitaBloccata,
    );
    if ('errore' in nuovo) { alert(nuovo.errore); return; }
    const eraNuovo = ingredienteInModifica === null;
    progetto.update((p) => aggiungiIngredienteUtente(p, nuovo));
    fi = formIngredienteVuoto();
    ingFormAperto = false;
    ingredienteInModifica = null;
    // un ingrediente appena creato va nella prima riga ancora vuota della ricetta, se c'è
    const vuota = eraNuovo ? fr.righe.find((r) => !r.ingredienteId) : undefined;
    if (vuota) { vuota.ingredienteId = nuovo.id; fr = fr; }
  }

  function eliminaIngrediente(i: Ingrediente) {
    const usi = usiIngrediente($progetto, i.id);
    if (usi.length > 0) { alert(`Non posso eliminarlo: è usato in\n${usi.join('\n')}`); return; }
    if (confirm(`Eliminare l'ingrediente "${i.nome}"?`)) progetto.update((p) => rimuoviIngredienteUtente(p, i.id));
  }
</script>

<section class="schermata">
  <div class="intestazione">
    <h2>📖 Ricette</h2>
    <button on:click={nuovaRicetta}>{formAperto && !ricettaInModifica ? 'Chiudi' : '➕ Aggiungi ricetta'}</button>
  </div>

  {#if formAperto}
    <div class="form">
      {#if ricettaInModifica}
        <h3>
          {eRicettaBase(ricettaInModifica.id) && !idUtente.has(ricettaInModifica.id) ? 'Personalizza' : 'Modifica'}: {ricettaInModifica.nome}
        </h3>
        {#if eRicettaBase(ricettaInModifica.id)}
          <p class="nota">La tua versione prenderà il posto di quella del ricettario (anche nei menu che la usano già). Potrai sempre tornare all'originale.</p>
        {/if}
      {/if}
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
          <input type="number" min="0" placeholder="dose" bind:value={r.dosePersona} /> <span class="unita">{unitaDi(r.ingredienteId)}</span>
          <button class="mini" on:click={() => togliRiga(i)} aria-label="Togli ingrediente">✕</button>
        </div>
      {/each}
      <div class="azioni-form">
        <button class="mini" on:click={aggiungiRiga}>+ riga</button>
        <button class="mini" on:click={nuovoIngrediente}>➕ Nuovo ingrediente</button>
      </div>

      <div class="azioni-form">
        <button class="salva" on:click={salvaRicetta}>Salva ricetta</button>
        <button class="mini" on:click={chiudiForm}>Annulla</button>
      </div>
    </div>
  {/if}

  {#if ingFormAperto}
    <div class="sub-form">
      <h4>{ingredienteInModifica ? `Modifica ingrediente: ${ingredienteInModifica.nome}` : 'Nuovo ingrediente'}</h4>
      <label>Nome <input type="text" bind:value={fi.nome} /></label>
      <label>Unità
        <select bind:value={fi.unita} disabled={unitaBloccata}><option value="g">g</option><option value="ml">ml</option><option value="pz">pz</option></select>
        {#if unitaBloccata}<span class="nota">L'ingrediente è già usato: l'unità non si può cambiare.</span>{/if}
      </label>
      <label>Categoria <select bind:value={fi.categoria}><option value="secco">secco</option><option value="fresco">fresco</option><option value="scatolame">scatolame</option></select></label>
      <label>Durata (giorni) <input type="number" min="1" bind:value={fi.durataGiorni} /></label>
      <label>Confezione (quantità) <input type="number" min="1" bind:value={fi.confQuantita} /></label>
      <label>Confezione (etichetta) <input type="text" bind:value={fi.confEtichetta} /></label>
      <label class="inline"><input type="checkbox" bind:checked={fi.vegetariano} /> Vegetariano</label>
      <div class="allergeni">{#each ALLERGENI as a}<label class="inline"><input type="checkbox" bind:checked={fi.allergeni[a]} /> {ETICHETTE_ALLERGENE[a]}</label>{/each}</div>
      <div class="azioni-form">
        <button on:click={salvaIngrediente}>Salva ingrediente</button>
        <button class="mini" on:click={() => { ingFormAperto = false; ingredienteInModifica = null; }}>Annulla</button>
      </div>
    </div>
  {/if}

  {#if mieiIngredienti.length > 0}
    <details class="miei-ingredienti">
      <summary>I tuoi ingredienti ({mieiIngredienti.length})</summary>
      <ul class="elenco">
        {#each mieiIngredienti as i}
          <li>
            <span class="nome">{i.nome}</span>
            <span class="tag">{i.unita}</span>
            {#each i.allergeni as a}<span class="tag allergene">{ETICHETTE_ALLERGENE[a]}</span>{/each}
            <span class="azioni-riga">
              <button class="mini" on:click={() => modificaIngrediente(i)}>Modifica</button>
              <button class="mini" on:click={() => eliminaIngrediente(i)}>Elimina</button>
            </span>
          </li>
        {/each}
      </ul>
    </details>
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
        {#if idUtente.has(r.id)}<span class="tag tua">{eRicettaBase(r.id) ? 'personalizzata' : 'tua'}</span>{/if}
        {#each r.pasti as p}<span class="tag pasto">{ETICHETTE_PASTO[p]}</span>{/each}
        <span class="conta">{r.ingredienti.length} ingredienti</span>
        <span class="azioni-riga">
          <button class="mini" on:click={() => modificaRicetta(r)}>{idUtente.has(r.id) ? 'Modifica' : 'Personalizza'}</button>
          {#if idUtente.has(r.id)}
            <button class="mini" on:click={() => eliminaRicetta(r)}>{eRicettaBase(r.id) ? 'Ripristina originale' : 'Elimina'}</button>
          {/if}
        </span>
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
  h3, h4 { margin: 0.2rem 0; }
  .nota { margin: 0; font-size: 0.85rem; font-weight: 400; color: #92400e; }
  label { display: flex; flex-direction: column; gap: 0.2rem; font-weight: 600; }
  label.inline { flex-direction: row; align-items: center; gap: 0.3rem; font-weight: 400; }
  .pasti, .allergeni { display: flex; flex-wrap: wrap; gap: 0.8rem; }
  input[type="text"], input[type="number"], select { padding: 0.4rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .riga-ing { display: flex; align-items: center; gap: 0.5rem; }
  .azioni-form { display: flex; gap: 0.5rem; align-items: center; }
  .unita { color: #6b7280; min-width: 24px; }
  .mini { background: #e5e7eb; border: 0; border-radius: 6px; padding: 0.3rem 0.6rem; cursor: pointer; }
  .cerca { max-width: 760px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .filtro-pasto { max-width: 200px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
  .miei-ingredienti { max-width: 760px; }
  .miei-ingredienti summary { cursor: pointer; font-weight: 600; }
  .elenco { list-style: none; padding: 0; margin: 0; max-width: 760px; }
  .elenco li { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem; border-bottom: 1px solid #eee; flex-wrap: wrap; }
  .nome { font-weight: 600; }
  .tag { background: #e5e7eb; border-radius: 999px; padding: 0.1rem 0.5rem; font-size: 0.8rem; }
  .tag.tua { background: #bbf7d0; }
  .tag.allergene { background: #fde68a; }
  .tag.pasto { background: #f3f4f6; color: #6b7280; }
  .conta { margin-left: auto; color: #6b7280; font-size: 0.85rem; }
  .azioni-riga { display: flex; gap: 0.3rem; }
</style>

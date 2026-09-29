<div align="center">

# ⛺ CambuBeiro

**L'app per chi fa cambusa ai campi scout: dal menu alla lista della spesa, senza fogli Excel infiniti.**

![Licenza MIT](https://img.shields.io/badge/licenza-MIT-green)
![Funziona offline](https://img.shields.io/badge/funziona-offline-blue)
![Ricette](https://img.shields.io/badge/ricette-186-orange)
![Svelte](https://img.shields.io/badge/Svelte-4-ff3e00)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

</div>

---

CambuBeiro è un'app **gratuita** e **open source** per i *cambusieri*, cioè chi al campo scout si occupa della cucina e della spesa.
Tu scrivi quante persone ci sono e cosa si mangia. L'app calcola **quanto comprare**, **quando** comprarlo e **quante confezioni** servono.

- 🔌 **Funziona senza internet.** È un unico file `.html`: lo apri con un doppio clic e basta.
- 🔒 **Nessun dato personale.** Contiene solo numeri (quanti adulti, bambini, vegetariani, allergici) e mai nomi. I dati restano nel tuo computer.
- 🇮🇹 **Tutta in italiano**, pensata per chi non è un informatico.

## ✨ Cosa fa

| | Funzione | In pratica |
|---|---|---|
| 👥 | **Presenze** | Imposti un "giorno tipo" (adulti, bambini, vegetariani, allergici) e lo cambi solo nei giorni diversi. |
| 🗓️ | **Menu stile Excel** | Una griglia con i giorni in colonna e colazione/pranzo/merenda/cena in riga: vedi tutto il campo a colpo d'occhio. |
| 📖 | **Ricettario** | **186 ricette** scout e della tradizione italiana, con dosi a persona di *tutti* gli ingredienti, compresi olio, sale e spezie. Puoi aggiungere le tue ricette e i tuoi ingredienti. |
| ⚖️ | **Dosi** | Totali per ogni pasto, con la riduzione automatica per i bambini (di solito il 30%). |
| ⚠️ | **Avvisi allergie e vegetariani** | Se un piatto non va bene per qualcuno, l'app te lo segnala. Tu scegli se fare una **variante**, **sostituire** un ingrediente o **toglierlo** per quelle persone. |
| 🛒 | **Spesa a ondate** | Scegli tu i giorni di spesa. L'app divide la lista in base a quanto durano i prodotti (il fresco vicino al consumo, il secco tutto subito), ti dice quante **confezioni** comprare e ti avvisa se un prodotto rischia di scadere prima di essere usato. |
| 📊 | **Esporta in Excel** | Un file `.xlsx` con tre fogli: Menu, Spesa e Dosi. |
| 💾 | **Salva e apri** | Salvataggio automatico nel browser, più un file `.cambusa` per il backup o per passare il campo a un altro computer. |

## 🍝 Il ricettario

Le ricette nascono da menu veri di campi scout, per lupetti/coccinelle e per ragazzi, più i classici della cucina italiana.

| Categoria | Ricette | Qualche esempio |
|---|---:|---|
| Primi | 55 | pasta al sugo, carbonara, amatriciana, risotti, polenta, tortellini in brodo |
| Secondi | 53 | frittate, polpette, pollo al latte, cotolette, fagiolata, pesce finto |
| Contorni | 23 | patate al cartoccio, peperonata, ratatouille, bruschette |
| Piatti unici | 16 | insalata di riso, cous cous, riso fritto, panini |
| Colazioni | 12 | latte e tè con pane e marmellata, biscotti, cereali |
| Merende e dolci | 27 | crepes, pancake, salame di cioccolato, tiramisù, frutta |

Ogni ingrediente (130 in tutto) ha:
- l'**unità** (g, ml, pezzi);
- la **confezione** tipica (es. pasta da 500 g);
- la **durata** in giorni;
- gli **allergeni**: glutine, lattosio, uova, frutta a guscio, pesce, soia, arachidi, sedano, senape, crostacei;
- l'indicazione se è **vegetariano**.

> ⚠️ Le dosi e le durate sono stime da campo. Controllale sempre con la tua esperienza e con le etichette dei prodotti, soprattutto per le **allergie**.

## 🚀 Come usarla

1. Prendi il file **`Cambusa-Scout.html`**: lo trovi nella sezione **Releases** di questa pagina, oppure costruiscilo tu (vedi sotto).
2. Aprilo con un doppio clic: si apre nel browser (Chrome, Edge, Firefox…).
3. Segui le voci del menu a sinistra, in ordine: **Campo → Presenze → Ricette → Menu → Dosi → Spesa**.

Trovi una guida breve in [`docs/COME-USARE.md`](docs/COME-USARE.md).

## 🛠️ Per chi sviluppa

Serve [Node.js](https://nodejs.org/) 18 o più recente.

```bash
npm install        # installa le dipendenze
npm run dev        # app in modalità sviluppo su http://localhost:5173
npm test           # esegue i test automatici (Vitest)
npm run build      # crea l'app in un unico file: dist/index.html
```

**Tecnologie:** [Svelte 4](https://svelte.dev/), TypeScript, [Vite](https://vitejs.dev/) con [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) per avere un solo file HTML, [SheetJS](https://sheetjs.com/) per l'Excel e [Vitest](https://vitest.dev/) per i test.

### Struttura del progetto

```
src/
├── core/        # il "motore": calcolo dosi, conflitti allergeni, spesa a ondate (puro, senza interfaccia)
├── data/        # il database: ingredienti.ts e ricette.ts
├── lib/         # azioni, salvataggio, export Excel, collegamento tra motore e schermate
└── schermate/   # le schermate dell'app (Campo, Presenze, Ricette, Menu, Dosi, Spesa)
tests/           # test automatici, compresi i controlli sul database
```

### Aggiungere una ricetta al database

Le ricette stanno in [`src/data/ricette.ts`](src/data/ricette.ts). Ogni ricetta elenca gli ingredienti con la **dose per una persona**:

```ts
{
  id: 'pasta_al_sugo', nome: 'Pasta al sugo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
  ingredienti: [
    { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
    { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
    { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
    { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
  ],
},
```

Se ti serve un ingrediente nuovo, aggiungilo in [`src/data/ingredienti.ts`](src/data/ingredienti.ts) con **tutti** i suoi allergeni. Poi lancia `npm test`: i test controllano da soli che id, unità e ingredienti siano coerenti.

## 🤝 Contribuire

Ricette nuove, dosi più precise, correzioni e idee sono benvenute! Apri una **Issue** per segnalare un problema o proporre qualcosa, oppure una **Pull Request** con le tue modifiche. Prima di inviarla controlla che `npm test` passi.

## 📄 Licenza

Distribuito con licenza **MIT**: puoi usarlo, modificarlo e condividerlo liberamente. Leggi il file [LICENSE](LICENSE).

<div align="center">

*Fatto con ❤️ per tutti i cambusieri. Buona strada!* 🏕️

</div>

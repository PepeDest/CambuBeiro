# Come usare Cambusa

## Aprire l'app
Apri il file `index.html` (nella cartella `dist`) con un doppio clic: si apre nel
tuo browser e funziona **senza internet**.

## Salvare il lavoro
- L'app **salva da sola** nel browser mentre lavori.
- Con **Salva** scarichi un file `.cambusa`: è il tuo backup e serve per portare
  il campo su un altro computer. Con **Apri** lo ricarichi.

## Rifare l'app dopo una modifica al codice (per chi sviluppa)
Dalla cartella del progetto: `npm run build` → il nuovo `dist/index.html` è pronto.

## Avvisi allergeni e "gestito"
Nel Menu, un piatto con un conflitto mostra ⚠️. Con gli aggiustamenti (variante,
sostituzione o rimozione) proteggi le persone interessate; il piatto passa a ✓ "gestito"
solo quando **tutte** sono protette, e l'app lo controlla da sola:
- una variante conta solo se non contiene lo stesso allergene (o carne/pesce per i vegetariani);
- se più ingredienti contengono l'allergene, vanno tolti o sostituiti tutti;
- una sostituzione conta solo se il nuovo ingrediente non ha l'allergene.

In "Gestisci" vedi per ogni avviso quante persone sono protette (es. "protette 1 su 2").
Una sostituzione è possibile solo con un ingrediente che si misura allo stesso modo
(grammi, millilitri o pezzi).

## Le tue ricette e i tuoi ingredienti
- **Personalizza** (su una ricetta del ricettario): ne fai la tua versione, che prende il suo
  posto ovunque, anche nei menu. Con **Ripristina originale** torni a quella di partenza.
- **Modifica / Elimina** (sulle tue ricette): una ricetta usata nel menu non si può eliminare
  finché non la togli dal menu.
- **I tuoi ingredienti** (sotto il pulsante "Aggiungi ricetta"): puoi correggerli, per esempio
  aggiungere un allergene dimenticato. Se un ingrediente è già usato, la sua unità (g, ml, pz)
  non si può cambiare e non si può eliminare.

## Se qualcosa va storto
- Una barra gialla in alto ti avvisa se il browser non riesce a salvare da solo: in quel caso
  usa **Salva** per non perdere il lavoro.
- Se il progetto salvato nel browser non si apre più, l'app ne tiene una **copia di riserva**
  che puoi scaricare dalla barra gialla.
- Nella **Spesa** l'app ti avvisa se un giorno di spesa arriva dopo i pasti che deve coprire.

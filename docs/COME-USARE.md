# Come usare Cambusa Scout

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
Nel Menu, un piatto con un conflitto mostra ⚠️. Quando aggiungi un aggiustamento
(variante, sostituzione o rimozione) il piatto passa a ✓ "gestito": l'app si fida
che tu abbia risolto, NON verifica da sola. Se un piatto ha più avvisi (es. lattosio
E non vegetariano), controlla di averli coperti tutti: basta un aggiustamento perché
diventi ✓.

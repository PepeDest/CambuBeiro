import type { Ricetta } from '../core/types';

// Catalogo base delle ricette (>= 80), scomposte in tutti gli ingredienti
// (compresi olio/sale/soffritto) con dose a persona. Ogni ingredienteId
// esiste in INGREDIENTI e usa l'unita dichiarata dall'ingrediente.
export const RICETTE: Ricetta[] = [
  // ============================ PRIMI ASCIUTTI ============================
  {
    id: 'pasta_al_sugo', nome: 'Pasta al sugo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_in_bianco', nome: 'Pasta in bianco', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_al_pesto', nome: 'Pasta al pesto', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pesto', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_al_pesto_rosso', nome: 'Pasta al pesto rosso', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'pasta_al_pesto',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pesto_rosso', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_al_tonno', nome: 'Pasta al tonno', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_alle_olive', nome: 'Pasta alle olive', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'olive_nere', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_aglio_olio', nome: 'Pasta aglio, olio e peperoncino', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 12, unita: 'ml' },
      { ingredienteId: 'peperoncino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_puttanesca', nome: 'Pasta alla puttanesca', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pomodori_pelati', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'olive_nere', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'capperi', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'acciughe', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'peperoncino', dosePersona: 0.3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pasta_arrabbiata', nome: "Pasta all'arrabbiata", categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'peperoncino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_alla_norma', nome: 'Pasta alla Norma', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'melanzane', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'ricotta', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 15, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_carbonara', nome: 'Pasta alla carbonara', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'guanciale', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'pecorino', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pepe', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pasta_cacio_e_pepe', nome: 'Pasta cacio e pepe', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pecorino', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'pepe', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pasta_amatriciana', nome: "Pasta all'amatriciana", categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'guanciale', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'pecorino', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'peperoncino', dosePersona: 0.3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pasta_gricia', nome: 'Pasta alla gricia', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'guanciale', dosePersona: 35, unita: 'g' },
      { ingredienteId: 'pecorino', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pepe', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pasta_al_ragu', nome: 'Pasta al ragù', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'carne_macinata', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_pomodoro_mozzarella', nome: 'Pasta pomodoro e mozzarella', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_al_forno', nome: 'Pasta al forno', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'carne_macinata', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'lasagne_bolognese', nome: 'Lasagne alla bolognese', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'lasagne', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'carne_macinata', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'besciamella', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 6, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'lasagne_vegetariane', nome: 'Lasagne vegetariane', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'lasagne_bolognese',
    ingredienti: [
      { ingredienteId: 'lasagne', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'melanzane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'besciamella', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'gnocchi_al_pomodoro', nome: 'Gnocchi al pomodoro', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'gnocchi', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'gnocchi_al_pesto', nome: 'Gnocchi al pesto', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'gnocchi', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'pesto', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'risotto_milanese', nome: 'Risotto alla milanese', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zafferano', dosePersona: 0.05, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 15, unita: 'ml' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'risotto_funghi', nome: 'Risotto ai funghi', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'funghi', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 15, unita: 'ml' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'risotto_pomodoro', nome: 'Risotto al pomodoro', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'risotto_zucca', nome: 'Risotto alla zucca', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zucca', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'insalata_di_riso', nome: 'Insalata di riso', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'mais', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olive_verdi', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'riso_al_tonno', nome: 'Riso al tonno', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'cous_cous_verdure', nome: 'Cous cous di verdure', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'cous_cous', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ======================= PRIMI IN BRODO / MINESTRE =======================
  {
    id: 'minestrone', nome: 'Minestrone', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'fagioli_borlotti', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodori_pelati', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'pasta', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_e_fagioli', nome: 'Pasta e fagioli', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'fagioli_borlotti', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_e_ceci', nome: 'Pasta e ceci', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'ceci', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_e_patate', nome: 'Pasta e patate', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_e_lenticchie', nome: 'Pasta e lenticchie', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'lenticchie', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'zuppa_di_legumi', nome: 'Zuppa di legumi', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fagioli_borlotti', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'ceci', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'lenticchie', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'zuppa_di_verdure', nome: 'Zuppa di verdure', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'spinaci', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'stracciatella', nome: 'Stracciatella in brodo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pastina', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pastina_in_brodo', nome: 'Pastina in brodo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pastina', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 4, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
    ],
  },
  {
    id: 'orzo_farro_insalata', nome: 'Orzo e farro in insalata', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'orzo_perlato', dosePersona: 45, unita: 'g' },
      { ingredienteId: 'farro', dosePersona: 45, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ============================ SECONDI DI CARNE ============================
  {
    id: 'spezzatino_patate', nome: 'Spezzatino con patate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'spezzatino_manzo', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 15, unita: 'ml' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'spezzatino_piselli', nome: 'Spezzatino con piselli', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'spezzatino_patate',
    ingredienti: [
      { ingredienteId: 'spezzatino_manzo', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'piselli', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'cotolette', nome: 'Cotolette impanate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fettine_manzo', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'pangrattato', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 20, unita: 'ml' },
      { ingredienteId: 'limone', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'scaloppine_limone', nome: 'Scaloppine al limone', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fettine_manzo', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'limone', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 20, unita: 'ml' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'straccetti', nome: 'Straccetti di manzo', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fettine_manzo', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'polpette_al_sugo', nome: 'Polpette al sugo', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'carne_macinata', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'polpette_al_forno', nome: 'Polpette al forno', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'polpette_al_sugo',
    ingredienti: [
      { ingredienteId: 'carne_macinata', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'polpettone', nome: 'Polpettone', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'carne_macinata', dosePersona: 130, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.4, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'hamburger', nome: 'Hamburger', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'carne_macinata', dosePersona: 130, unita: 'g' },
      { ingredienteId: 'pane_cassetta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'insalata', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'wurstel_patate', nome: 'Wurstel e patate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'wurstel', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'salsicce_fagioli', nome: 'Salsicce e fagioli', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'salsiccia', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'fagioli_borlotti', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'arrosto_vitello', nome: 'Arrosto di vitello', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'arrosto', dosePersona: 130, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 20, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pollo_al_forno_patate', nome: 'Pollo al forno con patate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_cosce', dosePersona: 220, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'cosce_di_pollo', nome: 'Cosce di pollo arrosto', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_cosce', dosePersona: 220, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'bocconcini_pollo', nome: 'Bocconcini di pollo', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_petto', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'farina', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 18, unita: 'ml' },
      { ingredienteId: 'limone', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'spiedini_pollo', nome: 'Spiedini di pollo', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_petto', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ============================ SECONDI DI PESCE ============================
  {
    id: 'tonno_e_fagioli', nome: 'Tonno e fagioli', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'tonno_scatola', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'fagioli_cannellini', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'tonno_e_cipolle', nome: 'Tonno e cipolle', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'tonno_scatola', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'aceto', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'platessa_al_forno', nome: 'Platessa al forno', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'platessa', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'limone', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'bastoncini_pesce_forno', nome: 'Bastoncini di pesce', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'bastoncini_pesce', dosePersona: 3, unita: 'pz' },
      { ingredienteId: 'olio_semi', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'limone', dosePersona: 8, unita: 'g' },
    ],
  },
  {
    id: 'insalata_di_mare', nome: 'Insalata di mare', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'frutti_mare', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'limone', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'polpette_di_tonno', nome: 'Polpette di tonno', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'tonno_scatola', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'pangrattato', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 12, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ==================== SECONDI VEGETARIANI / UOVA / FORMAGGI ====================
  {
    id: 'frittata_classica', nome: 'Frittata classica', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'frittata_zucchine', nome: 'Frittata alle zucchine', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'frittata_classica',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'frittata_patate', nome: 'Frittata di patate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'frittata_classica',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'patate', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'frittata_cipolle', nome: 'Frittata alle cipolle', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'frittata_classica',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'cipolla', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'uova_sode', nome: 'Uova sode', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'caprese', nome: 'Caprese', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'mozzarella', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'formaggio_affettati', nome: 'Formaggio e affettati', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'formaggio', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'salame', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
    ],
  },
  {
    id: 'parmigiana_melanzane', nome: 'Parmigiana di melanzane', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'melanzane', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 20, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'ceci_in_umido', nome: 'Ceci in umido', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'ceci', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'lenticchie_in_umido', nome: 'Lenticchie in umido', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'lenticchie', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'fagioli_uccelletto', nome: "Fagioli all'uccelletto", categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fagioli_cannellini', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'verdure_gratinate', nome: 'Verdure gratinate', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'melanzane', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ================================ CONTORNI ================================
  {
    id: 'insalata_mista', nome: 'Insalata mista', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'insalata', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'aceto', dosePersona: 4, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'insalata_pomodori', nome: 'Insalata di pomodori', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pomodoro', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'origano', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'patate_al_forno', nome: 'Patate al forno', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 12, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'patate_lesse', nome: 'Patate lesse', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pure', nome: 'Purè di patate', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 180, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 40, unita: 'ml' },
      { ingredienteId: 'burro', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'noce_moscata', dosePersona: 0.2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'carote_lesse', nome: 'Carote lesse', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'carote', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'piselli_al_burro', nome: 'Piselli al burro', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'piselli', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'fagiolini_lessi', nome: 'Fagiolini lessi', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fagiolini', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'zucchine_trifolate', nome: 'Zucchine trifolate', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'zucchine', dosePersona: 180, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'melanzane_al_forno', nome: 'Melanzane al forno', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'melanzane', dosePersona: 180, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 12, unita: 'ml' },
      { ingredienteId: 'origano', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'peperoni_in_padella', nome: 'Peperoni in padella', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'peperoni', dosePersona: 180, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'cavolfiore_lesso', nome: 'Cavolfiore lesso', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'cavolfiore', dosePersona: 180, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'spinaci_saltati', nome: 'Spinaci saltati', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'spinaci', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pane_tavola', nome: 'Pane', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 80, unita: 'g' },
    ],
  },

  // ============================= PIATTI UNICI DA CAMPO =============================
  {
    id: 'pasta_fredda', nome: 'Pasta fredda', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'olive_nere', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'riso_freddo', nome: 'Riso freddo', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'mais', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olive_verdi', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'panini_imbottiti', nome: 'Panini imbottiti', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'insalata', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 20, unita: 'g' },
    ],
  },
  {
    id: 'toast', nome: 'Toast prosciutto e formaggio', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane_cassetta', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 40, unita: 'g' },
    ],
  },
  {
    id: 'piadina_farcita', nome: 'Piadina farcita', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'piadina', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'insalata', dosePersona: 15, unita: 'g' },
    ],
  },
  {
    id: 'pizza_margherita', nome: 'Pizza margherita', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'lievito_birra', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'origano', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'focaccia', nome: 'Focaccia', categoria: 'piatto_unico', pasti: ['pranzo', 'cena', 'merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'lievito_birra', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'insalatona', nome: 'Insalatona con tonno e uova', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'insalata', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'mais', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'cous_cous_pollo', nome: 'Cous cous con pollo', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'cous_cous', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pollo_petto', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'riso_alla_cantonese', nome: 'Riso alla cantonese', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'piselli', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },

  // ================================ COLAZIONI ================================
  {
    id: 'latte_e_biscotti', nome: 'Latte e biscotti', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'latte', dosePersona: 200, unita: 'ml' },
      { ingredienteId: 'biscotti', dosePersona: 40, unita: 'g' },
    ],
  },
  {
    id: 'te_e_biscotti', nome: 'Tè e biscotti', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'te', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'biscotti', dosePersona: 40, unita: 'g' },
    ],
  },
  {
    id: 'orzo_e_fette', nome: 'Orzo e fette biscottate', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'orzo_solubile', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 150, unita: 'ml' },
      { ingredienteId: 'fette_biscottate', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'marmellata', dosePersona: 20, unita: 'g' },
    ],
  },
  {
    id: 'pane_burro_marmellata', nome: 'Pane, burro e marmellata', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'marmellata', dosePersona: 20, unita: 'g' },
    ],
  },
  {
    id: 'fette_biscottate_marmellata', nome: 'Fette biscottate e marmellata', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fette_biscottate', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'marmellata', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
    ],
  },
  {
    id: 'yogurt_e_cereali', nome: 'Yogurt e cereali', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'yogurt', dosePersona: 125, unita: 'g' },
      { ingredienteId: 'cereali', dosePersona: 40, unita: 'g' },
    ],
  },
  {
    id: 'latte_e_cereali', nome: 'Latte e cereali', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'latte', dosePersona: 200, unita: 'ml' },
      { ingredienteId: 'cereali', dosePersona: 45, unita: 'g' },
    ],
  },
  {
    id: 'crostata', nome: 'Crostata', categoria: 'colazione', pasti: ['colazione', 'merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 18, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'marmellata', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'lievito_dolci', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'ciambellone', nome: 'Ciambellone', categoria: 'colazione', pasti: ['colazione', 'merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.7, unita: 'pz' },
      { ingredienteId: 'latte', dosePersona: 30, unita: 'ml' },
      { ingredienteId: 'olio_semi', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'lievito_dolci', dosePersona: 2, unita: 'g' },
    ],
  },

  // ================================ MERENDE ================================
  {
    id: 'pane_e_nutella', nome: 'Pane e crema di nocciole', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'nutella', dosePersona: 30, unita: 'g' },
    ],
  },
  {
    id: 'pane_e_marmellata', nome: 'Pane e marmellata', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'marmellata', dosePersona: 25, unita: 'g' },
    ],
  },
  {
    id: 'crackers_merenda', nome: 'Crackers', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'crackers', dosePersona: 50, unita: 'g' },
    ],
  },
  {
    id: 'frutta_di_stagione', nome: 'Frutta di stagione', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'frutta_stagione', dosePersona: 150, unita: 'g' },
    ],
  },
  {
    id: 'torta_da_campo', nome: 'Torta da campo', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.7, unita: 'pz' },
      { ingredienteId: 'burro', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 25, unita: 'ml' },
      { ingredienteId: 'lievito_dolci', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'plumcake', nome: 'Plumcake', categoria: 'merenda', pasti: ['merenda', 'colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 35, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 18, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.7, unita: 'pz' },
      { ingredienteId: 'burro', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'lievito_dolci', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 20, unita: 'ml' },
    ],
  },
  {
    id: 'pane_e_olio', nome: 'Pane e olio', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pane_e_pomodoro', nome: 'Pane e pomodoro', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'budino_merenda', nome: 'Budino', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'budino', dosePersona: 100, unita: 'g' },
    ],
  },
  {
    id: 'macedonia', nome: 'Macedonia', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'mele', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'banane', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'arance', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'limone', dosePersona: 5, unita: 'g' },
    ],
  },
  {
    id: 'pane_e_prosciutto', nome: 'Pane e prosciutto', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 40, unita: 'g' },
    ],
  },
  // =================== DAI MENU REALI DEI CAMPI (2019-2025) ===================
  // --- Primi ---
  {
    id: 'pasta_sugo_ricotta', nome: 'Pasta al sugo e ricotta', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'ricotta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_tonno_pomodorini', nome: 'Pasta tonno e pomodorini', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_panna_zucchine', nome: 'Pasta panna e zucchine', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'panna', dosePersona: 40, unita: 'ml' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_pesto_fagiolini_patate', nome: 'Pasta al pesto con fagiolini e patate', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'pesto', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'patate', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'fagiolini', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_panna_piselli_prosciutto', nome: 'Pasta panna, piselli e prosciutto', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'panna', dosePersona: 40, unita: 'ml' },
      { ingredienteId: 'piselli', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pasta_pancetta_pomodoro', nome: 'Pasta pancetta e pomodoro', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'pancetta', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 4, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'tortellini_al_sugo', nome: 'Tortellini al sugo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'tortellini_carne', dosePersona: 110, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'tortellini_ricotta_spinaci_sugo', nome: 'Tortellini ricotta e spinaci al sugo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'tortellini_al_sugo',
    ingredienti: [
      { ingredienteId: 'tortellini_ricotta_spinaci', dosePersona: 110, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'tortellini_in_brodo', nome: 'Tortellini / cappelletti in brodo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'tortellini_carne', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'pastina_stracciata', nome: 'Pastina stracciata (in brodo con uovo)', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pastina', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'gnocchi_gorgonzola', nome: 'Gnocchi al gorgonzola', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'gnocchi', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'gorgonzola', dosePersona: 35, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 30, unita: 'ml' },
      { ingredienteId: 'burro', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'risotto_salsiccia_zucchine', nome: 'Risotto salsiccia, zucchine e formaggio', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'salsiccia', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'risotto_zucchine', nome: 'Risotto alle zucchine', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'risotto_salsiccia_zucchine',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 4, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'risotto_verdure', nome: 'Risotto alle verdure', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'piselli', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'dado_vegetale', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'polenta_al_sugo', nome: 'Polenta al sugo', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina_mais', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'parmigiano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'polenta_sugo_salsiccia', nome: 'Polenta con sugo e salsiccia', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina_mais', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'salsiccia', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'olio_oliva', dosePersona: 3, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'polenta_formaggio_sugo', nome: 'Polenta con formaggio e sugo', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'polenta_sugo_salsiccia',
    ingredienti: [
      { ingredienteId: 'farina_mais', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'polenta_ragu', nome: 'Polenta con ragu di carne', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina_mais', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'carne_macinata', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'farro_mozzarella_pomodori', nome: 'Insalata di farro, mozzarella e pomodori', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'farro_pesto_pomodorini', nome: 'Farro al pesto e pomodorini', categoria: 'primo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'pesto', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'pomodorini', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 3, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  // --- Piatti unici ---
  {
    id: 'cous_cous_pollo_curry', nome: 'Cous cous con pollo al curry, peperoni e zucchine', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'cous_cous', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'pollo_petto', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'curry', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pane_e_salamella', nome: 'Panino con salamella', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'salsiccia', dosePersona: 120, unita: 'g' },
    ],
  },
  {
    id: 'pane_spiedo', nome: 'Pane sullo spiedo (pane al bastone)', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'lievito_birra', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'zucchero', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1.5, unita: 'g' },
    ],
  },
  // --- Secondi ---
  {
    id: 'panino_burger_vegetale', nome: 'Panino con burger vegetale', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'hamburger',
    ingredienti: [
      { ingredienteId: 'burger_vegetale', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'pane', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'insalata', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 25, unita: 'g' },
    ],
  },
  {
    id: 'pollo_al_latte', nome: 'Pollo al latte', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_petto', dosePersona: 130, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 80, unita: 'ml' },
      { ingredienteId: 'farina', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'rosmarino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'nuggets_pollo', nome: 'Nuggets di pollo (con corn flakes)', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_petto', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'cereali', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'olio_semi', dosePersona: 25, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'grigliata_carne_verdure', nome: 'Grigliata di carne e verdure', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'lonza', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'melanzane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'involtini_lonza', nome: 'Involtini di lonza con prosciutto e formaggio', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'lonza', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'farina', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 6, unita: 'g' },
      { ingredienteId: 'vino_bianco', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'salsiccia_griglia', nome: 'Salsiccia alla griglia', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'salsiccia', dosePersona: 130, unita: 'g' },
    ],
  },
  {
    id: 'piatto_formaggi', nome: 'Piatto di formaggi', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    varianteDi: 'salsiccia_griglia',
    ingredienti: [
      { ingredienteId: 'formaggio', dosePersona: 70, unita: 'g' },
    ],
  },
  {
    id: 'mozzarella_in_carrozza', nome: 'Mozzarella in carrozza', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane_cassetta', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'mozzarella', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'latte', dosePersona: 20, unita: 'ml' },
      { ingredienteId: 'farina', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 30, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'cotolette_valdostana', nome: 'Cotolette alla valdostana', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pollo_petto', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'prosciutto_cotto', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'formaggio', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'farina', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 25, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'peperoni_ripieni', nome: 'Peperoni ripieni di carne', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'peperoni', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'carne_macinata', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'pangrattato', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.2, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'omelette', nome: 'Omelette al formaggio', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'latte', dosePersona: 15, unita: 'ml' },
      { ingredienteId: 'formaggio', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 0.5, unita: 'g' },
    ],
  },
  {
    id: 'uova_strapazzate', nome: 'Uova strapazzate', categoria: 'secondo', pasti: ['colazione', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'uova', dosePersona: 2, unita: 'pz' },
      { ingredienteId: 'latte', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'burro', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 0.5, unita: 'g' },
    ],
  },
  {
    id: 'pesce_finto', nome: 'Pesce finto (patate e tonno)', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'maionese', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'capperi', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'fagiolata', nome: 'Fagiolata', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fagioli_borlotti', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'sedano', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'pomodori_tonno', nome: 'Pomodori e tonno', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pomodoro', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'tonno_scatola', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 6, unita: 'ml' },
      { ingredienteId: 'origano', dosePersona: 0.2, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'insalata_pomodori_ceci', nome: 'Insalata di pomodori, ceci e basilico', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pomodoro', dosePersona: 120, unita: 'g' },
      { ingredienteId: 'ceci', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1.5, unita: 'g' },
    ],
  },
  {
    id: 'verdure_ceci', nome: 'Verdure in padella con ceci', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'ceci', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  // --- Contorni ---
  {
    id: 'bruschette', nome: 'Bruschette al pomodoro', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 70, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'origano', dosePersona: 0.2, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'ratatouille', nome: 'Ratatouille (verdure stufate)', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'melanzane', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'peperoni', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'pomodoro', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'basilico', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'peperonata', nome: 'Peperonata', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'peperoni', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'patate_al_cartoccio', nome: 'Patate al cartoccio', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 250, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'rosmarino', dosePersona: 0.5, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'patate_fagiolini', nome: 'Patate e fagiolini', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'fagiolini', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'prezzemolo', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'patatine_fritte', nome: 'Patatine fritte', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'olio_semi', dosePersona: 40, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'rosti_patate', nome: 'Rosti di patate', categoria: 'contorno', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'patate', dosePersona: 200, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 5, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'carote_crude', nome: 'Carote crude a bastoncini', categoria: 'contorno', pasti: ['pranzo', 'cena', 'merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'carote', dosePersona: 100, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 3, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 0.5, unita: 'g' },
    ],
  },
  // --- Colazioni (latte e te + pane o biscotti) ---
  {
    id: 'colazione_pane_marmellata', nome: 'Latte e te con pane e marmellata', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'latte', dosePersona: 200, unita: 'ml' },
      { ingredienteId: 'te', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'marmellata', dosePersona: 25, unita: 'g' },
    ],
  },
  {
    id: 'colazione_pane_nutella', nome: 'Latte e te con pane e crema di nocciole', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'latte', dosePersona: 200, unita: 'ml' },
      { ingredienteId: 'te', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'nutella', dosePersona: 30, unita: 'g' },
    ],
  },
  {
    id: 'colazione_biscotti', nome: 'Latte e te con biscotti', categoria: 'colazione', pasti: ['colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'latte', dosePersona: 200, unita: 'ml' },
      { ingredienteId: 'te', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'biscotti', dosePersona: 50, unita: 'g' },
    ],
  },
  // --- Merende e dolci ---
  {
    id: 'pancake', nome: 'Pancake', categoria: 'merenda', pasti: ['merenda', 'colazione'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 50, unita: 'ml' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'zucchero', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'lievito_dolci', dosePersona: 2, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'miele', dosePersona: 10, unita: 'g' },
    ],
  },
  {
    id: 'crepes_nutella', nome: 'Crepes con crema di nocciole', categoria: 'merenda', pasti: ['merenda', 'colazione', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'farina', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'latte', dosePersona: 60, unita: 'ml' },
      { ingredienteId: 'uova', dosePersona: 0.5, unita: 'pz' },
      { ingredienteId: 'burro', dosePersona: 4, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 3, unita: 'g' },
      { ingredienteId: 'nutella', dosePersona: 25, unita: 'g' },
    ],
  },
  {
    id: 'salame_cioccolato', nome: 'Salame di cioccolato', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'biscotti', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'burro', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'zucchero', dosePersona: 12, unita: 'g' },
      { ingredienteId: 'cacao', dosePersona: 6, unita: 'g' },
      { ingredienteId: 'cioccolato', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.2, unita: 'pz' },
    ],
  },
  {
    id: 'mousse_cioccolato', nome: 'Mousse al cioccolato', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'cioccolato', dosePersona: 35, unita: 'g' },
      { ingredienteId: 'panna_montare', dosePersona: 60, unita: 'ml' },
      { ingredienteId: 'zucchero', dosePersona: 5, unita: 'g' },
    ],
  },
  {
    id: 'tiramisu', nome: 'Tiramisu', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'savoiardi', dosePersona: 35, unita: 'g' },
      { ingredienteId: 'mascarpone', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'zucchero', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'caffe', dosePersona: 5, unita: 'g' },
      { ingredienteId: 'cacao', dosePersona: 3, unita: 'g' },
    ],
  },
  {
    id: 'ghiaccioli', nome: 'Ghiaccioli fatti in casa', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'sciroppo', dosePersona: 40, unita: 'ml' },
    ],
  },
  {
    id: 'pane_cioccolato', nome: 'Pane e cioccolato', categoria: 'merenda', pasti: ['merenda'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pane', dosePersona: 60, unita: 'g' },
      { ingredienteId: 'cioccolato', dosePersona: 25, unita: 'g' },
    ],
  },
  // --- Frutta (peso con buccia) ---
  {
    id: 'frutta_mela', nome: 'Mela', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'mele', dosePersona: 180, unita: 'g' }],
  },
  {
    id: 'frutta_banana', nome: 'Banana', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'banane', dosePersona: 150, unita: 'g' }],
  },
  {
    id: 'frutta_pesche', nome: 'Pesche', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'pesche', dosePersona: 200, unita: 'g' }],
  },
  {
    id: 'frutta_pere', nome: 'Pere', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'pere', dosePersona: 180, unita: 'g' }],
  },
  {
    id: 'frutta_albicocche', nome: 'Albicocche', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'albicocche', dosePersona: 150, unita: 'g' }],
  },
  {
    id: 'frutta_susine', nome: 'Susine', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'susine', dosePersona: 150, unita: 'g' }],
  },
  {
    id: 'frutta_anguria', nome: 'Anguria', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'anguria', dosePersona: 350, unita: 'g' }],
  },
  {
    id: 'frutta_melone', nome: 'Melone', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'melone', dosePersona: 250, unita: 'g' }],
  },
  {
    id: 'frutta_ananas', nome: 'Ananas', categoria: 'merenda', pasti: ['merenda', 'pranzo', 'cena'], origine: 'base',
    ingredienti: [{ ingredienteId: 'ananas', dosePersona: 250, unita: 'g' }],
  },
  // --- Chiariti dal cambusiere ---
  {
    id: 'spatellata', nome: 'Spatellata (fagioli al sugo)', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'fagioli_borlotti', dosePersona: 150, unita: 'g' },
      { ingredienteId: 'passata_pomodoro', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 15, unita: 'g' },
      { ingredienteId: 'aglio', dosePersona: 1, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 8, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 2, unita: 'g' },
    ],
  },
  {
    id: 'torta_salata', nome: 'Torta salata ricotta e zucchine', categoria: 'secondo', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'pasta_sfoglia', dosePersona: 50, unita: 'g' },
      { ingredienteId: 'ricotta', dosePersona: 40, unita: 'g' },
      { ingredienteId: 'formaggio_spalmabile', dosePersona: 25, unita: 'g' },
      { ingredienteId: 'zucchine', dosePersona: 80, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 0.3, unita: 'pz' },
      { ingredienteId: 'parmigiano', dosePersona: 8, unita: 'g' },
      { ingredienteId: 'olio_oliva', dosePersona: 3, unita: 'ml' },
      { ingredienteId: 'sale', dosePersona: 1, unita: 'g' },
    ],
  },
  {
    id: 'riso_fritto', nome: 'Riso fritto con salsa di soia (liso flitto)', categoria: 'piatto_unico', pasti: ['pranzo', 'cena'], origine: 'base',
    ingredienti: [
      { ingredienteId: 'riso', dosePersona: 90, unita: 'g' },
      { ingredienteId: 'uova', dosePersona: 1, unita: 'pz' },
      { ingredienteId: 'piselli', dosePersona: 30, unita: 'g' },
      { ingredienteId: 'carote', dosePersona: 20, unita: 'g' },
      { ingredienteId: 'cipolla', dosePersona: 10, unita: 'g' },
      { ingredienteId: 'salsa_soia', dosePersona: 10, unita: 'ml' },
      { ingredienteId: 'olio_semi', dosePersona: 10, unita: 'ml' },
    ],
  },
];

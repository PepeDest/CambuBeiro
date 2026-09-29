/** Id in snake_case ASCII dal nome (senza accenti); aggiunge _2, _3… se l'id esiste già. */
export function slugId(nome: string, esistenti: Iterable<string>): string {
  const base =
    nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // toglie gli accenti separati da NFD
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'voce';
  const usati = new Set(esistenti);
  if (!usati.has(base)) return base;
  let i = 2;
  while (usati.has(`${base}_${i}`)) i++;
  return `${base}_${i}`;
}

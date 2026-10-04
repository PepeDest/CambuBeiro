/** Nome file sicuro dal nome del campo, es. ("Campo Estivo", "xlsx") → "Campo_Estivo.xlsx". */
export function nomeFile(nomeCampo: string, estensione: string): string {
  return `${(nomeCampo || 'campo').replace(/[^a-z0-9-_]+/gi, '_')}.${estensione}`;
}

/** Fa scaricare un file al browser. */
export function scaricaFile(nome: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

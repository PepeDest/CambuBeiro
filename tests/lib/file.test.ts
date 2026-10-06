import { describe, it, expect, vi, afterEach } from 'vitest';
import { scaricaFile } from '../../src/lib/file';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('scaricaFile', () => {
  it("non cancella il link del file subito dopo il clic (alcuni browser non farebbero in tempo a scaricarlo)", () => {
    vi.useFakeTimers();
    const click = vi.fn();
    vi.stubGlobal('document', { createElement: () => ({ click }) });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:prova');
    const revoca = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    scaricaFile('campo.xlsx', new Blob(['x']));
    expect(click).toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(revoca).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60_000);
    expect(revoca).toHaveBeenCalledWith('blob:prova');
  });
});

import { DreEntry } from '@/types/dre';

export interface DreSummary {
  receita: number;
  despesa: number;
  lucro: number;
  margem: number;
}

export function summarize(entries: DreEntry[]): DreSummary {
  const receita = entries
    .filter((e) => e.type === 'receita')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const despesa = entries
    .filter((e) => e.type === 'despesa')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const lucro = receita - despesa;
  const margem = receita > 0 ? (lucro / receita) * 100 : 0;
  return { receita, despesa, lucro, margem };
}

export type EntryType = 'receita' | 'despesa';

export interface DreEntry {
  id: string;
  user_id: string;
  description: string;
  category: string;
  type: EntryType;
  amount: number;
  entry_date: string;
  created_at: string;
}

export interface DreInput {
  description: string;
  category: string;
  type: EntryType;
  amount: number;
  entry_date: string;
}

export interface DreSummary {
  receita: number;
  despesa: number;
  lucro: number;
}

export const DRE_CATEGORIES: Record<EntryType, string[]> = {
  receita: ['Vendas', 'Serviços', 'Outras Receitas'],
  despesa: ['Custos', 'Despesas Fixas', 'Folha de Pagamento', 'Marketing', 'Impostos', 'Outras Despesas'],
};

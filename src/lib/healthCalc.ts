import { DreEntry } from '@/types/dre';
import { InventoryProduct, stockStatusOf } from '@/types/inventory';

export type HealthStatus = 'saudavel' | 'atencao' | 'critico';

export interface HealthInsight {
  id: string;
  message: string;
}

export interface HealthReport {
  status: HealthStatus;
  score: number;
  hasData: boolean;
  receita: number;
  despesa: number;
  lucro: number;
  margem: number;
  totalProdutos: number;
  produtosEstoqueNormal: number;
  produtosEstoqueBaixo: number;
  produtosSemEstoque: number;
  acertos: HealthInsight[];
  pontosAtencao: HealthInsight[];
  dicas: HealthInsight[];
}

const MARGEM_IDEAL = 15;
const MARGEM_BAIXA = 5;

export function calculateHealth(entries: DreEntry[], products: InventoryProduct[]): HealthReport {
  const receita = entries.filter((e) => e.type === 'receita').reduce((s, e) => s + Number(e.amount), 0);
  const despesa = entries.filter((e) => e.type === 'despesa').reduce((s, e) => s + Number(e.amount), 0);
  const lucro = receita - despesa;
  const margem = receita > 0 ? (lucro / receita) * 100 : 0;

  const totalProdutos = products.length;
  const produtosSemEstoque = products.filter((p) => stockStatusOf(p) === 'out').length;
  const produtosEstoqueBaixo = products.filter((p) => stockStatusOf(p) === 'low').length;
  const produtosEstoqueNormal = products.filter((p) => stockStatusOf(p) === 'normal').length;

  const hasData = entries.length > 0 || products.length > 0;
  const temDadosFinanceiros = entries.length > 0;
  const temDadosEstoque = products.length > 0;

  const acertos: HealthInsight[] = [];
  const pontosAtencao: HealthInsight[] = [];
  const dicas: HealthInsight[] = [];

  // --- Financial rules ---
  if (temDadosFinanceiros) {
    if (lucro > 0) {
      acertos.push({ id: 'lucro', message: 'Seu negócio está apresentando lucro.' });
    }
    if (receita > despesa) {
      acertos.push({ id: 'receita-maior', message: 'Suas receitas estão acima das despesas.' });
    }
    if (margem >= MARGEM_IDEAL) {
      acertos.push({ id: 'margem-boa', message: `Sua margem de lucro (${margem.toFixed(1)}%) está acima do recomendado.` });
    }
    if (lucro <= 0) {
      pontosAtencao.push({ id: 'prejuizo', message: 'Suas despesas estão maiores que suas receitas.' });
    }
    if (receita > 0 && margem >= 0 && margem < MARGEM_IDEAL) {
      pontosAtencao.push({ id: 'margem-baixa', message: `Sua margem de lucro (${margem.toFixed(1)}%) está abaixo de ${MARGEM_IDEAL}%.` });
    }
    if (margem < MARGEM_BAIXA) {
      pontosAtencao.push({ id: 'margem-critica', message: 'Sua margem está muito baixa. Revise receitas e despesas.' });
    }
    if (despesa > receita) {
      dicas.push({ id: 'dica-despesas', message: 'Revise suas principais despesas e identifique oportunidades de redução.' });
    }
    if (margem >= 0 && margem < MARGEM_IDEAL) {
      dicas.push({ id: 'dica-margem', message: `Defina uma meta de margem mínima de ${MARGEM_IDEAL}% e acompanhe a evolução.` });
    }
  } else {
    dicas.push({ id: 'dica-sem-fin', message: 'Comece cadastrando suas receitas e despesas para acompanhar a saúde financeira do negócio.' });
  }

  // --- Stock rules ---
  if (temDadosEstoque) {
    if (produtosEstoqueNormal === totalProdutos && totalProdutos > 0) {
      acertos.push({ id: 'estoque-ok', message: 'Todos os seus produtos estão com estoque adequado.' });
    }
    if (produtosSemEstoque > 0) {
      pontosAtencao.push({ id: 'sem-estoque', message: `Existem ${produtosSemEstoque} produto(s) sem estoque.` });
    }
    if (produtosEstoqueBaixo > 0) {
      pontosAtencao.push({ id: 'estoque-baixo', message: `Existem ${produtosEstoqueBaixo} produto(s) que precisam de reposição.` });
    }
    if (produtosEstoqueBaixo > 0 || produtosSemEstoque > 0) {
      dicas.push({ id: 'dica-reposicao', message: 'Verifique os produtos que estão próximos do estoque mínimo e faça a reposição.' });
    }
    if (produtosSemEstoque > 0) {
      dicas.push({ id: 'dica-sem-estoque', message: 'Produtos sem estoque geram perda de venda. Priorize a reposição desses itens.' });
    }
  } else if (hasData) {
    dicas.push({ id: 'dica-sem-estoque-cad', message: 'Cadastre seus produtos no Estoque para acompanhar a situação dos itens.' });
  }

  // General tips
  dicas.push({ id: 'dica-inventario', message: 'Faça inventário do estoque pelo menos uma vez por mês para evitar perdas.' });
  dicas.push({ id: 'dica-separar', message: 'Separe despesas pessoais das despesas do negócio para ter uma visão mais clara.' });

  // --- Status determination ---
  let score = 100;
  if (lucro <= 0 && temDadosFinanceiros) score -= 40;
  else if (margem < MARGEM_BAIXA && temDadosFinanceiros) score -= 30;
  else if (margem < MARGEM_IDEAL && temDadosFinanceiros) score -= 15;

  if (produtosSemEstoque > 0) score -= 20;
  if (produtosEstoqueBaixo > 0) score -= 10;
  if (!temDadosFinanceiros && !temDadosEstoque) score = 0;

  score = Math.max(0, Math.min(100, score));

  let status: HealthStatus = 'saudavel';
  if (lucro <= 0 && temDadosFinanceiros) {
    status = 'critico';
  } else if (produtosSemEstoque > 0 || produtosEstoqueBaixo > 0 || margem < MARGEM_IDEAL) {
    status = 'atencao';
  }

  if (!hasData) {
    status = 'atencao';
  }

  return {
    status,
    score,
    hasData,
    receita,
    despesa,
    lucro,
    margem,
    totalProdutos,
    produtosEstoqueNormal,
    produtosEstoqueBaixo,
    produtosSemEstoque,
    acertos,
    pontosAtencao,
    dicas,
  };
}

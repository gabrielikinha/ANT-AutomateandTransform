import React from 'react';
import { Package, Plus, Search, AlertTriangle, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';

export default function Estoque() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Estoque"
        subtitle="Controle de produtos e quantidades"
        actions={
          <Button size="sm" icon={<Plus size={14} />}>
            Novo Produto
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total de Produtos"
            value="—"
            icon={<Package size={18} className="text-ant-purple" />}
            iconBg="bg-ant-purple-soft"
          />
          <StatCard
            label="Estoque Baixo"
            value="—"
            icon={<AlertTriangle size={18} className="text-warning-600" />}
            iconBg="bg-warning-100"
            subtitle="Produtos abaixo do mínimo"
          />
          <StatCard
            label="Valor Total em Estoque"
            value="R$ —"
            icon={<Tag size={18} className="text-ant-green" />}
            iconBg="bg-ant-green-soft"
          />
        </div>

        {/* Search and filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar produto por nome ou código..."
                icon={<Search size={16} />}
              />
            </div>
            <div className="flex gap-2">
              <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 outline-none focus:border-ant-purple">
                <option>Todas categorias</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 outline-none focus:border-ant-purple">
                <option>Todos os status</option>
                <option>Em estoque</option>
                <option>Estoque baixo</option>
                <option>Sem estoque</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Products table / empty state */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">Produtos Cadastrados</h3>
            <Badge variant="neutral">0 itens</Badge>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100">
            {['Produto', 'Categoria', 'Quantidade', 'Preço Unit.', 'Status'].map((h) => (
              <span key={h} className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <Package size={28} className="text-neutral-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-700">Nenhum produto cadastrado</h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                Adicione seus produtos para controlar o estoque, acompanhar quantidades e receber alertas de reposição.
              </p>
            </div>
            <Button icon={<Plus size={14} />} size="sm">
              Cadastrar Primeiro Produto
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

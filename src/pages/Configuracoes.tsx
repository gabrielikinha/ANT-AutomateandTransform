import React, { useState } from 'react';
import { Shield, Bell, Moon, Globe, Trash2, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-ant-purple' : 'bg-neutral-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function Configuracoes() {
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Configurações" subtitle="Preferências e configurações do sistema" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-warning-100 flex items-center justify-center">
              <Bell size={15} className="text-warning-600" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">Notificações</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Notificações gerais', desc: 'Receba avisos e alertas do sistema', value: notifications, onChange: setNotifications },
              { label: 'Alerta de estoque baixo', desc: 'Aviso quando produtos atingirem o estoque mínimo', value: lowStockAlert, onChange: setLowStockAlert },
              { label: 'Relatório mensal', desc: 'Resumo automático ao final de cada mês', value: monthlyReport, onChange: setMonthlyReport },
            ].map(({ label, desc, value, onChange }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-neutral-700">{label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                </div>
                <Toggle checked={value} onChange={onChange} />
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <Shield size={15} className="text-ant-purple" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">Segurança</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Alterar senha', desc: 'Atualize sua senha de acesso' },
              { label: 'Verificação em dois fatores', desc: 'Adicione uma camada extra de segurança' },
            ].map(({ label, desc }) => (
              <button key={label} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-700">{label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
              <Globe size={15} className="text-neutral-500" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">Preferências</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">Moeda</label>
              <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft">
                <option>Real Brasileiro (R$)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">Formato de data</label>
              <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft">
                <option>DD/MM/AAAA</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button size="sm">Salvar preferências</Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="p-6 border border-error-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-error-100 flex items-center justify-center">
              <Trash2 size={15} className="text-error-500" />
            </div>
            <h3 className="text-base font-semibold text-error-600">Zona de Perigo</h3>
          </div>
          <Alert variant="warning">
            Estas ações são permanentes e não podem ser desfeitas. Prossiga com cuidado.
          </Alert>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="border-error-200 text-error-500 hover:bg-error-50">
              Excluir todos os dados
            </Button>
            <Button variant="danger" size="sm">
              Excluir minha conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

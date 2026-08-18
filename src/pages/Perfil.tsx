import React from 'react';
import { User, Building2, Mail, Calendar, Hash, Briefcase, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface PerfilProps {
  userName?: string;
  userEmail?: string;
}

export default function Perfil({ userName = '', userEmail = '' }: PerfilProps) {
  const initials = userName
    ? userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Perfil" subtitle="Suas informações pessoais e do negócio" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Avatar header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ant-purple to-ant-purple-light flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-neutral-800">{userName || 'Seu nome'}</h2>
                  <p className="text-sm text-neutral-400 mt-0.5">{userEmail || 'seu@email.com'}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="purple">Microempreendedor</Badge>
                    <Badge variant="green">MEI</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sobre você */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-ant-purple-soft flex items-center justify-center">
                  <User size={15} className="text-ant-purple" />
                </div>
                <h3 className="text-base font-semibold text-neutral-800">Sobre você</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome" placeholder="Seu nome completo" defaultValue={userName} icon={<User size={15} />} />
                <Input label="E-mail" placeholder="seu@email.com" defaultValue={userEmail} type="email" icon={<Mail size={15} />} />
              </div>
              <div className="mt-5 flex justify-end">
                <Button size="sm" icon={<CheckCircle size={14} />}>Atualizar Perfil</Button>
              </div>
            </Card>

            {/* Seu negócio */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-ant-green-soft flex items-center justify-center">
                  <Building2 size={15} className="text-ant-green" />
                </div>
                <h3 className="text-base font-semibold text-neutral-800">Seu negócio</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome do negócio" placeholder="Ex: Padaria São João" icon={<Building2 size={15} />} />
                <Input label="Segmento" placeholder="Ex: Alimentação, Varejo..." icon={<Briefcase size={15} />} />
                <Input label="Ano de fundação" placeholder="Ex: 2023" type="number" icon={<Calendar size={15} />} />
                <Input label="CNPJ" placeholder="00.000.000/0001-00" icon={<Hash size={15} />} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700">Porte</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 py-2.5 px-3.5 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft">
                    <option>Microempreendedor Individual (MEI)</option>
                    <option>Microempresa (ME)</option>
                    <option>Empresa de Pequeno Porte (EPP)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700">É MEI?</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 py-2.5 px-3.5 outline-none focus:border-ant-purple focus:ring-2 focus:ring-ant-purple-soft">
                    <option>Sim</option>
                    <option>Não</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button size="sm" variant="secondary">Salvar Negócio</Button>
              </div>
            </Card>
          </div>

          {/* Side cards */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-ant-purple-soft to-white">
              <h3 className="text-sm font-semibold text-ant-purple mb-4">Resumo da Conta</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Plano</span>
                  <Badge variant="purple">Gratuito</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Membro desde</span>
                  <span className="text-xs font-medium text-neutral-700">Agosto 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Status</span>
                  <Badge variant="success">Ativo</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-4">Precisa de ajuda?</h3>
              <p className="text-xs text-neutral-400 mb-4">
                Consulte tutoriais e guias para aproveitar ao máximo o ANT.
              </p>
              <Button variant="outline" size="sm" fullWidth>Central de Ajuda</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

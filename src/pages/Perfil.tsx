import React from 'react';
import { User, Building2, Phone, Mail, MapPin, Camera } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Avatar */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ant-purple to-ant-purple-light flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl font-bold">{initials}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <Camera size={14} className="text-neutral-500" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-neutral-800">{userName || 'Seu nome'}</h2>
              <p className="text-sm text-neutral-400 mt-0.5">{userEmail || 'seu@email.com'}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="text-xs bg-ant-purple-soft text-ant-purple px-2.5 py-1 rounded-full font-medium">
                  Microempreendedor
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <User size={15} className="text-ant-purple" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">Informações Pessoais</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome completo" placeholder="Seu nome completo" defaultValue={userName} icon={<User size={15} />} />
            <Input label="E-mail" placeholder="seu@email.com" defaultValue={userEmail} type="email" icon={<Mail size={15} />} />
            <Input label="Telefone / WhatsApp" placeholder="(11) 99999-9999" type="tel" icon={<Phone size={15} />} />
            <Input label="CPF" placeholder="000.000.000-00" />
          </div>
          <div className="mt-5 flex justify-end">
            <Button size="sm">Salvar alterações</Button>
          </div>
        </Card>

        {/* Business info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-ant-green-soft flex items-center justify-center">
              <Building2 size={15} className="text-ant-green" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">Informações do Negócio</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do negócio" placeholder="Nome da sua empresa ou negócio" icon={<Building2 size={15} />} />
            <Input label="CNPJ / CPF (MEI)" placeholder="00.000.000/0001-00" />
            <Input label="Segmento / Ramo" placeholder="Ex: Varejo, Alimentação, Serviços..." />
            <Input label="Cidade / Estado" placeholder="São Paulo, SP" icon={<MapPin size={15} />} />
          </div>
          <div className="mt-5 flex justify-end">
            <Button size="sm">Salvar negócio</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

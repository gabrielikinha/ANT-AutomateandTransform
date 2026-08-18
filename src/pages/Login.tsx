import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

type Mode = 'login' | 'register' | 'forgot';

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setSuccessMsg('Enviamos um link de redefinição para seu e-mail.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Ocorreu um erro. Tente novamente.';
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (msg.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Faça login.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-gradient-to-br from-ant-purple via-ant-purple-light to-purple-400 p-10 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 w-32 h-32 rounded-full bg-ant-green/20" />

        <div className="relative z-10">
          <img src="/assets/images/ant.png" alt="ANT" className="w-14 h-14 object-contain brightness-0 invert" />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-white">ANT</h1>
            <p className="text-white/70 text-sm mt-1">Automate and Transform</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote>
            <p className="text-xl font-semibold text-white leading-relaxed">
              "Organize seu negócio com clareza e tome decisões com confiança."
            </p>
          </blockquote>

          <div className="flex flex-col gap-3">
            {[
              'Controle financeiro simplificado',
              'Gestão de estoque inteligente',
              'Indicadores em tempo real',
              'Alertas automáticos',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-ant-green flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          &copy; {new Date().getFullYear()} ANT — Automate and Transform
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/assets/images/ant.png" alt="ANT" className="w-9 h-9 object-contain" />
            <div>
              <span className="font-bold text-neutral-800 text-lg">ANT</span>
              <p className="text-xs text-neutral-400">Automate and Transform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800">
              {mode === 'login' ? 'Bem-vindo de volta!' : mode === 'register' ? 'Criar conta' : 'Redefinir senha'}
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              {mode === 'login' && 'Acesse sua conta para continuar.'}
              {mode === 'register' && 'Preencha os dados abaixo para começar.'}
              {mode === 'forgot' && 'Informe seu e-mail para receber o link de redefinição.'}
            </p>
          </div>

          {error && <Alert variant="error" className="mb-4" onClose={() => setError('')}>{error}</Alert>}
          {successMsg && <Alert variant="success" className="mb-4" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
              autoComplete="email"
            />

            {mode !== 'forgot' && (
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                iconRight={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-ant-purple hover:text-ant-purple-light transition-colors font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              iconRight={!loading ? <ArrowRight size={16} /> : undefined}
              className="mt-2"
            >
              {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                  className="text-ant-purple font-semibold hover:text-ant-purple-light transition-colors"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  className="text-ant-purple font-semibold hover:text-ant-purple-light transition-colors"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

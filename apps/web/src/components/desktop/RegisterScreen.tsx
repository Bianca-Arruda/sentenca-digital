"use client";

import { FormEvent, useState } from 'react';
import { PixelButton } from '@/components/system/PixelButton';
import type { RegisterInput } from '@/features/auth/api';

interface RegisterScreenProps {
  onRegister: (input: RegisterInput) => Promise<void>;
  onBack: () => void;
}

export function RegisterScreen({ onRegister, onBack }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('CONFIRMAÇÃO DE SENHA NÃO CONFERE.');
      return;
    }

    setLoading(true);

    try {
      await onRegister({ name, email, password });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'ERRO DE COMUNICAÇÃO.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <div className="login-window register-window">
        <div className="window-titlebar">
          <div className="window-title">
            <span className="window-icon">⚖</span>
            <span>SENTENÇA DIGITAL — NOVO USUÁRIO</span>
          </div>
          <div className="window-controls">
            <button className="window-control close" type="button" aria-label="Fechar" onClick={onBack}>×</button>
          </div>
        </div>

        <div className="login-body">
          <div className="login-emblem">⚖</div>
          <h1>REGISTRO DE NOVO USUÁRIO</h1>
          <p className="login-version">SISTEMA DIGITAL JUDICIAL / BANCO DE DADOS DE USUÁRIOS</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              NOME COMPLETO
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={100} />
            </label>
            <label>
              E-MAIL
              <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" required />
            </label>
            <label>
              SENHA
              <input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" type="password" minLength={8} required />
            </label>
            <label>
              CONFIRMAR SENHA
              <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" type="password" minLength={8} required />
            </label>

            {error && <div className="login-error" role="alert">{error}</div>}

            <div className="login-actions">
              <PixelButton type="submit" disabled={loading}>{loading ? 'CRIANDO...' : 'CRIAR USUÁRIO'}</PixelButton>
              <PixelButton type="button" onClick={onBack} disabled={loading}>CANCELAR</PixelButton>
            </div>
          </form>

          <div className="system-online"><span /> CONEXÃO SEGURA COM O BANCO DE DADOS</div>
        </div>
      </div>
      <div className="crt-vignette" />
    </main>
  );
}

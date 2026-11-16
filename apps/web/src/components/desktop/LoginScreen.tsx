"use client";

import { FormEvent, useState } from 'react';
import { PixelButton } from '@/components/system/PixelButton';
import type { LoginInput } from '@/features/auth/api';


interface LoginScreenProps {
  onLogin: (input: LoginInput) => Promise<void>;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onRegister, onForgotPassword, }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({ email, password });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'ERRO DE COMUNICAÇÃO.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <div className="login-window">
        <div className="window-titlebar">
          <div className="window-title"><span className="window-icon">⚖</span><span>SENTENÇA DIGITAL - LOGAR</span></div>
          <div className="window-controls"><button className="window-control close" type="button" aria-label="Fechar">×</button></div>
        </div>
        <div className="login-body">
          <div className="login-emblem">⚖</div>
          <h1>Sistema Judicial Digital</h1>
          <p className="login-version">SOMENTE PESSOA AUTORIZADA / v1.0</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label>E-MAIL<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" type="email" required /></label>
            <label>SENHA<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            {error && <div className="login-error" role="alert">{error}</div>}
            <div className="login-actions">
              <PixelButton type="submit" disabled={loading}>{loading ? 'CONETANDO...' : 'ENTRAR'}</PixelButton>
              <PixelButton type="button" onClick={() => { setEmail(''); setPassword(''); setError(''); }} disabled={loading}>CANCELAR</PixelButton>
            </div>
          </form> 
          <div className="login-links">
            <button type="button" onClick={onRegister}>CRIAR CONTA</button> {/* 
            <span>·</span>
            <button
              type="button"
              onClick={onForgotPassword}
            >
              ESQUECI SENHA
            </button> */}
          </div>
          <div className="system-online"><span /> SISTEMA ONLINE / AUTENTICAÇÃO SEGURA</div>
        </div>
      </div>
      <div className="crt-vignette" />
    </main>
  );
}

"use client";

import { FormEvent, useState } from 'react';
import { PixelButton } from '@/components/system/PixelButton';

interface ResetPasswordScreenProps {
  token: string;
  onBack: () => void;
}

export function ResetPasswordScreen({
  token,
  onBack,
}: ResetPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('AS SENHAS NÃO CONFEREM.');
      return;
    }

    if (password.length < 8) {
      setError(
        'A senha deve possuir pelo menos 8 caracteres.',
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3333/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível alterar a senha.',
        );
      }

      setMessage(
        'SENHA ALTERADA COM SUCESSO. VOCÊ JÁ PODE VOLTAR AO LOGIN.',
      );

      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'ERRO DE COMUNICAÇÃO.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <div className="login-window">
        <div className="window-titlebar">
          <div className="window-title">
            <span className="window-icon">⚖</span>
            <span>SENTENÇA DIGITAL - NOVA SENHA</span>
          </div>

          <div className="window-controls">
            <button
              className="window-control close"
              type="button"
              aria-label="Fechar"
              onClick={onBack}
            >
              ×
            </button>
          </div>
        </div>

        <div className="login-body">
          <div className="login-emblem">⚖</div>

          <h1>Nova senha</h1>

          <p className="login-version">
            DEFINA UMA NOVA SENHA PARA SUA CONTA
          </p>

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            <label>
              NOVA SENHA
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label>
              CONFIRMAR NOVA SENHA
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="login-success"
                role="status"
              >
                {message}
              </div>
            )}

            <div className="login-actions">
              <PixelButton
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'ALTERANDO...'
                  : 'ALTERAR SENHA'}
              </PixelButton>

              <PixelButton
                type="button"
                onClick={onBack}
                disabled={loading}
              >
                VOLTAR
              </PixelButton>
            </div>
          </form>
        </div>
      </div>

      <div className="crt-vignette" />
    </main>
  );
}
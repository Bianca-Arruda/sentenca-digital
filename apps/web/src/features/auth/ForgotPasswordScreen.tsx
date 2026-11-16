"use client";

import { FormEvent, useState } from 'react';
import { PixelButton } from '@/components/system/PixelButton';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({
  onBack,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3333/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível solicitar a recuperação.',
        );
      }

      setMessage(data.message);
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
            <span>SENTENÇA DIGITAL - RECUPERAÇÃO</span>
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

          <h1>Recuperar senha</h1>

          <p className="login-version">
            DIGITE O E-MAIL DA SUA CONTA
          </p>

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            <label>
              E-MAIL
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
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
                  ? 'ENVIANDO...'
                  : 'ENVIAR LINK'}
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
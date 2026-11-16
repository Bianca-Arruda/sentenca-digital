import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [email],
    subject: 'SENTENÇA DIGITAL — Recuperação de senha',
    html: `
      <div style="font-family: monospace; line-height: 1.6; max-width: 600px;">
        <h2>SENTENÇA DIGITAL</h2>

        <p>Foi solicitada uma recuperação de senha para sua conta.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 18px;
              background: #222;
              color: #fff;
              text-decoration: none;
              font-weight: bold;
            "
          >
            CRIAR NOVA SENHA
          </a>
        </p>

        <p>Este link será válido por 15 minutos.</p>

        <p>
          Se você não solicitou esta alteração, ignore este e-mail.
        </p>

        <p>SENTENÇA DIGITAL</p>
      </div>
    `,
  });

  if (error) {
    console.error('Erro ao enviar e-mail de recuperação:', error);
    throw new Error('Não foi possível enviar o e-mail de recuperação.');
  }
}
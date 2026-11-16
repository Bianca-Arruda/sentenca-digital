
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordScreen } from '@/features/auth/ResetPasswordScreen';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return (
    <ResetPasswordScreen
      token={token}
      onBack={() => {
        window.location.href = '/';
      }}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

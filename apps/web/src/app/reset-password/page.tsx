"use client";

import { useSearchParams } from 'next/navigation';
import { ResetPasswordScreen } from '@/features/auth/ResetPasswordScreen';

export default function ResetPasswordPage() {
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
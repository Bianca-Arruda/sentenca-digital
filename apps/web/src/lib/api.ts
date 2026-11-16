const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

type ApiErrorPayload = {
  error?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message ?? 'Não foi possível concluir a operação.');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.error;
    this.details = payload.details;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

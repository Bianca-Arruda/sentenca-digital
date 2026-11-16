export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
}

export interface AuthContext {
  id: string;
  role: 'PLAYER' | 'ADMIN';
}

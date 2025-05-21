export type Role = 'DIRECTEUR' | 'SERVICE' | 'SECRETAIRE';

export interface AppUser {
  id?: number;
  email: string;
  motDePasse: string;
  role: Role;
}
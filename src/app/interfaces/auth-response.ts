// interfaces/auth-response.ts
import { User } from './user';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}
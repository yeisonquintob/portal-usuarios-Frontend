import { User } from './user.interface';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    user: User;
    tokenType: string;
}

// Interfaz para respuesta del refresh token
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

// Interfaz para las credenciales de autenticación
export interface AuthCredentials {
    username: string;
    password: string;
}

// Interfaz para el estado de autenticación
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}
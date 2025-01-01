// Interfaz genérica para respuestas de la API
export interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data: T;
  errors?: { [key: string]: string[] };
}

// Interfaz para respuestas paginadas
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Interfaz para parámetros de paginación
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Interfaz para mensajes de error
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: { [key: string]: string[] };
  timestamp: string;
  path?: string;
}

// Interfaz para respuestas de autenticación
export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: string;
  user: {
      userId: number;
      username: string;
      role: string;
      email: string;
      firstName: string;
      lastName: string;
  };
}

// Interfaz para metadata de la respuesta
export interface ResponseMetadata {
  timestamp: string;
  path: string;
  version: string;
}
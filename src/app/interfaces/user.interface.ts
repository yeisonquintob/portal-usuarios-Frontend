// Interfaz principal de Usuario
export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  updatedAt?: Date;
}

// Interfaz para actualización de usuario
export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  profilePicture?: string;
}

// Interfaz para creación de usuario
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

// Interfaz para login
export interface LoginUserDTO {
  username: string;
  password: string;
}
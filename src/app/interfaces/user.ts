// interfaces/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
}
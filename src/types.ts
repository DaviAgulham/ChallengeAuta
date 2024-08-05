export type UserRole = 'consumer' | 'team';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  photoUrl: string;
  description: string;
  isFavorite?: boolean;
  isReserved?: boolean;
}
  
export interface User {
  id: string;
  displayName?: string;
  email?: string;
  role: UserRole;
  favorites?: string[];
  dni?: string;
}

export interface Query {
  id?: string;
  carId: string;
  userId: string;
  status: 'pending' | 'resolved';
  timestamp: Date;
}
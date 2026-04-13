
export interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  pricePerMeter: number;
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export type AppView = 'landing' | 'catalog' | 'previewer';

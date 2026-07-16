import { WineType } from "../types/WineType";

export type AuthProvider = 'google' | 'password';

export type CaveView = 'grid' | 'list';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  favoriteWineType: WineType | null;
  provider: AuthProvider;
  createdAt: Date;

  caveConfig: {
    rows: number;
    cols: number;
    viewMode: CaveView;
  };
}
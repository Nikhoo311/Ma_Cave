import { WineType } from "../types/WineType";
import { UserWine } from "./wine.model";

export type AuthProvider = 'google' | 'password';

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
  };
  cave: UserWine[];
}
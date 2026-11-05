import { createContext } from "react";
import type { User } from "../types/user";
import type { EditableProfile, ProfileData } from "../services/profileStorage";

type AuthContextValue = {
  user: User | null;
  profile: ProfileData;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (fields: EditableProfile) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

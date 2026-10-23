import { createContext } from "react";
import type { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

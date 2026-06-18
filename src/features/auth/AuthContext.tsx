import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import * as authApi from "../../api/authApi";
import type { AuthUser } from "../../api/authApi";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    email: string;
    displayName: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (input) => {
        const result = await authApi.login(input);
        setUser(result.user);
      },
      register: async (input) => {
        const result = await authApi.register(input);
        setUser(result.user);
      },
      logout: async () => {
        await authApi.logout();
        setUser(null);
      }
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}

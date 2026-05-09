import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, clearToken, setToken, type UserPublic } from "@/lib/api";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: UserPublic };

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserPublic>) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api.auth.me();
        setAuthState({ status: "authenticated", user });
      } catch {
        setAuthState({ status: "unauthenticated" });
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.auth.login({ email, password });
    await setToken(token);
    setAuthState({ status: "authenticated", user });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user } = await api.auth.register({ name, email, password });
      await setToken(token);
      setAuthState({ status: "authenticated", user });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {}
    await clearToken();
    setAuthState({ status: "unauthenticated" });
  }, []);

  const updateUser = useCallback(async (data: Partial<UserPublic>) => {
    const { user } = await api.auth.updateProfile(data);
    setAuthState({ status: "authenticated", user });
  }, []);

  const deleteAccount = useCallback(async () => {
    await api.auth.deleteAccount();
    await clearToken();
    setAuthState({ status: "unauthenticated" });
  }, []);

  return (
    <AuthContext.Provider
      value={{ authState, login, register, logout, updateUser, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useRequireAuth() {
  const { authState } = useAuth();
  if (authState.status === "authenticated") return authState.user;
  return null;
}

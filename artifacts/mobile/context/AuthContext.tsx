import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, clearToken, setToken, ApiError, type UserPublic } from "@/lib/api";

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
const LOCAL_USER_KEY = "tf_local_user";

function createLocalUser(name: string, email: string): UserPublic {
  const cleanName = name.trim() || email.split("@")[0] || "TripFlow User";
  const username = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "traveler";

  const now = new Date().toISOString();

  return {
    id: `local-${Date.now()}`,
    name: cleanName,
    username,
    email,
    avatarUrl: null,
    bio: null,
    preferredCurrency: "EUR",
    language: "pt",
    timezone: "Europe/Lisbon",
    profileVisibility: "private",
    createdAt: now,
    updatedAt: now,
  };
}

async function saveLocalUser(user: UserPublic): Promise<void> {
  await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

async function getLocalUser(): Promise<UserPublic | null> {
  const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
  return raw ? (JSON.parse(raw) as UserPublic) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api.auth.me();
        setAuthState({ status: "authenticated", user });
      } catch (err) {
        const localUser = await getLocalUser();
        if (err instanceof ApiError && err.status === 0 && localUser) {
          setAuthState({ status: "authenticated", user: localUser });
        } else {
          await clearToken();
          setAuthState({ status: "unauthenticated" });
        }
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await api.auth.login({ email, password });
      await setToken(token);
      await saveLocalUser(user);
      setAuthState({ status: "authenticated", user });
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        const existingUser = await getLocalUser();
        const user =
          existingUser?.email.toLowerCase() === email.toLowerCase()
            ? existingUser
            : createLocalUser(email.split("@")[0], email);
        await setToken("local-dev-token");
        await saveLocalUser(user);
        setAuthState({ status: "authenticated", user });
        return;
      }
      throw err;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { token, user } = await api.auth.register({ name, email, password });
        await setToken(token);
        await saveLocalUser(user);
        setAuthState({ status: "authenticated", user });
      } catch (err) {
        if (err instanceof ApiError && err.status === 0) {
          const user = createLocalUser(name, email);
          await setToken("local-dev-token");
          await saveLocalUser(user);
          setAuthState({ status: "authenticated", user });
          return;
        }
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {}
    await clearToken();
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
    setAuthState({ status: "unauthenticated" });
  }, []);

  const updateUser = useCallback(async (data: Partial<UserPublic>) => {
    try {
      const { user } = await api.auth.updateProfile(data);
      await saveLocalUser(user);
      setAuthState({ status: "authenticated", user });
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        const localUser = await getLocalUser();
        if (!localUser) throw new Error("No local user found");
        const user: UserPublic = { ...localUser, ...data, updatedAt: new Date().toISOString() };
        await saveLocalUser(user);
        setAuthState({ status: "authenticated", user });
        return;
      }
      throw err;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await api.auth.deleteAccount();
    } catch {}
    await clearToken();
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
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

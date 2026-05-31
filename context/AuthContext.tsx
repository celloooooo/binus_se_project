
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

// ── Helpers ──────────────────────────────────────────────────────
const USERS_KEY = 'users';

async function readUsers(): Promise<User[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Context types ────────────────────────────────────────────────
interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (form: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore last session on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('currentUser');
        if (raw) setCurrentUser(JSON.parse(raw));
      } catch {
        // no session saved — that's fine
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistSession = async (user: User | null) => {
    if (user) {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('currentUser');
    }
  };

  const login = useCallback(async (username: string, password: string) => {
    const users = await readUsers();
    // NOTE: passwords compared in plaintext because this is local-only storage.
    // Replace with Firebase Auth for production.
    const found = users.find(
      u => u.username === username && u.password === password
    );
    if (!found) throw new Error('Username atau password salah!');
    setCurrentUser(found);
    await persistSession(found);
  }, []);

  const register = useCallback(async (form: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const users = await readUsers();

    if (users.find(u => u.username === form.username)) {
      throw new Error('Username sudah digunakan!');
    }
    if (users.find(u => u.email === form.email)) {
      throw new Error('Email sudah digunakan!');
    }

    const newUser: User = {
      id: Date.now(),
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
      profileImage: null,
      coverImage: null,
      bio: '',
      cars: [],
      groups: [],
      stats: { badges: 0, posts: 0, followers: 0, following: 0 },
    };

    users.push(newUser);
    await writeUsers(users);
    setCurrentUser(newUser);
    await persistSession(newUser);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    AsyncStorage.removeItem('currentUser');
  }, []);

  // Patch currentUser + persist + update in users list
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    await persistSession(updated);

    const users = await readUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = updated;
      await writeUsers(users);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

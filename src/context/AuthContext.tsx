"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { isTokenExpired } from "@/utils/jwt"; // Ajusta la ruta según donde esté tu util

type User = {
  id: number;
  username: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const INACTIVITY_LIMIT = 5 * 60 * 1000;
const WARNING_TIME = 5 * 1000; // 5s antes del logout

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const activityHandlerRef = useRef<() => void>(() => {});

  // ---- LOGOUT ----
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("cart");
    setUser(null);

    window.dispatchEvent(new Event("clear-cart"));

    // Remover listeners
    const events = ["mousemove", "keydown", "click", "scroll"];
    if (activityHandlerRef.current) {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandlerRef.current)
      );
    }

    router.push("/");
  }, [router]);

  // ---- Actualizar timestamp de última actividad ----
  const updateLastActivity = useCallback(() => {
    if (!user) return;
    localStorage.setItem("lastActivity", Date.now().toString());
  }, [user]);

  // ---- Effect inicial (al abrir app) ----
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    // Si token expiró → logout inmediato
    if (isTokenExpired(storedToken)) {
      toast.info("Se cerró la sesión porque el token expiró");
      logout();
      router.push("/login");

      return;
    }

    const storedUserStr = localStorage.getItem("user");
    if (!storedUserStr) {
      logout();
      router.push("/login");

      return;
    }

    try {
      const storedUser = JSON.parse(storedUserStr);

      // Chequeo de inactividad (solo al reabrir)
      const lastActivityStr = localStorage.getItem("lastActivity");
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        const idleTime = Date.now() - lastActivity;
        if (idleTime > INACTIVITY_LIMIT) {
          toast.info("Se cerró la sesión por inactividad");
          logout();
          router.push("/login");

          return;
        } else if (idleTime > INACTIVITY_LIMIT - WARNING_TIME) {
          toast.warning(
            "Tu sesión expirará por inactividad en breve. Realiza alguna acción para mantenerla activa."
          );
        }
      }

      // Actualizar actividad al entrar
      localStorage.setItem("lastActivity", Date.now().toString());

      setUser(storedUser);
    } catch (e) {
      logout();
    }
  }, [logout, router]);

  // ---- Effect de listeners + timers de inactividad en tiempo real ----
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: NodeJS.Timeout | null = null;
    let warningTimer: NodeJS.Timeout | null = null;

    const resetTimers = () => {
      if (!user) return;
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);

      warningTimer = setTimeout(() => {
        toast.warning("Tu sesión expirará por inactividad en 5 segundos");
      }, INACTIVITY_LIMIT - WARNING_TIME);

      inactivityTimer = setTimeout(() => {
        toast.info("Se cerró la sesión por inactividad");
        logout();
        router.push("/login");
      }, INACTIVITY_LIMIT);
    };

    // Handler de actividad
    activityHandlerRef.current = () => {
      updateLastActivity();
      resetTimers();
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, activityHandlerRef.current)
    );

    // Iniciar timers al entrar
    resetTimers();

    // Cleanup
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandlerRef.current!)
      );
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [user, updateLastActivity, logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

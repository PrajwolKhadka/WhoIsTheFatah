"use client";

export interface StoredSession {
  code: string;
  playerId: string;
  name: string;
}

const KEY = "imposter-session";

export function saveSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

import { useState, useCallback } from 'react';
import { getSession, setSession, clearSession } from '../utils/session.js';

/**
 * Custom React hook for reactive admin session state.
 * Wraps session.js utilities and provides reactive state updates.
 *
 * @returns {{ isAuthenticated: boolean, login: () => void, logout: () => void }}
 */
export function useSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = getSession();
    return session.isAdmin;
  });

  /**
   * Sets the admin session to authenticated and updates reactive state.
   */
  const login = useCallback(() => {
    setSession(true);
    setIsAuthenticated(true);
  }, []);

  /**
   * Clears the admin session and updates reactive state.
   */
  const logout = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}

export default useSession;
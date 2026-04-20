/**
 * Session storage utilities for admin authentication state.
 * Uses sessionStorage with key 'hirehub_admin_auth'.
 * All access is wrapped in try/catch for resilience against
 * corrupted or unavailable storage.
 */

const SESSION_KEY = 'hirehub_admin_auth';

/**
 * Returns the current admin session state.
 * @returns {{ isAdmin: boolean }} Session state object
 */
export function getSession() {
  try {
    const value = sessionStorage.getItem(SESSION_KEY);
    return { isAdmin: value === 'true' };
  } catch (e) {
    return { isAdmin: false };
  }
}

/**
 * Sets the admin session state to authenticated.
 * @param {boolean} isAdmin - Whether the user is authenticated as admin
 * @returns {void}
 */
export function setSession(isAdmin) {
  try {
    if (isAdmin) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    // Silently fail — treat as logged out on next read
  }
}

/**
 * Clears the admin session state (logs out).
 * @returns {void}
 */
export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // Silently fail — storage may be unavailable
  }
}
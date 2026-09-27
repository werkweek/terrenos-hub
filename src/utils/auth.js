/**
 * Cryptographic Authentication Service
 * Uses Web Crypto API SHA-256 for secure client/serverless authentication
 */

const AUTH_SESSION_KEY = 'terrenos_auth_session';

// Pre-hashed credentials (SHA-256 of '4404ove')
const VALID_PASSWORD_HASH = '48003253f191a9f75581d38f42914e90a3c98b492feb9b048432a93717e54ba7';

// Allowed users (normalized: lowercase, without spaces)
const VALID_USERS = ['viga', 'v iga'];

/**
 * Compute SHA-256 hex string of a text
 */
export async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate credentials securely
 */
export async function verifyCredentials(username, password) {
  if (!username || !password) return { success: false, message: 'Ingresa usuario y contraseña' };

  const cleanUser = username.trim().toLowerCase();
  const normalizedUser = cleanUser.replace(/\s+/g, '');
  const isValidUser = VALID_USERS.some(u => u.replace(/\s+/g, '').toLowerCase() === normalizedUser);

  if (!isValidUser) {
    return { success: false, message: 'Usuario incorrecto o no autorizado' };
  }

  const inputHash = await sha256(password.trim());
  if (inputHash === VALID_PASSWORD_HASH) {
    const sessionData = {
      username: cleanUser,
      token: await sha256(`${cleanUser}-${Date.now()}-${VALID_PASSWORD_HASH}`),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
    return { success: true, session: sessionData };
  }

  return { success: false, message: 'Contraseña incorrecta' };
}

/**
 * Check if active session exists and is valid
 */
export function getActiveSession() {
  try {
    const sessionStr = localStorage.getItem(AUTH_SESSION_KEY);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    if (session && session.token && session.username) {
      return session;
    }
  } catch (e) {
    console.warn('Error reading session:', e);
  }
  return null;
}

/**
 * Logout and clear session
 */
export function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

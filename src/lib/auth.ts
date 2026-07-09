import { cookies } from 'next/headers';
import { getUserByEmail, User } from './db';

const SESSION_COOKIE_NAME = 'ppa_user_session';

/**
 * Retrieves the current logged in user based on the session cookie.
 * Can be called from Server Components, Server Actions, or Route Handlers.
 */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const email = sessionCookie.value;
    const user = await getUserByEmail(email);
    if (!user) return null;
    return user;
  } catch (error) {
    console.error('Error fetching session user:', error);
    return null;
  }
}

/**
 * Creates a new session by setting a cookie with the user's email.
 */
export async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

/**
 * Clears the session cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

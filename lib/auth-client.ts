'use client'

/**
 * Client-side auth helpers for checking sign-in state.
 * Uses Supabase session stored in localStorage.
 */

export interface UserSession {
  access_token: string
  user: {
    id: string
    email: string
    user_metadata?: {
      full_name?: string
      name?: string
    }
  }
}

/** Check if user is currently signed in */
export function isSignedIn(): boolean {
  if (typeof window === 'undefined') return false
  const session = localStorage.getItem('gsb_session')
  if (!session) return false
  try {
    const parsed = JSON.parse(session)
    return !!parsed?.access_token
  } catch {
    return false
  }
}

/** Get current user info */
export function getCurrentUser(): UserSession['user'] | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('gsb_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/** Get user email */
export function getUserEmail(): string | null {
  const user = getCurrentUser()
  return user?.email || null
}

/** Get user display name */
export function getUserName(): string | null {
  const user = getCurrentUser()
  return user?.user_metadata?.full_name || user?.user_metadata?.name || null
}

/** Sign out */
export function signOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('gsb_session')
  localStorage.removeItem('gsb_user')
}

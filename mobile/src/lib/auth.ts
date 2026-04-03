/**
 * Shared auth helpers for the mobile app
 * Used to gate actions behind sign-in and auto-track leads
 */
import { supabase } from './supabase'

/** Returns the current user or null */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

/** Returns true if a user is signed in */
export async function isSignedIn(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * After sign-in, auto-enroll the user in listing alerts for a city.
 * Silently fails — never blocks the user experience.
 */
export async function autoEnrollAlert(params: {
  email: string
  name: string
  city?: string
  source?: string
}) {
  try {
    const SITE_URL = 'https://www.gsbrealtor.com'
    await fetch(`${SITE_URL}/api/listing-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: params.email,
        name: params.name,
        cities: params.city ? [params.city] : ['Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan'],
        source: params.source || 'mobile_app_auto',
      }),
    })
  } catch {
    // Silent — never block the user
  }
}

/**
 * Submit a lead to the backend and Telegram/SMS/email pipeline.
 * Used when user contacts about a property.
 */
export async function submitLeadWithTracking(params: {
  name: string
  email: string
  phone?: string
  message: string
  type: string
  city?: string
  propertyAddress?: string
}) {
  try {
    const SITE_URL = 'https://www.gsbrealtor.com'
    await fetch(`${SITE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: params.name.split(' ')[0] || params.name,
        last_name: params.name.split(' ').slice(1).join(' ') || '',
        email: params.email,
        phone: params.phone || '',
        message: params.message,
        lead_type: params.type,
        source: 'mobile_app',
        property_address: params.propertyAddress || (params.city ? `${params.city}, UT` : ''),
      }),
    })
  } catch {
    // Silent — never block the user
  }
}

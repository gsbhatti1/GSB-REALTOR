/**
 * GSB REALTOR — SUPABASE CLIENT
 * Handles leads, saved searches, user accounts
 * 
 * NOTE: Uses lazy initialisation so the build doesn't crash when
 * NEXT_PUBLIC_SUPABASE_URL is not set (e.g. CI / Vercel build step).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Lazy singletons ──────────────────────────────────────────────────────────

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }
  _supabase = createClient(url, key)
  return _supabase
}

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || (!serviceKey && !anonKey)) {
    throw new Error('Supabase env vars not configured')
  }
  _supabaseAdmin = createClient(url, serviceKey || anonKey!)
  return _supabaseAdmin
}

// Backwards-compatible named exports (used by many files)
export const supabase      = new Proxy({} as SupabaseClient, { get: (_, prop) => (getSupabaseClient() as any)[prop] })
export const supabaseAdmin = new Proxy({} as SupabaseClient, { get: (_, prop) => (getSupabaseAdmin() as any)[prop] })

// -----------------------------------------------
// LEAD TYPES
// -----------------------------------------------

export type LeadType =
  | 'tour_request'
  | 'contact_form'
  | 'listing_inquiry'
  | 'market_report'
  | 'saved_search'
  | 'call_request'
  | 'investor_inquiry'

export interface Lead {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  lead_type: LeadType
  message?: string
  property_id?: string
  property_address?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  status?: 'new' | 'contacted' | 'qualified' | 'closed' | 'dead'
  created_at?: string
}

// -----------------------------------------------
// CONTACT (CRM) TYPES
// -----------------------------------------------

export interface Contact {
  id?: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  lane?: 'seller' | 'buyer' | 'investor' | 'commercial' | 'referral'
  status?: 'new' | 'active' | 'nurture' | 'closed' | 'dead'
  source?: string
  city?: string
  notes?: string
  next_followup_date?: string
  created_at?: string
  updated_at?: string
}

// -----------------------------------------------
// SAVE LEAD
// -----------------------------------------------

export async function saveLead(lead: Lead): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('leads')
      .insert({
        ...lead,
        status: 'new',
        source: lead.source || 'website',
      })

    if (error) {
      console.error('Error saving lead:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: any) {
    console.error('Supabase unavailable:', err.message)
    return { success: false, error: err.message }
  }
}

// -----------------------------------------------
// SAVE / GET CONTACTS (CRM)
// -----------------------------------------------

export async function saveContact(contact: Contact): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('contacts')
      .upsert({ ...contact, updated_at: new Date().toISOString() }, { onConflict: 'email' })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function getContacts(filters?: { lane?: string; status?: string; limit?: number }): Promise<Contact[]> {
  try {
    let query = getSupabaseAdmin().from('contacts').select('*').order('created_at', { ascending: false })
    if (filters?.lane)   query = query.eq('lane', filters.lane)
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.limit)  query = query.limit(filters.limit)

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

// -----------------------------------------------
// SAVE PROPERTY VIEW (analytics)
// -----------------------------------------------

export async function trackPropertyView(
  listingKey: string,
  sessionId: string
): Promise<void> {
  try {
    await getSupabaseAdmin()
      .from('property_views')
      .insert({
        listing_key: listingKey,
        session_id: sessionId,
        viewed_at: new Date().toISOString(),
      })
  } catch {
    // fire and forget — never crash on analytics
  }
}

/**
 * GSB REALTOR — SUPABASE CLIENT
 * Handles leads, saved searches, user accounts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side (browser) — limited permissions
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side — full permissions (API routes only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

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
// SAVE LEAD
// -----------------------------------------------

export async function saveLead(lead: Lead): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
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
}

// -----------------------------------------------
// SAVE PROPERTY VIEW (analytics)
// -----------------------------------------------

export async function trackPropertyView(
  listingKey: string,
  sessionId: string
): Promise<void> {
  await supabaseAdmin
    .from('property_views')
    .insert({
      listing_key: listingKey,
      session_id: sessionId,
      viewed_at: new Date().toISOString(),
    })
    .then(() => {}) // fire and forget
}

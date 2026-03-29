/**
 * GSB REALTOR — ADMIN LEADS API
 * Returns all leads for the admin dashboard
 * Protected by Supabase service role key
 */

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) throw error

    return NextResponse.json({ leads: leads || [] })
  } catch (error) {
    console.error('Admin leads error:', error)
    return NextResponse.json({ leads: [], error: 'Failed to fetch leads' }, { status: 500 })
  }
}

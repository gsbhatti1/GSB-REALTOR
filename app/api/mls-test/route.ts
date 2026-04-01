import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const TOKEN = process.env.WFRMLS_BEARER_TOKEN
  if (!TOKEN) return NextResponse.json({ error: 'No WFRMLS token', env_keys: Object.keys(process.env).filter(k => k.includes('WFRMLS')) })
  
  try {
    const url = new URL('https://resoapi.utahrealestate.com/reso/odata/Property')
    url.searchParams.set('$top', '3')
    url.searchParams.set('$select', 'ListingKey,ListPrice,City,StandardStatus')
    url.searchParams.set('$filter', "StandardStatus eq 'Active'")
    
    const res = await fetch(url.toString(), {
      headers: { Authorization: TOKEN, Accept: 'application/json' },
      cache: 'no-store'
    })
    
    const text = await res.text()
    return NextResponse.json({ 
      httpStatus: res.status,
      tokenPreview: TOKEN.substring(0, 8) + '...',
      response: text.substring(0, 500)
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}

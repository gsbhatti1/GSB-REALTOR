import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const TOKEN = process.env.WFRMLS_BEARER_TOKEN

export async function GET(request: NextRequest) {
  const listingKey = request.nextUrl.searchParams.get('key')
  if (!listingKey || !TOKEN) return NextResponse.json({ media: [] })

  try {
    const url = new URL('https://resoapi.utahrealestate.com/reso/odata/Media')
    url.searchParams.set('$filter', `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property'`)
    url.searchParams.set('$select', 'MediaURL,Order,MediaKey')
    url.searchParams.set('$top', '25')
    url.searchParams.set('$orderby', 'Order asc')

    const res = await fetch(url.toString(), {
      headers: { Authorization: TOKEN, Accept: 'application/json' },
      cache: 'no-store'
    })

    if (!res.ok) return NextResponse.json({ media: [] })
    const data = await res.json()
    return NextResponse.json({ media: data.value || [] })
  } catch {
    return NextResponse.json({ media: [] })
  }
}

import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const TOKEN = process.env.WFRMLS_BEARER_TOKEN
  if (!TOKEN) return NextResponse.json({ error: 'No token' })
  
  // Test 1: Minimal query
  const tests = [
    "https://resoapi.utahrealestate.com/reso/odata/Property?$top=2&$select=ListingKey,ListPrice,City",
    "https://resoapi.utahrealestate.com/reso/odata/Property?$top=2&$filter=StandardStatus+eq+'Active'&$select=ListingKey,ListPrice,City",
    "https://resoapi.utahrealestate.com/reso/odata/Property?$top=2&$count=true&$filter=StandardStatus+eq+'Active'&$select=ListingKey,ListPrice,City",
  ]
  
  const results = []
  for (const url of tests) {
    const res = await fetch(url, { headers: { Authorization: TOKEN, Accept: 'application/json' }, cache: 'no-store' })
    const body = await res.text()
    results.push({ url: url.substring(60), status: res.status, body: body.substring(0, 300) })
  }
  
  return NextResponse.json(results)
}

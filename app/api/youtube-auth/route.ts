/**
 * GSB Realtor — YouTube OAuth Handler
 * 
 * GET /api/youtube-auth          → redirects to Google OAuth consent screen
 * GET /api/youtube-auth?code=... → exchanges code for tokens, saves refresh token
 */

import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = 'https://gsbrealtor.com/api/youtube-auth'
const SCOPES = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Step 1: No code yet — redirect to Google OAuth
  if (!code && !error) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', SCOPES)
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')

    return NextResponse.redirect(authUrl.toString())
  }

  // Step 2: Error from Google
  if (error) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px">
        <h2>❌ Authorization Error</h2>
        <p>${error}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Step 3: Exchange code for tokens
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code!,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.refresh_token) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px">
          <h2>⚠️ No Refresh Token</h2>
          <p>Google didn't return a refresh token. This usually means the account already authorized this app.</p>
          <p>Try visiting <a href="/api/youtube-auth">/api/youtube-auth</a> again — it will force a new consent screen.</p>
          <pre>${JSON.stringify(tokens, null, 2)}</pre>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    const refreshToken = tokens.refresh_token

    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:600px">
        <h2>✅ YouTube Authorization Successful!</h2>
        <p>GSB Realtor is now connected to YouTube.</p>
        <hr/>
        <h3>⚠️ Copy this Refresh Token and save it:</h3>
        <code style="background:#f0f0f0;padding:12px;display:block;word-break:break-all;font-size:12px">${refreshToken}</code>
        <p style="color:#666;font-size:14px">Add this as <strong>YOUTUBE_REFRESH_TOKEN</strong> in your Vercel environment variables.</p>
        <hr/>
        <p>Full token data:</p>
        <pre style="font-size:11px;background:#f5f5f5;padding:12px;overflow:auto">${JSON.stringify(tokens, null, 2)}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )

  } catch (err: any) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px">
        <h2>❌ Token Exchange Failed</h2>
        <pre>${err.message}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

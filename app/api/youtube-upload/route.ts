/**
 * GSB Realtor — YouTube Upload API
 * 
 * POST /api/youtube-upload
 * Body: { video_url, title, description }
 * 
 * Downloads video from HeyGen URL, uploads to YouTube channel.
 * Called by n8n webhook after HeyGen video is ready.
 */

import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token
}

async function uploadToYouTube(
  accessToken: string,
  videoBuffer: ArrayBuffer,
  title: string,
  description: string
): Promise<string> {
  const metadata = {
    snippet: {
      title: title.substring(0, 100),
      description: description.substring(0, 5000),
      categoryId: '22',
      tags: ['Utah Real Estate', 'GSB Realtor', 'Homes for Sale', 'Gurpreet Singh', 'West Jordan Utah'],
    },
    status: {
      privacyStatus: 'public',
    },
  }

  // Initialize resumable upload
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': videoBuffer.byteLength.toString(),
      },
      body: JSON.stringify(metadata),
    }
  )

  if (!initRes.ok) {
    const err = await initRes.text()
    throw new Error(`Upload init failed (${initRes.status}): ${err}`)
  }

  const uploadUrl = initRes.headers.get('Location')
  if (!uploadUrl) throw new Error('No upload URL returned from YouTube')

  // Upload the video
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.byteLength.toString(),
    },
    body: videoBuffer,
  })

  if (!uploadRes.ok && uploadRes.status !== 201) {
    const err = await uploadRes.text()
    throw new Error(`Upload failed (${uploadRes.status}): ${err.substring(0, 500)}`)
  }

  const result = await uploadRes.json()
  return result.id
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'YOUTUBE_REFRESH_TOKEN not configured. Visit /api/youtube-auth to authorize.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { video_url, title, description } = body

    if (!video_url) {
      return NextResponse.json({ error: 'video_url is required' }, { status: 400 })
    }

    const videoTitle = title || 'New Property Tour — GSB Realtor Utah'
    const videoDesc = description || `Check out this property from GSB Realtor!\n\n📞 Call Gurpreet Singh: 801-635-8462\n🌐 Visit: https://gsbrealtor.com\n\n#UtahRealEstate #GSBRealtor #HomesForSale`

    console.log(`[YouTube Upload] Downloading video from HeyGen...`)

    // Download video from HeyGen
    const videoRes = await fetch(video_url)
    if (!videoRes.ok) throw new Error(`Failed to download video: ${videoRes.status}`)

    const videoBuffer = await videoRes.arrayBuffer()
    const sizeMB = (videoBuffer.byteLength / 1024 / 1024).toFixed(1)
    console.log(`[YouTube Upload] Downloaded ${sizeMB}MB, getting access token...`)

    // Get fresh access token
    const accessToken = await getAccessToken(refreshToken)
    console.log(`[YouTube Upload] Got access token, uploading to YouTube...`)

    // Upload to YouTube
    const videoId = await uploadToYouTube(accessToken, videoBuffer, videoTitle, videoDesc)
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`

    console.log(`[YouTube Upload] ✅ Success! Video ID: ${videoId}`)

    // Send confirmation email via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'GSB Realtor <noreply@gsbrealtor.com>',
          to: 'gsbhatti1@yahoo.com',
          subject: `✅ New YouTube Video Published — ${videoTitle}`,
          html: `
            <h2>Your new GSB Realtor video is live on YouTube!</h2>
            <p><strong>${videoTitle}</strong></p>
            <p><a href="${youtubeUrl}" style="background:#d4a843;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold">▶ Watch on YouTube</a></p>
            <p style="color:#666;font-size:14px">Video ID: ${videoId}<br/>Channel: https://www.youtube.com/@GSBRealtorUtah</p>
          `,
        }),
      })
    } catch (emailErr) {
      console.error('[YouTube Upload] Email notification failed:', emailErr)
    }

    return NextResponse.json({
      success: true,
      video_id: videoId,
      youtube_url: youtubeUrl,
      title: videoTitle,
      size_mb: sizeMB,
    })

  } catch (error: any) {
    console.error('[YouTube Upload] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

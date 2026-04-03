import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'

const UTAH_CITY_SLUGS = [
  'salt-lake-city','west-jordan','sandy','south-jordan','taylorsville',
  'murray','provo','orem','ogden','layton','st-george','logan',
  'draper','herriman','riverton','lehi','west-valley-city','millcreek',
  'cottonwood-heights','midvale','bountiful','holladay','springville',
  'spanish-fork','payson','clearfield','syracuse','farmington','kaysville',
  'clinton','north-salt-lake','woods-cross','centerville','bluffdale',
  'saratoga-springs','eagle-mountain','american-fork','highland','alpine',
  'cedar-city','washington','ivins','santa-clara','hurricane','moab',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gsbrealtor.com'
  const now = new Date().toISOString()

  // ── Core Pages ──────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0, lastModified: now },
    { url: `${baseUrl}/search`, changeFrequency: 'hourly', priority: 0.9, lastModified: now },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sell`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/commercial`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/investor`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/valuation`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/testimonials`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/track-record`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/team`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/market`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/market-reports`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // ── Language Pages ──────────────────────────────────
  const langPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/es`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pa`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ar`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/zh`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/vi`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/fa`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pt`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // ── City Market Pages (45+) ─────────────────────────
  const cityPages: MetadataRoute.Sitemap = UTAH_CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/market/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
    lastModified: now,
  }))

  // ── City Sell Pages ─────────────────────────────────
  const sellPages: MetadataRoute.Sitemap = UTAH_CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/sell/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ── Blog Posts ──────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: post.dateISO,
  }))

  return [
    ...staticPages,
    ...langPages,
    ...cityPages,
    ...sellPages,
    ...blogPages,
  ]
}

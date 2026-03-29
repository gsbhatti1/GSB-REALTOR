import { MetadataRoute } from 'next'

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

  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/search`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/investor`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/valuation`, changeFrequency: 'weekly' as const, priority: 0.9 },
  ]

  const cityPages = UTAH_CITY_SLUGS.map(slug => ({
    url: `${baseUrl}/market/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...cityPages]
}

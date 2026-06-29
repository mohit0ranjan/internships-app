import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/'], // Disallow crawling of internal dashboards
    },
    sitemap: 'https://internships.csdac.in/sitemap.xml',
  }
}

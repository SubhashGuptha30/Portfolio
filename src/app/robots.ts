import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/studio/', // Disallow Sanity Studio
        },
        sitemap: 'https://subhashguptha.online/sitemap.xml', // Replace with actual domain
    }
}

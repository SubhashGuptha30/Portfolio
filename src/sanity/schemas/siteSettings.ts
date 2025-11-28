export const siteSettings = {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
        },
        {
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'heroTagline',
            title: 'Hero Tagline',
            type: 'string',
        },
        {
            name: 'heroSummary',
            title: 'Hero Summary',
            type: 'text',
        },
        {
            name: 'aboutText',
            title: 'About Text',
            type: 'text',
        },
        {
            name: 'resume',
            title: 'Resume',
            type: 'file',
            description: 'Upload your resume (PDF recommended)',
        },
        {
            name: 'socialLinks',
            title: 'Social Links',
            type: 'object',
            fields: [
                { name: 'github', title: 'GitHub URL', type: 'url' },
                { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
                { name: 'email', title: 'Email', type: 'string' },
            ],
        },
        {
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            description: 'Overrides the default page title',
        },
        {
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            description: 'Meta description for search engines',
        },
        {
            name: 'seoKeywords',
            title: 'SEO Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Keywords for search engines',
        },
        {
            name: 'ogImage',
            title: 'Open Graph Image',
            type: 'image',
            description: 'Image displayed when sharing on social media',
            options: {
                hotspot: true,
            },
        },
    ],
}

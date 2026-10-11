export const project = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        {
            name: 'order',
            title: 'Display Order',
            description: 'Lower numbers appear first',
            type: 'number',
        },
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
        },
        {
            name: 'longDescription',
            title: 'Long Description',
            type: 'text',
        },
        {
            name: 'highlights',
            title: 'Key Numbers',
            description: 'Up to 3 short stats shown on the project card, e.g. 0.888 / AUROC',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'value', title: 'Value', type: 'string' },
                    { name: 'label', title: 'Label', type: 'string' },
                ],
            }],
            validation: (Rule: any) => Rule.max(3),
        },
        {
            name: 'technologies',
            title: 'Technologies',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'demoUrl',
            title: 'Demo URL',
            type: 'url',
        },
        {
            name: 'codeUrl',
            title: 'Code URL',
            type: 'url',
        },
        {
            name: 'thumbnailImage',
            title: 'Thumbnail Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'demoMedia',
            title: 'Demo Media',
            type: 'array',
            of: [
                { type: 'image', options: { hotspot: true } },
                { type: 'file', title: 'Video', options: { accept: 'video/*' } }
            ]
        },
    ],
}

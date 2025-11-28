export const project = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
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

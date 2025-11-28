export const certification = {
    name: 'certification',
    title: 'Certification',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'provider',
            title: 'Provider',
            type: 'string',
        },
        {
            name: 'issueDate',
            title: 'Issue Date',
            type: 'date',
        },
        {
            name: 'certificateImage',
            title: 'Certificate Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'verificationUrl',
            title: 'Verification URL',
            type: 'url',
        },
    ],
}

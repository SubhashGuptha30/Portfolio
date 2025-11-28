export const skill = {
    name: 'skill',
    title: 'Skill',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Frontend', value: 'frontend' },
                    { title: 'Backend', value: 'backend' },
                    { title: 'Database', value: 'database' },
                    { title: 'Languages', value: 'languages' },
                    { title: 'Tools', value: 'tools' },
                    { title: 'Cloud', value: 'cloud' },
                    { title: 'Mobile', value: 'mobile' },
                    { title: 'Design', value: 'design' },
                    { title: 'Soft Skills', value: 'soft-skills' },
                    { title: 'Other', value: 'other' },
                ],
            },
        },

    ],
}

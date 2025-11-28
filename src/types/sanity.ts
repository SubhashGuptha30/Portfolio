export interface SanityImage {
    asset: {
        _ref: string;
        _type: string;
    };
    _type: 'image';
}

export interface SanityFile {
    asset: {
        _ref: string;
        _type: string;
        url: string;
    };
    _type: 'file';
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    email?: string;
}

export interface SiteSettings {
    name: string;
    role: string;
    heroImage: SanityImage;
    heroTagline: string;
    heroSummary: string;
    aboutText: string;
    resumeUrl: string;
    socialLinks: SocialLinks;
}

export interface Project {
    _id: string;
    title: string;
    slug: { current: string };
    shortDescription: string;
    longDescription: string;
    technologies: string[];
    demoUrl?: string;
    codeUrl?: string;
    thumbnailImage: SanityImage;
    demoMedia?: Array<{
        _type: 'image' | 'file';
        url: string;
        asset: any;
    }>;
}

export interface Skill {
    _id: string;
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'languages' | 'tools' | 'cloud' | 'mobile' | 'design' | 'soft-skills' | 'other';
    icon?: SanityImage;
}

export interface Experience {
    _id: string;
    role: string;
    organization: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
}

export interface Certification {
    _id: string;
    title: string;
    provider: string;
    issueDate: string;
    certificateImage: SanityImage;
    verificationUrl?: string;
}

export interface Achievement {
    _id: string;
    title: string;
    description: string;
    date: string;
}

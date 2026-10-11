import Studio from './Studio'

export const dynamic = 'force-static'

export function generateStaticParams() {
    return [{ index: [] }]
}

export default function StudioPage() {
    return <Studio />
}

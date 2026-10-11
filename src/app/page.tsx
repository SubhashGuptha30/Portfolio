import { client } from '@/lib/sanity'
import { fetchHomeData } from '@/lib/homeData'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  return <HomeClient initialData={await fetchHomeData(client)} />
}

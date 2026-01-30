import { Hero } from '../components/hero'
import { Products } from '../components/products'

export const revalidate = 60 

export default function HomePage() {
  return (
    <div className="bg-black">
      <Hero />   
      <Products />
    </div>
  )
}

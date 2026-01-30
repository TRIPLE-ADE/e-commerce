import Link from 'next/link'
import { Package, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 border border-white/10">
            <Package size={40} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white">404</h1>
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-zinc-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
          >
            <Home size={18} />
            Go home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors border border-white/10 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}

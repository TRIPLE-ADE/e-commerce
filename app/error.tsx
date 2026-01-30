'use client'

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={40} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
          <p className="text-zinc-500">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p className="text-xs text-red-400 font-mono mt-4 p-3 bg-red-500/10 rounded border border-red-500/20">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors border border-white/10 flex items-center gap-2"
          >
            <Home size={18} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

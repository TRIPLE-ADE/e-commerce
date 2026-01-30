import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Success } from './success'


export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="text-emerald-500 animate-spin" size={48} />
            </div>
        }>
            <Success />
        </Suspense>
    )
}

'use client'

export const ProductSkeleton = () => {
    return (
        <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-zinc-900" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-6 w-3/4 bg-zinc-900 rounded-md" />
                    <div className="h-4 w-10 bg-zinc-900 rounded-md" />
                </div>
                <div className="h-5 w-1/4 bg-zinc-900 rounded-md" />
                <div className="flex gap-2 pt-2">
                    <div className="h-10 flex-1 bg-zinc-900 rounded-xl" />
                    <div className="h-10 w-10 bg-zinc-900 rounded-xl" />
                </div>
            </div>
        </div>
    )
}

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count} gap-8`}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    )
}

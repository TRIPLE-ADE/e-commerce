export function CollectionSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-32 space-y-24">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="h-20 w-64 bg-zinc-900 rounded-lg mx-auto animate-pulse" />
                <div className="h-6 w-96 bg-zinc-900 rounded-lg mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[600px]">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-full h-full rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 animate-pulse"
                    />
                ))}
            </div>
        </div>
    )
}
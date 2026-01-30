import type { CartItem } from '@/types/cart';

export function mergeCarts(localItems: CartItem[], cloudItems: CartItem[]): CartItem[] {
    if (localItems.length === 0) return cloudItems;
    if (cloudItems.length === 0) return localItems;

    const mergedMap = new Map<string, CartItem>();

    // Load cloud items as the base
    cloudItems.forEach(item => {
        const key = `${item.id}-${item.variant || 'default'}`;
        mergedMap.set(key, { ...item });
    });

    // Merge local items into the map
    localItems.forEach(localItem => {
        const key = `${localItem.id}-${localItem.variant || 'default'}`;
        const existing = mergedMap.get(key);

        if (existing) {
            const localTimeStamp = localItem.updatedAt;
            const cloudTimeStamp = existing.updatedAt;

            if (!localTimeStamp || !cloudTimeStamp) {
                mergedMap.set(key, { ...localItem });
                return;
            }

            const localGreater = localTimeStamp > cloudTimeStamp;
            const equal = localTimeStamp === cloudTimeStamp;

            // Fresher timestamp wins
            if (localGreater || (equal && localItem.quantity > existing.quantity)) {
                mergedMap.set(key, { ...localItem });
            }
        } else {
            mergedMap.set(key, { ...localItem });
        }
    });

    return Array.from(mergedMap.values());
}

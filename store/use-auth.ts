import { create } from 'zustand'

interface AuthStore {
    isAuthOpen: boolean
    setIsAuthOpen: (open: boolean) => void
    authView: 'login' | 'signup'
    setAuthView: (view: 'login' | 'signup') => void

    // Future auth state
    isAuthenticated: boolean
    user: { email: string; name?: string } | null
    login: (email: string) => void
    logout: () => void
}

export const useAuth = create<AuthStore>((set) => ({
    isAuthOpen: false,
    setIsAuthOpen: (open) => set({ isAuthOpen: open }),
    authView: 'login',
    setAuthView: (view) => set({ authView: view }),

    isAuthenticated: false,
    user: null,
    login: (email) => set({
        isAuthenticated: true,
        user: { email, name: email.split('@')[0] },
        isAuthOpen: false
    }),
    logout: () => set({
        isAuthenticated: false,
        user: null
    })
}))

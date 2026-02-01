
import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthStore {
    user: FirebaseUser | null;
    setUser: (user: FirebaseUser | null) => void;
}

export const useAuth = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));

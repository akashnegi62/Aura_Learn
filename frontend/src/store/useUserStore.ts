import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserState {
  user: User | null;
  isLoading: boolean;
  anonymousQuiz: Record<string, unknown> | null;
  anonymousFlashcards: Record<string, unknown>[] | null;
  setUser: (user: User | null) => void;
  setAnonymousQuiz: (quiz: Record<string, unknown> | null) => void;
  setAnonymousFlashcards: (cards: Record<string, unknown>[] | null) => void;
  initializeUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  anonymousQuiz: null,
  anonymousFlashcards: null,
  setUser: (user) => set({ user }),
  setAnonymousQuiz: (quiz) => set({ anonymousQuiz: quiz }),
  setAnonymousFlashcards: (cards) => set({ anonymousFlashcards: cards }),
  initializeUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, isLoading: false });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });
    } catch (error) {
      console.error("Failed to initialize user session:", error);
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

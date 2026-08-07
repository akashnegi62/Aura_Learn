"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeUser = useUserStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return <>{children}</>;
}

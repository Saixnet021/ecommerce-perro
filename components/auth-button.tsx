'use client';

import { useAuth } from '@/store/auth';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-900 font-medium flex items-center gap-2 hidden md:flex">
          <UserIcon className="w-4 h-4" />
          {user.displayName || user.email }
        </span>
        <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
          <LogOut className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Salir</span>
        </Button>
      </div>
    );
  }

  return (
    <Link href="/auth">
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all hover:scale-105"
        size="sm"
      >
        <UserIcon className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Iniciar Sesión</span>
        <span className="md:hidden">Login</span>
      </Button>
    </Link>
  );
}

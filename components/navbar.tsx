'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from './auth-button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 rounded-2xl max-w-4xl w-[calc(100%-2rem)] ${isScrolled ? 'bg-gray-100/95 backdrop-blur-md py-2 shadow-xl mt-4 border border-gray-300' : 'bg-gray-100 py-3 mt-3 shadow-lg border border-gray-300'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 md:w-12 md:h-12 relative">
              <Image
                src="/pedro.jpeg"
                alt="PEDRO SMS Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-base md:text-lg font-bold block text-gray-900">PEDRO SMS</span>
              <span className="text-[10px] md:text-xs text-blue-700 hidden sm:block">Explora Nuestros Productos</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/#productos" className="text-gray-900 hover:text-blue-700 transition-colors text-xs md:text-sm font-medium">
              Catálogo
            </Link>
            {user && (
              <Link href="/admin" className="flex items-center gap-1 text-gray-900 hover:text-blue-700 transition-colors text-xs md:text-sm font-medium">
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                Admin
              </Link>
            )}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

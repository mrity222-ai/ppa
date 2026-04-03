'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'News', href: '/news' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const logoImg = PlaceHolderImages.find(img => img.id === 'ppa-logo');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300 border-b',
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'
    )}>
      <div className="responsive-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl shadow-sm bg-primary/5 p-1 border border-primary/10">
              <ShieldCheck className="w-full h-full text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-slate-900 font-headline leading-none">PPA Lucknow</span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Pensioners Association</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-bold rounded-full transition-all',
                  pathname === link.href 
                    ? 'text-primary bg-primary/5' 
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none rounded-full px-5 font-bold shadow-md">
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Join WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'lg:hidden bg-white border-t transition-all duration-300 overflow-hidden',
        isOpen ? 'max-h-[500px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
      )}>
        <div className="responsive-container flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-6 py-3 rounded-xl text-base font-bold transition-all',
                pathname === link.href ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t flex flex-col gap-3">
            <Button asChild className="w-full h-12 rounded-xl bg-[#25D366] font-bold">
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Join WhatsApp Group
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

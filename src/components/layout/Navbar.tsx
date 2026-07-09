'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, ShieldCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { apiGateway, Notice } from '@/lib/apiClient';

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

  const [notices, setNotices] = useState<Notice[]>([]);
  const [showNotices, setShowNotices] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadNotices() {
      try {
        const list = await apiGateway.getNotices();
        setNotices(list);
        
        // Count unread notices from localStorage history of read notices
        const readIds = JSON.parse(localStorage.getItem('ppa_read_notices') || '[]');
        const unread = list.filter(n => !readIds.includes(n.id.toString()));
        setUnreadCount(unread.length);
      } catch (err) {
        console.error('Failed to load notices in navbar:', err);
      }
    }
    loadNotices();
  }, []);

  const handleToggleNotices = () => {
    setShowNotices(!showNotices);
    if (!showNotices) {
      // Mark all as read
      const readIds = notices.map(n => n.id.toString());
      localStorage.setItem('ppa_read_notices', JSON.stringify(readIds));
      setUnreadCount(0);
    }
  };

  const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbCGfvKBVJlD3Aj4hV0y';

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

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 relative">
            {/* Notices Bell Icon */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative border border-slate-200 hover:bg-slate-50"
                onClick={handleToggleNotices}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {showNotices && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <span className="font-bold text-slate-800 text-sm">Notice Board / सूचना पट्ट</span>
                    <span className="text-xs text-muted-foreground">{notices.length} notices</span>
                  </div>
                  {notices.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notices posted / कोई सूचना नहीं है</p>
                  ) : (
                    <div className="space-y-3">
                      {notices.map((n) => (
                        <div key={n.id} className="border-b last:border-0 pb-3 last:pb-0 space-y-2">
                          <div className="space-y-1">
                            <p className="font-bold text-xs text-slate-800">{n.title}</p>
                            <p className="text-[11px] text-slate-600 leading-normal">{n.content}</p>
                          </div>

                          {n.photo_url && (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                              <img src={n.photo_url} alt="Notice Image" className="object-cover w-full h-full" />
                            </div>
                          )}

                          {(n.date || n.time || n.day) && (
                            <div className="bg-slate-50 p-2 rounded-xl border text-[10px] text-slate-600 font-medium space-y-0.5">
                              {n.date && <div>📅 Date: {n.date} {n.day ? `(${n.day})` : ''}</div>}
                              {n.time && <div>⏰ Time: {n.time}</div>}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            {n.file_url && (
                              <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[10px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                                <a href={n.file_url} target="_blank" rel="noopener noreferrer" download>
                                  📥 Download Doc
                                </a>
                              </Button>
                            )}
                            {n.link_url && (
                              <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[10px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                                <a href={n.link_url} target="_blank" rel="noopener noreferrer">
                                  🔗 Open Link
                                </a>
                              </Button>
                            )}
                          </div>

                          <p className="text-[8px] text-slate-400">
                            📅 Posted: {n.created_at ? n.created_at.split(' ')[0] : 'Today'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-full px-5 font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all">
              <Link href="/join">Join</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none rounded-full px-5 font-bold shadow-md">
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Join WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile Bell and Toggle */}
          <div className="flex items-center gap-2 lg:hidden relative">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative border border-slate-200"
                onClick={handleToggleNotices}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {showNotices && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <span className="font-bold text-slate-800 text-xs">Notice Board</span>
                    <span className="text-[10px] text-muted-foreground">{notices.length} notices</span>
                  </div>
                  {notices.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-4">No notices</p>
                  ) : (
                    <div className="space-y-3">
                      {notices.map((n) => (
                        <div key={n.id} className="border-b last:border-0 pb-3 last:pb-0 space-y-2">
                          <div className="space-y-1">
                            <p className="font-bold text-[11px] text-slate-800">{n.title}</p>
                            <p className="text-[10px] text-slate-600 leading-normal">{n.content}</p>
                          </div>

                          {n.photo_url && (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                              <img src={n.photo_url} alt="Notice Image" className="object-cover w-full h-full" />
                            </div>
                          )}

                          {(n.date || n.time || n.day) && (
                            <div className="bg-slate-50 p-2 rounded-xl border text-[9px] text-slate-600 font-medium space-y-0.5">
                              {n.date && <div>📅 Date: {n.date} {n.day ? `(${n.day})` : ''}</div>}
                              {n.time && <div>⏰ Time: {n.time}</div>}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            {n.file_url && (
                              <Button asChild size="sm" variant="outline" className="h-6 px-2.5 text-[9px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                                <a href={n.file_url} target="_blank" rel="noopener noreferrer" download>
                                  📥 Download Doc
                                </a>
                              </Button>
                            )}
                            {n.link_url && (
                              <Button asChild size="sm" variant="outline" className="h-6 px-2.5 text-[9px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                                <a href={n.link_url} target="_blank" rel="noopener noreferrer">
                                  🔗 Open Link
                                </a>
                              </Button>
                            )}
                          </div>

                          <p className="text-[8px] text-slate-400">
                            📅 Posted: {n.created_at ? n.created_at.split(' ')[0] : 'Today'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
            <Button asChild variant="outline" className="w-full h-12 rounded-xl border-2 border-primary/20 text-primary font-bold">
              <Link href="/join" onClick={() => setIsOpen(false)}>Join</Link>
            </Button>
            <Button asChild className="w-full h-12 rounded-xl bg-[#25D366] font-bold">
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Join WhatsApp Group
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
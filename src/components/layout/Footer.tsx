import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Twitter, Instagram, MapPin, 
  Phone, Mail, Heart, ChevronRight, ShieldCheck 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-white text-slate-900 border-t rounded-t-[3rem] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="responsive-container py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary shadow-lg red-glow">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900">PPA Lucknow</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Community Care</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Dedicated to the welfare, dignity, and care of retired government employees across Uttar Pradesh.
            </p>
            <div className="flex items-center gap-2 font-bold text-xs italic text-primary">
              <Heart className="w-4 h-4 fill-current animate-pulse text-rose-500" />
              <span className="bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent">Serving seniors since 2025</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'News', 'Events', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '') === 'home' ? '' : item.toLowerCase().replace(' ', '')}`} className="group flex items-center text-slate-500 font-bold text-sm hover:text-primary transition-all">
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {['Become a Member', 'Volunteer Support', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center text-slate-500 font-bold text-sm hover:text-primary transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  G1/0049, Olive Wood Villa, Golf City, Lucknow, UP – 226002
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-sm font-bold">+91 9532341000</p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all hover:scale-110 border">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-8 border-t">
        <div className="responsive-container text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Prantiya Pensioners Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

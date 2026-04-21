import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Twitter, Instagram, MapPin, 
  Phone, Mail, Heart, ChevronRight, ShieldCheck 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-white text-slate-900 border-t rounded-t-[3rem] overflow-hidden mt-12">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px] -z-10" />
      
      <div className="responsive-container py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary shadow-2xl shadow-primary/30 transition-transform group-hover:scale-110 duration-500">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-headline leading-none">PPA Lucknow</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Community Care</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Prantiya Pensioners Association (PPA) is dedicated to the welfare, dignity, and care of retired government employees across Uttar Pradesh.
            </p>
            <div className="flex items-center gap-2 font-bold text-xs italic text-primary group cursor-default">
              <Heart className="w-4 h-4 fill-current animate-pulse text-rose-500 group-hover:scale-125 transition-transform" />
              <span className="bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent">Helping our elderly since 2025</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold relative inline-block text-slate-900">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'News', 'Events', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                    className="group flex items-center text-slate-500 font-bold text-sm hover:text-primary transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold relative inline-block text-slate-900">
              Support & Help
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Volunteer Support', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center text-slate-500 font-bold text-sm hover:text-primary transition-all duration-300 border-b border-transparent hover:border-primary/20 pb-1">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold relative inline-block text-slate-900">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider pt-1">
                  House No. 9, Semara, Chinhat, Gomti Nagar, Lucknow – 226028 Uttar Pradesh, India
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-sm font-bold">+91 99352 12121</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-sm font-bold">info@upppa.org</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-11 h-11 rounded-full bg-white backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-50/80 backdrop-blur-sm py-8 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="responsive-container flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 Prantiya Pensioners Association. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

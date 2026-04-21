'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, MapPin, Users, ArrowRight, Activity, 
  Target, ShieldCheck, Sparkles, Clock, ImageIcon 
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImg1 = PlaceHolderImages.find(img => img.id === 'hero-collage-1');
  const heroImg2 = PlaceHolderImages.find(img => img.id === 'hero-collage-2');
  const heroImg3 = PlaceHolderImages.find(img => img.id === 'hero-collage-3');
  const aboutImg = PlaceHolderImages.find(img => img.id === 'about-img');
  
  const newsItems = [
    {
      date: 'June 12, 2025',
      title: 'Pension Revision Notice — Important Update',
      category: 'Pension',
      image: PlaceHolderImages.find(img => img.id === 'news-1')?.imageUrl || '',
      description: 'The state government has issued a new notification regarding pension revision.'
    },
    {
      date: 'June 5, 2025',
      title: 'Our Team Expands to 500+ Members',
      category: 'Growth',
      image: PlaceHolderImages.find(img => img.id === 'news-2')?.imageUrl || '',
      description: 'We are proud to reach a new milestone of active members across UP.'
    }
  ];

  const galleryItems = PlaceHolderImages.filter(img => img.id.startsWith('gallery-')).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden py-12 lg:py-0">
          <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
          
          <div className="responsive-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Established 2025 | Lucknow, UP</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                    <span className="block font-headline text-slate-900 leading-none">प्रांतीय पेंशनर्स एसोसिएशन PPA Lucknow</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-primary font-bold italic font-headline">
                    "सेवा से सम्मान तक – हम आपके साथ हैं"
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-sm p-6 md:p-8 rounded-[2rem] max-w-xl mx-auto lg:mx-0">
                  <p className="text-lg leading-relaxed text-slate-700 font-medium">
                    A dedicated organization for protecting the rights and dignity of retired government employees of Uttar Pradesh.
                  </p>
                  <div className="h-px w-12 bg-primary/30 my-4 mx-auto lg:mx-0"></div>
                  <p className="text-sm text-slate-500 leading-relaxed font-body">
                    उत्तर प्रदेश के सेवानिवृत्त सरकारी कर्मचारियों के अधिकारों और सम्मान की रक्षा के लिए समर्पित संगठन।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="rounded-xl px-10 h-14 text-lg font-bold bg-primary text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                    <Link href="/contact" className="flex items-center gap-2">
                      Get in Touch <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-xl px-10 h-14 text-lg font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all hover:scale-105">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>

              <div className="relative h-[400px] md:h-[600px] w-full mt-8 lg:mt-0 animate-in fade-in zoom-in duration-1000">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4">
                  <div className="col-span-7 row-span-12 relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white animate-float">
                    <Image src={heroImg1?.imageUrl || ''} alt="Leadership" fill className="object-cover" />
                  </div>
                  <div className="col-span-5 row-span-5 relative rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-105 duration-500">
                    <Image src={heroImg2?.imageUrl || ''} alt="Support" fill className="object-cover" />
                  </div>
                  <div className="col-span-5 row-span-6 row-start-7 relative rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-105 duration-500">
                    <Image src={heroImg3?.imageUrl || ''} alt="Health" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="responsive-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image src={aboutImg?.imageUrl || ''} alt="Vision" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl text-white">
                    <h3 className="text-lg font-bold text-white mb-1">Our Vision / हमारी दृष्टि</h3>
                    <p className="text-base italic font-medium leading-relaxed">
                      "एक ऐसा समाज बनाना जहाँ हर सेवानिवृत्त कर्मचारी सम्मान और सुरक्षा के साथ जीवन व्यतीत करे।"
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Impact & Reach
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                    Securing a dignified <br className="hidden md:block" /> future for retirees
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-3xl font-bold text-slate-900">500+</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Active Members</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="text-3xl font-bold text-slate-900">75+</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Annual Events</p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-primary/10 shadow-sm hover:-translate-y-1 transition-all">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Our Strategic Mission</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mt-1">
                        To support pensioners through targeted welfare programs, specialized legal assistance, and health initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWS SECTION */}
        <section className="py-20 bg-white">
          <div className="responsive-container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-4 max-w-2xl">
                <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                  Latest Updates
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">News & Announcements</h2>
              </div>
              <Button asChild variant="ghost" className="text-primary font-bold group">
                <Link href="/news" className="flex items-center gap-2">
                  View All News <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsItems.map((item, i) => (
                <Card key={i} className="group overflow-hidden border-none bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-2/5 relative h-56 lg:h-auto overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <CardContent className="p-8 lg:w-3/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold">{item.category}</Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                      <Link href="/news" className="inline-flex items-center text-primary text-xs font-bold gap-1 group/link">
                        Read Story <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 3x2 GALLERY SECTION */}
        <section className="py-20 bg-slate-50">
          <div className="responsive-container">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mx-auto w-fit">
                <ImageIcon className="w-3 h-3" /> Community Gallery
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Captured Moments</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, i) => (
                <div 
                  key={i} 
                  className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white border border-slate-100"
                >
                  <Image 
                    src={item.imageUrl} 
                    alt={item.description} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    data-ai-hint={item.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500 leading-tight">
                      {item.description}
                    </p>
                    <div className="h-1 w-8 bg-primary rounded-full mt-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75"></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="ghost" className="text-primary font-bold group hover:bg-primary/5 rounded-full px-8">
                <Link href="/gallery" className="flex items-center gap-2">
                  View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-white">
          <div className="responsive-container">
            <div className="relative rounded-[3rem] bg-slate-900 p-8 md:p-16 overflow-hidden shadow-2xl text-center lg:text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-2xl">
                  <Badge className="bg-primary text-white border-none px-4 py-1 text-[10px] uppercase font-bold tracking-widest">Connect with Us</Badge>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">Secure Your Future with PPA Today</h2>
                  <p className="text-lg text-slate-400">Join a legacy of service and ensure your dignity post-retirement.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold bg-transparent text-white border-white/20 hover:bg-white/10 transition-all">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
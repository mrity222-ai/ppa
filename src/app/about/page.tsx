'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, Phone, History, Target, 
  BookOpen, Shield, ShieldCheck, Stethoscope, 
  Briefcase, Scale, Leaf, HardHat, Bus, Mail, 
  Zap, Banknote, Sparkles
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sectors = [
  { name: "Education Sector", desc: "Teachers (Primary, Secondary, Higher), Professors, Education Officers", icon: <BookOpen className="w-6 h-6" /> },
  { name: "Police & Security", desc: "Police Officers, Traffic Police, Home Guard, Paramilitary Forces", icon: <Shield className="w-6 h-6" /> },
  { name: "Defence Services", desc: "Army, Navy, and Air Force Personnel", icon: <ShieldCheck className="w-6 h-6" /> },
  { name: "Health Department", desc: "Doctors (Govt), Nurses, Pharmacists, Health Workers", icon: <Stethoscope className="w-6 h-6" /> },
  { name: "Administrative Services", desc: "IAS & PCS Officers, Clerks, Government Office Staff", icon: <Briefcase className="w-6 h-6" /> },
  { name: "Judiciary Department", desc: "Judges, Court Clerks, Legal Officers", icon: <Scale className="w-6 h-6" /> },
  { name: "Agriculture Department", desc: "Agriculture Officers, Field Officers, Extension Workers", icon: <Leaf className="w-6 h-6" /> },
  { name: "Public Works (PWD)", desc: "Civil & Electrical Engineers, Technical Staff", icon: <HardHat className="w-6 h-6" /> },
  { name: "Transport & Railways", desc: "Railway Employees, Transport Officers, Bus Depot Staff", icon: <Bus className="w-6 h-6" /> },
  { name: "Postal Department", desc: "Postman, Postal Assistants, Sorting Staff", icon: <Mail className="w-6 h-6" /> },
  { name: "Electricity Dept", desc: "Lineman, Electrical Engineers, Power Department Staff", icon: <Zap className="w-6 h-6" /> },
  { name: "Finance & Banking", desc: "Bank Employees (PSU), Treasury & Tax Officers", icon: <Banknote className="w-6 h-6" /> },
];

export default function AboutPage() {
  const aboutImg = PlaceHolderImages.find(img => img.id === 'about-img');
  const presidentImg = PlaceHolderImages.find(img => img.id === 'member-1');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO */}
        <section className="py-20 bg-white border-b">
          <div className="responsive-container text-center space-y-6">
            <Badge variant="outline" className="border-primary/20 text-primary px-6 py-1 rounded-full uppercase tracking-widest font-bold">
              Our Legacy / हमारा इतिहास
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              A Voice for Those <br className="hidden md:block" /> Who Served the State
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
              Prantiya Pensioners Association (PPA) is a non-political, non-profit organization dedicated to the welfare of retired government employees.
            </p>
          </div>
        </section>

        {/* MISSION SPLIT */}
        <section className="py-20 bg-slate-50">
          <div className="responsive-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-primary tracking-widest uppercase flex items-center gap-2">
                    <History className="w-4 h-4" /> About the Association / परिचय
                  </h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    United for Dignity, <br />Empowered for Growth.
                  </h3>
                  <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                    <p>
                      Prantiya Pensioners Association (Uttar Pradesh) is a dedicated community formed to support and connect retired government employees across the state.
                    </p>
                    <p>
                      Our primary aim is to create a strong and united platform where pensioners can stay informed, seek guidance, and find solutions to issues related to their pension and post-retirement life.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white rounded-2xl border shadow-sm">
                    <p className="text-primary font-bold text-lg leading-none">Non-Political</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">गैर-राजनीतिक</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border shadow-sm">
                    <p className="text-primary font-bold text-lg leading-none">Non-Profit</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">गैर-लाभकारी</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image src={aboutImg?.imageUrl || ''} alt="About PPA" fill className="object-cover" />
                  <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-3xl text-white shadow-xl animate-float">
                    <p className="text-4xl font-black">2025</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Established</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS GRID */}
        <section className="py-20 bg-white">
          <div className="responsive-container">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/5 text-primary border-primary/10 rounded-full px-6 py-1 font-bold">Government Sectors We Serve</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Serving with Respect and Support</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, i) => (
                <Card key={i} className="group hover:-translate-y-2 transition-all duration-300 border-primary/5 hover:border-primary/20 hover:shadow-xl bg-slate-50/50">
                  <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border">
                      {sector.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">{sector.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold leading-tight">{sector.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRESIDENT'S MESSAGE - CIRCULAR DESIGN */}
        <section className="py-20 bg-slate-50">
          <div className="responsive-container">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-12 border border-slate-100">
              <div className="flex-shrink-0 relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg relative">
                  <Image src={presidentImg?.imageUrl || ''} alt="President" fill className="object-cover" />
                </div>
                <div className="absolute -inset-2 bg-primary/5 rounded-full -z-10 blur-md"></div>
              </div>
              <div className="flex-grow space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <Badge className="bg-primary text-white border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">President's Message</Badge>
                  <h3 className="text-3xl font-bold text-slate-900">Shri Vishun Dev Yadav</h3>
                  <p className="text-primary font-bold tracking-widest uppercase text-sm">President, PPA Lucknow (DSP Retired)</p>
                </div>
                <div className="space-y-4">
                  <p className="text-2xl font-bold text-slate-800 italic leading-relaxed">
                    "प्रिय सदस्यों, हमारी एसोसिएशन आप सभी के अधिकारों की रक्षा के लिए सदैव तत्पर है।"
                  </p>
                  <p className="text-base text-slate-500 font-medium">
                    "Dear Members, our association is always ready to protect the rights of all of you."
                  </p>
                </div>
                <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 font-bold shadow-lg">
                  <Link href="/about/president-bio" className="flex items-center gap-2">
                    View Bio / बायो देखें <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
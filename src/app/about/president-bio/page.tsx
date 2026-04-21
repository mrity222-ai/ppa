'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShieldCheck, Phone, Briefcase, MapPin, Calendar } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PresidentBioPage() {
  const presidentImg = PlaceHolderImages.find(img => img.id === 'member-1');

  const serviceData = [
    { label: "Father's Name", value: "MAHESH YADAV" },
    { label: "Home Place", value: "AZAMGARH" },
    { label: "Date of Birth", value: "15/07/1965" },
    { label: "Current Rank", value: "DSP (RETIRED)" },
    { label: "Promotion to Dy. SP", value: "05/06/2020" },
    { label: "Last Post Held", value: "DSP/ACO HQ (Anti-Corruption)" },
    { label: "Last Posting Date", value: "26/09/2020" },
    { label: "Posting District", value: "LUCKNOW" },
    { label: "Date of Recruitment", value: "05/06/2020 (PPS Rank)" },
    { label: "Cadre, PPS Year", value: "OTH 2019" },
    { label: "Mobile Number", value: "+91 99352 12121" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="responsive-container">
          <Button asChild variant="ghost" className="mb-12 hover:bg-transparent hover:text-primary p-0 h-auto font-bold flex items-center gap-2">
            <Link href="/about"><ArrowLeft className="w-4 h-4" /> Back to About / पीछे जाएं</Link>
          </Button>

          <div className="flex flex-col lg:flex-row gap-12 items-start max-w-6xl mx-auto">
            <div className="w-full lg:w-1/3 space-y-8 sticky top-24">
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
                <Image src={presidentImg?.imageUrl || ''} alt="President" fill className="object-cover" priority />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">President, PPA</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Rank</p>
                    <p className="font-bold text-slate-900 leading-none mt-1">DSP (Retired)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-12">
              <div className="space-y-4 text-center lg:text-left">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest">
                  Official Service Record / सेवा विवरण
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Shri Bishun Dev Yadav <br />
                  <span className="text-primary font-medium text-2xl md:text-3xl italic">DSP (Retired), PPS</span>
                </h1>
              </div>

              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Briefcase className="w-6 h-6 text-primary" /> 
                    PPS Service Data (PPS Rank)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableBody>
                      {serviceData.map((row, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-500 py-5 pl-8 border-r bg-slate-50/30 w-1/3">
                            {row.label}
                          </TableCell>
                          <TableCell className="py-5 pl-8 font-bold text-slate-900">
                            {row.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-[2rem] border shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><MapPin /></div>
                  <h3 className="text-xl font-bold">Home Presence</h3>
                  <p className="text-slate-500 font-medium">Representing the heritage of <strong>Azamgarh</strong> while serving the community in <strong>Lucknow</strong>.</p>
                </div>
                <div className="p-8 bg-white rounded-[2rem] border shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><Calendar /></div>
                  <h3 className="text-xl font-bold">Career Milestone</h3>
                  <p className="text-slate-500 font-medium">Promoted to <strong>Deputy Superintendent of Police</strong> on June 5, 2020, following years of meritorious service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

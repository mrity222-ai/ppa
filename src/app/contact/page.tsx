'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-24">
        <div className="responsive-container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Connect With Us | संपर्क</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-slate-900 leading-tight">
              संपर्क करें / Contact Us
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Have questions or need assistance? Our team is here to support you in every step of your retirement journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            {/* Info Section */}
            <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group">
                <CardContent className="p-10 space-y-10">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-900">Office Address</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        G1/0049, Olive Wood Villa, Golf City, <br />Lucknow, Uttar Pradesh – 226002
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <Phone className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-900">Call Us</h3>
                      <p className="text-slate-500 text-base font-bold">+91 99352 12121</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mon - Sat: 10:00 AM – 5:00 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-900">Email Us</h3>
                      <p className="text-slate-500 text-base font-bold">info@upppa.org</p>
                      <p className="text-slate-400 text-sm font-medium">secretary@upppa.org</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-primary to-rose-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" /> Member Helpdesk
                </h3>
                <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">
                  Active members get priority support for pension disputes, medical claims, and legal documentation.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-8 md:p-14">
                  <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name / पूरा नाम *</Label>
                        <Input 
                          id="name" 
                          placeholder="Shri John Doe" 
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="mobile" className="text-sm font-bold text-slate-700 ml-1">Mobile Number / मोबाइल *</Label>
                        <Input 
                          id="mobile" 
                          placeholder="+91 99352 XXXXX" 
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="state" className="text-sm font-bold text-slate-700 ml-1">State / राज्य *</Label>
                        <Select required>
                          <SelectTrigger className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="up">Uttar Pradesh</SelectItem>
                            <SelectItem value="uk">Uttarakhand</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="district" className="text-sm font-bold text-slate-700 ml-1">District / जिला *</Label>
                        <Input 
                          id="district" 
                          placeholder="e.g. Lucknow" 
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="designation" className="text-sm font-bold text-slate-700 ml-1">Designation (Retired) / पद *</Label>
                      <Input 
                        id="designation" 
                        placeholder="e.g. Inspector, Teacher, Clerk" 
                        className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                        required 
                      />
                    </div>

                    <Button className="w-full h-16 rounded-full text-lg font-bold bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.01] active:scale-95 shadow-xl transition-all flex items-center justify-center gap-3">
                      Submit / सबमिट करें <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

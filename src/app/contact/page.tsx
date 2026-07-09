'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGateway } from '@/lib/apiClient';

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    state: '',
    district: '',
    designation: '',
  });

  const [stateQuery, setStateQuery] = useState('');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const StatesList = [
    { id: 'up', name: 'Uttar Pradesh' },
    { id: 'uk', name: 'Uttarakhand' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'other', name: 'Other' }
  ];

  const filteredStates = stateQuery.trim() === '' 
    ? StatesList 
    : StatesList.filter(s => s.name.toLowerCase().includes(stateQuery.toLowerCase()));

  React.useEffect(() => {
    if (formData.state) {
      const selected = StatesList.find(s => s.id === formData.state);
      if (selected && stateQuery !== selected.name) {
        setStateQuery(selected.name);
      }
    } else {
      setStateQuery('');
    }
  }, [formData.state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({});
    setIsPending(true);

    try {
      const stateLabel = formData.state === 'up' ? 'Uttar Pradesh' : 
                         formData.state === 'uk' ? 'Uttarakhand' : 
                         formData.state === 'delhi' ? 'Delhi' : 'Other';

      const success = await apiGateway.submitContact({
        name: formData.name,
        mobile: formData.mobile,
        state: stateLabel,
        district: formData.district,
        designation: formData.designation,
        message: ''
      });
      
      if (success) {
        setStatus({ 
          success: true, 
          message: 'Your message has been submitted successfully / आपका संदेश सफलतापूर्वक सबमिट कर दिया गया है' 
        });
        setFormData({
          name: '',
          mobile: '',
          state: '',
          district: '',
          designation: '',
        });
      } else {
        setStatus({ 
          success: false, 
          error: 'An error occurred while saving your message. Please try again. / आपका संदेश सहेजते समय एक त्रुटि आई। कृपया पुनः प्रयास करें।' 
        });
      }
    } catch (err) {
      setStatus({ 
        success: false, 
        error: 'An unexpected error occurred. / एक अप्रत्याशित त्रुटि हुई।' 
      });
    } finally {
      setIsPending(false);
    }
  };

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
                        House No. 9, Semara, Chinhat, <br />Gomti Nagar, Lucknow – 226028 Uttar Pradesh, India
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
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {status.success && (
                      <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
                        <div>
                          <p className="font-bold">Submitted / सबमिट किया गया</p>
                          <p className="text-sm mt-0.5">{status.message}</p>
                        </div>
                      </div>
                    )}

                    {status.error && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                        <div>
                          <p className="font-bold">Error / त्रुटि</p>
                          <p className="text-sm mt-0.5">{status.error}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name / पूरा नाम *</Label>
                        <Input 
                          id="name" 
                          placeholder="Shri John Doe" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="mobile" className="text-sm font-bold text-slate-700 ml-1">Mobile Number / मोबाइल *</Label>
                        <Input 
                          id="mobile" 
                          placeholder="+91 99352 XXXXX" 
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 relative">
                        <Label htmlFor="state" className="text-sm font-bold text-slate-700 ml-1">State / राज्य *</Label>
                        <div className="relative">
                          <Input
                            id="state"
                            value={stateQuery}
                            onChange={(e) => {
                              setStateQuery(e.target.value);
                              setIsStateDropdownOpen(true);
                              if (e.target.value === '') {
                                setFormData({ ...formData, state: '' });
                              }
                            }}
                            onFocus={() => setIsStateDropdownOpen(true)}
                            onBlur={() => {
                              setTimeout(() => {
                                setIsStateDropdownOpen(false);
                                const selected = StatesList.find(s => s.id === formData.state);
                                if (selected) {
                                  setStateQuery(selected.name);
                                } else {
                                  setStateQuery('');
                                }
                              }, 200);
                            }}
                            placeholder="Search & select state..."
                            disabled={isPending}
                            className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50"
                            autoComplete="off"
                          />
                          {isStateDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                              {filteredStates.length === 0 ? (
                                <div className="p-3 text-xs text-slate-400 text-center font-medium">
                                  No states found
                                </div>
                              ) : (
                                filteredStates.map((s) => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, state: s.id });
                                      setStateQuery(s.name);
                                      setIsStateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b last:border-b-0 border-slate-100 font-medium text-slate-700 transition-colors"
                                  >
                                    {s.name}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="district" className="text-sm font-bold text-slate-700 ml-1">District / जिला *</Label>
                        <Input 
                          id="district" 
                          placeholder="e.g. Lucknow" 
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                          required 
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="designation" className="text-sm font-bold text-slate-700 ml-1">Designation (Retired) / पद *</Label>
                      <Input 
                        id="designation" 
                        placeholder="e.g. Inspector, Teacher, Clerk" 
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="h-14 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-2xl bg-slate-50/50" 
                        required 
                        disabled={isPending}
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isPending}
                      className="w-full h-16 rounded-full text-lg font-bold bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.01] active:scale-95 shadow-xl transition-all flex items-center justify-center gap-3 text-white"
                    >
                      {isPending ? (
                        <>
                          Submitting / सबमिट हो रहा है... <Loader2 className="w-5 h-5 animate-spin" />
                        </>
                      ) : (
                        <>
                          Submit / सबमिट करें <Send className="w-5 h-5" />
                        </>
                      )}
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

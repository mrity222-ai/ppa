'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calendar, Clock, MapPin, ArrowLeft, Loader2, CheckCircle2, AlertCircle, X,
  ShieldCheck, Phone, Mail, FileText
} from 'lucide-react';
import { apiGateway, Event } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Registration states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinName, setJoinName] = useState('');
  const [joinMobile, setJoinMobile] = useState('');
  const [joinAddress, setJoinAddress] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

  useEffect(() => {
    async function loadEvent() {
      if (!params.id) return;
      setLoading(true);
      try {
        const list = await apiGateway.getEvents();
        const found = list.find(e => e.id.toString() === params.id.toString());
        if (found) {
          setEvent(found);
        } else {
          toast({
            title: "Event Not Found",
            description: "We couldn't find the requested event.",
            variant: "destructive"
          });
          router.push('/events');
        }
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [params.id]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setJoining(true);
    setJoinStatus(null);
    try {
      const ok = await apiGateway.registerEvent(event.id, joinName, joinMobile, joinAddress);
      if (ok) {
        setJoinStatus({ success: true, message: 'You have registered for the event successfully!' });
        setEvent({ ...event, is_registered: true, registrations_count: (event.registrations_count || 0) + 1 });
        toast({
          title: "Registration Successful",
          description: "Your registration has been saved successfully."
        });
      } else {
        setJoinStatus({ success: false, error: 'Registration failed or you are already registered.' });
      }
    } catch (err: any) {
      setJoinStatus({ success: false, error: err.message || 'Connection error.' });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-slate-500 font-semibold text-sm">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  // Split images list
  const imageUrlsList = event.image_urls 
    ? (Array.isArray(event.image_urls) ? event.image_urls : event.image_urls.split(',').map((u: string) => u.trim()))
    : (event.image_url ? [event.image_url] : []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 hover:bg-transparent hover:text-primary p-0 h-auto font-bold flex items-center gap-2">
            <Link href="/events">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Area (Card) */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                {/* Event banner images */}
                <div className="relative h-64 md:h-96 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={imageUrlsList[0] || 'https://picsum.photos/seed/event/800/600'}
                    alt={event.title_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary hover:bg-primary text-white border-none font-bold uppercase text-[10px]">
                        {event.type}
                      </Badge>
                      {event.district_name ? (
                        <Badge variant="secondary" className="font-bold">{event.district_name}</Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none font-bold">State-wide</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white font-headline leading-tight mb-2">
                      {event.title_en}
                    </h1>
                    <h2 className="text-lg md:text-xl font-medium text-slate-300 leading-snug">
                      {event.title_hi}
                    </h2>
                  </div>
                </div>

                <div className="p-6 md:p-10 space-y-8">
                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-[#CCCCCC]/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 shadow-sm border border-primary/5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time & Day</p>
                        <p className="font-bold text-slate-800 text-base">{event.time} {event.day ? `(${event.day})` : ''}</p>
                        <p className="text-xs text-slate-500 font-medium">Date: {event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 shadow-sm border border-primary/5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Venue</p>
                        <p className="font-bold text-slate-800 text-base">{event.venue_en}</p>
                        <p className="text-xs text-slate-500 font-medium">{event.venue_hi}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 font-headline">About this Event</h3>
                    <p className="text-slate-600 leading-relaxed font-body text-base whitespace-pre-line">
                      {event.description_en}
                    </p>
                  </div>

                  {/* Event Gallery Collage if multiple image URLs */}
                  {imageUrlsList.length > 1 && (
                    <div className="space-y-4 pt-6 border-t border-[#CCCCCC]/10">
                      <h3 className="text-lg font-bold text-slate-900 font-headline">Event Media Gallery</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imageUrlsList.slice(1).map((url, i) => (
                          <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border bg-slate-50 group hover:shadow-md transition-all duration-300">
                            <img
                              src={url}
                              alt={`Event Media ${i + 2}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Action Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden p-8 text-center space-y-6 border border-slate-100/50">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary text-2xl font-bold">
                  📅
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 font-headline">Registration Desk</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {event.registrations_count || 0} Registered Attendees
                  </p>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                {event.is_registered ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <span>✓ You are Registered</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal font-medium">
                      Your name is on the attendee list. We look forward to seeing you at the event!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => setIsJoinModalOpen(true)}
                      className="w-full rounded-full bg-primary hover:bg-primary/95 text-white font-bold h-14 text-base shadow-md hover:shadow-lg transition-all"
                    >
                      Register Now
                    </Button>
                    <p className="text-xs text-slate-400 leading-normal font-medium">
                      Fill out a short form to register as a guest or member. Free admission for pensioners.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic Registration Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 backdrop-blur-xl bg-black/60 transition-all duration-300">
          <div className="bg-white rounded-none md:rounded-[2.5rem] w-full h-full md:h-auto md:max-w-lg overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-primary h-2 w-full shrink-0"></div>
            <div className="p-8 md:p-10 space-y-6 overflow-y-auto">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-headline text-slate-900">Join Event</h3>
                  <p className="text-sm font-medium text-slate-500 line-clamp-1">{event.title_en}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    setJoinStatus(null);
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {joinStatus?.success ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">Registration Confirmed!</h4>
                    <p className="text-sm text-slate-600 font-medium">{joinStatus.message}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsJoinModalOpen(false);
                      setJoinStatus(null);
                    }}
                    className="rounded-full w-full bg-primary hover:bg-primary/95 text-white font-bold h-12"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  {joinStatus?.error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{joinStatus.error}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Full Name *</label>
                    <Input 
                      placeholder="e.g. Ram Prasad"
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      required
                      disabled={joining}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Mobile Number *</label>
                    <Input 
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={joinMobile}
                      onChange={(e) => setJoinMobile(e.target.value)}
                      required
                      disabled={joining}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Residential Address *</label>
                    <textarea 
                      placeholder="House No, Area, City"
                      value={joinAddress}
                      onChange={(e) => setJoinAddress(e.target.value)}
                      required
                      disabled={joining}
                      rows={3}
                      className="w-full rounded-xl border border-[#CCCCCC]/30 p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none bg-transparent"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold self-center mr-1">Quick Add:</span>
                      {['Gomti Nagar, Lucknow', 'Indira Nagar, Lucknow', 'Aliganj, Lucknow', 'Vikas Nagar, Lucknow', 'Civil Lines, Gorakhpur'].map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            if (joinAddress.trim() === '') {
                              setJoinAddress(loc);
                            } else {
                              setJoinAddress(joinAddress.trim() + ', ' + loc);
                            }
                          }}
                          className="text-[10px] bg-slate-50 hover:bg-primary/5 text-slate-600 hover:text-primary border border-slate-200 rounded-full px-2 py-0.5 font-bold transition-all"
                        >
                          + {loc.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsJoinModalOpen(false);
                        setJoinStatus(null);
                      }}
                      disabled={joining}
                      className="rounded-full flex-1 h-12 font-bold border-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={joining}
                      className="rounded-full flex-1 h-12 font-bold bg-primary hover:bg-primary/95 text-white"
                    >
                      {joining ? 'Submitting...' : 'Register'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Search, ArrowRight, Share2, Info, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiGateway, Event } from '@/lib/apiClient';

const eventCategories = ['All', 'Meetings', 'Health Camps', 'Social Gatherings', 'Workshops'];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedEventForJoin, setSelectedEventForJoin] = useState<Event | null>(null);
  const [joinName, setJoinName] = useState('');
  const [joinMobile, setJoinMobile] = useState('');
  const [joinAddress, setJoinAddress] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleOpenJoinModal = (event: Event) => {
    setSelectedEventForJoin(event);
    setJoinName('');
    setJoinMobile('');
    setJoinAddress('');
    setJoinStatus(null);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForJoin) return;
    if (!joinName.trim() || !joinMobile.trim() || !joinAddress.trim()) {
      setJoinStatus({ success: false, error: 'All fields are required.' });
      return;
    }
    setJoining(true);
    setJoinStatus(null);
    try {
      const ok = await apiGateway.registerEvent(selectedEventForJoin.id, joinName, joinMobile, joinAddress);
      if (ok) {
        setJoinStatus({ success: true, message: 'You have registered for the event successfully! / आप सफलतापूर्वक पंजीकृत हो गए हैं!' });
        setEvents(prev => prev.map(evt => {
          if (evt.id === selectedEventForJoin.id) {
            return { ...evt, registrations_count: evt.registrations_count + 1, is_registered: true };
          }
          return evt;
        }));
      } else {
        setJoinStatus({ success: false, error: 'Registration failed or you are already registered. / पंजीकरण विफल रहा या आप पहले से पंजीकृत हैं।' });
      }
    } catch (err: any) {
      setJoinStatus({ success: false, error: err.message || 'Connection error. / कनेक्शन त्रुटि।' });
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const list = await apiGateway.getEvents();
        setEvents(list);
        setFilteredEvents(list);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    let result = events;

    if (selectedCategory !== 'All') {
      const catMapping: Record<string, string> = {
        'Meetings': 'Meeting',
        'Health Camps': 'Health Camp',
        'Social Gatherings': 'Social Gathering',
        'Workshops': 'Workshop'
      };
      const type = catMapping[selectedCategory] || selectedCategory;
      result = result.filter(evt => evt.type.toLowerCase() === type.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(evt => 
        evt.title_en.toLowerCase().includes(q) || 
        evt.title_hi.toLowerCase().includes(q) ||
        evt.venue_en.toLowerCase().includes(q)
      );
    }

    setFilteredEvents(result);
  }, [selectedCategory, searchQuery, events]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-[#F7F7F7] py-20 border-b border-[#CCCCCC]/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Mark Your Calendars | आयोजन</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-[#111111] mb-6">
                Upcoming Events & Community Gatherings
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stay engaged with PPA Lucknow. From official committee meetings to welfare camps and workshops, join us in building a stronger community.
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-12 border-b border-[#CCCCCC]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full lg:w-auto">
                {eventCategories.map((cat) => (
                  <Button 
                    key={cat} 
                    variant={cat === selectedCategory ? 'default' : 'outline'} 
                    className="rounded-full whitespace-nowrap h-11 px-6 font-bold"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search events by name or location..." 
                  className="pl-12 h-12 rounded-full border-[#CCCCCC]/30 focus:border-primary transition-all bg-transparent w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-slate-400 mt-2">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-lg font-bold">No upcoming events scheduled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12">
                {filteredEvents.map((event) => {
                  const rawUrls = event.image_urls as any;
                  const urls: string[] = rawUrls
                    ? (Array.isArray(rawUrls)
                        ? rawUrls
                        : (typeof rawUrls === 'string'
                            ? rawUrls.split(',').map((u: string) => u.trim())
                            : []))
                    : (event.image_url ? [event.image_url] : []);

                  return (
                    <Card 
                      key={event.id} 
                      className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[30px] overflow-hidden group bg-white"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Image Area with Collage */}
                          <div className="lg:w-1/3 relative min-h-[250px] overflow-hidden bg-slate-100 flex flex-col justify-stretch">
                            <div className={`grid gap-0.5 w-full h-full min-h-[250px] ${
                              urls.length === 1 ? 'grid-cols-1' :
                              urls.length === 2 ? 'grid-cols-2' :
                              'grid-cols-3'
                            }`}>
                              {urls.length === 1 ? (
                                <img
                                  src={urls[0]}
                                  alt={event.title_en}
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                              ) : urls.length === 2 ? (
                                urls.map((url, i) => (
                                  <img
                                    key={i}
                                    src={url}
                                    alt={`${event.title_en} ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                  />
                                ))
                              ) : (
                                <>
                                  <div className="col-span-3 h-40">
                                    <img
                                      src={urls[0]}
                                      alt={`${event.title_en} 1`}
                                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                  </div>
                                  {urls.slice(1, 4).map((url, i) => (
                                    <div key={i} className="relative h-16 overflow-hidden">
                                      <img
                                        src={url}
                                        alt={`${event.title_en} ${i + 2}`}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                      />
                                      {i === 2 && urls.length > 4 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">
                                          +{urls.length - 4}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                            <div className="absolute top-6 left-6">
                              <Badge className="bg-primary text-white border-none py-1 px-4 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                {event.type}
                              </Badge>
                            </div>
                          </div>

                          {/* Details Area */}
                          <div className="flex-grow p-8 lg:p-12 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                              <div className="space-y-3">
                                <h3 className="text-2xl md:text-3xl font-headline font-bold text-[#111111] group-hover:text-primary transition-colors leading-tight">
                                  {event.title_hi}
                                </h3>
                                <h4 className="text-lg font-medium text-muted-foreground">
                                  {event.title_en}
                                </h4>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center bg-[#F7F7F7] rounded-3xl p-6 min-w-[120px] shadow-sm border border-primary/5">
                                <p className="text-xs font-bold text-primary uppercase mb-1">{event.date.split('-')[1] || 'Month'}</p>
                                <p className="text-3xl font-bold text-[#111111]">{event.date.split('-')[2] || 'Day'}</p>
                                <p className="text-xs font-bold text-muted-foreground">{event.date.split('-')[0] || 'Year'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#CCCCCC]/10">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                  <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Time & Day | समय और दिन</p>
                                  <p className="font-bold text-[#111111]">{event.time} {event.day ? `(${event.day})` : ''}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                  <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Venue | स्थान</p>
                                  <p className="font-bold text-[#111111]">{event.venue_hi}</p>
                                  <p className="text-xs text-muted-foreground">{event.venue_en}</p>
                                </div>
                              </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed max-w-2xl font-body">
                              {event.description_en}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                              {event.is_registered ? (
                                <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold h-12 px-8 flex items-center gap-2 rounded-full text-sm">
                                  ✓ Registered / पंजीकृत
                                </Badge>
                              ) : (
                                <Button 
                                  onClick={() => handleOpenJoinModal(event)}
                                  className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 flex items-center gap-2 shadow-md hover:shadow-lg transition-all group/btn"
                                >
                                  Join Event / शामिल हों <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                              )}
                              <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-primary text-primary hover:bg-primary/5 font-bold h-12 px-8 flex items-center gap-2 shadow-sm"
                              >
                                <Link href={`/events/${event.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Calendar Help CTA */}
        <section className="py-24 bg-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Info className="w-12 h-12 mx-auto mb-8 text-white/50" />
            <h2 className="text-3xl font-headline font-bold mb-6">
              Missing an Event Notification?
            </h2>
            <p className="text-white/80 mb-10 text-lg leading-relaxed">
              Make sure you are subscribed to our WhatsApp and SMS alerts for instant updates about pension revisions and meeting schedules.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-full h-14 px-10 shadow-xl transition-all hover:scale-105 h-auto py-4">
                  Join Alerts List
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* JOIN MODAL */}
      {selectedEventForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 backdrop-blur-xl bg-black/60 transition-all duration-300">
          <div className="bg-white rounded-none md:rounded-[2.5rem] w-full h-full md:h-auto md:max-w-lg overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary h-2 w-full shrink-0"></div>
            <div className="p-8 md:p-10 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-headline text-slate-900">Join Event / शामिल हों</h3>
                  <p className="text-sm font-medium text-slate-500 line-clamp-1">{selectedEventForJoin.title_en}</p>
                </div>
                <button 
                  onClick={() => setSelectedEventForJoin(null)}
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
                    onClick={() => setSelectedEventForJoin(null)}
                    className="rounded-full w-full bg-primary hover:bg-primary/95 text-white font-bold h-12"
                  >
                    Close / बंद करें
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
                    <label className="text-xs font-bold text-slate-600">Full Name / पूरा नाम *</label>
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
                    <label className="text-xs font-bold text-slate-600">Mobile Number / मोबाइल नंबर *</label>
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
                    <label className="text-xs font-bold text-slate-600">Residential Address / आवासीय पता *</label>
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
                      onClick={() => setSelectedEventForJoin(null)}
                      disabled={joining}
                      className="rounded-full flex-1 h-12 font-bold border-2"
                    >
                      Cancel / रद्द करें
                    </Button>
                    <Button 
                      type="submit"
                      disabled={joining}
                      className="rounded-full flex-1 h-12 font-bold bg-primary hover:bg-primary/95 text-white"
                    >
                      {joining ? 'Submitting...' : 'Join Event / शामिल हों'}
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

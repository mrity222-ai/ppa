import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Search, Filter, ArrowRight, Share2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const eventCategories = ['All', 'Meetings', 'Health Camps', 'Social Gatherings', 'Legal Aid', 'Workshops'];

export default function EventsPage() {
  const events = [
    {
      id: 1,
      titleHi: 'त्रैमासिक बैठक — Q1 2025',
      titleEn: 'Quarterly Meeting — Q1 2025',
      date: '15 April 2025',
      time: '11:00 AM - 2:00 PM',
      venueHi: 'टाउन हॉल, लखनऊ',
      venueEn: 'Town Hall, Lucknow',
      type: 'Meeting',
      descriptionEn: 'Discussing member welfare, pension revision updates, and upcoming social initiatives for the year.',
      image: PlaceHolderImages.find(img => img.id === 'event-1')?.imageUrl || '',
    },
    {
      id: 2,
      titleHi: 'निःशुल्क स्वास्थ्य शिविर — नेत्र एवं सामान्य जाँच',
      titleEn: 'Free Health Camp — Eye & General Checkup',
      date: '22 April 2025',
      time: '9:00 AM - 4:00 PM',
      venueHi: 'जिला अस्पताल, लखनऊ',
      venueEn: 'District Hospital, Lucknow',
      type: 'Health Camp',
      descriptionEn: 'Specialized health checkup for senior citizens including eye examination and blood pressure monitoring.',
      image: 'https://picsum.photos/seed/health-event/800/600',
    },
    {
      id: 3,
      titleHi: 'पेंशन अधिकार कार्यशाला',
      titleEn: 'Pension Rights & Legal Awareness Workshop',
      date: '05 May 2025',
      time: '2:00 PM - 5:00 PM',
      venueHi: 'PPA भवन, लखनऊ',
      venueEn: 'PPA Bhawan, Lucknow',
      type: 'Workshop',
      descriptionEn: 'Expert guidance on new government pension schemes and legal assistance for grievance redressal.',
      image: 'https://picsum.photos/seed/legal-event/800/600',
    }
  ];

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
                    variant={cat === 'All' ? 'default' : 'outline'} 
                    className="rounded-full whitespace-nowrap h-11 px-6 font-bold"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search events by name or location..." 
                  className="pl-12 h-12 rounded-full border-[#CCCCCC]/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[30px] overflow-hidden group bg-white"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Area */}
                      <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.titleEn}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          data-ai-hint="event crowd meeting"
                        />
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
                              {event.titleHi}
                            </h3>
                            <h4 className="text-lg font-medium text-muted-foreground">
                              {event.titleEn}
                            </h4>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center bg-[#F7F7F7] rounded-3xl p-6 min-w-[120px] shadow-sm border border-primary/5">
                            <p className="text-xs font-bold text-primary uppercase mb-1">{event.date.split(' ')[1]}</p>
                            <p className="text-3xl font-bold text-[#111111]">{event.date.split(' ')[0]}</p>
                            <p className="text-xs font-bold text-muted-foreground">{event.date.split(' ')[2]}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#CCCCCC]/10">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Time | समय</p>
                              <p className="font-bold text-[#111111]">{event.time}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Venue | स्थान</p>
                              <p className="font-bold text-[#111111]">{event.venueHi}</p>
                              <p className="text-xs text-muted-foreground">{event.venueEn}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                          {event.descriptionEn}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 flex items-center gap-2 shadow-md hover:shadow-lg transition-all group/btn">
                            Join Event / पंजीकरण <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                          <Button variant="outline" className="rounded-full border-[#CCCCCC] font-bold h-12 px-8 hover:bg-[#F7F7F7] transition-all">
                            More Details
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-muted-foreground hover:text-primary">
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-full h-14 px-10 shadow-xl transition-all hover:scale-105">
                Join Alerts List
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold rounded-full h-14 px-10">
                Contact Secretary
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

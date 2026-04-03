import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = ['All', 'Pension', 'Health', 'Events', 'Policy', 'Announcements'];

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      titleEn: 'Pension Revision Notice — Important Update',
      titleHi: 'पेंशन संशोधन सूचना — महत्वपूर्ण अपडेट',
      category: 'Pension',
      date: 'January 2025',
      contentEn: 'The state government has issued a new notification regarding pension revision. All members are requested to read it carefully.',
      contentHi: 'राज्य सरकार द्वारा पेंशन संशोधन की नई अधिसूचना जारी की गई है। सभी सदस्यों से अनुरोध है कि इसे ध्यान से पढ़ें।'
    },
    {
      id: 2,
      titleEn: 'Free Medical Camp Organized Successfully',
      titleHi: 'निःशुल्क स्वास्थ्य शिविर सफलतापूर्वक आयोजित',
      category: 'Health',
      date: 'February 2025',
      contentEn: 'A free health checkup camp was organized by PPA in February 2025. More than 200 pensioners participated.',
      contentHi: 'PPA द्वारा फरवरी 2025 में निःशुल्क स्वास्थ्य जाँच शिविर का आयोजन किया गया। 200 से अधिक पेंशनरों ने भाग लिया।'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-slate-900 mb-4">News & Updates / समाचार</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Stay updated with the latest happenings in our association and government policy updates.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="flex-grow flex items-center bg-white rounded-full px-4 border shadow-sm">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input variant="ghost" placeholder="Search news articles..." className="border-none focus-visible:ring-0 shadow-none" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              {categories.map((cat) => (
                <Button key={cat} variant={cat === 'All' ? 'default' : 'outline'} className="rounded-full whitespace-nowrap">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={`/7.jpg`}
                    alt="News Image"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-white border-none">{item.category}</Badge>
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center uppercase font-bold tracking-tighter"><Calendar className="w-3 h-3 mr-1" /> {item.date}</span>
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> Admin</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer leading-tight mb-2">
                    {item.titleHi}
                  </CardTitle>
                  <CardTitle className="text-sm font-medium text-muted-foreground mb-3">
                    {item.titleEn}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-3 italic">
                    {item.contentHi}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="link" className="p-0 h-auto text-primary font-bold group-hover:gap-2 transition-all">
                    Read Full Story <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

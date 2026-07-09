'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Search, Filter, Loader2, Share2, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiGateway, News } from '@/lib/apiClient';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Pension', 'Health', 'Events', 'Policy'];

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleReadStory = (item: News) => {
    router.push(`/news/${item.id}`);
  };

  const handleShare = (item: News) => {
    if (navigator.share) {
      navigator.share({
        title: item.title_hi || item.title_en,
        text: item.content_hi || item.content_en,
        url: `${window.location.origin}/news#story-${item.id}`
      }).catch(console.error);
    } else {
      const shareUrl = `${window.location.origin}/news#story-${item.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied / लिंक कॉपी हो गया",
        description: "The story link has been copied to your clipboard. / कहानी का लिंक आपके क्लिपबोर्ड पर कॉपी हो गया है।",
      });
    }
  };

  const handleDownloadPDF = (item: News) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${item.title_en}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mukta:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', 'Mukta', sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 850px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .category {
              display: inline-block;
              background: #0284c7;
              color: white;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              margin-bottom: 12px;
            }
            .title-hi {
              font-family: 'Mukta', sans-serif;
              font-size: 28px;
              font-weight: 700;
              margin: 10px 0;
              color: #0f172a;
            }
            .title-en {
              font-size: 20px;
              font-weight: 500;
              color: #475569;
              margin-bottom: 15px;
            }
            .meta {
              font-size: 13px;
              color: #64748b;
            }
            .image-container {
              margin: 30px 0;
              text-align: center;
            }
            .story-image {
              max-width: 100%;
              max-height: 380px;
              border-radius: 12px;
              object-fit: cover;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            .content-section {
              margin-bottom: 40px;
            }
            .section-heading {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .content-hi {
              font-family: 'Mukta', sans-serif;
              font-size: 17px;
              white-space: pre-wrap;
              margin-bottom: 30px;
              color: #1e293b;
            }
            .content-en {
              font-size: 16px;
              white-space: pre-wrap;
              color: #334155;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 12px;
              color: #94a3b8;
              text-align: center;
            }
            @media print {
              body {
                padding: 20px;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="category">${item.category}</span>
            <h1 class="title-hi">${item.title_hi}</h1>
            <h2 class="title-en">${item.title_en}</h2>
            <div class="meta">
              Published on: ${item.created_at ? item.created_at.split('T')[0] : 'June 2026'} | By: ${item.author_name || 'Admin'}
            </div>
          </div>
          
          ${item.image_url ? `
          <div class="image-container">
            <img class="story-image" src="${item.image_url}" alt="${item.title_en}" />
          </div>
          ` : ''}
          
          <div class="content-section">
            <div class="section-heading">हिंदी विवरण / Hindi Details</div>
            <div class="content-hi">${item.content_hi}</div>
          </div>
          
          <div class="content-section">
            <div class="section-heading">English Translation</div>
            <div class="content-en">${item.content_en}</div>
          </div>
          
          <div class="footer">
            Prantiya Pensioners Association (PPA) Lucknow - Official Updates & Circulars
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const list = await apiGateway.getNews();
        setNews(list);
        setFilteredNews(list);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    let result = news;

    if (selectedCategory !== 'All') {
      result = result.filter(n => n.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title_en.toLowerCase().includes(q) || 
        n.title_hi.toLowerCase().includes(q) ||
        n.content_en.toLowerCase().includes(q) ||
        n.content_hi.toLowerCase().includes(q)
      );
    }

    setFilteredNews(result);
  }, [selectedCategory, searchQuery, news]);

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
            <div className="flex-grow flex items-center bg-white rounded-full px-4 border shadow-sm h-12">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input 
                placeholder="Search news articles..." 
                className="border-none focus-visible:ring-0 shadow-none w-full bg-transparent" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              {categories.map((cat) => (
                <Button 
                  key={cat} 
                  variant={cat === selectedCategory ? 'default' : 'outline'} 
                  className="rounded-full whitespace-nowrap"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-slate-400 mt-2">Loading news...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-bold">No news updates found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image_url || '/7.jpg'}
                      alt={item.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[220px]"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-white border-none">{item.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center uppercase font-bold tracking-tighter">
                        <Calendar className="w-3 h-3 mr-1" /> {item.created_at ? item.created_at.split('T')[0] : 'June 2026'}
                      </span>
                      <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {item.author_name || 'Admin'}</span>
                    </div>
                    <CardTitle 
                      className="text-xl group-hover:text-primary transition-colors cursor-pointer leading-tight mb-2"
                      onClick={() => handleReadStory(item)}
                    >
                      {item.title_hi}
                    </CardTitle>
                    <CardTitle 
                      className="text-sm font-medium text-muted-foreground mb-3 cursor-pointer"
                      onClick={() => handleReadStory(item)}
                    >
                      {item.title_en}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-3 italic font-body">
                      {item.content_hi}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary font-bold group-hover:gap-2 transition-all"
                      onClick={() => handleReadStory(item)}
                    >
                      Read Full Story <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

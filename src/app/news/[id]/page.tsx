'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, ArrowLeft, Share2, Download, Loader2 } from 'lucide-react';
import { apiGateway, News } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [item, setItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      if (!params.id) return;
      setLoading(true);
      try {
        const list = await apiGateway.getNews();
        const found = list.find(n => n.id.toString() === params.id.toString());
        if (found) {
          setItem(found);
        } else {
          toast({
            title: "Article Not Found",
            description: "We couldn't find the requested news update.",
            variant: "destructive"
          });
          router.push('/news');
        }
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [params.id]);

  const handleShare = () => {
    if (!item) return;
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "The story link has been copied to your clipboard."
    });
  };

  const handleDownloadPDF = () => {
    if (!item) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${item.title_en}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .category { font-weight: bold; text-transform: uppercase; color: #e11d48; font-size: 12px; letter-spacing: 0.1em; }
            .title-en { font-size: 28px; margin: 10px 0; color: #0f172a; }
            .title-hi { font-size: 24px; margin: 10px 0; color: #334155; }
            .meta { font-size: 12px; color: #64748b; margin-top: 10px; }
            .image-container { margin: 30px 0; text-align: center; }
            .story-image { max-width: 100%; max-height: 400px; border-radius: 12px; }
            .content-section { margin-top: 35px; }
            .section-heading { font-weight: bold; border-left: 4px solid #e11d48; padding-left: 10px; margin-bottom: 15px; color: #0f172a; }
            .content-hi, .content-en { font-size: 16px; color: #334155; white-space: pre-line; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="category">${item.category}</span>
            <h1 class="title-en">${item.title_en}</h1>
            <h2 class="title-hi">${item.title_hi}</h2>
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
            <div class="section-heading">English Details</div>
            <div class="content-en">${item.content_en}</div>
          </div>

          <div class="content-section">
            <div class="section-heading">Hindi Details</div>
            <div class="content-hi">${item.content_hi}</div>
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-slate-500 font-semibold text-sm">Loading article details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 hover:bg-transparent hover:text-primary p-0 h-auto font-bold flex items-center gap-2">
            <Link href="/news">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
          </Button>

          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            {/* Header Image */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-100">
              <img
                src={item.image_url || '/7.jpg'}
                alt={item.title_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-primary hover:bg-primary text-white border-none font-bold uppercase text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-slate-300 flex items-center font-semibold">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.created_at ? item.created_at.split('T')[0] : 'June 2026'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white font-headline leading-tight mb-2">
                  {item.title_en}
                </h1>
                <h2 className="text-lg md:text-xl font-medium text-slate-300 leading-snug">
                  {item.title_hi}
                </h2>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-10 space-y-8">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="text-xs text-muted-foreground flex items-center font-medium">
                  <User className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>Published by: <span className="font-semibold text-slate-700">{item.author_name || 'Admin'}</span></span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 hover:bg-slate-50 border-slate-200 rounded-full font-bold"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 text-primary" />
                    <span>Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 hover:bg-slate-50 border-slate-200 rounded-full font-bold"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>PDF</span>
                  </Button>
                </div>
              </div>

              {/* Stacked Bilingual Content */}
              <div className="space-y-10">
                {/* Hindi Content (Main) */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 border-l-4 border-primary pl-3 font-headline">
                    हिन्दी विवरण (Hindi Version)
                  </h3>
                  <div className="text-slate-800 text-base md:text-lg leading-relaxed whitespace-pre-line font-body font-normal">
                    {item.content_hi}
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-8"></div>

                {/* English Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 border-l-4 border-slate-400 pl-3 font-headline">
                    English Version
                  </h3>
                  <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-body font-normal">
                    {item.content_en}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

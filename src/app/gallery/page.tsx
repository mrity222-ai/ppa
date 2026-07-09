'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ImageIcon, Maximize2, Loader2 } from 'lucide-react';
import { apiGateway } from '@/lib/apiClient';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', ...Array.from(new Set(photos.map(p => p.album_name || 'General')))];

  const filteredPhotos = selectedTag === 'All' 
    ? photos 
    : photos.filter(p => (p.album_name || 'General').toLowerCase() === selectedTag.toLowerCase());

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const list = await apiGateway.getGallery();
        if (list && list.length > 0) {
          setPhotos(list);
        } else {
          // Fallback to placeholder images
          const placeholders = PlaceHolderImages.filter(img => img.id.startsWith('gallery-')).map((img, idx) => ({
            id: img.id,
            title: img.description,
            image_url: img.imageUrl,
            album_name: 'Events',
          }));
          setPhotos(placeholders);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Banner Section */}
        <section className="bg-[#F7F7F7] py-20 border-b border-[#CCCCCC]/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary mb-6">
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Visual Journey | चित्र गैलरी</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-[#111111] mb-6">
                Capturing Moments of Service & Unity
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore our journey through photographs. From official meetings and medical camps to social gatherings and celebrations, witness the spirit of PPA Lucknow.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Tag Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12 overflow-x-auto pb-2">
              {tags.map((tag) => (
                <Button 
                  key={tag} 
                  variant={tag === selectedTag ? 'default' : 'outline'} 
                  className="rounded-full font-bold whitespace-nowrap"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-slate-400 mt-2">Loading gallery...</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredPhotos.map((item, idx) => {
                  const rawUrls = item.image_urls as any;
                  const urls: string[] = rawUrls
                    ? (Array.isArray(rawUrls)
                        ? rawUrls
                        : (typeof rawUrls === 'string'
                            ? rawUrls.split(',').map((u: string) => u.trim())
                            : []))
                    : (item.image_url ? [item.image_url] : []);

                  return (
                    <div 
                      key={idx} 
                      className="relative group break-inside-avoid rounded-[24px] overflow-hidden bg-white border border-[#CCCCCC]/10 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative w-full overflow-hidden">
                        {/* Collage layout based on image count */}
                        <div className={`grid gap-0.5 bg-slate-100 ${
                          urls.length === 1 ? 'grid-cols-1' :
                          urls.length === 2 ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          {urls.length === 1 ? (
                            <img
                              src={urls[0]}
                              alt={item.title}
                              className="w-full h-auto object-cover max-h-96 transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          ) : urls.length === 2 ? (
                            urls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`${item.title} ${i + 1}`}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              />
                            ))
                          ) : (
                            <>
                              <div className="col-span-3">
                                <img
                                  src={urls[0]}
                                  alt={`${item.title} 1`}
                                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                              </div>
                              {urls.slice(1, 4).map((url, i) => (
                                <div key={i} className="relative h-20 overflow-hidden">
                                  <img
                                    src={url}
                                    alt={`${item.title} ${i + 2}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                  />
                                  {i === 2 && urls.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">
                                      +{urls.length - 4} More
                                    </div>
                                  )}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title & Metadata Card Body */}
                      <div className="p-6 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 font-bold uppercase text-[9px] py-0.5 px-2">
                            {item.album_name || 'General'}
                          </Badge>
                          {(item.date || item.day) && (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {item.day ? `${item.day}, ` : ''}{item.date || ''}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-headline font-bold text-[#111111] leading-snug mb-1.5">
                          {item.title}
                        </h3>
                        {item.time && (
                          <p className="text-xs text-slate-500 font-medium">
                            🕒 Time: {item.time}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-headline font-bold mb-6 italic">
              "Be a part of our next memory."
            </h2>
            <p className="text-white/80 mb-10 text-lg">
              Join the Prantiya Pensioners Association today and contribute to our growing community.
            </p>
            <Link href="/join">
              <Button size="lg" className="bg-white text-primary font-bold px-10 py-6 rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl h-auto">
                JOIN PPA NOW
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

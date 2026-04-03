import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ImageIcon, Maximize2 } from 'lucide-react';

export default function GalleryPage() {
  const galleryItems = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

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
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {galleryItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="relative group break-inside-avoid rounded-[24px] overflow-hidden bg-[#F7F7F7] border border-[#CCCCCC]/10 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.description}
                      width={800}
                      height={idx % 2 === 0 ? 600 : 1000}
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                      data-ai-hint={item.imageHint}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Badge className="bg-primary text-white border-none mb-3">
                          Event Photo
                        </Badge>
                        <h3 className="text-xl font-bold text-white leading-tight">
                          {item.description}
                        </h3>
                        <div className="flex items-center gap-2 mt-4 text-white/60 text-xs font-medium uppercase tracking-widest">
                          <Maximize2 className="w-3 h-3" /> View Large
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <button className="bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl">
              JOIN PPA NOW
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Eye, Search, FolderClosed, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiGateway, DocumentItem } from '@/lib/apiClient';

const docCategories = ['All', 'Pension Circulars', 'Government Orders', 'Meeting Minutes', 'Application Forms'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      try {
        const list = await apiGateway.getDocuments();
        setDocuments(list);
        setFilteredDocs(list);
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  useEffect(() => {
    let result = documents;
    
    if (selectedCategory !== 'All') {
      result = result.filter(doc => doc.type.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(doc => doc.title.toLowerCase().includes(q) || doc.type.toLowerCase().includes(q));
    }

    setFilteredDocs(result);
  }, [selectedCategory, searchQuery, documents]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Resource Center / दस्तावेज़</h1>
            <p className="text-lg text-muted-foreground">
              Access and download official association documents, pension circulars, and government orders.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="flex-grow flex items-center bg-white rounded-full px-4 border shadow-sm h-14">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input 
                placeholder="Search by document title..." 
                className="border-none focus-visible:ring-0 shadow-none text-lg w-full bg-transparent" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {docCategories.map((cat) => (
                <Button 
                  key={cat} 
                  variant={cat === selectedCategory ? 'default' : 'outline'} 
                  className="rounded-full whitespace-nowrap px-6 h-11"
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
              <p className="text-sm text-slate-400 mt-2">Loading documents...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FolderClosed className="w-12 h-12 mx-auto mb-4 text-slate-200" />
              <p className="text-lg font-bold">No documents found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                      <div className="flex items-center gap-5 flex-grow">
                        <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold font-headline leading-tight">{doc.title}</h3>
                            <Badge variant="secondary" className="text-[10px] py-0">PDF</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center"><FolderClosed className="w-3 h-3 mr-1" /> {doc.type}</span>
                            <span>•</span>
                            <span>{doc.created_at ? doc.created_at.split('T')[0] : '2026'}</span>
                            <span>•</span>
                            <span>{doc.file_size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0 rounded-full gap-2" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4" /> View
                          </a>
                        </Button>
                        <Button size="sm" className="flex-grow sm:flex-grow-0 rounded-full gap-2" asChild>
                          <a href={doc.file_url} download>
                            <Download className="w-4 h-4" /> Download
                          </a>
                        </Button>
                      </div>
                    </div>
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

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Eye, Search, FolderClosed } from 'lucide-react';
import { Input } from '@/components/ui/input';

const docCategories = ['All', 'Pension Circulars', 'Government Orders', 'Meeting Minutes', 'Application Forms', 'Constitution'];

export default function DocumentsPage() {
  const docs = [
    { title: 'Pension Revision Order 2025 — राज्य सरकार', type: 'Order', size: '1.2 MB' },
    { title: 'Medical Facility Order for Pensioners', type: 'Medical', size: '0.8 MB' },
    { title: 'PPA Membership Application Form', type: 'Form', size: '0.5 MB' },
    { title: 'Grievance Application Format', type: 'Form', size: '0.4 MB' },
    { title: 'Annual Meeting Minutes — 2025', type: 'Minutes', size: '2.1 MB' },
  ];

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
              <Input variant="ghost" placeholder="Search by document title..." className="border-none focus-visible:ring-0 shadow-none text-lg" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {docCategories.map((cat) => (
                <Button key={cat} variant={cat === 'All' ? 'default' : 'outline'} className="rounded-full whitespace-nowrap px-6 h-11">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {docs.map((doc, i) => (
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
                          <span>2025</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0 rounded-full gap-2">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                      <Button size="sm" className="flex-grow sm:flex-grow-0 rounded-full gap-2">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  </div>
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

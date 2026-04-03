import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-20 bg-background">
        <div className="responsive-container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">संपर्क करें / Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need assistance? Our team is here to support you. <br/>
              क्या आपके कोई प्रश्न हैं या आपको सहायता की आवश्यकता है? हमारी टीम आपके सहयोग के लिए यहाँ है।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="border-none shadow-sm rounded-[20px] bg-white">
                <CardContent className="p-8 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Office Address</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        G1/0049, Olive Wood Villa, Golf City, <br />Lucknow, Uttar Pradesh – 226002
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Call Us</h3>
                      <p className="text-muted-foreground text-sm">Phone: 9532341000</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm">info@ppa.org.in</p>
                      <p className="text-muted-foreground text-sm">secretary@ppa.org.in</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Office Hours</h3>
                      <p className="text-muted-foreground text-sm">Mon - Sat: 10:00 AM – 5:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary rounded-[20px] p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Member Helpdesk
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Members get priority support for pension disputes and medical claims.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-full font-bold shadow-md transition-all">
                  Join Community
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-xl rounded-[20px] overflow-hidden bg-white">
                <CardContent className="p-8 md:p-12">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name / पूरा नाम *</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-sm font-bold text-slate-700">Mobile Number / मोबाइल *</Label>
                        <Input 
                          id="mobile" 
                          placeholder="9532341000" 
                          className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-bold text-slate-700">State / राज्य *</Label>
                        <Select required>
                          <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="up">Uttar Pradesh</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="haryana">Haryana</SelectItem>
                            <SelectItem value="mp">Madhya Pradesh</SelectItem>
                            <SelectItem value="uk">Uttarakhand</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-bold text-slate-700">District / जिला *</Label>
                        <Input 
                          id="district" 
                          placeholder="Enter District Name" 
                          className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-sm font-bold text-slate-700">Designation / पद *</Label>
                      <Input 
                        id="designation" 
                        placeholder="e.g. Teacher, Inspector, Clerk" 
                        className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-bold text-slate-700">Message / संदेश</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your message here..." 
                        className="min-h-[120px] border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg resize-none" 
                      />
                    </div>

                    <Button className="w-full h-14 rounded-full text-lg font-bold bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.02] shadow-lg transition-all flex items-center justify-center gap-2">
                      Submit / सबमिट करें <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
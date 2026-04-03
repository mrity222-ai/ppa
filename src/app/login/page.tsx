import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, Mail, ArrowLeft, UserCircle } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage
          </Link>
          
          <Card className="shadow-2xl border-none rounded-2xl overflow-hidden">
            <div className="bg-primary h-2 w-full"></div>
            <CardHeader className="space-y-2 text-center pt-10">
              <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline font-bold">Member Login</CardTitle>
              <CardDescription className="text-base">
                सदस्य लॉगिन — PPA Lucknow Portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 px-8">
              <div className="space-y-2">
                <Label htmlFor="email">Member ID / Email / सदस्य आईडी</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input id="email" placeholder="PPA-LKO-0001" className="pl-10 h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password / पासवर्ड</Label>
                  <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>
              <Button asChild className="w-full h-12 text-lg font-bold rounded-full">
                <Link href="/dashboard">Login / लॉगिन करें</Link>
              </Button>
            </CardContent>
            <CardFooter className="bg-accent/50 py-6 border-t border-accent text-center justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link href="/join" className="text-primary font-bold hover:underline">Register Now</Link>
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2025 Prantiya Pensioners Association. Lucknow, UP.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

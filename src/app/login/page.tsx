'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, Mail, ArrowLeft, UserCircle, AlertCircle, Loader2, Smartphone, Key } from 'lucide-react';
import { apiGateway } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password form states
  const [resetEmail, setResetEmail] = useState('');
  const [resetMobile, setResetMobile] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        const response = await apiGateway.login(email, password);
        if (response.success && response.user) {
          // Save session locally
          sessionStorage.setItem('ppa_logged_in_user', JSON.stringify(response.user));
          
          // Show message
          router.push('/dashboard');
        } else {
          setError(response.error || 'Invalid credentials');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected connection error occurred.');
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (resetPassword !== resetConfirmPassword) {
      setError('Passwords do not match / पासवर्ड मेल नहीं खाते');
      return;
    }

    startTransition(async () => {
      try {
        const response = await apiGateway.resetPassword({
          email: resetEmail,
          mobile: resetMobile,
          password: resetPassword
        });
        if (response.success) {
          toast({
            title: "Password Reset Success / पासवर्ड रीसेट सफल",
            description: "Your password has been reset successfully. Please log in. / आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है। कृपया लॉगिन करें।",
          });
          setEmail(resetEmail); // pre-populate email on login page
          setView('login');
          setResetEmail('');
          setResetMobile('');
          setResetPassword('');
          setResetConfirmPassword('');
        } else {
          setError(response.error || 'Failed to reset password');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected connection error occurred.');
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage
          </Link>
          
          <Card className="shadow-2xl border-none rounded-2xl overflow-hidden bg-white">
            <div className="bg-primary h-2 w-full"></div>
            
            {view === 'login' ? (
              <>
                <CardHeader className="space-y-2 text-center pt-8">
                  <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-2">
                    <UserCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-headline font-bold">Admin Login</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    प्रशासनिक लॉगिन — PPA Lucknow Administrative Portal
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-4 px-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                      <p>{error}</p>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email / Mobile / Admin Username *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="text"
                          placeholder="" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password / पासवर्ड *</Label>
                        <button 
                          type="button"
                          onClick={() => { setError(''); setView('forgot'); }} 
                          className="text-xs font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full h-11 text-base font-bold rounded-full mt-2 bg-primary text-white"
                    >
                      {isPending ? (
                        <>
                          Verifying... <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        </>
                      ) : (
                        'Login / लॉगिन करें'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="space-y-2 text-center pt-8">
                  <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                    <Key className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl font-headline font-bold">Reset Password</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    पासवर्ड रीसेट — Verify details to set new password
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-4 px-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                      <p>{error}</p>
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleResetPassword}>
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Registered Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="reset-email" 
                          type="email"
                          placeholder="" 
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-mobile">Registered Mobile Number *</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="reset-mobile" 
                          type="text"
                          placeholder="" 
                          value={resetMobile}
                          onChange={(e) => setResetMobile(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-password">New Password / नया पासवर्ड *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="reset-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-confirm">Confirm Password / पुष्टि करें *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="reset-confirm" 
                          type="password" 
                          placeholder="••••••••" 
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          className="pl-10 h-11" 
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full h-11 text-base font-bold rounded-full mt-2 bg-primary text-white"
                    >
                      {isPending ? (
                        <>
                          Resetting... <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        </>
                      ) : (
                        'Reset Password / पासवर्ड बदलें'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setError(''); setView('login'); }}
                      className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-700 mt-4 block bg-transparent border-none cursor-pointer"
                    >
                      Back to Login / लॉगिन पर लौटें
                    </button>
                  </form>
                </CardContent>
              </>
            )}
            
            {/* CardFooter register link removed */}

          </Card>
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2026 Prantiya Pensioners Association. Lucknow, UP.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

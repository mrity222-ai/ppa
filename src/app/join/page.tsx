'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle, Loader2, UserCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGateway, District } from '@/lib/apiClient';

export default function JoinPage() {
  const router = useRouter();
  const [districts, setDistricts] = useState<District[]>([]);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string }>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    district_id: '',
    designation: '',
    department: '',
  });

  const [districtQuery, setDistrictQuery] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const filteredDistricts = districtQuery.trim() === '' 
    ? districts 
    : districts.filter(d => d.name.toLowerCase().includes(districtQuery.toLowerCase()));

  useEffect(() => {
    if (formData.district_id) {
      const selected = districts.find(d => d.id.toString() === formData.district_id);
      if (selected && districtQuery !== selected.name) {
        setDistrictQuery(selected.name);
      }
    }
  }, [formData.district_id, districts]);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const list = await apiGateway.getDistricts();
        setDistricts(list);
      } catch (err) {
        console.error('Failed to load districts:', err);
      }
    }
    loadDistricts();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({});

    if (!formData.district_id) {
      setStatus({ success: false, error: 'Please select your District / कृपया अपने जिले का चयन करें।' });
      return;
    }

    startTransition(async () => {
      try {
        let uploadedUrl = null;
        if (photoFile) {
          const uploadRes = await apiGateway.uploadImage(photoFile);
          if (uploadRes.success && uploadRes.url) {
            uploadedUrl = uploadRes.url;
          } else {
            setStatus({ success: false, error: 'Photo upload failed / फोटो अपलोड विफल रहा: ' + (uploadRes.error || '') });
            return;
          }
        }

        const response = await apiGateway.register({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          district_id: formData.district_id,
          designation: formData.designation,
          department: formData.department,
          address: 'N/A',
          city: 'N/A',
          pincode: 'N/A',
          photo_url: uploadedUrl
        });
        
        if (response.success && response.user) {
          // Immediately login the user by setting session
          sessionStorage.setItem('ppa_logged_in_user', JSON.stringify(response.user));
          router.push('/dashboard');
        } else if (response.success) {
          setStatus({ success: true, message: response.message });
          setFormData({
            name: '',
            email: '',
            mobile: '',
            district_id: '',
            designation: '',
            department: '',
          });
          setPhotoFile(null);
          setPhotoPreview(null);
        } else {
          setStatus({ success: false, error: response.error });
        }
      } catch (err: any) {
        setStatus({ success: false, error: err.message || 'Registration failed. Check connection.' });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage / मुख्य पृष्ठ पर जाएं
          </Link>
          
          <Card className="shadow-2xl border-none rounded-3xl overflow-hidden bg-white">
            <div className="bg-primary h-2.5 w-full"></div>
            
            <CardHeader className="space-y-2 text-center pt-8">
              <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-2">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline font-bold text-slate-900">Online Registration</CardTitle>
              <CardDescription className="text-sm">
                पंजीकरण अनुरोध — Apply for PPA Lucknow Membership
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 md:px-10 py-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status.success && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
                    <div className="text-sm">
                      <p className="font-bold">Application Submitted!</p>
                      <p className="mt-0.5">{status.message}</p>
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                    <div className="text-sm">
                      <p className="font-bold">Registration Alert</p>
                      <p className="mt-0.5">{status.error}</p>
                    </div>
                  </div>
                )}
                {/* Profile Photo Upload Field */}
                <div className="flex flex-col items-center gap-4 border-b pb-6">
                  <div className="relative w-24 h-24 rounded-full border bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <Label htmlFor="photo" className="cursor-pointer bg-primary/10 text-primary font-bold text-xs px-4 py-2 rounded-full hover:bg-primary/20 transition-all border border-primary/20">
                      Upload Profile Photo / फोटो अपलोड करें
                    </Label>
                    <input 
                      id="photo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                      disabled={isPending}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">JPEG, PNG or WebP up to 5MB</p>
                  </div>
                </div>

                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1">Personal Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name / पूरा नाम *</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Shri Hari Mohan" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required 
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number / मोबाइल *</Label>
                    <Input 
                      id="mobile" 
                      placeholder="e.g. +91 99352 XXXXX" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required 
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address / ईमेल आईडी (Optional / वैकल्पिक)</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="e.g. user@domain.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isPending}
                  />
                </div>

                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-1 pt-2">Service Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="district">District PPA Branch / जिला शाखा *</Label>
                    <div className="relative">
                      <Input
                        id="district"
                        value={districtQuery}
                        onChange={(e) => {
                          setDistrictQuery(e.target.value);
                          setIsDistrictDropdownOpen(true);
                          if (e.target.value === '') {
                            setFormData({ ...formData, district_id: '' });
                          }
                        }}
                        onFocus={() => setIsDistrictDropdownOpen(true)}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsDistrictDropdownOpen(false);
                            const selected = districts.find(d => d.id.toString() === formData.district_id);
                            if (selected) {
                              setDistrictQuery(selected.name);
                            } else {
                              setDistrictQuery('');
                            }
                          }, 200);
                        }}
                        placeholder="Search & select district..."
                        disabled={isPending}
                        className="rounded-xl h-11"
                        autoComplete="off"
                      />
                      {isDistrictDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                          {filteredDistricts.length === 0 ? (
                            <div className="p-3 text-xs text-slate-400 text-center font-medium">
                              No districts found
                            </div>
                          ) : (
                            filteredDistricts.map((d) => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, district_id: d.id.toString() });
                                  setDistrictQuery(d.name);
                                  setIsDistrictDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b last:border-b-0 border-slate-100 font-medium text-slate-700 transition-colors"
                              >
                                {d.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / राज्य</Label>
                    <Input 
                      id="state" 
                      value="Uttar Pradesh" 
                      disabled 
                      className="bg-slate-50 font-bold text-slate-500 border-dashed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Retired Designation / पद *</Label>
                    <Input 
                      id="designation" 
                      placeholder="e.g. Executive Engineer, Inspector" 
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      required 
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department / विभाग *</Label>
                    <Input 
                      id="department" 
                      placeholder="e.g. PWD, Revenue" 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required 
                      disabled={isPending}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-12 rounded-xl text-lg font-bold bg-primary text-white hover:bg-primary/95 transition-all mt-4"
                >
                  {isPending ? (
                    <>
                      Submitting Request... <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    </>
                  ) : (
                    'Apply for Membership / पंजीकरण करें'
                  )}
                </Button>
              </form>
            </CardContent>
            
            {/* CardFooter login link removed */}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

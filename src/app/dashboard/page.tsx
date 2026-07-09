'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, User, FileText, Calendar, Bell, LogOut, Search, CreditCard, ChevronRight, 
  Download, Clock, Sparkles, MessageSquare, Copy, Check, Key, Inbox, AlertTriangle, 
  Building2, Landmark, UserCheck, ShieldAlert, FileSpreadsheet, PlusCircle, CheckCircle2,
  Trash2, RefreshCw, Printer, Info, HelpCircle, Loader2, Pencil, UserCircle, Users, X, Link as LinkIcon, Settings, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGateway, User as ApiUser, District, MembershipRequest, News, Event, Notice, ActivityLog, Committee } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileMobile, setProfileMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminMobile, setNewAdminMobile] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('districtadmin');
  const [newAdminDistrictId, setNewAdminDistrictId] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [createdAdminInfo, setCreatedAdminInfo] = useState<{ email: string; name: string; role: string } | null>(null);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);

  // Administrator management states
  const [adminUsers, setAdminUsers] = useState<ApiUser[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<ApiUser | null>(null);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState('');
  const [editAdminMobile, setEditAdminMobile] = useState('');
  const [editAdminRole, setEditAdminRole] = useState('districtadmin');
  const [editAdminDistrictId, setEditAdminDistrictId] = useState('');
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  // Administrator detail viewing states
  const [selectedAdminForView, setSelectedAdminForView] = useState<ApiUser | null>(null);
  const [isViewAdminModalOpen, setIsViewAdminModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfileMobile(currentUser.mobile || '');
    }
  }, [currentUser]);
  
  // Data lists
  const [districts, setDistricts] = useState<District[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MembershipRequest[]>([]);
  const [members, setMembers] = useState<ApiUser[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // Loading indicators
  const [loading, setLoading] = useState(false);
  const [isMocking, setIsMocking] = useState(true);

  // Forms / Inputs
  const [newDistrict, setNewDistrict] = useState({ name: '', code: '' });
  const [newNews, setNewNews] = useState({ title_en: '', title_hi: '', category: 'Pension', content_en: '', content_hi: '', image_url: '' });
  const [newEvent, setNewEvent] = useState({ title_en: '', title_hi: '', date: '', time: '', day: '', venue_en: '', venue_hi: '', type: 'Meeting', description_en: '', image_urls: '' });
  const [newGallery, setNewGallery] = useState({ title: '', album_name: 'General', image_urls: '', date: '', time: '', day: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', district_id: 'global', link_url: '', file_url: '', photo_url: '', date: '', time: '', day: '' });
  const [newCommittee, setNewCommittee] = useState({ name: '', description: '', image_url: '', file_url: '', members_list: '' });

  // Modal states
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState(false);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [lastNoticesCount, setLastNoticesCount] = useState<number | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState({ id: '', notes: '' });

  // Event attendee viewer states
  const [selectedEventRegistrants, setSelectedEventRegistrants] = useState<any[]>([]);
  const [isRegistrantsModalOpen, setIsRegistrantsModalOpen] = useState(false);
  const [selectedEventForViewReg, setSelectedEventForViewReg] = useState<Event | null>(null);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);

  // Editing states
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [editingCommitteeId, setEditingCommitteeId] = useState<number | string | null>(null);

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
    setEditingNewsId(null);
    setNewNews({ title_en: '', title_hi: '', category: 'Pension', content_en: '', content_hi: '', image_url: '' });
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEventId(null);
    setNewEvent({ title_en: '', title_hi: '', date: '', time: '', day: '', venue_en: '', venue_hi: '', type: 'Meeting', description_en: '', image_urls: '' });
  };

  const closeGalleryModal = () => {
    setIsGalleryModalOpen(false);
    setEditingGalleryId(null);
    setNewGallery({ title: '', album_name: 'General', image_urls: '', date: '', time: '', day: '' });
  };

  const closeNoticeModal = () => {
    setIsNoticeModalOpen(false);
    setEditingNoticeId(null);
    setNewNotice({ title: '', content: '', district_id: 'global', link_url: '', file_url: '', photo_url: '', date: '', time: '', day: '' });
  };

  const closeCommitteeModal = () => {
    setIsCommitteeModalOpen(false);
    setEditingCommitteeId(null);
    setNewCommittee({ name: '', description: '', image_url: '', file_url: '', members_list: '' });
  };

  const handleStartEditNews = (item: News) => {
    setNewNews({
      title_en: item.title_en,
      title_hi: item.title_hi,
      category: item.category,
      content_en: item.content_en,
      content_hi: item.content_hi,
      image_url: item.image_url || ''
    });
    setEditingNewsId(Number(item.id));
    setIsNewsModalOpen(true);
  };

  const handleStartEditEvent = (item: Event) => {
    setNewEvent({
      title_en: item.title_en,
      title_hi: item.title_hi,
      date: item.date,
      time: item.time,
      day: item.day || '',
      venue_en: item.venue_en,
      venue_hi: item.venue_hi,
      type: item.type,
      description_en: item.description_en,
      image_urls: Array.isArray(item.image_urls) ? item.image_urls.join(', ') : (item.image_url || '')
    });
    setEditingEventId(Number(item.id));
    setIsEventModalOpen(true);
  };

  const handleStartEditGallery = (item: any) => {
    setNewGallery({
      title: item.title,
      album_name: item.album_name,
      date: item.date || '',
      time: item.time || '',
      day: item.day || '',
      image_urls: Array.isArray(item.image_urls) ? item.image_urls.join(', ') : (item.image_url || '')
    });
    setEditingGalleryId(Number(item.id));
    setIsGalleryModalOpen(true);
  };

  const handleStartEditNotice = (item: Notice) => {
    setNewNotice({
      title: item.title,
      content: item.content,
      district_id: item.district_id ? item.district_id.toString() : 'global',
      link_url: item.link_url || '',
      file_url: item.file_url || '',
      photo_url: item.photo_url || '',
      date: item.date || '',
      time: item.time || '',
      day: item.day || ''
    });
    setEditingNoticeId(Number(item.id));
    setIsNoticeModalOpen(true);
  };



  // --- Session check ---
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('ppa_logged_in_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        if (parsed.role === 'member') {
          setActiveTab('member_card');
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  // Load gateway status and data
  useEffect(() => {
    if (currentUser) {
      checkConnection();
      loadDashboardData();
    }
  }, [currentUser, activeTab]);

  // Request browser notification permissions on mount
  useEffect(() => {
    if (currentUser && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification("Notifications Enabled / अधिसूचना चालू 🔔", {
              body: "You will now receive real-time updates and notices directly on this device.",
              icon: "/favicon.ico"
            });
          }
        });
      }
    }
  }, [currentUser]);

  // Poll for new notices and trigger notifications
  useEffect(() => {
    if (!currentUser) return;

    const checkNewNotices = async () => {
      try {
        const districtId = currentUser.role === 'districtadmin' || currentUser.role === 'member' ? currentUser.district_id : undefined;
        const list = await apiGateway.getNotices(districtId);
        
        if (lastNoticesCount !== null && list.length > lastNoticesCount) {
          const latestNotice = list[0];
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification("New Notice Posted / नई सूचना 🔔", {
              body: `${latestNotice.title}: ${latestNotice.content.substring(0, 60)}...`,
              icon: "/favicon.ico"
            });
          }
          loadDashboardData();
        }
        setLastNoticesCount(list.length);
      } catch (err) {}
    };

    // Run initial count fetch
    if (lastNoticesCount === null) {
      const getInitialCount = async () => {
        try {
          const districtId = currentUser.role === 'districtadmin' || currentUser.role === 'member' ? currentUser.district_id : undefined;
          const list = await apiGateway.getNotices(districtId);
          setLastNoticesCount(list.length);
        } catch (e) {}
      };
      getInitialCount();
    }

    const interval = setInterval(checkNewNotices, 8000);
    return () => clearInterval(interval);
  }, [currentUser, lastNoticesCount]);

  // Poll for resolved grievances and trigger notifications (for members)
  // Deprecated: Grievances removed

  const checkConnection = async () => {
    const isMock = await apiGateway.isMock();
    setIsMocking(isMock);
  };

  const loadDashboardData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const districtId = currentUser.role === 'member' ? currentUser.district_id : undefined;
      
      // Load districts always
      const distList = await apiGateway.getDistricts();
      setDistricts(distList);

      // Load specific tab data to minimize loading times
      if (activeTab === 'overview') {
        const dashboardStats = await apiGateway.getStats(districtId);
        setStats(dashboardStats);
      } else if (activeTab === 'requests') {
        const requests = await apiGateway.getPendingRequests(districtId);
        setPendingRequests(requests);
      } else if (activeTab === 'members') {
        const membersList = await apiGateway.getMembers(districtId);
        setMembers(membersList);
      } else if (activeTab === 'news') {
        const newsList = await apiGateway.getNews(districtId);
        setNews(newsList);
      } else if (activeTab === 'events' || activeTab === 'member_events') {
        const eventsList = await apiGateway.getEvents(districtId, currentUser.id);
        setEvents(eventsList);
      } else if (activeTab === 'gallery') {
        const galleryList = await apiGateway.getGallery(districtId);
        setGallery(galleryList);
      } else if (activeTab === 'notices') {
        const noticesList = await apiGateway.getNotices(districtId);
        setNotices(noticesList);
      } else if (activeTab === 'committees') {
        const commsList = await apiGateway.getCommittees();
        setCommittees(commsList);
      } else if (activeTab === 'submissions') {
        const list = await apiGateway.getSubmissions();
        setSubmissions(list);
      } else if (activeTab === 'settings') {
        if (currentUser.role !== 'member') {
          const list = await apiGateway.getAdminUsers();
          setAdminUsers(list);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ppa_logged_in_user');
    router.push('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!profileName.trim() || !profileEmail.trim()) {
      toast({
        title: "Required Fields Missing / आवश्यक फ़ील्ड गायब हैं",
        description: "Name and email are required. / नाम और ईमेल आवश्यक हैं।",
        variant: "destructive"
      });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match / पासवर्ड मेल नहीं खाते",
        description: "Please check your passwords. / कृपया अपना पासवर्ड दोबारा जांचें।",
        variant: "destructive"
      });
      return;
    }

    setSavingProfile(true);
    try {
      const payload: any = {
        user_id: currentUser.id,
        name: profileName,
        email: profileEmail,
        mobile: profileMobile
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await apiGateway.updateProfile(payload);
      if (res.success) {
        const updatedUser = {
          ...currentUser,
          name: profileName,
          email: profileEmail,
          mobile: profileMobile
        };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('ppa_logged_in_user', JSON.stringify(updatedUser));
        setNewPassword('');
        setConfirmPassword('');
        toast({
          title: "Profile Updated / प्रोफ़ाइल अपडेट हो गई",
          description: "Your profile details have been saved successfully. / आपके प्रोफ़ाइल विवरण सफलतापूर्वक सहेज लिए गए हैं।",
        });
      } else {
        toast({
          title: "Update Failed / अपडेट विफल रहा",
          description: res.error || "Could not update profile. / प्रोफ़ाइल अपडेट नहीं की जा सकी।",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Update Error / त्रुटि",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminMobile.trim() || !newAdminPassword.trim()) {
      toast({
        title: "Required Fields Missing / आवश्यक फ़ील्ड गायब हैं",
        description: "Name, email, mobile, and password are required. / नाम, ईमेल, मोबाइल और पासवर्ड आवश्यक हैं।",
        variant: "destructive"
      });
      return;
    }

    setCreatingAdmin(true);
    try {
      const res = await apiGateway.createAdminUser({
        name: newAdminName,
        email: newAdminEmail,
        mobile: newAdminMobile,
        password: newAdminPassword,
        role: newAdminRole,
        district_id: newAdminRole === 'districtadmin' ? newAdminDistrictId : null,
        creator_id: currentUser.id
      });

      if (res.success) {
        setCreatedAdminInfo({
          email: newAdminEmail,
          name: newAdminName,
          role: newAdminRole
        });
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminMobile('');
        setNewAdminPassword('');
        setNewAdminRole('districtadmin');
        setNewAdminDistrictId('');
        toast({
          title: "Admin Account Created / एडमिन खाता बनाया गया",
          description: res.message || "The administrator account has been created successfully. / व्यवस्थापक खाता सफलतापूर्वक बनाया गया है।",
        });
      } else {
        toast({
          title: "Creation Failed / निर्माण विफल",
          description: res.error || "Could not create administrator account.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Creation Error / त्रुटि",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  // --- CRUD Submission Handlers ---

  const handleCreateDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrict.name || !newDistrict.code) return;
    const ok = await apiGateway.createDistrict(newDistrict.name, newDistrict.code, currentUser?.id);
    if (ok) {
      setNewDistrict({ name: '', code: '' });
      loadDashboardData();
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = false;
    if (editingNewsId !== null) {
      ok = await apiGateway.updateNews(editingNewsId, {
        ...newNews,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null,
        author_id: currentUser?.id
      });
    } else {
      ok = await apiGateway.createNews({
        ...newNews,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null,
        author_id: currentUser?.id
      });
    }
    if (ok) {
      setNewNews({ title_en: '', title_hi: '', category: 'Pension', content_en: '', content_hi: '', image_url: '' });
      setEditingNewsId(null);
      setIsNewsModalOpen(false);
      loadDashboardData();
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = false;
    if (editingEventId !== null) {
      ok = await apiGateway.updateEvent(editingEventId, {
        ...newEvent,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null,
        author_id: currentUser?.id
      });
    } else {
      ok = await apiGateway.createEvent({
        ...newEvent,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null,
        author_id: currentUser?.id
      });
    }
    if (ok) {
      setNewEvent({ title_en: '', title_hi: '', date: '', time: '', day: '', venue_en: '', venue_hi: '', type: 'Meeting', description_en: '', image_urls: '' });
      setEditingEventId(null);
      setIsEventModalOpen(false);
      loadDashboardData();
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const dId = newNotice.district_id === 'global' ? null : newNotice.district_id;
    let ok = false;
    const noticeExtra = {
      link_url: newNotice.link_url || undefined,
      file_url: newNotice.file_url || undefined,
      photo_url: newNotice.photo_url || undefined,
      date: newNotice.date || undefined,
      time: newNotice.time || undefined,
      day: newNotice.day || undefined
    };
    if (editingNoticeId !== null) {
      ok = await apiGateway.updateNotice(editingNoticeId, newNotice.title, newNotice.content, dId, currentUser?.id, noticeExtra);
    } else {
      ok = await apiGateway.createNotice(newNotice.title, newNotice.content, dId, currentUser?.id, noticeExtra);
    }
    if (ok) {
      setNewNotice({ title: '', content: '', district_id: 'global', link_url: '', file_url: '', photo_url: '', date: '', time: '', day: '' });
      setEditingNoticeId(null);
      setIsNoticeModalOpen(false);
      loadDashboardData();
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = false;
    if (editingGalleryId !== null) {
      ok = await apiGateway.updateGallery(editingGalleryId, {
        ...newGallery,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null
      });
    } else {
      ok = await apiGateway.createGallery({
        ...newGallery,
        district_id: currentUser?.role === 'districtadmin' ? currentUser.district_id : null
      });
    }
    if (ok) {
      setNewGallery({ title: '', album_name: 'General', image_urls: '', date: '', time: '', day: '' });
      setEditingGalleryId(null);
      setIsGalleryModalOpen(false);
      loadDashboardData();
    }
  };

  const handleDeleteNotice = async (id: any) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      const ok = await apiGateway.deleteNotice(id, currentUser?.id);
      if (ok) loadDashboardData();
    }
  };

  const handleViewRegistrations = async (event: Event) => {
    setSelectedEventForViewReg(event);
    setLoadingRegistrants(true);
    setIsRegistrantsModalOpen(true);
    try {
      const list = await apiGateway.getEventRegistrations(event.id);
      setSelectedEventRegistrants(list);
    } catch (err) {
      console.error('Failed to load event registrants:', err);
    } finally {
      setLoadingRegistrants(false);
    }
  };

  const handleStartEditCommittee = (item: Committee) => {
    setNewCommittee({
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || '',
      file_url: item.file_url || '',
      members_list: item.members_list || ''
    });
    setEditingCommitteeId(item.id);
    setIsCommitteeModalOpen(true);
  };

  const handleCreateCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommittee.name) return;
    let ok = false;
    const commData = {
      name: newCommittee.name,
      description: newCommittee.description,
      image_url: newCommittee.image_url,
      file_url: newCommittee.file_url,
      members_list: newCommittee.members_list,
      admin_id: currentUser?.id
    };
    if (editingCommitteeId !== null) {
      ok = await apiGateway.updateCommittee(editingCommitteeId, commData);
    } else {
      ok = await apiGateway.createCommittee(commData);
    }
    if (ok) {
      closeCommitteeModal();
      loadDashboardData();
    }
  };

  const handleDeleteCommittee = async (id: any) => {
    if (confirm('Are you sure you want to delete this committee/group?')) {
      const ok = await apiGateway.deleteCommittee(id, currentUser?.id);
      if (ok) loadDashboardData();
    }
  };

  const handleApproveMember = async (requestId: any) => {
    const ok = await apiGateway.approveRequest(requestId, currentUser?.id);
    if (ok) loadDashboardData();
  };

  const handleRejectMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionNotes.id || !rejectionNotes.notes) return;
    const ok = await apiGateway.rejectRequest(rejectionNotes.id, rejectionNotes.notes, currentUser?.id);
    if (ok) {
      setRejectionNotes({ id: '', notes: '' });
      loadDashboardData();
    }
  };

  const handleDeleteNews = async (id: any) => {
    if (confirm('Delete this news article?')) {
      const ok = await apiGateway.deleteNews(id, currentUser?.id);
      if (ok) loadDashboardData();
    }
  };

  const handleDeleteEvent = async (id: any) => {
    if (confirm('Delete this event?')) {
      const ok = await apiGateway.deleteEvent(id, currentUser?.id);
      if (ok) loadDashboardData();
    }
  };

  const handleStartEditAdmin = (admin: ApiUser) => {
    setEditingAdmin(admin);
    setEditAdminName(admin.name);
    setEditAdminEmail(admin.email);
    setEditAdminMobile(admin.mobile);
    setEditAdminRole(admin.role);
    setEditAdminDistrictId(admin.district_id ? admin.district_id.toString() : '');
    setEditAdminPassword('');
    setIsEditAdminModalOpen(true);
  };

  const handleEditAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setUpdatingAdmin(true);
    try {
      const res = await apiGateway.updateAdminUser(editingAdmin.id, {
        name: editAdminName,
        email: editAdminEmail,
        mobile: editAdminMobile,
        role: editAdminRole,
        district_id: editAdminRole === 'districtadmin' ? editAdminDistrictId : null,
        password: editAdminPassword || undefined,
        admin_id: currentUser?.id
      });
      if (res.success) {
        toast({
          title: "Admin Updated",
          description: "Administrator account details updated successfully."
        });
        setIsEditAdminModalOpen(false);
        setEditingAdmin(null);
        loadDashboardData();
      } else {
        toast({
          title: "Update Failed",
          description: res.error || "Could not update administrator account.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Connection Error",
        description: err.message || "Failed to submit administrator update.",
        variant: "destructive"
      });
    } finally {
      setUpdatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id: any) => {
    if (confirm('Are you sure you want to delete this administrator account?')) {
      try {
        const res = await apiGateway.deleteAdminUser(id, currentUser?.id);
        if (res.success) {
          toast({
            title: "Admin Deleted",
            description: "Administrator account has been deleted successfully."
          });
          loadDashboardData();
        } else {
          toast({
            title: "Deletion Failed",
            description: res.error || "Could not delete administrator account.",
            variant: "destructive"
          });
        }
      } catch (err: any) {
        toast({
          title: "Connection Error",
          description: err.message || "Failed to request administrator deletion.",
          variant: "destructive"
        });
      }
    }
  };

  const handleViewAdminDetails = (admin: ApiUser) => {
    setSelectedAdminForView(admin);
    setIsViewAdminModalOpen(true);
  };

  const handleStartEditMember = (m: ApiUser) => {
    setEditingMember({
      user_id: m.id,
      name: m.name,
      email: m.email,
      mobile: m.mobile || '',
      district_id: m.district_id,
      designation: m.member_details?.designation || '',
      department: m.member_details?.department || '',
      membership_status: m.member_details?.membership_status || 'active'
    });
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const ok = await apiGateway.updateMember(editingMember, currentUser?.id);
    if (ok) {
      setEditingMember(null);
      loadDashboardData();
    }
  };

  const handleDeleteMember = async (userId: any) => {
    if (confirm('Are you sure you want to suspend/delete this member? This action is permanent.')) {
      const ok = await apiGateway.deleteMember(userId, currentUser?.id);
      if (ok) {
        loadDashboardData();
      }
    }
  };



  const handlePrintCard = () => {
    window.print();
  };

  if (!isClient || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 flex-col gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-muted-foreground">Initializing platform session...</p>
      </div>
    );
  }

  const roleName = {
    superadmin: 'Super Admin',
    stateadmin: 'State Admin',
    districtadmin: `${currentUser.district_name || 'District'} Admin`,
    member: 'PPA Member'
  }[currentUser.role];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 w-full">
        
        {/* SIDEBAR PANEL */}
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="p-6 border-b border-slate-100 bg-white">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-base font-headline font-bold text-slate-900 leading-none">PPA Lucknow</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">SaaS Management</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3 bg-white py-4">
            <SidebarMenu>
              {/* Common menu */}
              {currentUser.role !== 'member' && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} tooltip="Dashboard">
                    <LayoutDashboard className="w-4 h-4 text-slate-500" /> <span>Dashboard Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Admin Portal Menu (All Admin Roles) */}
              {currentUser.role !== 'member' && (
                <>
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Admin Portal</div>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} tooltip="Requests">
                      <UserCheck className="w-4 h-4 text-slate-500" /> <span>Verify Members</span>
                      {stats?.pending_applications > 0 && <Badge className="ml-auto bg-amber-500 text-white border-none">{stats.pending_applications}</Badge>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'members'} onClick={() => setActiveTab('members')} tooltip="Members">
                      <User className="w-4 h-4 text-slate-500" /> <span>Members Directory</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'news'} onClick={() => setActiveTab('news')} tooltip="News">
                      <FileText className="w-4 h-4 text-slate-500" /> <span>Manage News</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} tooltip="Events">
                      <Calendar className="w-4 h-4 text-slate-500" /> <span>Manage Events</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} tooltip="Gallery">
                      <FileSpreadsheet className="w-4 h-4 text-slate-500" /> <span>Manage Gallery</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'notices'} onClick={() => setActiveTab('notices')} tooltip="Notices">
                      <Bell className="w-4 h-4 text-slate-500" /> <span>Notice Board</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'committees'} onClick={() => setActiveTab('committees')} tooltip="Committees">
                      <Users className="w-4 h-4 text-slate-500" /> <span>Manage Committees</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} tooltip="Submissions">
                      <MessageSquare className="w-4 h-4 text-slate-500" /> <span>Contact Requests</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Member Menu */}
              {currentUser.role === 'member' && (
                <>
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Member Portal</div>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'member_card'} onClick={() => setActiveTab('member_card')} tooltip="Card">
                      <CreditCard className="w-4 h-4 text-slate-500" /> <span>Membership ID Card</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* Documents, Registered Events, and Grievances removed from member view */}
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'notices'} onClick={() => setActiveTab('notices')} tooltip="Notices">
                      <Bell className="w-4 h-4 text-slate-500" /> <span>Notices & Updates</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              <div className="mt-8 border-t pt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} tooltip="Settings">
                    <Settings className="w-4 h-4 text-slate-500" /> <span>Account Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-red-50 hover:text-destructive mt-1">
                    <LogOut className="w-4 h-4" /> <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* INSET MAIN CONTENT */}
        <SidebarInset className="bg-slate-50/30 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-8 w-px bg-slate-100 mx-2"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">Welcome, {currentUser.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{roleName}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isMocking ? (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-bold text-[10px]">
                  Local Storage Fallback (Offline)
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold text-[10px]">
                  PHP Backend Live
                </Badge>
              )}
              <Button size="sm" variant="outline" className="rounded-full h-8" onClick={loadDashboardData}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reload
              </Button>
            </div>
          </header>

          <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full flex-grow">

            {/* =======================================================
                A. TAB: OVERVIEW (ANALYTICS)
                ======================================================= */}
            {activeTab === 'overview' && currentUser.role !== 'member' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Members</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_members ?? 0}</h3>
                        <p className="text-xs text-muted-foreground mt-1">State wide registered</p>
                      </div>
                      <div className="bg-primary/10 p-3.5 rounded-2xl text-primary">
                        <User className="w-7 h-7" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Approvals</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.pending_applications ?? 0}</h3>
                        <p className="text-xs text-amber-600 font-semibold mt-1">Needs verification</p>
                      </div>
                      <div className="bg-amber-100 p-3.5 rounded-2xl text-amber-600">
                        <UserCheck className="w-7 h-7" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Committees</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{committees.length}</h3>
                        <p className="text-xs text-rose-600 font-semibold mt-1">Uploaded groups</p>
                      </div>
                      <div className="bg-rose-100 p-3.5 rounded-2xl text-rose-600">
                        <Users className="w-7 h-7" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Events</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_events ?? 0}</h3>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">Conducted & planned</p>
                      </div>
                      <div className="bg-indigo-100 p-3.5 rounded-2xl text-indigo-600">
                        <Calendar className="w-7 h-7" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* District Wise Members chart mockup */}
                  <Card className="lg:col-span-8 border-none shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="font-headline font-bold text-lg">District wise Member Distribution</CardTitle>
                      <CardDescription>SaaS district metrics for PPA Uttar Pradesh</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stats?.districts_data && stats.districts_data.map((d: any, i: number) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{d.district_name}</span>
                            <span>{d.members_count} members</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(10, d.members_count * 10))}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Audit Timeline Logs */}
                  <Card className="lg:col-span-4 border-none shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="font-headline font-bold text-lg">Activity Audit Log</CardTitle>
                      <CardDescription>Auditing system logs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stats?.activity_logs && stats.activity_logs.map((log: any, idx: number) => (
                        <div key={idx} className="flex gap-3 text-xs relative">
                          {idx !== stats.activity_logs.length - 1 && <div className="absolute left-2.5 top-6 bottom-0 w-px bg-slate-100"></div>}
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            L
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800">{log.action}</p>
                            <p className="text-slate-500 leading-normal">{log.details}</p>
                            <p className="text-[9px] text-slate-400">{log.user_name} • {new Date(log.created_at).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* =======================================================
                B. TAB: MEMBERSHIP VERIFICATION REQUESTS
                ======================================================= */}
            {activeTab === 'requests' && (
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold font-headline">Verify Registration Requests</CardTitle>
                  <CardDescription>Approve or reject pending membership requests for pensioners</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
                  ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <UserCheck className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                      <p className="font-bold text-lg text-slate-500">No pending verification requests</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-4 px-4">Pensioner / संपर्क</th>
                            <th className="py-4 px-4">Retired Designation</th>
                            <th className="py-4 px-4">District Branch</th>
                            <th className="py-4 px-4">PPO Number</th>
                            <th className="py-4 px-4">Address</th>
                            <th className="py-4 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {pendingRequests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-50/50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                                    {req.photo_url ? (
                                      <AvatarImage src={req.photo_url} alt={req.name} className="object-cover" />
                                    ) : (
                                      <AvatarFallback><UserCircle className="w-6 h-6 text-slate-400" /></AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-slate-800">{req.name}</p>
                                    <p className="text-xs text-slate-400">{req.email} • {req.mobile}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <p className="font-semibold text-slate-800">{req.designation}</p>
                                <p className="text-xs text-slate-400">{req.department}</p>
                              </td>
                              <td className="py-4 px-4 font-bold text-slate-800">{req.district_name}</td>
                              <td className="py-4 px-4 text-slate-600 font-mono text-xs">{req.ppo_number || 'N/A'}</td>
                              <td className="py-4 px-4">
                                <p className="text-xs text-slate-600">{req.address}</p>
                                <p className="text-[10px] text-slate-400">{req.city}, {req.pincode}</p>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2 justify-center">
                                  <Button size="sm" onClick={() => handleApproveMember(req.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg h-9 px-3">
                                    Approve / Verify
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => setRejectionNotes({ id: req.id.toString(), notes: 'Documents verification failed' })} className="font-bold rounded-lg h-9 px-3">
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {rejectionNotes.id && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                      <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                          <div>
                            <CardTitle className="text-lg font-bold font-headline">Reject Membership Request / अनुरोध अस्वीकृत करें</CardTitle>
                            <CardDescription>Input rejection notes for verification failure</CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            onClick={() => setRejectionNotes({ id: '', notes: '' })}
                            className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                          >
                            ✕
                          </Button>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          <Label className="font-bold text-slate-700">Rejection Notes / अस्वीकृति कारण</Label>
                          <Textarea 
                            placeholder="State reason for rejecting the pensioner request..." 
                            value={rejectionNotes.notes}
                            onChange={(e) => setRejectionNotes({ ...rejectionNotes, notes: e.target.value })}
                            className="mt-2"
                          />
                          <div className="flex gap-2 justify-end border-t pt-4 mt-4">
                            <Button size="sm" variant="destructive" onClick={handleRejectMember} className="font-bold">Confirm Reject</Button>
                            <Button size="sm" variant="outline" onClick={() => setRejectionNotes({ id: '', notes: '' })} className="font-bold">Cancel</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* =======================================================
                C. TAB: MEMBERS DIRECTORY
                ======================================================= */}
            {activeTab === 'members' && (
              <div className="space-y-8">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline">Approved Members Directory</CardTitle>
                    <CardDescription>Audit active government pensioner membership records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-4 px-4">Member ID Card</th>
                            <th className="py-4 px-4">Name</th>
                            <th className="py-4 px-4">Email & Mobile</th>
                            <th className="py-4 px-4">Designation</th>
                            <th className="py-4 px-4">District</th>
                            <th className="py-4 px-4">Status</th>
                            {currentUser.role === 'superadmin' && <th className="py-4 px-4 text-center">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {members.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50/50">
                              <td className="py-4 px-4 font-mono font-bold text-primary">{m.member_details?.member_id_card || 'PPA-GEN-0000'}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                                    {m.member_details?.photo_url || m.photo_url ? (
                                      <AvatarImage src={m.member_details?.photo_url || m.photo_url} alt={m.name} className="object-cover" />
                                    ) : (
                                      <AvatarFallback><UserCircle className="w-6 h-6 text-slate-400" /></AvatarFallback>
                                    )}
                                  </Avatar>
                                  <span className="font-bold text-slate-800">{m.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-slate-600">{m.email} <br /> {m.mobile}</td>
                              <td className="py-4 px-4">
                                <p className="font-medium text-slate-800">{m.member_details?.designation}</p>
                                <p className="text-xs text-slate-400">{m.member_details?.department}</p>
                              </td>
                              <td className="py-4 px-4 font-bold">{m.district_name || 'State'}</td>
                              <td className="py-4 px-4">
                                <Badge className={`${
                                  m.member_details?.membership_status === 'suspended' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' :
                                  m.member_details?.membership_status === 'expired' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                                  'bg-green-100 text-green-700 hover:bg-green-100'
                                } border-none font-bold uppercase text-[10px]`}>
                                  {m.member_details?.membership_status || 'active'}
                                </Badge>
                              </td>
                              {currentUser.role === 'superadmin' && (
                                <td className="py-4 px-4">
                                  <div className="flex gap-2 justify-center">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleStartEditMember(m)}
                                      className="font-bold h-8 px-2.5 rounded-lg"
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => handleDeleteMember(m.id)}
                                      className="font-bold h-8 px-2.5 rounded-lg"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {editingMember && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">Edit Member Details / सदस्य विवरण संपादित करें</CardTitle>
                          <CardDescription>Update name, contact, designation, or change district and membership status</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => setEditingMember(null)}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form onSubmit={handleUpdateMember} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Full Name / पूरा नाम</Label>
                              <Input 
                                value={editingMember.name} 
                                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email Address / ईमेल</Label>
                              <Input 
                                type="email" 
                                value={editingMember.email} 
                                onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Mobile Number / मोबाइल</Label>
                              <Input 
                                value={editingMember.mobile} 
                                onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>District Branch / जिला</Label>
                              <Select 
                                value={editingMember.district_id?.toString() || ''} 
                                onValueChange={(val) => setEditingMember({ ...editingMember, district_id: val })}
                              >
                                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                <SelectContent>
                                  {districts.map(d => (
                                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Designation (Retired) / सेवानिवृत्त पद</Label>
                              <Input 
                                value={editingMember.designation} 
                                onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Department / विभाग</Label>
                              <Input 
                                value={editingMember.department} 
                                onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2">
                              <Label>Membership Status / सदस्यता स्थिति</Label>
                              <Select 
                                value={editingMember.membership_status} 
                                onValueChange={(val) => setEditingMember({ ...editingMember, membership_status: val })}
                              >
                                <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end border-t pt-4 mt-6">
                            <Button type="submit" className="font-bold">Save Changes</Button>
                            <Button type="button" variant="outline" onClick={() => setEditingMember(null)} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                D. TAB: DISTRICT CONTROL (SUPER ADMIN ONLY)
                ======================================================= */}
            {activeTab === 'districts' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="font-bold font-headline text-xl">Active District Branches / सक्रिय जिला शाखाएं</CardTitle>
                      <CardDescription>List of administrative districts managed in UP</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsDistrictModalOpen(true)}
                      className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                    >
                      <PlusCircle className="w-4 h-4" /> Add District
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {districts.map(d => (
                        <div key={d.id} className="flex justify-between items-center p-4 bg-slate-50 border rounded-xl hover:bg-slate-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Building2 className="text-primary w-5 h-5" />
                            <span className="font-bold text-slate-800">{d.name}</span>
                          </div>
                          <Badge variant="secondary" className="font-mono text-xs px-2.5 font-bold uppercase">{d.code}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {isDistrictModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">Add New District Branch / नई जिला शाखा जोड़ें</CardTitle>
                          <CardDescription>Expand SaaS registration capabilities</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => setIsDistrictModalOpen(false)}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form className="space-y-4" onSubmit={async (e) => {
                          await handleCreateDistrict(e);
                          setIsDistrictModalOpen(false);
                        }}>
                          <div className="space-y-2">
                            <Label>District Name / जिला का नाम *</Label>
                            <Input 
                              placeholder="e.g. Gorakhpur" 
                              value={newDistrict.name}
                              onChange={(e) => setNewDistrict({ ...newDistrict, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>District Code (3 characters) / जिला कोड *</Label>
                            <Input 
                              placeholder="e.g. GKP" 
                              maxLength={3}
                              value={newDistrict.code}
                              onChange={(e) => setNewDistrict({ ...newDistrict, code: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex gap-2 justify-end border-t pt-4 mt-6">
                            <Button type="submit" className="font-bold">Create Branch</Button>
                            <Button type="button" variant="outline" className="font-bold" onClick={() => setIsDistrictModalOpen(false)}>Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}            {activeTab === 'news' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">News & Updates Portal</CardTitle>
                      <CardDescription>State-wide announcements and local district news</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsNewsModalOpen(true)}
                      className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                    >
                      <PlusCircle className="w-4 h-4" /> Add News
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {news.map(n => (
                      <div key={n.id} className="p-5 bg-slate-50 border rounded-2xl flex gap-4 relative group">
                        {n.image_url && (
                          <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                            <img src={n.image_url} alt={n.title_en} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none">{n.category}</Badge>
                            {n.district_name ? (
                              <Badge variant="secondary">{n.district_name}</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">State-wide</Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-lg text-slate-800">{n.title_hi}</h4>
                          <h5 className="font-medium text-sm text-slate-500 italic">{n.title_en}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">{n.content_hi}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Posted: {n.created_at.split('T')[0]}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleStartEditNews(n)}
                            className="text-primary hover:bg-slate-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteNews(n.id)}
                            className="text-destructive hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* News Modal Overlay */}
                {isNewsModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            {editingNewsId !== null ? 'Edit News / Update' : 'Publish News / Update'}
                          </CardTitle>
                          <CardDescription>Post circular updates or association announcements</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={closeNewsModal}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <form className="space-y-4" onSubmit={handleCreateNews}>
                          <div className="space-y-2">
                            <Label>News Title (Hindi) *</Label>
                            <Input 
                              placeholder="पेंशन संशोधन नोटिस..." 
                              value={newNews.title_hi}
                              onChange={(e) => setNewNews({ ...newNews, title_hi: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>News Title (English) *</Label>
                            <Input 
                              placeholder="Pension Revision Notice..." 
                              value={newNews.title_en}
                              onChange={(e) => setNewNews({ ...newNews, title_en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select 
                              value={newNews.category} 
                              onValueChange={(val) => setNewNews({ ...newNews, category: val })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pension">Pension</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Policy">Policy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Choose Feature Image (Choose from phone/desktop)</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setUploadingImage(true);
                                    const res = await apiGateway.uploadImage(file);
                                    if (res.success && res.url) {
                                      setNewNews({ ...newNews, image_url: res.url });
                                    }
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {uploadingImage && <p className="text-xs text-primary font-bold animate-pulse">Uploading image... / चित्र अपलोड हो रहा है...</p>}
                              {newNews.image_url && (
                                <div className="mt-2 w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border">
                                  <img src={newNews.image_url} alt="Uploaded preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Content (Hindi) *</Label>
                            <Textarea 
                              rows={4}
                              value={newNews.content_hi}
                              onChange={(e) => setNewNews({ ...newNews, content_hi: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Content (English) *</Label>
                            <Textarea 
                              rows={4}
                              value={newNews.content_en}
                              onChange={(e) => setNewNews({ ...newNews, content_en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" className="font-bold">
                              {editingNewsId !== null ? 'Save Changes' : 'Publish Article'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeNewsModal} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                F. TAB: EVENTS MANAGEMENT
                ======================================================= */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">Association Events List</CardTitle>
                      <CardDescription>Scheduled quarterly body meetings and camps</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsEventModalOpen(true)}
                      className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Event
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {events.map(e => (
                      <div key={e.id} className="p-5 bg-slate-50 border rounded-2xl flex gap-4 relative group">
                        {e.image_url && (
                          <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                            <img src={e.image_url} alt={e.title_en} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none">{e.type}</Badge>
                            {e.district_name ? (
                              <Badge variant="secondary">{e.district_name}</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">State-wide</Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-lg text-slate-800">{e.title_en}</h4>
                          <h5 className="font-medium text-sm text-slate-500 italic">{e.title_hi}</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium">
                            <p>📅 {e.date}</p>
                            <p>🕒 {e.time} {e.day ? `(${e.day})` : ''}</p>
                            <p className="col-span-2">📍 {e.venue_en}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 border-none font-bold text-[10px]">
                              {e.registrations_count} Attendees Registered
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRegistrations(e)}
                              className="h-6 text-[10px] font-bold px-2 rounded-full border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 flex items-center gap-1"
                            >
                              👁 View Attendees
                            </Button>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleStartEditEvent(e)}
                            className="text-primary hover:bg-slate-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteEvent(e.id)}
                            className="text-destructive hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Event Creation Modal */}
                {isEventModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            {editingEventId !== null ? 'Edit Event' : 'Create Upcoming Event'}
                          </CardTitle>
                          <CardDescription>Input time, date and venue details</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={closeEventModal}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <form className="space-y-4" onSubmit={handleCreateEvent}>
                          <div className="space-y-2">
                            <Label>Event Title (English) *</Label>
                            <Input 
                              placeholder="e.g. Health Camp..." 
                              value={newEvent.title_en}
                              onChange={(e) => setNewEvent({ ...newEvent, title_en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Event Title (Hindi) *</Label>
                            <Input 
                              placeholder="चिकित्सा शिविर..." 
                              value={newEvent.title_hi}
                              onChange={(e) => setNewEvent({ ...newEvent, title_hi: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Event Date *</Label>
                              <Input 
                                type="date" 
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time Schedule *</Label>
                              <Input 
                                placeholder="e.g. 10 AM - 1 PM" 
                                value={newEvent.time}
                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Day Name *</Label>
                              <Input 
                                placeholder="e.g. Saturday" 
                                value={newEvent.day}
                                onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Venue Name (English) *</Label>
                            <Input 
                              placeholder="e.g. Town Hall..." 
                              value={newEvent.venue_en}
                              onChange={(e) => setNewEvent({ ...newEvent, venue_en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Venue Name (Hindi) *</Label>
                            <Input 
                              placeholder="टाउन हॉल..." 
                              value={newEvent.venue_hi}
                              onChange={(e) => setNewEvent({ ...newEvent, venue_hi: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Event Type</Label>
                              <Select 
                                value={newEvent.type} 
                                onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Meeting">Meeting</SelectItem>
                                  <SelectItem value="Health Camp">Health Camp</SelectItem>
                                  <SelectItem value="Workshop">Workshop</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Event Images (Choose from phone/desktop)</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setUploadingImage(true);
                                    const urls: string[] = [];
                                    for (let i = 0; i < files.length; i++) {
                                      const res = await apiGateway.uploadImage(files[i]);
                                      if (res.success && res.url) {
                                        urls.push(res.url);
                                      }
                                    }
                                    const existingUrls = newEvent.image_urls 
                                      ? newEvent.image_urls.split(',').map(u => u.trim()).filter(Boolean)
                                      : [];
                                    const combined = [...existingUrls, ...urls];
                                    setNewEvent({ ...newEvent, image_urls: combined.join(', ') });
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {uploadingImage && <p className="text-xs text-primary font-bold animate-pulse">Uploading files... / चित्र अपलोड हो रहे हैं...</p>}
                              {newEvent.image_urls && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                  {newEvent.image_urls.split(',').map((url, i) => (
                                    <div key={i} className="relative w-20 h-16 bg-slate-100 rounded-lg overflow-hidden border">
                                      <img src={url.trim()} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                      <Button 
                                        type="button"
                                        onClick={() => {
                                          const remaining = newEvent.image_urls.split(',').map(u => u.trim()).filter((_, idx) => idx !== i);
                                          setNewEvent({ ...newEvent, image_urls: remaining.join(', ') });
                                        }}
                                        className="absolute top-0 right-0 h-4 w-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-0 flex items-center justify-center text-[8px] font-bold"
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea 
                              rows={3}
                              value={newEvent.description_en}
                              onChange={(e) => setNewEvent({ ...newEvent, description_en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" className="font-bold">
                              {editingEventId !== null ? 'Save Changes' : 'Schedule Event'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeEventModal} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Event Attendees Modal */}
                {isRegistrantsModalOpen && selectedEventForViewReg && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            Attendees for: {selectedEventForViewReg.title_en}
                          </CardTitle>
                          <CardDescription>
                            List of users who registered for this event
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => setIsRegistrantsModalOpen(false)}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {loadingRegistrants ? (
                          <div className="flex items-center justify-center py-10 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="text-sm text-slate-500 font-semibold">Loading attendee list...</span>
                          </div>
                        ) : selectedEventRegistrants.length === 0 ? (
                          <div className="text-center py-10 text-slate-400">
                            No attendees registered for this event yet.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className="border-b text-xs font-bold text-slate-400 uppercase">
                                  <th className="py-3 px-4">Name / नाम</th>
                                  <th className="py-3 px-4">Mobile / मोबाइल</th>
                                  <th className="py-3 px-4">Address / पता</th>
                                  <th className="py-3 px-4">Registered At / समय</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y text-sm">
                                {selectedEventRegistrants.map((reg, idx) => (
                                  <tr key={reg.id || idx} className="hover:bg-slate-50/50">
                                    <td className="py-3 px-4 font-bold text-slate-800">{reg.name}</td>
                                    <td className="py-3 px-4 text-slate-600 font-mono">{reg.mobile}</td>
                                    <td className="py-3 px-4 text-slate-600">{reg.address || 'N/A'}</td>
                                    <td className="py-3 px-4 text-slate-400 text-xs">
                                      {reg.created_at ? new Date(reg.created_at).toLocaleString() : 'N/A'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                F2. TAB: GALLERY MANAGEMENT (ADMIN ONLY)
                ======================================================= */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">Gallery Posts List</CardTitle>
                      <CardDescription>Manage photos and albums displayed on the public gallery</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Gallery Post
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading ? (
                      <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
                    ) : gallery.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                        <p className="font-bold text-lg text-slate-500">No gallery posts found</p>
                      </div>
                    ) : (
                      gallery.map(item => (
                        <div key={item.id} className="p-5 bg-slate-50 border rounded-2xl flex gap-4 relative group">
                          {item.image_url && (
                            <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-grow space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary/10 text-primary border-none">{item.album_name}</Badge>
                              {item.district_id ? <Badge variant="secondary">District</Badge> : <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">State-wide</Badge>}
                            </div>
                            <h4 className="font-bold text-base text-slate-800">{item.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">📅 {item.date || 'N/A'} • 🕒 {item.time || 'N/A'} ({item.day || 'N/A'})</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Images count: {item.image_urls ? (Array.isArray(item.image_urls) ? item.image_urls.length : item.image_urls.split(',').length) : 1}</p>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleStartEditGallery(item)}
                              className="text-primary hover:bg-slate-100"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={async () => {
                                if (confirm('Delete this gallery item?')) {
                                  const ok = await apiGateway.deleteGallery(item.id, currentUser?.id);
                                  if (ok) loadDashboardData();
                                }
                              }}
                              className="text-destructive hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Gallery Post Creation Modal */}
                {isGalleryModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            {editingGalleryId !== null ? 'Edit Gallery Post' : 'Add Gallery Post'}
                          </CardTitle>
                          <CardDescription>Upload photos to the public portal</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={closeGalleryModal}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <form className="space-y-4" onSubmit={handleCreateGallery}>
                          <div className="space-y-2">
                            <Label>Post/Event Title *</Label>
                            <Input 
                              placeholder="e.g. Annual Committee Meet 2026..." 
                              value={newGallery.title}
                              onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Album / Category Name</Label>
                            <Input 
                              placeholder="e.g. Meetings, Health, Events" 
                              value={newGallery.album_name}
                              onChange={(e) => setNewGallery({ ...newGallery, album_name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label>Event Date</Label>
                              <Input 
                                type="date" 
                                value={newGallery.date}
                                onChange={(e) => setNewGallery({ ...newGallery, date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time</Label>
                              <Input 
                                placeholder="12:00 PM" 
                                value={newGallery.time}
                                onChange={(e) => setNewGallery({ ...newGallery, time: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Day</Label>
                              <Input 
                                placeholder="Friday" 
                                value={newGallery.day}
                                onChange={(e) => setNewGallery({ ...newGallery, day: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Gallery Images (Choose from phone/desktop)</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setUploadingImage(true);
                                    const urls: string[] = [];
                                    for (let i = 0; i < files.length; i++) {
                                      const res = await apiGateway.uploadImage(files[i]);
                                      if (res.success && res.url) {
                                        urls.push(res.url);
                                      }
                                    }
                                    const existingUrls = newGallery.image_urls 
                                      ? newGallery.image_urls.split(',').map(u => u.trim()).filter(Boolean)
                                      : [];
                                    const combined = [...existingUrls, ...urls];
                                    setNewGallery({ ...newGallery, image_urls: combined.join(', ') });
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {uploadingImage && <p className="text-xs text-primary font-bold animate-pulse">Uploading files... / चित्र अपलोड हो रहे हैं...</p>}
                              {newGallery.image_urls && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                  {newGallery.image_urls.split(',').map((url, i) => (
                                    <div key={i} className="relative w-20 h-16 bg-slate-100 rounded-lg overflow-hidden border">
                                      <img src={url.trim()} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                      <Button 
                                        type="button"
                                        onClick={() => {
                                          const remaining = newGallery.image_urls.split(',').map(u => u.trim()).filter((_, idx) => idx !== i);
                                          setNewGallery({ ...newGallery, image_urls: remaining.join(', ') });
                                        }}
                                        className="absolute top-0 right-0 h-4 w-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-0 flex items-center justify-center text-[8px] font-bold"
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" className="font-bold">
                              {editingGalleryId !== null ? 'Save Changes' : 'Publish Post'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeGalleryModal} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* =======================================================
                H. TAB: NOTICE BOARD & ANNOUNCEMENTS
                ======================================================= */}
            {activeTab === 'notices' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">Notice Board / सूचना पट्ट</CardTitle>
                      <CardDescription>Latest alerts, circulars, and bulletins for members</CardDescription>
                    </div>
                    {currentUser.role !== 'member' && (
                      <Button 
                        onClick={() => setIsNoticeModalOpen(true)}
                        className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Notice
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {notices.map(n => (
                      <div key={n.id} className="p-5 bg-slate-50 border rounded-2xl space-y-4 relative group">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-white border-none py-0 px-2.5 text-[9px] font-bold">ALERT</Badge>
                          <span className="text-[10px] text-slate-400 font-bold">{new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-base text-slate-800">{n.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-body">{n.content}</p>
                        </div>

                        {n.photo_url && (
                          <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border bg-slate-100">
                            <img src={n.photo_url} alt="Notice preview" className="object-cover w-full h-full" />
                          </div>
                        )}

                        {(n.date || n.time || n.day) && (
                          <div className="text-xs text-slate-600 bg-slate-100/50 border p-3 rounded-xl max-w-sm space-y-1 font-medium">
                            {n.date && <div>📅 Meeting Date: {n.date} {n.day ? `(${n.day})` : ''}</div>}
                            {n.time && <div>⏰ Meeting Time: {n.time}</div>}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {n.file_url && (
                            <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[10px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                              <a href={n.file_url} target="_blank" rel="noopener noreferrer" download>
                                📥 Download PDF Doc
                              </a>
                            </Button>
                          )}
                          {n.link_url && (
                            <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[10px] rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold">
                              <a href={n.link_url} target="_blank" rel="noopener noreferrer">
                                🔗 Open Attachment Link
                              </a>
                            </Button>
                          )}
                        </div>

                        {currentUser.role !== 'member' && (
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleStartEditNotice(n)}
                              className="text-primary hover:bg-slate-100"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteNotice(n.id)}
                              className="text-destructive hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notice Modal Overlay */}
                {isNoticeModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            {editingNoticeId !== null ? 'Edit Notice Bulletin' : 'Post Notice Bulletin'}
                          </CardTitle>
                          <CardDescription>Display notification to district/state members</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={closeNoticeModal}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <form className="space-y-4" onSubmit={handleCreateNotice}>
                          <div className="space-y-2">
                            <Label>Notice Title</Label>
                            <Input 
                              placeholder="State body elections, PPO uploads..." 
                              value={newNotice.title}
                              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Notice Scope</Label>
                            <Select 
                              value={newNotice.district_id} 
                              onValueChange={(val) => setNewNotice({ ...newNotice, district_id: val })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="global">State Wide (Global)</SelectItem>
                                {districts.map(d => (
                                  <SelectItem key={d.id} value={d.id.toString()}>{d.name} Local</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Bulletin Content</Label>
                            <Textarea 
                              rows={4}
                              value={newNotice.content}
                              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Meeting Date (Optional)</Label>
                              <Input 
                                type="date" 
                                value={newNotice.date}
                                onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Meeting Day (Optional)</Label>
                              <Input 
                                placeholder="e.g. Wednesday" 
                                value={newNotice.day}
                                onChange={(e) => setNewNotice({ ...newNotice, day: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Meeting Time (Optional)</Label>
                            <Input 
                              placeholder="e.g. 11:00 AM - 1:00 PM" 
                              value={newNotice.time}
                              onChange={(e) => setNewNotice({ ...newNotice, time: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Photo Attachment (Choose from phone/desktop)</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setUploadingImage(true);
                                    const res = await apiGateway.uploadImage(files[0]);
                                    if (res.success && res.url) {
                                      setNewNotice({ ...newNotice, photo_url: res.url });
                                    }
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {uploadingImage && <p className="text-xs text-primary font-bold animate-pulse">Uploading file... / फ़ाइल अपलोड हो रही है...</p>}
                              {newNotice.photo_url && (
                                <div className="relative w-24 h-16 bg-slate-100 rounded-lg overflow-hidden border">
                                  <img src={newNotice.photo_url} alt="Notice Photo" className="w-full h-full object-cover" />
                                  <Button 
                                    type="button"
                                    onClick={() => setNewNotice({ ...newNotice, photo_url: '' })}
                                    className="absolute top-0 right-0 h-4 w-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-0 flex items-center justify-center text-[8px] font-bold"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Document PDF Attachment (Choose PDF from phone/desktop)</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="application/pdf"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setUploadingImage(true);
                                    const res = await apiGateway.uploadImage(files[0]);
                                    if (res.success && res.url) {
                                      setNewNotice({ ...newNotice, file_url: res.url });
                                    }
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {newNotice.file_url && (
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                                  <span className="text-primary font-bold font-mono text-[10px] truncate max-w-[200px]">
                                    📄 {newNotice.file_url.split('/').pop()}
                                  </span>
                                  <Button 
                                    type="button"
                                    onClick={() => setNewNotice({ ...newNotice, file_url: '' })}
                                    className="h-4 w-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-0 flex items-center justify-center text-[8px] font-bold shrink-0"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>External Link URL (Optional)</Label>
                            <Input 
                              placeholder="e.g. https://external-website.com" 
                              value={newNotice.link_url}
                              onChange={(e) => setNewNotice({ ...newNotice, link_url: e.target.value })}
                            />
                          </div>

                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" className="font-bold">
                              {editingNoticeId !== null ? 'Save Changes' : 'Post Bulletin'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeNoticeModal} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                I. TAB: COMMITTEES MANAGEMENT
                ======================================================= */}
            {activeTab === 'committees' && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">Manage Committee Members / समिति सदस्य</CardTitle>
                      <CardDescription>Upload committee members, their roles, and photos to show on the public About Us page</CardDescription>
                    </div>
                    {currentUser.role !== 'member' && (
                      <Button 
                        onClick={() => setIsCommitteeModalOpen(true)}
                        className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Committee Member
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="text-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="text-xs text-slate-400 mt-2">Loading committee members...</p>
                      </div>
                    ) : committees.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 font-semibold border-2 border-dashed rounded-3xl">
                        No committee members uploaded yet. Click "Add Committee Member" to create one.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {committees.map(c => (
                          <div key={c.id} className="p-6 bg-slate-50 border rounded-2xl flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-center">
                              {c.image_url ? (
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                                  <img src={c.image_url} alt={c.name} className="object-cover w-full h-full" />
                                </div>
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs border">
                                  No Photo
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-lg text-slate-800 leading-snug">{c.name}</h4>
                                <p className="text-sm font-bold text-primary mt-1">{c.description || 'Committee Member'}</p>
                              </div>
                            </div>

                            {currentUser.role !== 'member' && (
                              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleStartEditCommittee(c)}
                                  className="text-primary hover:bg-slate-100 h-8 w-8"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteCommittee(c.id)}
                                  className="text-destructive hover:bg-red-50 h-8 w-8"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Committee Modal Overlay */}
                {isCommitteeModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            {editingCommitteeId !== null ? 'Edit Committee Member' : 'Add Committee Member'}
                          </CardTitle>
                          <CardDescription>Enter name, role/designation and upload profile photo</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={closeCommitteeModal}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <form className="space-y-4" onSubmit={handleCreateCommittee}>
                          <div className="space-y-2">
                            <Label>Member Name / सदस्य का नाम *</Label>
                            <Input 
                              placeholder="e.g. Shri B.D. Yadav" 
                              value={newCommittee.name}
                              onChange={(e) => setNewCommittee({ ...newCommittee, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role or Designation / पद *</Label>
                            <Input 
                              placeholder="e.g. President, Vice President, Secretary" 
                              value={newCommittee.description}
                              onChange={(e) => setNewCommittee({ ...newCommittee, description: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Profile Photo / फोटो *</Label>
                            <div className="flex flex-col gap-2">
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setUploadingImage(true);
                                    const res = await apiGateway.uploadImage(files[0]);
                                    if (res.success && res.url) {
                                      setNewCommittee({ ...newCommittee, image_url: res.url });
                                    }
                                    setUploadingImage(false);
                                  }
                                }}
                              />
                              {newCommittee.image_url && (
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-slate-50 mt-2">
                                  <img src={newCommittee.image_url} alt="Committee Photo" className="w-full h-full object-cover" />
                                  <Button 
                                    type="button"
                                    onClick={() => setNewCommittee({ ...newCommittee, image_url: '' })}
                                    className="absolute top-0 right-0 h-5 w-5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0 flex items-center justify-center text-[10px] font-bold"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" className="font-bold">
                              {editingCommitteeId !== null ? 'Save Changes' : 'Publish Member'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeCommitteeModal} className="font-bold">Cancel</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                J. TAB: CONTACT FORM SUBMISSIONS REVIEW
                ======================================================= */}
            {activeTab === 'submissions' && (
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold font-headline">Public Contact Requests</CardTitle>
                  <CardDescription>Review messages submitted from the public contact portal</CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No contact messages found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-4 px-4">From</th>
                            <th className="py-4 px-4">Location</th>
                            <th className="py-4 px-4">Designation</th>
                            <th className="py-4 px-4">Message</th>
                            <th className="py-4 px-4">Received At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {submissions.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/50">
                              <td className="py-4 px-4">
                                <p className="font-bold text-slate-800">{s.name}</p>
                                <p className="text-xs text-slate-400">{s.mobile}</p>
                              </td>
                              <td className="py-4 px-4 text-slate-700">
                                <span className="font-semibold">{s.district}</span>, {s.state}
                              </td>
                              <td className="py-4 px-4 text-slate-600">{s.designation}</td>
                              <td className="py-4 px-4 text-slate-600 max-w-xs">{s.message || 'N/A'}</td>
                              <td className="py-4 px-4 text-slate-400 text-xs">{new Date(s.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* =======================================================
                K. TAB: CONTENT SUMMARIZER (GENKIT FLOW)
                ======================================================= */}


            {/* =======================================================
                L. TAB: MEMBER DIGITAL ID CARD (MEMBER VIEW)
                ======================================================= */}
            {activeTab === 'member_card' && (
              <div className="flex flex-col items-center gap-8 print:p-0">
                <div className="max-w-md w-full bg-gradient-to-br from-primary to-primary/95 text-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-accent relative overflow-hidden print:shadow-none print:border-slate-800">
                  {/* Decorative backgrounds */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-bold italic text-xl shadow-md">
                        P
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-wider font-headline leading-none">PPA Lucknow</span>
                        <span className="text-[8px] font-bold text-accent uppercase tracking-widest mt-1">Uttar Pradesh Pensioners</span>
                      </div>
                    </div>
                    <Badge className="bg-accent text-primary border-none hover:bg-accent text-[9px] font-bold py-0.5 px-2.5 rounded-full shadow-sm">
                      MEMBER
                    </Badge>
                  </div>

                  {/* Card Body */}
                  <div className="flex gap-6 pt-6">
                    <div className="w-24 h-28 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-sm shrink-0 overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        {currentUser.member_details?.photo_url || currentUser.photo_url ? (
                          <AvatarImage src={currentUser.member_details?.photo_url || currentUser.photo_url} alt={currentUser.name} className="object-cover w-full h-full" />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-white"><UserCircle className="w-10 h-10" /></AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    <div className="space-y-3 text-white flex-grow">
                      <div>
                        <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">Full Name</p>
                        <p className="font-bold text-base font-headline leading-none mt-0.5">{currentUser.name}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">Membership Card ID</p>
                        <p className="font-mono font-bold text-sm text-accent leading-none mt-0.5">{currentUser.member_details?.member_id_card || 'PPA-LKO-2025-0042'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">Retired Designation</p>
                        <p className="font-semibold text-xs leading-tight mt-0.5">{currentUser.member_details?.designation || 'Administrative Officer'}</p>
                        <p className="text-[9px] text-white/70">{currentUser.member_details?.department || 'UP Secretariat'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-end pt-6 border-t border-white/10 mt-6 text-white/80 text-[9px]">
                    <div className="space-y-0.5">
                      <p className="text-[7px] text-white/40 uppercase tracking-widest">Office District</p>
                      <p className="font-bold">{currentUser.district_name || 'Lucknow'}</p>
                    </div>
                    <div className="space-y-0.5 text-center">
                      <p className="text-[7px] text-white/40 uppercase tracking-widest">Renewal Date</p>
                      <p className="font-bold text-accent">{currentUser.member_details?.renewal_date || '2026-06-30'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="w-16 h-6 bg-white/10 rounded flex items-center justify-center border border-white/20">
                        <span className="font-mono text-[7px] text-white/60">BARCODE</span>
                      </div>
                      <p className="text-[7px] text-white/40 mt-0.5">Audit Stamp</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 print:hidden">
                  <Button onClick={handlePrintCard} className="rounded-full font-bold h-11 px-8 gap-2 bg-primary text-white">
                    <Printer className="w-4 h-4" /> Print / Download Card
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-headline font-bold text-slate-900 mb-2">Account Settings / खाता सेटिंग्स</h1>
                    <p className="text-slate-500 text-sm">
                      Manage your account details and update your login password. / अपने खाते के विवरण प्रबंधित करें और अपना लॉगिन पासवर्ड अपडेट करें।
                    </p>
                  </div>
                  {currentUser.role !== 'member' && (
                    <Button 
                      onClick={() => setIsCreateAdminModalOpen(true)}
                      className="rounded-full font-bold bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-10 px-4 shrink-0"
                    >
                      <PlusCircle className="w-4 h-4" /> Create Admin Account / व्यवस्थापक खाता बनाएं
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="border-slate-200 shadow-sm bg-white">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold">Profile Details / प्रोफ़ाइल विवरण</CardTitle>
                        <CardDescription>
                          Update your personal information used for your login profile. / अपने लॉगिन प्रोफ़ाइल के लिए उपयोग की जाने वाली व्यक्तिगत जानकारी अपडेट करें।
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="prof-name">Full Name / पूरा नाम *</Label>
                              <Input
                                id="prof-name"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                placeholder="Enter full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="prof-email">Email Address / ईमेल आईडी *</Label>
                              <Input
                                id="prof-email"
                                type="email"
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                placeholder="Enter email address"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="prof-mobile">Mobile Number / मोबाइल नंबर</Label>
                              <Input
                                id="prof-mobile"
                                value={profileMobile}
                                onChange={(e) => setProfileMobile(e.target.value)}
                                placeholder="Enter mobile number"
                              />
                            </div>
                          </div>

                          <div className="border-t pt-6 space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm">Change Password / पासवर्ड बदलें</h3>
                            <p className="text-xs text-muted-foreground">
                              Leave blank if you do not want to change your current password. / यदि आप अपना वर्तमान पासवर्ड नहीं बदलना चाहते हैं तो इसे खाली छोड़ दें।
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-pw">New Password / नया पासवर्ड</Label>
                                <Input
                                  id="new-pw"
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Min 6 characters"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirm-pw">Confirm New Password / पासवर्ड पुष्टि</Label>
                                <Input
                                  id="confirm-pw"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="Re-enter new password"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t">
                            <Button type="submit" disabled={savingProfile} className="gap-2 font-bold">
                              {savingProfile ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                              ) : (
                                <>Save Changes / सुरक्षित करें</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Manage Administrator Accounts */}
                    {currentUser.role !== 'member' && (
                      <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold">Manage Administrator Accounts</CardTitle>
                          <CardDescription>
                            View, edit, or delete active administrator accounts.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Administrators breakdown cards */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                              <p className="text-xs font-bold text-slate-400 uppercase">Total Admins</p>
                              <p className="text-2xl font-bold text-slate-800 mt-1">{adminUsers.length}</p>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center">
                              <p className="text-xs font-bold text-primary uppercase">Super Admins / मुख्य</p>
                              <p className="text-2xl font-bold text-primary mt-1">
                                {adminUsers.filter(u => u.role === 'superadmin').length}
                              </p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                              <p className="text-xs font-bold text-amber-600 uppercase">State Admins / राज्य</p>
                              <p className="text-2xl font-bold text-amber-700 mt-1">
                                {adminUsers.filter(u => u.role === 'stateadmin').length}
                              </p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                              <p className="text-xs font-bold text-emerald-600 uppercase">District Admins / जिला</p>
                              <p className="text-2xl font-bold text-emerald-700 mt-1">
                                {adminUsers.filter(u => u.role === 'districtadmin').length}
                              </p>
                            </div>
                          </div>

                          {adminUsers.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm">
                              No administrative accounts found.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                  <tr className="border-b text-xs font-bold text-slate-400 uppercase">
                                    <th className="py-3 px-2">Name</th>
                                    <th className="py-3 px-2">Role</th>
                                    <th className="py-3 px-2">Contact</th>
                                    <th className="py-3 px-2 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {adminUsers.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50">
                                      <td className="py-3 px-2 font-semibold text-slate-800">
                                        {admin.name}
                                        {admin.id === currentUser.id && (
                                          <Badge className="ml-1.5 bg-slate-100 text-slate-600 border-none font-bold text-[8px]">
                                            You
                                          </Badge>
                                        )}
                                      </td>
                                      <td className="py-3 px-2 capitalize">
                                        <Badge variant="outline" className="border-primary/20 text-primary font-bold text-[10px]">
                                          {admin.role.replace('admin', ' Admin')}
                                        </Badge>
                                        {admin.district_name && (
                                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                            📍 {admin.district_name}
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-3 px-2 text-xs text-slate-500 font-medium">
                                        <div>{admin.email}</div>
                                        <div className="font-mono mt-0.5">{admin.mobile}</div>
                                      </td>
                                      <td className="py-3 px-2 text-right">
                                        <div className="flex justify-end gap-1.5">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewAdminDetails(admin)}
                                            className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                                            title="View Details"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleStartEditAdmin(admin)}
                                            className="h-8 w-8 text-primary hover:bg-slate-100"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            disabled={admin.id === currentUser.id}
                                            className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                  </div>

                  {/* Profile info sidebar widget */}
                  <Card className="border-slate-200 shadow-sm bg-white h-fit">
                    <CardHeader className="text-center pb-2">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary text-3xl font-headline font-bold mb-4 uppercase">
                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                      </div>
                      <CardTitle className="text-lg font-bold">{currentUser.name}</CardTitle>
                      <Badge className="bg-primary/10 text-primary border-none mt-2 capitalize font-bold mx-auto">
                        {currentUser.role}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-4 border-t text-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Email:</span>
                        <span className="font-semibold text-slate-700">{currentUser.email}</span>
                      </div>
                      {currentUser.mobile && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Mobile:</span>
                          <span className="font-semibold text-slate-700">{currentUser.mobile}</span>
                        </div>
                      )}
                      {currentUser.district_name && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">District:</span>
                          <span className="font-semibold text-slate-700">{currentUser.district_name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Create Admin Modal Overlay */}
                {isCreateAdminModalOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            Create Administrator Account / व्यवस्थापक खाता बनाएं
                          </CardTitle>
                          <CardDescription>Create a new administrative user ID and assign roles</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setIsCreateAdminModalOpen(false);
                            setCreatedAdminInfo(null);
                          }}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        {createdAdminInfo && (
                          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl relative animate-in fade-in slide-in-from-top-2 duration-300">
                            <button 
                              type="button"
                              onClick={() => setCreatedAdminInfo(null)}
                              className="absolute top-4 right-4 text-emerald-700 hover:text-emerald-900 font-bold bg-transparent border-none cursor-pointer text-sm"
                            >
                              ✕
                            </button>
                            <h4 className="font-bold text-base text-emerald-800 mb-1">✓ Admin Account Created Successfully / व्यवस्थापक खाता सफलतापूर्वक बनाया गया</h4>
                            <p className="text-sm mb-3 text-emerald-800">You can share these credentials with the user to log in:</p>
                            <div className="space-y-1.5 text-sm bg-white/70 p-3 rounded-xl border border-emerald-100/50">
                              <div><strong>Name / नाम:</strong> {createdAdminInfo.name}</div>
                              <div><strong>Login Email ID / ईमेल आईडी:</strong> <code className="bg-emerald-100/50 px-1.5 py-0.5 rounded font-mono select-all text-xs">{createdAdminInfo.email}</code></div>
                              <div><strong>Login Username / उपयोगकर्ता नाम:</strong> <code className="bg-emerald-100/50 px-1.5 py-0.5 rounded font-mono select-all text-xs">{createdAdminInfo.email.split('@')[0]}</code></div>
                              <div><strong>Role / भूमिका:</strong> <span className="capitalize">{createdAdminInfo.role}</span></div>
                            </div>
                            <div className="mt-3 text-xs flex items-center gap-1.5 text-emerald-700">
                              <span>To log in, visit the portal login page at / लॉगिन करने के लिए, यहां जाएं:</span>
                              <a href="/login" target="_blank" className="font-bold underline hover:text-emerald-900">
                                /login
                              </a>
                            </div>
                          </div>
                        )}
                        <form onSubmit={handleCreateAdminUser} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-admin-name">Full Name / पूरा नाम *</Label>
                              <Input
                                id="new-admin-name"
                                value={newAdminName}
                                onChange={(e) => setNewAdminName(e.target.value)}
                                placeholder="Enter full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-admin-email">Email Address / ईमेल आईडी *</Label>
                              <Input
                                id="new-admin-email"
                                type="email"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                placeholder="Enter email address"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-admin-mobile">Mobile Number / मोबाइल नंबर *</Label>
                              <Input
                                id="new-admin-mobile"
                                value={newAdminMobile}
                                onChange={(e) => setNewAdminMobile(e.target.value)}
                                placeholder="Enter 10-digit mobile number"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-admin-password">Password / पासवर्ड *</Label>
                              <Input
                                id="new-admin-password"
                                type="password"
                                value={newAdminPassword}
                                onChange={(e) => setNewAdminPassword(e.target.value)}
                                placeholder="Enter password (min 6 characters)"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-admin-role">Administrator Role / भूमिका *</Label>
                              <Select
                                value={newAdminRole}
                                onValueChange={(val) => {
                                  setNewAdminRole(val);
                                  if (val !== 'districtadmin') {
                                    setNewAdminDistrictId('');
                                  }
                                }}
                              >
                                <SelectTrigger id="new-admin-role">
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="superadmin">Super Admin / मुख्य व्यवस्थापक</SelectItem>
                                  <SelectItem value="stateadmin">State Admin / राज्य व्यवस्थापक</SelectItem>
                                  <SelectItem value="districtadmin">District Admin / जिला व्यवस्थापक</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {newAdminRole === 'districtadmin' && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Label htmlFor="new-admin-district">District / जिला *</Label>
                                <Select
                                  value={newAdminDistrictId}
                                  onValueChange={(val) => setNewAdminDistrictId(val)}
                                >
                                  <SelectTrigger id="new-admin-district">
                                    <SelectValue placeholder="Select District" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {districts.map((d) => (
                                      <SelectItem key={d.id} value={d.id.toString()}>
                                        {d.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 justify-end border-t pt-4">
                            <Button type="submit" disabled={creatingAdmin} className="gap-2 font-bold bg-primary hover:bg-primary/95 text-white">
                              {creatingAdmin ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                                </>
                              ) : (
                                <>Create Account / खाता बनाएं</>
                              )}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setIsCreateAdminModalOpen(false);
                                setCreatedAdminInfo(null);
                              }} 
                              className="font-bold"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Edit Admin Modal Overlay */}
                {isEditAdminModalOpen && editingAdmin && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            Edit Administrator Account
                          </CardTitle>
                          <CardDescription>Modify administrator details or reset password</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setIsEditAdminModalOpen(false);
                            setEditingAdmin(null);
                          }}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form onSubmit={handleEditAdminSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-admin-name">Full Name *</Label>
                              <Input
                                id="edit-admin-name"
                                value={editAdminName}
                                onChange={(e) => setEditAdminName(e.target.value)}
                                placeholder="Enter full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-admin-email">Email Address *</Label>
                              <Input
                                id="edit-admin-email"
                                type="email"
                                value={editAdminEmail}
                                onChange={(e) => setEditAdminEmail(e.target.value)}
                                placeholder="Enter email address"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-admin-mobile">Mobile Number *</Label>
                              <Input
                                id="edit-admin-mobile"
                                value={editAdminMobile}
                                onChange={(e) => setEditAdminMobile(e.target.value)}
                                placeholder="Enter 10-digit mobile number"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-admin-password">New Password (Leave blank to keep current)</Label>
                              <Input
                                id="edit-admin-password"
                                type="password"
                                value={editAdminPassword}
                                onChange={(e) => setEditAdminPassword(e.target.value)}
                                placeholder="Enter new password"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-admin-role">Administrator Role *</Label>
                              <Select
                                value={editAdminRole}
                                onValueChange={(val) => {
                                  setEditAdminRole(val);
                                  if (val !== 'districtadmin') {
                                    setEditAdminDistrictId('');
                                  }
                                }}
                              >
                                <SelectTrigger id="edit-admin-role">
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="superadmin">Super Admin</SelectItem>
                                  <SelectItem value="stateadmin">State Admin</SelectItem>
                                  <SelectItem value="districtadmin">District Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {editAdminRole === 'districtadmin' && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Label htmlFor="edit-admin-district">District *</Label>
                                <Select
                                  value={editAdminDistrictId}
                                  onValueChange={(val) => setEditAdminDistrictId(val)}
                                >
                                  <SelectTrigger id="edit-admin-district">
                                    <SelectValue placeholder="Select District" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {districts.map((d) => (
                                      <SelectItem key={d.id} value={d.id.toString()}>
                                        {d.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-3 border-t pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setIsEditAdminModalOpen(false);
                                setEditingAdmin(null);
                              }}
                              className="font-bold rounded-full"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={updatingAdmin} className="font-bold rounded-full gap-2 bg-primary hover:bg-primary/95 text-white">
                              {updatingAdmin ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                              ) : (
                                <>Save Changes</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* View Admin Details Modal Overlay */}
                {isViewAdminModalOpen && selectedAdminForView && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in duration-300">
                    <Card className="w-full h-full md:h-auto md:max-w-md border-none shadow-2xl bg-white overflow-y-auto rounded-none md:rounded-3xl flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">
                            Administrator Details
                          </CardTitle>
                          <CardDescription>Full account information</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setIsViewAdminModalOpen(false);
                            setSelectedAdminForView(null);
                          }}
                          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex flex-col items-center pb-4 border-b">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-3 uppercase">
                            {selectedAdminForView.name ? selectedAdminForView.name.charAt(0) : 'A'}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{selectedAdminForView.name}</h3>
                          <Badge className="bg-primary/10 text-primary border-none mt-1.5 capitalize font-bold">
                            {selectedAdminForView.role.replace('admin', ' Admin')}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="text-slate-400 font-medium">User ID:</span>
                            <span className="font-semibold text-slate-800">{selectedAdminForView.id}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="text-slate-400 font-medium">Email Address:</span>
                            <span className="font-semibold text-slate-850 break-all text-right">{selectedAdminForView.email}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="text-slate-400 font-medium">Mobile Number:</span>
                            <span className="font-semibold text-slate-800">{selectedAdminForView.mobile}</span>
                          </div>
                          {selectedAdminForView.district_name && (
                            <div className="flex justify-between py-1.5 border-b border-slate-50">
                              <span className="text-slate-400 font-medium">District Branch:</span>
                              <span className="font-semibold text-slate-800">📍 {selectedAdminForView.district_name}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 flex justify-end">
                          <Button
                            onClick={() => {
                              setIsViewAdminModalOpen(false);
                              setSelectedAdminForView(null);
                            }}
                            className="rounded-full font-bold px-6 bg-primary hover:bg-primary/95 text-white"
                          >
                            Close Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Member events tab removed */}

            {/* Submit Grievance tab removed */}

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

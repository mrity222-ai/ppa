/**
 * apiClient.ts - Unified API Client Gateway for NextJS Frontend
 * Coordinates requests to the PHP 8 Backend. If the PHP backend is not available,
 * it falls back to a highly robust LocalStorage-based database simulation.
 */

const PHP_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/backend/api.php';

// Interfaces matching database schema
export interface District {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  mobile?: string;
  role: 'superadmin' | 'stateadmin' | 'districtadmin' | 'member';
  district_id: number | string | null;
  district_name?: string | null;
  photo_url?: string;
  member_details?: any;
  is_approved?: boolean;
  password_hash?: string;
}

export interface MembershipRequest {
  id: number | string;
  name: string;
  email: string;
  mobile: string;
  district_id: number | string;
  district_name?: string;
  designation: string;
  department: string;
  retirement_date?: string;
  ppo_number?: string;
  address: string;
  city: string;
  pincode: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  photo_url?: string;
  created_at: string;
}

export interface News {
  id: number | string;
  title_en: string;
  title_hi: string;
  category: string;
  content_en: string;
  content_hi: string;
  image_url: string;
  district_id: number | string | null;
  district_name?: string | null;
  author_name: string;
  created_at: string;
}

export interface Event {
  id: number | string;
  title_en: string;
  title_hi: string;
  date: string;
  time: string;
  day?: string;
  venue_en: string;
  venue_hi: string;
  type: string;
  description_en: string;
  image_url: string;
  image_urls?: string[];
  district_id: number | string | null;
  district_name?: string | null;
  author_name: string;
  registrations_count: number;
  is_registered?: boolean;
}

export interface Gallery {
  id: number | string;
  title: string;
  album_name: string;
  image_url?: string;
  image_urls?: string[];
  date?: string;
  time?: string;
  day?: string;
  district_id?: number | string | null;
  created_at: string;
}

export interface Notice {
  id: number | string;
  title: string;
  content: string;
  district_id: number | string | null;
  link_url?: string | null;
  file_url?: string | null;
  photo_url?: string | null;
  date?: string | null;
  time?: string | null;
  day?: string | null;
  created_at: string;
}

export interface Committee {
  id: number | string;
  name: string;
  description?: string;
  image_url?: string;
  file_url?: string;
  members_list?: string;
  created_at?: string;
}


export interface DocumentItem {
  id: number | string;
  title: string;
  type: string;
  file_url: string;
  file_size: string;
  created_at: string;
}

export interface ActivityLog {
  id: number | string;
  action: string;
  details: string;
  user_name: string;
  created_at: string;
}

// Initial Mock Seed Data for local fallback mode
const LOCAL_SEEDS = {
  districts: [
    { id: 1, name: 'Lucknow', code: 'LKO' },
    { id: 2, name: 'Kanpur', code: 'KNP' },
    { id: 3, name: 'Gorakhpur', code: 'GKP' },
    { id: 4, name: 'Varanasi', code: 'VNS' },
    { id: 5, name: 'Prayagraj', code: 'PRG' }
  ],
  users: [
    {
      id: 1,
      name: 'Super Administrator',
      email: 'superadmin@upppa.org',
      role: 'superadmin',
      district_id: null,
      is_approved: true
    },
    {
      id: 2,
      name: 'State Officer',
      email: 'stateadmin@upppa.org',
      role: 'stateadmin',
      district_id: null,
      is_approved: true
    },
    {
      id: 3,
      name: 'Lucknow District Admin',
      email: 'districtadmin@upppa.org',
      role: 'districtadmin',
      district_id: 1,
      is_approved: true
    },
    {
      id: 4,
      name: 'Approved Member',
      email: 'member@upppa.org',
      role: 'member',
      district_id: 1,
      is_approved: true,
      member_details: {
        member_id_card: 'PPA-LKO-2025-0042',
        designation: 'Senior Administrative Officer',
        department: 'UP Secretariat',
        retirement_date: '2024-12-31',
        ppo_number: 'PPO-2024-998877',
        address: 'House 12, Chinhat',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226028',
        membership_status: 'active',
        points: 1250,
        renewal_date: '2026-06-30'
      }
    }
  ] as User[],
  membership_requests: [
    {
      id: 'req-1',
      name: 'Ram Gopal Yadav',
      email: 'pending@upppa.org',
      mobile: '+91 98390 XXXXX',
      district_id: 1,
      designation: 'Retired Principal',
      department: 'Education Dept',
      retirement_date: '2025-02-28',
      ppo_number: 'PPO-2025-887766',
      address: 'Vikas Nagar',
      city: 'Lucknow',
      pincode: '226022',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ] as MembershipRequest[],
  news: [
    {
      id: 1,
      title_en: 'State Pension Revision Notice 2026',
      title_hi: 'राज्य पेंशन संशोधन अधिसूचना 2026',
      category: 'Pension',
      content_en: 'The Uttar Pradesh state government has officially sanctioned the latest pension revisions for retired officers.',
      content_hi: 'उत्तर प्रदेश राज्य सरकार ने आधिकारिक तौर पर सेवानिवृत्त अधिकारियों के लिए नवीनतम पेंशन संशोधनों को मंजूरी दे दी है।',
      image_url: '/7.jpg',
      district_id: null,
      author_name: 'PPA Admin Office',
      created_at: new Date('2026-06-12T10:00:00Z').toISOString()
    },
    {
      id: 2,
      title_en: 'Lucknow Member Pension Camp',
      title_hi: 'लखनऊ सदस्य पेंशन शिविर',
      category: 'Event',
      content_en: 'A special verification camp is scheduled at the Lucknow office next Monday.',
      content_hi: 'अगले सोमवार को लखनऊ कार्यालय में एक विशेष सत्यापन शिविर निर्धारित है।',
      image_url: '/7.jpg',
      district_id: 1,
      author_name: 'Lucknow Admin',
      created_at: new Date('2026-06-15T11:00:00Z').toISOString()
    }
  ],
  events: [
    {
      id: 1,
      title_en: 'Quarterly PPA State Committee Meeting',
      title_hi: 'त्रैमासिक पीपीए राज्य समिति की बैठक',
      date: '2026-07-15',
      time: '11:00 AM - 2:00 PM',
      day: 'Wednesday',
      venue_en: 'Town Hall Assembly, Lucknow',
      venue_hi: 'टाउन हॉल असेंबली, लखनऊ',
      type: 'Meeting',
      description_en: 'Reviewing pensioner welfare policies, pending grievances, and district audits.',
      image_url: 'https://picsum.photos/seed/meeting1/800/600',
      image_urls: ['https://picsum.photos/seed/meeting1/800/600', 'https://picsum.photos/seed/meeting2/800/600'],
      district_id: null,
      author_name: 'PPA Admin Office',
      registrations_count: 5,
      is_registered: true
    },
    {
      id: 2,
      title_en: 'Senior Citizens Free Medical Checkup Camp',
      title_hi: 'वरिष्ठ नागरिक निःशुल्क चिकित्सा शिविर',
      date: '2026-08-08',
      time: '09:00 AM - 4:00 PM',
      day: 'Saturday',
      venue_en: 'District Hospital Campus, LKO',
      venue_hi: 'जिला अस्पताल परिसर, लखनऊ',
      type: 'Health Camp',
      description_en: 'General medical, eye checkup and cardiovascular tests for members.',
      image_url: 'https://picsum.photos/seed/health1/800/600',
      image_urls: ['https://picsum.photos/seed/health1/800/600', 'https://picsum.photos/seed/health2/800/600', 'https://picsum.photos/seed/health3/800/600'],
      district_id: 1,
      author_name: 'Lucknow Admin',
      registrations_count: 12,
      is_registered: false
    }
  ],
  gallery: [
    { 
      id: 1, 
      title: 'Annual General Assembly 2026', 
      album_name: 'Meetings', 
      image_url: 'https://picsum.photos/seed/gall1/800/600', 
      image_urls: ['https://picsum.photos/seed/gall1/800/600', 'https://picsum.photos/seed/gall3/800/600'], 
      date: '2026-06-12', 
      time: '12:00 PM', 
      day: 'Friday', 
      district_id: null, 
      created_at: new Date().toISOString() 
    },
    { 
      id: 2, 
      title: 'Lucknow Free Dental & Eye Camp', 
      album_name: 'Health', 
      image_url: 'https://picsum.photos/seed/gall2/800/600', 
      image_urls: ['https://picsum.photos/seed/gall2/800/600', 'https://picsum.photos/seed/gall4/800/600'], 
      date: '2026-06-15', 
      time: '10:00 AM', 
      day: 'Monday', 
      district_id: 1, 
      created_at: new Date().toISOString() 
    },
  ],
  contact_requests: [
    { id: 1, name: 'Sohan Lal', mobile: '+91 99999 XXXXX', state: 'Uttar Pradesh', district: 'Lucknow', designation: 'Retired Clerk', message: 'How do I renew my membership?', status: 'new', created_at: new Date().toISOString() }
  ],
  committees: [
    { id: 1, name: 'State Executive Committee', description: 'Governing committee for all state wide activities.', image_url: 'https://picsum.photos/seed/comm1/800/600', members_list: '1. President: Shri R.K. Mishra\n2. Secretary: Shri V.P. Singh\n3. Treasurer: Shri A.K. Srivastava', created_at: new Date().toISOString() }
  ] as Committee[],
  event_registrations: [] as any[],
  notices: [
    { id: 1, title: 'Upload your PPO to complete digitisation', content: 'All members registered in Lucknow are requested to upload their PPO to access digital ID cards.', district_id: 1, created_at: new Date().toISOString() },
    { id: 2, title: 'State body elections declared for September', content: 'The official nominations for PPA state body office-bearers will begin in August.', district_id: null, created_at: new Date().toISOString() }
  ],
  documents: [
    { id: 1, title: 'Official Pension Revision Order 2026', type: 'Pension Circulars', file_url: '/docs/revision_order_2026.pdf', file_size: '1.4 MB', created_at: new Date().toISOString() },
    { id: 2, title: 'Medical Reimbursement Application Form', type: 'Application Forms', file_url: '/docs/medical_reimbursement.pdf', file_size: '0.8 MB', created_at: new Date().toISOString() }
  ],
  activity_logs: [
    { id: 1, action: 'CREATE_NEWS', details: 'Created state news revision notice 2026', user_name: 'Super Admin', created_at: new Date().toISOString() },
    { id: 2, action: 'APPROVE_MEMBER', details: 'Approved membership request for Member 4', user_name: 'Lucknow Admin', created_at: new Date().toISOString() }
  ]
};

// Helper: Get local db or seed it
function getLocalDB(): typeof LOCAL_SEEDS {
  if (typeof window === 'undefined') return LOCAL_SEEDS;
  
  const CURRENT_VERSION = 'v6'; // Bumped version to force reset database
  const dbVersion = localStorage.getItem('ppa_local_db_version');
  const dbStr = localStorage.getItem('ppa_local_db');
  
  if (!dbStr || dbVersion !== CURRENT_VERSION) {
    localStorage.setItem('ppa_local_db', JSON.stringify(LOCAL_SEEDS));
    localStorage.setItem('ppa_local_db_version', CURRENT_VERSION);
    return LOCAL_SEEDS;
  }
  return JSON.parse(dbStr);
}

function saveLocalDB(db: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ppa_local_db', JSON.stringify(db));
  }
}

// Check if PHP backend is active. 
// Uses a fast fetch with 1s timeout to check connection.
let isBackendConnected = false;
async function checkBackendConnection(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${PHP_API_BASE_URL}?action=get_districts`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendConnected = res.status === 200;
    return isBackendConnected;
  } catch (err) {
    isBackendConnected = false;
    return false;
  }
}

export const apiGateway = {

  // --- Check status ---
  isMock: async () => {
    const connected = await checkBackendConnection();
    return !connected;
  },

  // --- Auth & Register ---
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    const trimmedEmail = email.trim();
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password })
        });
        return await res.json();
      } catch (err) {
        return { success: false, error: 'Connection to PHP backend failed.' };
      }
    } else {
      // Local Storage login fallback
      const db = getLocalDB();
      const idLower = trimmedEmail.toLowerCase();

      const cleanMobileMatch = (stored: string | undefined, input: string) => {
        if (!stored) return false;
        const storedClean = stored.replace(/[^0-9]/g, '');
        const inputClean = input.replace(/[^0-9]/g, '');
        if (inputClean.length < 8 || storedClean.length < 8) return false;
        return storedClean.endsWith(inputClean) || inputClean.endsWith(storedClean);
      };

      const user = db.users.find(u => 
        (u.email && (u.email.toLowerCase() === idLower || u.email.toLowerCase().split('@')[0] === idLower)) || 
        (u.mobile && cleanMobileMatch(u.mobile, idLower)) ||
        (u.member_details && u.member_details.member_id_card && u.member_details.member_id_card.toLowerCase() === idLower)
      );

      console.log('Mock Login Debug:', {
        inputEmailOrUsername: trimmedEmail,
        inputPassword: password,
        userFound: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
        storedPasswordHash: user ? user.password_hash : undefined,
        allUsersInMockDB: db.users.map(u => ({ id: u.id, email: u.email, mobile: u.mobile, role: u.role }))
      });

      if (user) {
        if (user.role === 'member') {
          return { success: false, error: 'Only administrators can log in. Members cannot log in. / केवल व्यवस्थापक ही लॉगिन कर सकते हैं। सदस्य लॉगिन नहीं कर सकते।' };
        }
        const storedPassword = user.password_hash;
        const passwordMatched = storedPassword 
          ? (storedPassword === password)
          : (password.includes('123') || password === 'admin' || password === 'password');

        if (passwordMatched) {
          if (trimmedEmail.includes('pending') && !user.is_approved) {
            return { success: false, error: "Your account is pending verification by an administrator." };
          }
          return { success: true, user: user as User };
        }
      }
      return { success: false, error: 'Invalid email/mobile/ID or password / अमान्य साख' };
    }
  },

  register: async (data: any): Promise<{ success: boolean; message?: string; error?: string; user?: User }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } else {
      const db = getLocalDB();
      const cleanMobile = data.mobile.replace(/[^0-9]/g, '');
      const emailVal = data.email || `member_${cleanMobile}@upppa.org`;

      const exists = db.users.some(u => u.email.toLowerCase() === emailVal.toLowerCase() || u.mobile === data.mobile);
      if (exists) {
        return { success: false, error: 'Email or Mobile number is already registered / ईमेल या मोबाइल नंबर पहले से पंजीकृत है' };
      }

      const newUserId = Math.floor(Math.random() * 10000) + 1000;
      const cardCode = Math.random().toString(36).substring(2, 5).toUpperCase();
      const member_id_card = `PPA-LKO-2026-${cardCode}${newUserId}`;

      const newUser: User = {
        id: newUserId,
        name: data.name,
        email: emailVal,
        mobile: data.mobile,
        role: 'member',
        district_id: parseInt(data.district_id),
        district_name: db.districts.find(d => d.id === parseInt(data.district_id))?.name || 'Lucknow',
        is_approved: true,
        photo_url: data.photo_url || undefined,
        member_details: {
          member_id_card: member_id_card,
          designation: data.designation,
          department: data.department,
          retirement_date: data.retirement_date || null,
          ppo_number: data.ppo_number || null,
          address: data.address,
          city: data.city,
          state: 'Uttar Pradesh',
          pincode: data.pincode,
          membership_status: 'active',
          renewal_date: '2027-06-30',
          photo_url: data.photo_url || undefined
        }
      };

      db.users.push(newUser);
      saveLocalDB(db);
      return { success: true, message: 'Registration successful!', user: newUser };
    }
  },

  // --- Districts ---
  getDistricts: async (): Promise<District[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=get_districts`);
      const body = await res.json();
      return body.districts || [];
    } else {
      return getLocalDB().districts;
    }
  },

  createDistrict: async (name: string, code: string, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_district`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const newD = { id: db.districts.length + 1, name, code: code.toUpperCase() };
      db.districts.push(newD);
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_DISTRICT', details: `Added district: ${name}`, user_name: 'Super Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  // --- Approvals ---
  getPendingRequests: async (districtId?: any): Promise<MembershipRequest[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const url = districtId ? `${PHP_API_BASE_URL}?action=get_pending_requests&district_id=${districtId}` : `${PHP_API_BASE_URL}?action=get_pending_requests`;
      const res = await fetch(url);
      const body = await res.json();
      return body.requests || [];
    } else {
      const db = getLocalDB();
      let reqs = db.membership_requests.filter(r => r.status === 'pending');
      if (districtId) {
        reqs = reqs.filter(r => r.district_id === parseInt(districtId));
      }
      return reqs as MembershipRequest[];
    }
  },

  approveRequest: async (requestId: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=approve_request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const reqIdx = db.membership_requests.findIndex(r => r.id === requestId);
      if (reqIdx === -1) return false;

      const req = db.membership_requests[reqIdx];
      req.status = 'approved';

      const newUserId = db.users.length + 1;
      const districtCode = db.districts.find(d => d.id === req.district_id)?.code || 'LKO';
      const memberIdCard = `PPA-${districtCode}-${new Date().getFullYear()}-${String(newUserId).padStart(4, '0')}`;

      // Create user
      const newUser = {
        id: newUserId,
        name: req.name,
        email: req.email,
        role: 'member' as const,
        district_id: typeof req.district_id === 'string' ? parseInt(req.district_id) : req.district_id,
        is_approved: true,
        member_details: {
          member_id_card: memberIdCard,
          designation: req.designation,
          department: req.department,
          retirement_date: req.retirement_date || '',
          ppo_number: req.ppo_number || '',
          address: req.address,
          city: req.city,
          state: 'Uttar Pradesh',
          pincode: req.pincode,
          membership_status: 'active',
          points: 100,
          renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };

      db.users.push(newUser);
      db.activity_logs.unshift({ id: Math.random(), action: 'APPROVE_MEMBER', details: `Approved request ${requestId} generating Card ${memberIdCard}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  rejectRequest: async (requestId: any, notes: string, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=reject_request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, notes, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const req = db.membership_requests.find(r => r.id === requestId);
      if (req) {
        req.status = 'rejected';
        req.admin_notes = notes;
        db.activity_logs.unshift({ id: Math.random(), action: 'REJECT_MEMBER', details: `Rejected application ID: ${requestId}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Members ---
  getMembers: async (districtId?: any, search?: string): Promise<User[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_members`;
      if (districtId) url += `&district_id=${districtId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const body = await res.json();
      return (body.members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        mobile: m.mobile,
        role: m.role,
        district_id: m.district_id,
        district_name: m.district_name,
        member_details: {
          member_id_card: m.member_id_card,
          designation: m.designation,
          department: m.department,
          membership_status: m.membership_status,
          photo_url: m.photo_url
        }
      }));
    } else {
      const db = getLocalDB();
      let list = db.users.filter(u => u.role === 'member');
      if (districtId) {
        list = list.filter(u => u.district_id === parseInt(districtId));
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(u => u.name.toLowerCase().includes(q) || (u.member_details?.member_id_card || '').toLowerCase().includes(q));
      }
      return list as User[];
    }
  },

  updateMember: async (data: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const userIdx = db.users.findIndex(u => u.id === data.user_id || u.id === parseInt(data.user_id));
      if (userIdx !== -1) {
        const u = db.users[userIdx] as any;
        u.name = data.name;
        u.email = data.email;
        u.mobile = data.mobile;
        u.district_id = data.district_id ? parseInt(data.district_id) : null;
        
        if (u.member_details) {
          u.member_details.designation = data.designation;
          u.member_details.department = data.department;
          u.member_details.membership_status = data.membership_status;
        }
        
        db.activity_logs.unshift({
          id: Math.random(),
          action: 'UPDATE_MEMBER',
          details: `Updated details for member: ${data.name}`,
          user_name: 'Admin',
          created_at: new Date().toISOString()
        });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  deleteMember: async (userId: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_member&id=${userId}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const idToFind = typeof userId === 'string' ? parseInt(userId) : userId;
      db.users = db.users.filter(u => u.id !== idToFind && u.id !== userId);
      db.activity_logs.unshift({
        id: Math.random(),
        action: 'DELETE_MEMBER',
        details: `Deleted member user ID: ${userId}`,
        user_name: 'Admin',
        created_at: new Date().toISOString()
      });
      saveLocalDB(db);
      return true;
    }
  },

  // --- News ---
  getNews: async (districtId?: any): Promise<News[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_news`;
      if (districtId) url += `&district_id=${districtId}`;
      const res = await fetch(url);
      const body = await res.json();
      return body.news || [];
    } else {
      const db = getLocalDB();
      let list = db.news;
      if (districtId) {
        // State-wide news (null) + district news
        list = list.filter(n => n.district_id === null || n.district_id === parseInt(districtId));
      }
      return list as News[];
    }
  },

  createNews: async (data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const newN = {
        id: db.news.length + 1,
        title_en: data.title_en,
        title_hi: data.title_hi,
        category: data.category,
        content_en: data.content_en,
        content_hi: data.content_hi,
        image_url: '/7.jpg',
        district_id: data.district_id ? parseInt(data.district_id) : null,
        author_name: 'PPA Admin',
        created_at: new Date().toISOString()
      };
      db.news.unshift(newN);
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_NEWS', details: `Posted news: ${data.title_en}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  deleteNews: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_news&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.news = db.news.filter(n => n.id !== id);
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_NEWS', details: `Deleted news ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateNews: async (id: any, data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const newsIndex = db.news.findIndex(n => n.id === id || n.id.toString() === id.toString());
      if (newsIndex !== -1) {
        db.news[newsIndex] = {
          ...db.news[newsIndex],
          title_en: data.title_en,
          title_hi: data.title_hi,
          category: data.category,
          content_en: data.content_en,
          content_hi: data.content_hi,
          image_url: data.image_url || db.news[newsIndex].image_url,
          district_id: data.district_id ? parseInt(data.district_id) : null,
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_NEWS', details: `Updated news: ${data.title_en}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Events ---
  getEvents: async (districtId?: any, userId?: any): Promise<Event[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_events`;
      if (districtId) url += `&district_id=${districtId}`;
      if (userId) url += `&user_id=${userId}`;
      const res = await fetch(url);
      const body = await res.json();
      return body.events || [];
    } else {
      const db = getLocalDB();
      let list = db.events;
      if (districtId) {
        list = list.filter(e => e.district_id === null || e.district_id === parseInt(districtId));
      }
      return list.map(e => ({
        ...e,
        is_registered: e.is_registered || false
      })) as Event[];
    }
  },

  createEvent: async (data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const urlsArray = Array.isArray(data.image_urls) 
        ? data.image_urls 
        : (data.image_urls ? data.image_urls.split(',').map((u: string) => u.trim()) : []);

      const newE = {
        id: db.events.length + 1,
        title_en: data.title_en,
        title_hi: data.title_hi,
        date: data.date,
        time: data.time,
        day: data.day || 'Saturday',
        venue_en: data.venue_en,
        venue_hi: data.venue_hi,
        type: data.type,
        description_en: data.description_en,
        image_url: urlsArray[0] || 'https://picsum.photos/seed/event/800/600',
        image_urls: urlsArray.length > 0 ? urlsArray : ['https://picsum.photos/seed/event/800/600'],
        district_id: data.district_id ? parseInt(data.district_id) : null,
        author_name: 'PPA Admin',
        registrations_count: 0,
        is_registered: false
      };
      db.events.unshift(newE);
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_EVENT', details: `Created event: ${data.title_en}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  registerEvent: async (eventId: any, name: string, mobile: string, address: string, userId?: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=register_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, name, mobile, address, user_id: userId || null })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      const evt = db.events.find((e: any) => e.id === eventId);
      if (evt) {
        evt.registrations_count += 1;
        evt.is_registered = true;
        if (!db.event_registrations) {
          db.event_registrations = [];
        }
        db.event_registrations.push({
          id: Math.random(),
          event_id: eventId,
          user_id: userId || null,
          name,
          mobile,
          address,
          created_at: new Date().toISOString()
        });
        db.activity_logs.unshift({ id: Math.random(), action: 'REGISTER_EVENT', details: `Attendee ${name} (${mobile}) registered for Event ${eventId}`, user_name: name, created_at: new Date().toISOString() });
        saveLocalDB(db);
      }
      return true;
    }
  },

  getEventRegistrations: async (eventId: any): Promise<any[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=get_event_registrations&event_id=${eventId}`);
      const body = await res.json();
      return body.registrations || [];
    } else {
      const db = getLocalDB() as any;
      if (!db.event_registrations) {
        db.event_registrations = [
          { id: 1, event_id: 1, name: 'Suresh Kumar', mobile: '9876543210', address: 'Aliganj, Lucknow', created_at: new Date().toISOString() },
          { id: 2, event_id: 1, name: 'Mahendra Singh', mobile: '9988776655', address: 'Gomti Nagar, Lucknow', created_at: new Date().toISOString() }
        ];
        saveLocalDB(db);
      }
      return db.event_registrations.filter((r: any) => r.event_id === eventId || r.event_id.toString() === eventId.toString());
    }
  },

  unregisterEvent: async (eventId: any, userId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=unregister_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, user_id: userId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const evt = db.events.find(e => e.id === eventId);
      if (evt && evt.registrations_count > 0) {
        evt.registrations_count -= 1;
        evt.is_registered = false;
        db.activity_logs.unshift({ id: Math.random(), action: 'UNREGISTER_EVENT', details: `User ${userId} unregistered from Event ${eventId}`, user_name: 'Member', created_at: new Date().toISOString() });
        saveLocalDB(db);
      }
      return true;
    }
  },

  deleteEvent: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_event&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.events = db.events.filter(e => e.id !== id);
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_EVENT', details: `Deleted event ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateEvent: async (id: any, data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const eventIndex = db.events.findIndex(e => e.id === id || e.id.toString() === id.toString());
      if (eventIndex !== -1) {
        const urlsArray = Array.isArray(data.image_urls) 
          ? data.image_urls 
          : (data.image_urls ? data.image_urls.split(',').map((u: string) => u.trim()) : []);

        db.events[eventIndex] = {
          ...db.events[eventIndex],
          title_en: data.title_en,
          title_hi: data.title_hi,
          date: data.date,
          time: data.time,
          day: data.day || 'Saturday',
          venue_en: data.venue_en,
          venue_hi: data.venue_hi,
          type: data.type,
          description_en: data.description_en,
          image_url: urlsArray[0] || db.events[eventIndex].image_url,
          image_urls: urlsArray.length > 0 ? urlsArray : db.events[eventIndex].image_urls,
          district_id: data.district_id ? parseInt(data.district_id) : null,
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_EVENT', details: `Updated event: ${data.title_en}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Gallery ---
  getGallery: async (districtId?: any): Promise<any[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_gallery`;
      if (districtId) url += `&district_id=${districtId}`;
      const res = await fetch(url);
      const body = await res.json();
      return body.photos || [];
    } else {
      const db = getLocalDB();
      let list = db.gallery;
      if (districtId) {
        list = list.filter(p => p.district_id === null || p.district_id === parseInt(districtId));
      }
      return list;
    }
  },

  createGallery: async (data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const urlsArray = Array.isArray(data.image_urls) 
        ? data.image_urls 
        : (data.image_urls ? data.image_urls.split(',').map((u: string) => u.trim()) : []);

      db.gallery.unshift({
        id: db.gallery.length + 1,
        title: data.title,
        image_url: urlsArray[0] || 'https://picsum.photos/seed/gall1/800/600',
        image_urls: urlsArray.length > 0 ? urlsArray : ['https://picsum.photos/seed/gall1/800/600'],
        album_name: data.album_name,
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '12:00 PM',
        day: data.day || 'Monday',
        district_id: data.district_id ? parseInt(data.district_id) : null,
        created_at: new Date().toISOString()
      });
      saveLocalDB(db);
      return true;
    }
  },

  deleteGallery: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_gallery&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.gallery = db.gallery.filter(g => g.id !== id);
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_GALLERY', details: `Deleted gallery ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateGallery: async (id: any, data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const idx = db.gallery.findIndex(g => g.id === id || g.id.toString() === id.toString());
      if (idx !== -1) {
        const urlsArray = Array.isArray(data.image_urls) 
          ? data.image_urls 
          : (data.image_urls ? data.image_urls.split(',').map((u: string) => u.trim()) : []);

        db.gallery[idx] = {
          ...db.gallery[idx],
          title: data.title,
          album_name: data.album_name,
          date: data.date || db.gallery[idx].date,
          time: data.time || db.gallery[idx].time,
          day: data.day || db.gallery[idx].day,
          image_url: urlsArray[0] || db.gallery[idx].image_url,
          image_urls: urlsArray.length > 0 ? urlsArray : db.gallery[idx].image_urls,
          district_id: data.district_id ? parseInt(data.district_id) : null
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_GALLERY', details: `Updated gallery post: ${data.title}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Submissions ---
  getSubmissions: async (): Promise<any[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=get_submissions`);
      const body = await res.json();
      return body.submissions || [];
    } else {
      return getLocalDB().contact_requests;
    }
  },

  submitContact: async (data: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=submit_contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.contact_requests.unshift({
        id: db.contact_requests.length + 1,
        name: data.name,
        mobile: data.mobile,
        state: data.state,
        district: data.district,
        designation: data.designation,
        message: data.message,
        status: 'new',
        created_at: new Date().toISOString()
      });
      saveLocalDB(db);
      return true;
    }
  },



  // --- Notices ---
  getNotices: async (districtId?: any): Promise<Notice[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_notices`;
      if (districtId) url += `&district_id=${districtId}`;
      const res = await fetch(url);
      const body = await res.json();
      return body.notices || [];
    } else {
      const db = getLocalDB();
      let list = db.notices;
      if (districtId) {
        list = list.filter(n => n.district_id === null || n.district_id === parseInt(districtId));
      }
      return list as Notice[];
    }
  },

  createNotice: async (title: string, content: string, districtId: any, adminId: any, extra?: { link_url?: string; file_url?: string; photo_url?: string; date?: string; time?: string; day?: string }): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_notice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, district_id: districtId, admin_id: adminId, ...extra })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      db.notices.unshift({
        id: db.notices.length + 1,
        title,
        content,
        district_id: districtId ? parseInt(districtId) : null,
        link_url: extra?.link_url || null,
        file_url: extra?.file_url || null,
        photo_url: extra?.photo_url || null,
        date: extra?.date || null,
        time: extra?.time || null,
        day: extra?.day || null,
        created_at: new Date().toISOString()
      });
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_NOTICE', details: `Posted notice: ${title}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  deleteNotice: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_notice&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.notices = db.notices.filter(n => n.id !== id);
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_NOTICE', details: `Deleted notice ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateNotice: async (id: any, title: string, content: string, districtId: any, adminId: any, extra?: { link_url?: string; file_url?: string; photo_url?: string; date?: string; time?: string; day?: string }): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_notice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, content, district_id: districtId, admin_id: adminId, ...extra })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      const idx = db.notices.findIndex((n: any) => n.id === id || n.id.toString() === id.toString());
      if (idx !== -1) {
        db.notices[idx] = {
          ...db.notices[idx],
          title,
          content,
          district_id: districtId ? parseInt(districtId) : null,
          link_url: extra?.link_url || db.notices[idx].link_url,
          file_url: extra?.file_url || db.notices[idx].file_url,
          photo_url: extra?.photo_url || db.notices[idx].photo_url,
          date: extra?.date || db.notices[idx].date,
          time: extra?.time || db.notices[idx].time,
          day: extra?.day || db.notices[idx].day,
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_NOTICE', details: `Updated notice: ${title}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Committees ---
  getCommittees: async (): Promise<Committee[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=get_committees`);
      const body = await res.json();
      return body.committees || [];
    } else {
      const db = getLocalDB() as any;
      if (!db.committees) {
        db.committees = [
          { id: 1, name: 'State Executive Committee', description: 'Governing committee for all state wide activities.', image_url: 'https://picsum.photos/seed/comm1/800/600', members_list: '1. President: Shri R.K. Mishra\n2. Secretary: Shri V.P. Singh\n3. Treasurer: Shri A.K. Srivastava', created_at: new Date().toISOString() }
        ];
        saveLocalDB(db);
      }
      return db.committees;
    }
  },

  createCommittee: async (data: { name: string; description?: string; image_url?: string; file_url?: string; members_list?: string; admin_id?: any }): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      if (!db.committees) db.committees = [];
      db.committees.unshift({
        id: db.committees.length + 1,
        name: data.name,
        description: data.description || '',
        image_url: data.image_url || '',
        file_url: data.file_url || '',
        members_list: data.members_list || '',
        created_at: new Date().toISOString()
      });
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_COMMITTEE', details: `Created committee: ${data.name}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateCommittee: async (id: any, data: { name: string; description?: string; image_url?: string; file_url?: string; members_list?: string; admin_id?: any }): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      if (!db.committees) db.committees = [];
      const idx = db.committees.findIndex((c: any) => c.id === id || c.id.toString() === id.toString());
      if (idx !== -1) {
        db.committees[idx] = {
          ...db.committees[idx],
          name: data.name,
          description: data.description !== undefined ? data.description : db.committees[idx].description,
          image_url: data.image_url !== undefined ? data.image_url : db.committees[idx].image_url,
          file_url: data.file_url !== undefined ? data.file_url : db.committees[idx].file_url,
          members_list: data.members_list !== undefined ? data.members_list : db.committees[idx].members_list
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_COMMITTEE', details: `Updated committee: ${data.name}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  deleteCommittee: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_committee&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB() as any;
      if (!db.committees) db.committees = [];
      db.committees = db.committees.filter((c: any) => c.id !== id && c.id.toString() !== id.toString());
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_COMMITTEE', details: `Deleted committee ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },


  // --- Documents ---
  getDocuments: async (): Promise<DocumentItem[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=get_documents`);
      const body = await res.json();
      return body.documents || [];
    } else {
      return getLocalDB().documents;
    }
  },

  createDocument: async (title: string, type: string, size: string, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=create_document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, size, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.documents.unshift({
        id: db.documents.length + 1,
        title,
        type,
        file_url: '/docs/mock_file.pdf',
        file_size: size,
        created_at: new Date().toISOString()
      });
      db.activity_logs.unshift({ id: Math.random(), action: 'CREATE_DOCUMENT', details: `Uploaded doc: ${title}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  deleteDocument: async (id: any, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=delete_document&id=${id}&admin_id=${adminId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      db.documents = db.documents.filter(d => d.id !== id);
      db.activity_logs.unshift({ id: Math.random(), action: 'DELETE_DOCUMENT', details: `Deleted document ID: ${id}`, user_name: 'Admin', created_at: new Date().toISOString() });
      saveLocalDB(db);
      return true;
    }
  },

  updateDocument: async (id: any, title: string, type: string, size: string, adminId: any): Promise<boolean> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      const res = await fetch(`${PHP_API_BASE_URL}?action=update_document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, type, size, admin_id: adminId })
      });
      const body = await res.json();
      return body.success;
    } else {
      const db = getLocalDB();
      const idx = db.documents.findIndex(d => d.id === id || d.id.toString() === id.toString());
      if (idx !== -1) {
        db.documents[idx] = {
          ...db.documents[idx],
          title,
          type,
          file_size: size
        };
        db.activity_logs.unshift({ id: Math.random(), action: 'UPDATE_DOCUMENT', details: `Updated doc: ${title}`, user_name: 'Admin', created_at: new Date().toISOString() });
        saveLocalDB(db);
        return true;
      }
      return false;
    }
  },

  // --- Reports & Stats ---
  getStats: async (districtId?: any): Promise<any> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      let url = `${PHP_API_BASE_URL}?action=get_stats`;
      if (districtId) url += `&district_id=${districtId}`;
      const res = await fetch(url);
      const body = await res.json();
      return body.stats;
    } else {
      const db = getLocalDB();
      
      let mems = db.users.filter(u => u.role === 'member');
      let pends = db.membership_requests.filter(r => r.status === 'pending');

      if (districtId) {
        mems = mems.filter(u => u.district_id === parseInt(districtId));
        pends = pends.filter(r => r.district_id === parseInt(districtId));
      }

      // District data
      const districtsData = db.districts.map(d => {
        const count = db.users.filter(u => u.role === 'member' && u.district_id === d.id).length;
        return { district_name: d.name, members_count: count };
      });

      return {
        total_members: mems.length,
        pending_applications: pends.length,
        pending_grievances: 0,
        total_events: db.events.length,
        districts_data: districtsData,
        activity_logs: db.activity_logs.slice(0, 8)
      };
    }
  },

  resetPassword: async (data: { email: string; mobile: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=reset_password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection failed.' };
      }
    } else {
      const db = getLocalDB();
      const userIdx = db.users.findIndex(u => u.email === data.email && u.mobile === data.mobile);
      if (userIdx !== -1) {
        const u = db.users[userIdx] as any;
        if (data.password) {
          u.password_hash = data.password;
        }
        db.activity_logs.unshift({
          id: Math.random(),
          action: 'RESET_PASSWORD',
          details: `Reset password for user: ${data.email}`,
          user_name: u.name,
          created_at: new Date().toISOString()
        });
        saveLocalDB(db);
        return { success: true };
      }
      return { success: false, error: 'No account found with this email and mobile combination' };
    }
  },

  updateProfile: async (data: { user_id: number | string; name: string; email: string; mobile?: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=update_profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection failed.' };
      }
    } else {
      const db = getLocalDB();
      const userIdx = db.users.findIndex(u => u.id === data.user_id || u.id === parseInt(data.user_id as string));
      if (userIdx !== -1) {
        const u = db.users[userIdx] as any;
        
        // Check email uniqueness locally
        const emailExists = db.users.some(other => other.email === data.email && other.id !== u.id);
        if (emailExists) {
          return { success: false, error: 'Email is already in use by another account' };
        }
        
        u.name = data.name;
        u.email = data.email;
        if (data.mobile !== undefined) u.mobile = data.mobile;
        if (data.password) {
          u.password_hash = data.password;
        }
        
        db.activity_logs.unshift({
          id: Math.random(),
          action: 'UPDATE_PROFILE',
          details: `Updated own profile: ${data.name}`,
          user_name: u.name,
          created_at: new Date().toISOString()
        });
        saveLocalDB(db);
        return { success: true };
      }
      return { success: false, error: 'User not found.' };
    }
  },

  createAdminUser: async (data: { name: string; email: string; mobile: string; password?: string; role: string; district_id?: number | string | null; creator_id?: number | string | null }): Promise<{ success: boolean; message?: string; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=create_admin_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection failed.' };
      }
    } else {
      const db = getLocalDB();
      const emailVal = data.email.trim();

      const exists = db.users.some(u => u.email.toLowerCase() === emailVal.toLowerCase() || u.mobile === data.mobile);
      if (exists) {
        return { success: false, error: 'Email or Mobile number is already registered / ईमेल या मोबाइल नंबर पहले से पंजीकृत है' };
      }

      const newUserId = Math.floor(Math.random() * 10000) + 1000;
      const newUser: User = {
        id: newUserId,
        name: data.name,
        email: emailVal,
        mobile: data.mobile,
        role: data.role as any,
        district_id: data.role === 'districtadmin' ? (data.district_id ? parseInt(data.district_id as string) : null) : null,
        is_approved: true,
        password_hash: data.password
      };

      db.users.push(newUser);
      db.activity_logs.unshift({
        id: Math.random(),
        action: 'CREATE_ADMIN',
        details: `Created administrator ${data.name} (${data.role})`,
        user_name: 'Admin',
        created_at: new Date().toISOString()
      });
      saveLocalDB(db);
      return { success: true, message: 'Administrator account created successfully!' };
    }
  },

  getAdminUsers: async (): Promise<any[]> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=get_admin_users`);
        const body = await res.json();
        return body.admins || [];
      } catch (err) {
        console.error('Failed to fetch admins:', err);
        return [];
      }
    } else {
      const db = getLocalDB();
      return db.users.filter(u => ['superadmin', 'stateadmin', 'districtadmin'].includes(u.role));
    }
  },

  updateAdminUser: async (id: any, data: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=update_admin_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection failed.' };
      }
    } else {
      const db = getLocalDB();
      const uIdx = db.users.findIndex(u => u.id === id || u.id.toString() === id.toString());
      if (uIdx !== -1) {
        const emailVal = data.email.trim();
        const exists = db.users.some(u => (u.email.toLowerCase() === emailVal.toLowerCase() || u.mobile === data.mobile) && u.id.toString() !== id.toString());
        if (exists) {
          return { success: false, error: 'Email or Mobile is already registered by another user' };
        }
        
        db.users[uIdx] = { 
          ...db.users[uIdx], 
          name: data.name,
          email: emailVal,
          mobile: data.mobile,
          role: data.role,
          district_id: data.role === 'districtadmin' ? (data.district_id ? parseInt(data.district_id) : null) : null
        };
        if (data.password) {
          db.users[uIdx].password_hash = data.password;
        }
        saveLocalDB(db);
        return { success: true, message: 'Administrator updated successfully!' };
      }
      return { success: false, error: 'User not found.' };
    }
  },

  deleteAdminUser: async (id: any, adminId: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const res = await fetch(`${PHP_API_BASE_URL}?action=delete_admin_user&id=${id}&admin_id=${adminId}`, {
          method: 'DELETE'
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection failed.' };
      }
    } else {
      if (id.toString() === adminId.toString()) {
        return { success: false, error: 'You cannot delete your own account' };
      }
      const db = getLocalDB();
      db.users = db.users.filter(u => u.id !== id && u.id.toString() !== id.toString());
      saveLocalDB(db);
      return { success: true, message: 'Administrator account deleted.' };
    }
  },

  uploadImage: async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    const isMock = !(await checkBackendConnection());
    if (!isMock) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${PHP_API_BASE_URL}?action=upload_image`, {
          method: 'POST',
          body: formData
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || 'Image upload connection failed.' };
      }
    } else {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read file as Data URL.' });
        };
        reader.readAsDataURL(file);
      });
    }
  }
};

import fs from 'fs/promises';
import path from 'path';

// --- Interfaces ---

export interface ContactSubmission {
  id: string;
  name: string;
  mobile: string;
  state: string;
  district: string;
  designation: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain-text for simple local mockup
  mobile: string;
  state: string;
  district: string;
  designation: string;
  role: 'admin' | 'member';
  isApproved: boolean;
  joinDate: string;
  memberId: string;
}

export interface NewsItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  date: string;
  contentHi: string;
  contentEn: string;
  image: string;
}

export interface EventItem {
  id: string;
  titleHi: string;
  titleEn: string;
  date: string;
  time: string;
  venueHi: string;
  venueEn: string;
  type: string;
  descriptionEn: string;
  image: string;
  registrations: string[]; // List of user emails/IDs registered
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

// --- File Paths ---

const DATA_DIR = path.join(process.cwd(), 'data');
const FILES = {
  submissions: path.join(DATA_DIR, 'submissions.json'),
  users: path.join(DATA_DIR, 'users.json'),
  news: path.join(DATA_DIR, 'news.json'),
  events: path.join(DATA_DIR, 'events.json'),
  documents: path.join(DATA_DIR, 'documents.json'),
  announcements: path.join(DATA_DIR, 'announcements.json'),
};

// --- Initial Seed Data ---

const SEED_DATA = {
  users: [
    {
      id: 'user-admin',
      name: 'PPA Admin Office',
      email: 'admin@upppa.org',
      passwordHash: 'admin123',
      mobile: '+91 99352 12121',
      state: 'up',
      district: 'Lucknow',
      designation: 'General Secretary',
      role: 'admin' as const,
      isApproved: true,
      joinDate: new Date().toISOString(),
      memberId: 'PPA-LKO-ADMIN',
    },
    {
      id: 'user-member-1',
      name: 'John Doe',
      email: 'member@upppa.org',
      passwordHash: 'member123',
      mobile: '+91 94150 XXXXX',
      state: 'up',
      district: 'Lucknow',
      designation: 'Retired Inspector',
      role: 'member' as const,
      isApproved: true,
      joinDate: new Date('2025-01-15').toISOString(),
      memberId: 'PPA-LKO-2025-0042',
    },
    {
      id: 'user-member-2',
      name: 'Ram Gopal Yadav',
      email: 'pending@upppa.org',
      passwordHash: 'pending123',
      mobile: '+91 98390 XXXXX',
      state: 'up',
      district: 'Kanpur',
      designation: 'Retired Teacher',
      role: 'member' as const,
      isApproved: false,
      joinDate: new Date().toISOString(),
      memberId: 'PPA-LKO-PENDING-01',
    }
  ],
  news: [
    {
      id: 'news-1',
      titleEn: 'Pension Revision Notice — Important Update',
      titleHi: 'पेंशन संशोधन सूचना — महत्वपूर्ण अपडेट',
      category: 'Pension',
      date: 'June 12, 2025',
      contentEn: 'The state government has issued a new notification regarding pension revision. All members are requested to review it.',
      contentHi: 'राज्य सरकार द्वारा पेंशन संशोधन की नई अधिसूचना जारी की गई है। सभी सदस्यों से अनुरोध है कि इसे ध्यान से पढ़ें।',
      image: '/7.jpg'
    },
    {
      id: 'news-2',
      titleEn: 'Free Medical Camp Organized Successfully',
      titleHi: 'निःशुल्क स्वास्थ्य शिविर सफलतापूर्वक आयोजित',
      category: 'Health',
      date: 'May 05, 2025',
      contentEn: 'A free health checkup camp was organized by PPA in Chinhat, Lucknow. More than 200 pensioners participated.',
      contentHi: 'PPA द्वारा चिनहट, लखनऊ में निःशुल्क स्वास्थ्य जाँच शिविर का आयोजन किया गया। 200 से अधिक पेंशनरों ने भाग लिया।',
      image: '/7.jpg'
    }
  ],
  events: [
    {
      id: 'event-1',
      titleHi: 'त्रैमासिक बैठक — Q1 2025',
      titleEn: 'Quarterly Meeting — Q1 2025',
      date: '15 April 2025',
      time: '11:00 AM - 2:00 PM',
      venueHi: 'टाउन हॉल, लखनऊ',
      venueEn: 'Town Hall, Lucknow',
      type: 'Meeting',
      descriptionEn: 'Discussing member welfare, pension revision updates, and upcoming social initiatives for the year.',
      image: 'https://picsum.photos/seed/event-meeting/800/600',
      registrations: ['member@upppa.org']
    },
    {
      id: 'event-2',
      titleHi: 'निःशुल्क स्वास्थ्य शिविर — नेत्र एवं सामान्य जाँच',
      titleEn: 'Free Health Camp — Eye & General Checkup',
      date: '22 April 2025',
      time: '9:00 AM - 4:00 PM',
      venueHi: 'जिला अस्पताल, लखनऊ',
      venueEn: 'District Hospital, Lucknow',
      type: 'Health Camp',
      descriptionEn: 'Specialized health checkup for senior citizens including eye examination and blood pressure monitoring.',
      image: 'https://picsum.photos/seed/health-event/800/600',
      registrations: []
    }
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'Pension Revision Order 2025 — राज्य सरकार',
      type: 'Pension Circulars',
      size: '1.2 MB',
      date: 'Jan 2025'
    },
    {
      id: 'doc-2',
      title: 'Medical Facility Order for Pensioners',
      type: 'Government Orders',
      size: '0.8 MB',
      date: 'Feb 2025'
    },
    {
      id: 'doc-3',
      title: 'PPA Membership Application Form',
      type: 'Application Forms',
      size: '0.5 MB',
      date: 'Mar 2025'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Pension Revision Notification published on the site.',
      date: 'June 18, 2025',
      content: 'The official PDF for the latest state government pension revision has been uploaded to the Documents portal.'
    },
    {
      id: 'ann-2',
      title: 'Next general body meeting scheduled for July 15.',
      date: 'June 15, 2025',
      content: 'Please make sure to register for the meeting through your portal to confirm attendance.'
    }
  ]
};

// --- DB File Helper ---

async function ensureFile(filePath: string, defaultContent: any) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {}

  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
  }
}

async function readJSON<T>(filePath: string, defaultContent: T): Promise<T> {
  await ensureFile(filePath, defaultContent);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

async function writeJSON<T>(filePath: string, content: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
}

// --- Initialization ---

export async function initializeDatabase() {
  await ensureFile(FILES.submissions, []);
  await ensureFile(FILES.users, SEED_DATA.users);
  await ensureFile(FILES.news, SEED_DATA.news);
  await ensureFile(FILES.events, SEED_DATA.events);
  await ensureFile(FILES.documents, SEED_DATA.documents);
  await ensureFile(FILES.announcements, SEED_DATA.announcements);
}

// --- Users (Auth / Verification) CRUD ---

export async function getUsers(): Promise<User[]> {
  await initializeDatabase();
  return readJSON<User[]>(FILES.users, SEED_DATA.users);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(user: Omit<User, 'id' | 'joinDate' | 'isApproved' | 'role' | 'memberId'>): Promise<User> {
  const users = await getUsers();
  
  const formattedEmail = user.email.toLowerCase();
  if (users.some(u => u.email.toLowerCase() === formattedEmail)) {
    throw new Error('Email is already registered / ईमेल पहले से पंजीकृत है');
  }

  const id = `user-${Math.random().toString(36).substring(2, 9)}`;
  const memberId = `PPA-LKO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser: User = {
    ...user,
    email: formattedEmail,
    id,
    role: 'member',
    isApproved: false,
    joinDate: new Date().toISOString(),
    memberId,
  };

  users.push(newUser);
  await writeJSON(FILES.users, users);
  return newUser;
}

export async function verifyUserAccount(id: string, isApproved: boolean): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;

  users[index].isApproved = isApproved;
  await writeJSON(FILES.users, users);
  return true;
}

export async function deleteUserAccount(id: string): Promise<boolean> {
  const users = await getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  await writeJSON(FILES.users, filtered);
  return true;
}

// --- Contact Submissions CRUD ---

export async function saveContactSubmission(submission: Omit<ContactSubmission, 'id' | 'timestamp'>): Promise<ContactSubmission> {
  const submissions = await readJSON<ContactSubmission[]>(FILES.submissions, []);
  const newSubmission: ContactSubmission = {
    ...submission,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
  };
  
  submissions.push(newSubmission);
  await writeJSON(FILES.submissions, submissions);
  return newSubmission;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await readJSON<ContactSubmission[]>(FILES.submissions, []);
  return submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// --- News CRUD ---

export async function getNewsItems(): Promise<NewsItem[]> {
  await initializeDatabase();
  return readJSON<NewsItem[]>(FILES.news, SEED_DATA.news);
}

export async function createNewsItem(item: Omit<NewsItem, 'id' | 'date'>): Promise<NewsItem> {
  const news = await getNewsItems();
  const newItem: NewsItem = {
    ...item,
    id: `news-${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
  news.unshift(newItem);
  await writeJSON(FILES.news, news);
  return newItem;
}

export async function deleteNewsItem(id: string): Promise<boolean> {
  const news = await getNewsItems();
  const filtered = news.filter(n => n.id !== id);
  if (filtered.length === news.length) return false;
  await writeJSON(FILES.news, filtered);
  return true;
}

// --- Events CRUD ---

export async function getEventItems(): Promise<EventItem[]> {
  await initializeDatabase();
  return readJSON<EventItem[]>(FILES.events, SEED_DATA.events);
}

export async function createEventItem(item: Omit<EventItem, 'id' | 'registrations'>): Promise<EventItem> {
  const events = await getEventItems();
  const newEvent: EventItem = {
    ...item,
    id: `event-${Math.random().toString(36).substring(2, 9)}`,
    registrations: [],
  };
  events.unshift(newEvent);
  await writeJSON(FILES.events, events);
  return newEvent;
}

export async function registerForEvent(eventId: string, email: string): Promise<boolean> {
  const events = await getEventItems();
  const index = events.findIndex(e => e.id === eventId);
  if (index === -1) return false;

  const currentReg = events[index].registrations || [];
  if (!currentReg.includes(email)) {
    currentReg.push(email);
    events[index].registrations = currentReg;
    await writeJSON(FILES.events, events);
  }
  return true;
}

export async function unregisterFromEvent(eventId: string, email: string): Promise<boolean> {
  const events = await getEventItems();
  const index = events.findIndex(e => e.id === eventId);
  if (index === -1) return false;

  const currentReg = events[index].registrations || [];
  events[index].registrations = currentReg.filter(e => e !== email);
  await writeJSON(FILES.events, events);
  return true;
}

export async function deleteEventItem(id: string): Promise<boolean> {
  const events = await getEventItems();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return false;
  await writeJSON(FILES.events, filtered);
  return true;
}

// --- Documents CRUD ---

export async function getDocumentItems(): Promise<DocumentItem[]> {
  await initializeDatabase();
  return readJSON<DocumentItem[]>(FILES.documents, SEED_DATA.documents);
}

export async function createDocumentItem(item: Omit<DocumentItem, 'id' | 'date'>): Promise<DocumentItem> {
  const docs = await getDocumentItems();
  const newDoc: DocumentItem = {
    ...item,
    id: `doc-${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
  };
  docs.unshift(newDoc);
  await writeJSON(FILES.documents, docs);
  return newDoc;
}

export async function deleteDocumentItem(id: string): Promise<boolean> {
  const docs = await getDocumentItems();
  const filtered = docs.filter(d => d.id !== id);
  if (filtered.length === docs.length) return false;
  await writeJSON(FILES.documents, filtered);
  return true;
}

// --- Announcements CRUD ---

export async function getAnnouncements(): Promise<Announcement[]> {
  await initializeDatabase();
  return readJSON<Announcement[]>(FILES.announcements, SEED_DATA.announcements);
}

export async function createAnnouncement(ann: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
  const anns = await getAnnouncements();
  const newAnn: Announcement = {
    ...ann,
    id: `ann-${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
  anns.unshift(newAnn);
  await writeJSON(FILES.announcements, anns);
  return newAnn;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const anns = await getAnnouncements();
  const filtered = anns.filter(a => a.id !== id);
  if (filtered.length === anns.length) return false;
  await writeJSON(FILES.announcements, filtered);
  return true;
}

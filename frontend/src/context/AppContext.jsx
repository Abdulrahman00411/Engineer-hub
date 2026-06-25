import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

// Seed data for fallback when API is offline
const SEED_ENGINEERS = [
  {
    id: 'eng1', role: 'freelancer', email: 'ahmed@example.com', password: '123456',
    name: 'Ahmed Khan', title: 'Frontend Developer',
    location: 'Lahore', phone: '+92-300-1234567',
    avatar: { initials: 'AK', bg: 'rgba(37,99,235,0.22)', color: '#60A5FA' },
    rating: 4.9, reviews: 87, projects: 47, badge: 'Top Rated', badgeType: 'amber',
    available: true, verified: true, joinedDate: '2022-03-15',
    hourlyRate: 35, bio: '5+ years experience in React, Vue, and modern frontend frameworks. Specializing in responsive UI/UX.',
    education: [
      { degree: 'B.Sc Computer Science', institute: 'UET Lahore', year: '2018', grade: 'First Division' },
      { degree: 'React Professional Certification', institute: 'Meta', year: '2021', grade: 'Distinction' }
    ],
    skills: ['React', 'Vue', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Figma', 'Responsive Design'],
    services: ['Frontend Development', 'UI/UX Implementation', 'Website Optimization', 'Landing Pages', 'SPA Development'],
    portfolio: [
      { title: 'E-Commerce Platform Redesign', desc: 'Complete frontend overhaul using React and Tailwind', year: '2024', value: '$4,500' },
      { title: 'SaaS Dashboard - FinTech App', desc: 'Interactive dashboard with real-time data visualization', year: '2023', value: '$8,000' },
      { title: 'Healthcare Portal UI', desc: 'Patient management system with accessible design', year: '2023', value: '$3,200' }
    ],
    reviewsList: [
      { client: 'TechStart PK', rating: 5, comment: 'Ahmed delivered an amazing frontend. Very clean code and pixel-perfect design.', date: '2024-02-10' },
      { client: 'CloudSystems Ltd', rating: 5, comment: 'Highly recommended. Fast delivery and great communication.', date: '2024-01-22' }
    ],
    completedJobs: 47, totalEarned: '$14,200'
  },
  {
    id: 'eng2', role: 'freelancer', email: 'sara@example.com', password: '123456',
    name: 'Sara Raza', title: 'Backend Developer',
    location: 'Karachi', phone: '+92-321-9876543',
    avatar: { initials: 'SR', bg: 'rgba(14,165,160,0.22)', color: '#2DD4D0' },
    rating: 4.8, reviews: 52, projects: 31, badge: 'Rising Star', badgeType: 'teal',
    available: true, verified: true, joinedDate: '2023-01-10',
    hourlyRate: 40, bio: 'Node.js and Python specialist. Building scalable APIs and microservices architecture.',
    education: [
      { degree: 'B.Sc Software Engineering', institute: 'FAST Karachi', year: '2020', grade: 'First Division' }
    ],
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'Docker'],
    services: ['Backend Development', 'API Design', 'Database Architecture', 'Microservices', 'Server Optimization'],
    portfolio: [
      { title: 'FinTech Payment Gateway', desc: 'Secure payment processing system with 99.9% uptime', year: '2024', value: '$12,000' },
      { title: 'Inventory Management API', desc: 'Enterprise inventory system with real-time sync', year: '2023', value: '$6,500' }
    ],
    reviewsList: [
      { client: 'PayFirst', rating: 5, comment: 'Sara built an excellent backend system. Very reliable and scalable.', date: '2024-03-05' },
      { client: 'LogiChain', rating: 4, comment: 'Good work, delivered on time.', date: '2024-01-18' }
    ],
    completedJobs: 31, totalEarned: '$10,800'
  },
  {
    id: 'eng3', role: 'freelancer', email: 'omar@example.com', password: '123456',
    name: 'Omar Malik', title: 'DevOps & Cloud Engineer',
    location: 'Islamabad', phone: '+92-333-5554444',
    avatar: { initials: 'OM', bg: 'rgba(240,165,0,0.2)', color: '#F0A500' },
    rating: 4.7, reviews: 134, projects: 62, badge: 'Expert', badgeType: 'blue',
    available: false, verified: true, joinedDate: '2021-08-20',
    hourlyRate: 55, bio: 'AWS certified DevOps engineer specializing in CI/CD pipelines, containerization, and cloud infrastructure.',
    education: [
      { degree: 'B.Sc Computer Engineering', institute: 'COMSATS Islamabad', year: '2018', grade: 'Distinction' },
      { degree: 'AWS Certified Solutions Architect', institute: 'Amazon Web Services', year: '2021', grade: 'Pass' }
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Monitoring'],
    services: ['Cloud Architecture', 'DevOps Setup', 'CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging'],
    portfolio: [
      { title: 'Startup Cloud Migration', desc: 'Complete AWS migration saving 40% on infrastructure costs', year: '2024', value: '$15,000' },
      { title: 'Enterprise CI/CD Pipeline', desc: 'Automated deployment pipeline reducing release time by 80%', year: '2023', value: '$9,500' }
    ],
    reviewsList: [
      { client: 'ScaleUp Tech', rating: 5, comment: 'Omar transformed our deployment process completely.', date: '2024-02-28' },
      { client: 'DataFlow Inc', rating: 5, comment: 'Exceptional DevOps work. Infrastructure is rock solid.', date: '2024-01-10' }
    ],
    completedJobs: 62, totalEarned: '$45,000'
  }
];

const SEED_CLIENTS = [
  {
    id: 'cli1', role: 'client', email: 'client@example.com', password: '123456',
    name: 'Hassan Developers', location: 'Lahore',
    avatar: { initials: 'HD', bg: 'rgba(139,92,246,0.2)', color: '#A78BFA' },
    joinedDate: '2023-05-01', verified: true,
    postedJobs: 8, totalSpent: '$5,400'
  }
];

const SEED_JOBS = [
  {
    id: 'job1', clientId: 'cli1', clientName: 'Hassan Developers',
    title: 'React Dashboard Development — Analytics SaaS',
    category: 'Frontend', type: 'Fixed Price', budget: '$1,500–2,500',
    level: 'Intermediate', location: 'Lahore', urgent: true,
    tags: ['React', 'Chart.js', 'Tailwind'],
    description: 'SaaS analytics dashboard with interactive charts, real-time data, and responsive design. Admin panel with user management included.',
    posted: '2025-04-22', bids: 12, status: 'open'
  },
  {
    id: 'job2', clientId: 'cli1', clientName: 'SunPower Industries',
    title: 'REST API Development — Inventory System',
    category: 'Backend', type: 'Hourly', budget: '$40–55/hr',
    level: 'Expert', location: 'Karachi', urgent: false,
    tags: ['Node.js', 'PostgreSQL', 'REST API'],
    description: 'Enterprise inventory management API with user roles, reporting, and real-time stock updates. Must be scalable and well-documented.',
    posted: '2025-04-23', bids: 5, status: 'open'
  },
  {
    id: 'job3', clientId: 'cli1', clientName: 'MedCon Builders',
    title: 'CI/CD Pipeline Setup — Docker & Kubernetes',
    category: 'DevOps', type: 'Fixed Price', budget: '$2,000–3,000',
    level: 'Expert', location: 'Islamabad', urgent: true,
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    description: 'Complete CI/CD pipeline setup for microservices architecture on AWS. Include monitoring, alerting, and infrastructure as code.',
    posted: '2025-04-21', bids: 8, status: 'open'
  }
];

const SEED_GIGS = [
  {
    id: 'gig1', engineerId: 'eng1', engineerName: 'Ahmed Khan', initials: 'AK',
    avatar: { initials: 'AK', bg: 'rgba(37,99,235,0.22)', color: '#60A5FA' },
    title: 'Professional Landing Page Development',
    category: 'Frontend', icon: '🎨', accent: '#2563EB',
    startingAt: 199, deliveryDays: 5, rating: 4.9, reviews: 47,
    description: 'High-converting landing pages with responsive design, animations, and SEO optimization. Perfect for startups and portfolios.',
    tags: ['React', 'Tailwind', 'Animations'],
    packages: [
      { name: 'Basic', price: 199, delivery: 5, desc: 'Single landing page + mobile responsive' },
      { name: 'Standard', price: 399, delivery: 7, desc: '3-page website + contact form + SEO' },
      { name: 'Premium', price: 799, delivery: 10, desc: 'Full website + CMS + analytics setup' }
    ]
  },
  {
    id: 'gig2', engineerId: 'eng2', engineerName: 'Sara Raza', initials: 'SR',
    avatar: { initials: 'SR', bg: 'rgba(14,165,160,0.22)', color: '#2DD4D0' },
    title: 'REST API Development & Integration',
    category: 'Backend', icon: '⚙️', accent: '#2DD4D0',
    startingAt: 299, deliveryDays: 7, rating: 4.8, reviews: 31,
    description: 'Custom RESTful API development with authentication, documentation, and third-party integrations.',
    tags: ['Node.js', 'PostgreSQL', 'JWT'],
    packages: [
      { name: 'Basic', price: 299, delivery: 7, desc: 'Single API endpoint + auth' },
      { name: 'Standard', price: 599, delivery: 10, desc: 'Full CRUD API + documentation' },
      { name: 'Premium', price: 999, delivery: 14, desc: 'Microservices + rate limiting + testing' }
    ]
  },
  {
    id: 'gig3', engineerId: 'eng3', engineerName: 'Omar Malik', initials: 'OM',
    avatar: { initials: 'OM', bg: 'rgba(240,165,0,0.2)', color: '#F0A500' },
    title: 'Cloud Infrastructure Setup & DevOps',
    category: 'DevOps', icon: '☁️', accent: '#F0A500',
    startingAt: 499, deliveryDays: 10, rating: 4.7, reviews: 62,
    description: 'AWS cloud setup, Docker containers, CI/CD pipelines, and 24/7 monitoring for production applications.',
    tags: ['AWS', 'Docker', 'CI/CD'],
    packages: [
      { name: 'Basic', price: 499, delivery: 10, desc: 'AWS EC2 setup + SSL + monitoring' },
      { name: 'Standard', price: 999, delivery: 14, desc: 'Full VPC + RDS + CI/CD pipeline' },
      { name: 'Premium', price: 1999, delivery: 21, desc: 'Kubernetes cluster + auto-scaling + alerting' }
    ]
  }
];

// Normalize MongoDB conversation to frontend's expected format
// MongoDB returns _id (ObjectId) and participants as ObjectId[]
// Frontend expects: id, participants as string[], engineerName, clientName, etc.
const normalizeConvo = (c) => ({
  id: c._id?.toString() || c.id,
  _id: c._id?.toString(),
  participants: (c.participants || []).map(p => p.toString()),
  engineerName: c.engineerName || '',
  engineerInitials: c.engineerInitials || '',
  clientName: c.clientName || '',
  lastMsg: c.lastMsg || '',
  lastTime: c.lastTime || '',
  unread: Object.fromEntries((c.unread instanceof Map ? c.unread.entries() : Object.entries(c.unread || {}))),
  messages: (c.messages || []).map(m => ({
    id: m.id || m._id?.toString() || m.id,
    from: m.from?.toString() || m.from || '',
    text: m.text || '',
    time: m.time || '',
    date: m.date || 'Today'
  }))
});

function getInitialConvos() {
  return [
    {
      id: 'conv1',
      participants: ['cli1', 'eng1'],
      engineerName: 'Ahmed Khan', engineerInitials: 'AK',
      clientName: 'Hassan Developers',
      lastMsg: 'Bilkul, kal tak drawings bhej deta hoon.',
      lastTime: '10:42 AM',
      unread: { cli1: 1, eng1: 0 },
      messages: [
        { id: 'm1', from: 'cli1', text: 'Ahmed bhai, structural drawings kab tak ready hongi?', time: '10:30 AM', date: 'Today' },
        { id: 'm2', from: 'eng1', text: 'Bilkul, kal tak drawings bhej deta hoon. Koi changes chahiye toh bata dain.', time: '10:42 AM', date: 'Today' }
      ]
    }
  ];
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_user')); } catch { return null; }
  });
  const [page, setPage] = useState('home');
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [engineers, setEngineers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_engineers')) || SEED_ENGINEERS; } catch { return SEED_ENGINEERS; }
  });
  const [clients, setClients] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_clients')) || SEED_CLIENTS; } catch { return SEED_CLIENTS; }
  });
  const [jobs, setJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_jobs')) || SEED_JOBS; } catch { return SEED_JOBS; }
  });
  const [gigs, setGigs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_gigs')) || SEED_GIGS; } catch { return SEED_GIGS; }
  });
  const [orders, setOrders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [convos, setConvos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_convos')) || getInitialConvos(); } catch { return getInitialConvos(); }
  });
  const [drafts, setDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eh_drafts')) || []; } catch { return []; }
  });
  const [toasts, setToasts] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  // Check if API is available and fetch initial data
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          setApiOnline(true);
          // Fetch data from API
          try {
            const [engData, jobData, gigData, clientData] = await Promise.all([
              api.getEngineers(),
              api.getJobs(),
              api.getGigs(),
              api.getClients()
            ]);
            if (engData?.length) setEngineers(engData);
            if (jobData?.length) setJobs(jobData);
            if (gigData?.length) setGigs(gigData);
            if (clientData?.length) setClients(clientData);
          } catch {}
          // Restore session if token exists
          const token = localStorage.getItem('eh_token');
          if (token) {
            try {
              const userData = await api.getMe();
              setUser(userData);
            } catch {
              // Token invalid, clear it
              localStorage.removeItem('eh_token');
            }
          }
        }
      } catch {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 30000);
    return () => clearInterval(interval);
  }, []);

  // Persist
  useEffect(() => { if(user) localStorage.setItem('eh_user', JSON.stringify(user)); else localStorage.removeItem('eh_user'); }, [user]);
  useEffect(() => { localStorage.setItem('eh_engineers', JSON.stringify(engineers)); }, [engineers]);
  useEffect(() => { localStorage.setItem('eh_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('eh_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('eh_gigs', JSON.stringify(gigs)); }, [gigs]);
  useEffect(() => { localStorage.setItem('eh_convos', JSON.stringify(convos)); }, [convos]);
  useEffect(() => { localStorage.setItem('eh_drafts', JSON.stringify(drafts)); }, [drafts]);

  const toast = useCallback((msg, type='success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  // Load conversations from API when online and user is logged in
  const loadConversations = useCallback(async () => {
    if (!apiOnline || !user) return;
    try {
      const apiConvos = await api.getConversations();
      if (!apiConvos?.length) return;

      const normalized = apiConvos.map(normalizeConvo);

      // Merge: keep local convos that have a local-only id (not in API),
      // replace/update API convos with real data
      setConvos(prev => {
        const localOnly = prev.filter(c => !c._id || !normalized.find(ac => ac._id === c._id));
        const merged = [...localOnly, ...normalized];

        // Sort by most recent (updatedAt from MongoDB, or lastTime)
        merged.sort((a, b) => {
          const timeA = a.lastTime || '';
          const timeB = b.lastTime || '';
          return timeB.localeCompare(timeA);
        });

        return merged;
      });
    } catch (err) {
      // Silent fail — keep using local convos
    }
  }, [apiOnline, user]);

  // Poll for new messages every 15 seconds when user is logged in and API is online
  useEffect(() => {
    if (!user || !apiOnline) return;
    const pollMessages = () => loadConversations();
    const interval = setInterval(pollMessages, 15000);
    return () => clearInterval(interval);
  }, [user, apiOnline, loadConversations]);

  const login = async (email, password) => {
    if (apiOnline) {
      try {
        const data = await api.login(email, password);
        localStorage.setItem('eh_token', data.token);
        setUser(data.user);
        toast(`Welcome back, ${data.user.name}! 👋`);
        // Load real conversations from API on login
        // Defer slightly so user state is set first
        setTimeout(() => { loadConversations(); loadMyJobs(); }, 100);
        return null;
      } catch (err) {
        return err.message;
      }
    }
    // Local fallback
    const allUsers = [...engineers, ...clients];
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (!found) return 'Email or password is incorrect';
    setUser(found);
    toast(`Welcome back, ${found.name}! 👋`);
    // Load orders and bids on local login
    setTimeout(() => { loadOrders(); loadMyBids(); loadMyJobs(); }, 100);
    return null;
  };

  const register = async (data) => {
    if (apiOnline) {
      try {
        const response = await api.register(data);
        localStorage.setItem('eh_token', response.token);
        setUser(response.user);
        toast('Account created! Welcome to EngineersHub 🌟');
        // Load real conversations on register
        setTimeout(() => { loadConversations(); loadOrders(); loadMyBids(); loadMyJobs(); }, 100);
        return null;
      } catch (err) {
        return err.message;
      }
    }
    // Local fallback
    const allUsers = [...engineers, ...clients];
    if (allUsers.find(u => u.email === data.email)) return 'Email is already registered';
    const id = 'u' + Date.now();
    const newUser = { ...data, id, joinedDate: new Date().toISOString().split('T')[0], verified: false };
    if (data.role === 'freelancer') {
      const u = {
        ...newUser,
        rating: 0, reviews: 0, projects: 0, badge: 'New', badgeType: 'gray',
        available: true, hourlyRate: 0, bio: '',
        education: [], skills: [], services: [], portfolio: [], reviewsList: [],
        completedJobs: 0, totalEarned: '$0',
        avatar: { initials: data.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(), bg: 'rgba(37,99,235,0.22)', color: '#60A5FA' }
      };
      setEngineers(e => [...e, u]);
      setUser(u);
    } else {
      const u = {
        ...newUser,
        postedJobs: 0, totalSpent: '$0',
        avatar: { initials: data.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(), bg: 'rgba(139,92,246,0.2)', color: '#A78BFA' }
      };
      setClients(c => [...c, u]);
      setUser(u);
    }
    toast('Account created! Welcome to EngineersHub 🌟');
    return null;
  };

  const logout = () => {
    localStorage.removeItem('eh_token');
    setUser(null);
    setPage('home');
    toast('Logged out successfully', 'info');
  };

  const updateProfile = async (updates) => {
    if (apiOnline) {
      try {
        const updated = user.role === 'freelancer'
          ? await api.updateProfile(updates)
          : await api.updateClientProfile(updates);
        setUser(updated);
        toast('Profile updated successfully ✨');
        return;
      } catch (err) {
        toast(err.message, 'error');
      }
    }
    // Local fallback
    setUser(u => ({ ...u, ...updates }));
    if (user?.role === 'freelancer') {
      setEngineers(list => list.map(e => e.id === user.id ? { ...e, ...updates } : e));
    } else {
      setClients(list => list.map(c => c.id === user.id ? { ...c, ...updates } : c));
    }
    toast('Profile updated ✨');
  };

  const postJob = async (jobData) => {
    if (apiOnline) {
      try {
        const job = await api.createJob(jobData);
        setJobs(j => [job, ...j]);
        toast('Job posted successfully! Engineers will bid soon 🚀');
        return job;
      } catch (err) {
        toast(err.message, 'error');
      }
    }
    // Local fallback
    const job = {
      ...jobData, id: 'job' + Date.now(),
      clientId: user.id, clientName: user.name,
      posted: new Date().toISOString().split('T')[0],
      bids: 0, status: 'open'
    };
    setJobs(j => [job, ...j]);
    toast('Job posted successfully! Engineers will bid soon 🚀');
    return job;
  };

  const loadMyBids = useCallback(async () => {
    if (!apiOnline || !user) return;
    try {
      const bids = await api.getMyBids();
      setMyBids(bids || []);
    } catch {}
  }, [apiOnline, user]);

  const loadMyJobs = useCallback(async () => {
    if (!apiOnline || !user) return;
    try {
      const jobs = await api.getMyJobs();
      if (jobs?.length) {
        setJobs(prev => {
          // Merge: keep local jobs without _id, add/replace API jobs
          const localOnly = prev.filter(j => !j._id);
          const apiIds = new Set(jobs.map(j => j._id?.toString()));
          const filteredPrev = prev.filter(j => !apiIds.has(j._id?.toString()));
          return [...filteredPrev, ...jobs];
        });
      }
    } catch {}
  }, [apiOnline, user]);

  const loadOrders = useCallback(async () => {
    if (!apiOnline || !user) return;
    try {
      const data = await api.getOrders();
      setOrders(data || []);
    } catch {}
  }, [apiOnline, user]);

  const updateOrderStatus = async (orderId, status) => {
    if (!apiOnline) {
      setOrders(os => os.map(o => o._id === orderId ? { ...o, status } : o));
      return;
    }
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(os => os.map(o => (o._id || o.id) === orderId ? { ...o, ...updated } : o));
      toast(status === 'accepted' ? 'Order accepted! 🎉' : status === 'completed' ? 'Order marked complete! ✅' : 'Status updated');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const placeBid = async (jobId, bidData) => {
    if (apiOnline) {
      try {
        await api.placeBid(jobId, bidData);
        await loadMyBids();
        toast('Bid submitted successfully! 🎉');
        return true;
      } catch (err) {
        toast(err.message, 'error');
        return false;
      }
    }
    // Local fallback
    toast('Bid submitted locally (API offline) 🎉');
    return true;
  };

  const saveDraft = (draftData) => {
    const existing = drafts.find(d => d.draftId === draftData.draftId);
    if (existing) {
      setDrafts(d => d.map(x => x.draftId === draftData.draftId ? { ...draftData, savedAt: new Date().toISOString() } : x));
    } else {
      setDrafts(d => [...d, { ...draftData, draftId: draftData.draftId || 'd' + Date.now(), savedAt: new Date().toISOString() }]);
    }
    toast('Draft saved 💾', 'info');
  };

  const deleteDraft = (draftId) => {
    setDrafts(d => d.filter(x => x.draftId !== draftId));
    toast('Draft deleted', 'info');
  };

  const sendMessage = async (toUserId, text) => {
    const myId = user._id || user.id;
    const isEngineer = user.role === 'freelancer';
    const otherUser = isEngineer
      ? clients.find(c => (c._id || c.id) == toUserId) || { id: toUserId, name: 'Client', avatar: { initials: 'CL' } }
      : engineers.find(e => (e._id || e.id) == toUserId) || { id: toUserId, name: 'Engineer', avatar: { initials: 'EN' } };

    const existing = convos.find(c =>
      c.participants.some(p => String(p) === String(myId)) &&
      c.participants.some(p => String(p) === String(toUserId))
    );
    const msg = { id: 'm' + Date.now(), from: myId, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: 'Today' };

    if (existing) {
      // Existing conversation — optimistic local update
      const existingId = existing._id || existing.id;
      setConvos(cv => cv.map(c => (c._id || c.id) === existingId
        ? { ...c, messages: [...c.messages, msg], lastMsg: text, lastTime: msg.time, unread: { ...c.unread, [toUserId]: (c.unread?.[toUserId] || 0) + 1 } }
        : c
      ));
      setActiveConvo(existingId);
      // Sync to API and reload full conversation for authoritative state
      if (apiOnline) {
        try {
          await api.sendMessage(existingId, text);
          await loadConversations();
        } catch (err) { /* silent */ }
      }
    } else {
      // New conversation — optimistic local update first
      const localId = 'conv' + Date.now();
      const newConvo = {
        id: localId,
        participants: [myId, toUserId],
        engineerName: isEngineer ? user.name : otherUser.name,
        engineerInitials: isEngineer ? user.avatar?.initials : otherUser.avatar?.initials,
        clientName: isEngineer ? otherUser.name : user.name,
        lastMsg: text, lastTime: msg.time,
        unread: { [myId]: 0, [toUserId]: 1 },
        messages: [msg]
      };
      setConvos(cv => [newConvo, ...cv]);
      setActiveConvo(localId);
      // Sync to API — after creation, reload to get real _id and canonical data
      if (apiOnline) {
        try {
          const created = await api.startConversation({ participantId: toUserId, initialMessage: text });
          // Replace the local-only conversation with the real API one
          setConvos(cv => {
            const normalized = normalizeConvo(created);
            return cv.map(c => c.id === localId ? normalized : c);
          });
          setActiveConvo(created._id?.toString() || created.id);
        } catch (err) { /* silent */ }
      }
    }
  };

  const markRead = (convo) => {
    const convoId = convo._id || convo.id;
    const uid = user._id || user.id;
    setConvos(cv => cv.map(c => (c._id || c.id) === convoId
      ? { ...c, unread: { ...c.unread, [uid]: 0 } }
      : c
    ));
    if (apiOnline && convo._id) {
      api.markRead(convoId).catch(() => {});
    }
  };

  const myConvos = user ? convos.filter(c => {
    const uid = user._id || user.id;
    return c.participants.some(p => String(p) === String(uid));
  }) : [];
  const totalUnread = myConvos.reduce((sum, c) => sum + (c.unread[user?.id] || 0), 0);
  const myDrafts = user ? drafts.filter(d => d.userId === user?.id) : [];

  const openModal = (name, data = null) => { setModal(name); setModalData(data); };
  const closeModal = () => { setModal(null); setModalData(null); };

  return (
    <Ctx.Provider value={{
      user, login, register, logout, updateProfile,
      engineers, clients, jobs, gigs,
      postJob, saveDraft, deleteDraft, myDrafts, placeBid,
      orders, myBids, loadOrders, loadMyBids, loadMyJobs, updateOrderStatus,
      convos: myConvos, allConvos: convos, sendMessage, markRead, activeConvo, setActiveConvo, totalUnread,
      page, setPage,
      modal, modalData, openModal, closeModal,
      toasts, toast, apiOnline, api
    }}>
      {children}
    </Ctx.Provider>
  );
}
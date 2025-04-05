
// This file contains mock implementations of all API endpoints
// Replace with real API calls when a backend is available

import { toast } from "sonner";

// Types
export interface Admin {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface Startup {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  stage: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'funding' | 'government' | 'news' | 'other';
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  startupId: string;
  startupName: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

// Mock data
const mockAdmin: Admin = {
  id: '1',
  name: 'Demo Admin',
  email: 'admin@incumeta.com',
  token: 'demo-token-xyz',
};

// Generate mock startups
const generateMockStartups = (count: number): Startup[] => {
  const industries = ['Fintech', 'Healthtech', 'Edtech', 'AI/ML', 'IoT', 'SaaS', 'E-commerce'];
  const stages = ['Ideation', 'MVP', 'Early Traction', 'Growth', 'Scale'];
  const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'approved', 'approved', 'rejected'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `startup-${i + 1}`,
    name: `Startup ${i + 1}`,
    industry: industries[Math.floor(Math.random() * industries.length)],
    stage: stages[Math.floor(Math.random() * stages.length)],
    description: `This is a ${industries[Math.floor(Math.random() * industries.length)]} startup in the ${stages[Math.floor(Math.random() * stages.length)]} stage. They are working on innovative solutions.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
  }));
};

// Generate mock events
const generateMockEvents = (count: number): Event[] => {
  const eventTypes = ['Workshop', 'Seminar', 'Networking', 'Pitch Day', 'Demo Day', 'Conference'];
  const locations = ['Main Hall', 'Conference Room A', 'Virtual (Zoom)', 'Incubator Space', 'Partner Location'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    title: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]}: ${i + 1}`,
    description: `Join us for this exciting event focused on startup growth and innovation.`,
    date: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
    location: locations[Math.floor(Math.random() * locations.length)],
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
  }));
};

// Generate mock announcements
const generateMockAnnouncements = (count: number): Announcement[] => {
  const announcementTypes: ('funding' | 'government' | 'news' | 'other')[] = ['funding', 'government', 'news', 'other'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `announcement-${i + 1}`,
    title: `${announcementTypes[i % 4].charAt(0).toUpperCase() + announcementTypes[i % 4].slice(1)} Announcement ${i + 1}`,
    description: `Important announcement for all incubated startups. Please read carefully and take action if necessary.`,
    type: announcementTypes[i % 4],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
  }));
};

// Generate mock meetings
const generateMockMeetings = (count: number, startups: Startup[]): Meeting[] => {
  return Array.from({ length: count }, (_, i) => {
    const startup = startups[Math.floor(Math.random() * startups.length)];
    const futureDate = new Date(Date.now() + Math.floor(Math.random() * 10000000000));
    
    return {
      id: `meeting-${i + 1}`,
      title: `Progress Review Meeting ${i + 1}`,
      startupId: startup.id,
      startupName: startup.name,
      date: futureDate.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 8) + 9}:00`,
      duration: 60,
      notes: i % 3 === 0 ? 'Discuss recent milestones and upcoming goals' : undefined,
      status: ['scheduled', 'completed', 'scheduled'][Math.floor(Math.random() * 2)] as 'scheduled' | 'completed' | 'cancelled',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
    };
  });
};

// Create initial mock data
const mockStartups = generateMockStartups(15);
const mockEvents = generateMockEvents(8);
const mockAnnouncements = generateMockAnnouncements(10);
const mockMeetings = generateMockMeetings(12, mockStartups);

// Store data in memory (will reset on page refresh)
let startups = [...mockStartups];
let events = [...mockEvents];
let announcements = [...mockAnnouncements];
let meetings = [...mockMeetings];

// Delay to simulate network latency (200-800ms)
const delay = (ms: number = Math.floor(Math.random() * 600) + 200) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate API errors (10% chance)
const simulateRandomError = () => {
  if (Math.random() < 0.1) {
    throw new Error("API Error: Something went wrong. Please try again.");
  }
};

// Mock API endpoints
export const mockApi = {
  // Admin Authentication
  adminRegister: async (name: string, email: string, password: string) => {
    await delay();
    simulateRandomError();
    
    return { 
      success: true,
      message: "Registration successful. Please log in."
    };
  },
  
  adminLogin: async (email: string, password: string) => {
    await delay();
    simulateRandomError();
    
    if (password !== "demo123") {
      throw new Error("Invalid credentials. Use password: demo123");
    }
    
    return {
      success: true,
      admin: {
        ...mockAdmin,
        email
      },
      token: "demo-token-xyz"
    };
  },
  
  adminProfile: async (token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    return {
      success: true,
      admin: mockAdmin
    };
  },
  
  // Startup endpoints
  startupApply: async (data: any) => {
    await delay();
    simulateRandomError();
    
    const newStartup: Startup = {
      id: `startup-${startups.length + 1}`,
      name: data.name,
      industry: data.industry,
      stage: data.stage,
      description: data.description,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    startups = [newStartup, ...startups];
    
    return {
      success: true,
      startup: newStartup
    };
  },
  
  startupLogin: async (email: string, password: string) => {
    await delay();
    simulateRandomError();
    
    return {
      success: true,
      startup: {
        id: "user-1",
        name: "User Startup",
        email: email
      },
      token: "user-token-xyz"
    };
  },
  
  startupProfile: async (token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "user-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    return {
      success: true,
      startup: {
        id: "user-1",
        name: "User Startup",
        email: "user@startup.com",
        industry: "Fintech",
        stage: "Early Traction",
        status: "approved"
      }
    };
  },
  
  // Events
  createEvent: async (data: any, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const newEvent: Event = {
      id: `event-${events.length + 1}`,
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      type: data.type,
      createdAt: new Date().toISOString()
    };
    
    events = [newEvent, ...events];
    
    return {
      success: true,
      event: newEvent
    };
  },
  
  getAllEvents: async () => {
    await delay();
    simulateRandomError();
    
    return {
      success: true,
      events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  },
  
  removeEvent: async (eventId: string, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }
    
    events = events.filter(e => e.id !== eventId);
    
    return {
      success: true,
      message: "Event removed successfully"
    };
  },
  
  // Announcements
  createAnnouncement: async (data: any, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const newAnnouncement: Announcement = {
      id: `announcement-${announcements.length + 1}`,
      title: data.title,
      description: data.description,
      type: data.type as 'funding' | 'government' | 'news' | 'other',
      createdAt: new Date().toISOString()
    };
    
    announcements = [newAnnouncement, ...announcements];
    
    return {
      success: true,
      announcement: newAnnouncement
    };
  },
  
  getAllAnnouncements: async () => {
    await delay();
    simulateRandomError();
    
    return {
      success: true,
      announcements: announcements
    };
  },
  
  removeAnnouncement: async (announcementId: string, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const announcementIndex = announcements.findIndex(a => a.id === announcementId);
    
    if (announcementIndex === -1) {
      throw new Error("Announcement not found");
    }
    
    announcements = announcements.filter(a => a.id !== announcementId);
    
    return {
      success: true,
      message: "Announcement removed successfully"
    };
  },
  
  // Startups
  getAllStartups: async (token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    return {
      success: true,
      startups: startups
    };
  },
  
  getStartupDetails: async (startupId: string, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const startup = startups.find(s => s.id === startupId);
    
    if (!startup) {
      throw new Error("Startup not found");
    }
    
    return {
      success: true,
      startup
    };
  },
  
  approveStartup: async (startupId: string, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const startupIndex = startups.findIndex(s => s.id === startupId);
    
    if (startupIndex === -1) {
      throw new Error("Startup not found");
    }
    
    startups = startups.map(s => 
      s.id === startupId ? {...s, status: 'approved' as const} : s
    );
    
    return {
      success: true,
      message: "Startup approved successfully"
    };
  },
  
  // Meetings/Schedules
  scheduleMeeting: async (data: any, token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    const startup = startups.find(s => s.id === data.startupId);
    
    if (!startup) {
      throw new Error("Startup not found");
    }
    
    const newMeeting: Meeting = {
      id: `meeting-${meetings.length + 1}`,
      title: data.title,
      startupId: data.startupId,
      startupName: startup.name,
      date: data.date,
      time: data.time,
      duration: data.duration || 60,
      notes: data.notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    meetings = [newMeeting, ...meetings];
    
    return {
      success: true,
      meeting: newMeeting
    };
  },
  
  getAllMeetings: async (token: string) => {
    await delay();
    simulateRandomError();
    
    if (token !== "demo-token-xyz") {
      throw new Error("Unauthorized");
    }
    
    return {
      success: true,
      meetings: meetings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
    };
  },
  
  getStartupMeetings: async (startupId: string, token: string) => {
    await delay();
    simulateRandomError();
    
    const startupMeetings = meetings.filter(m => m.startupId === startupId);
    
    return {
      success: true,
      meetings: startupMeetings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
    };
  }
};

// Intercept API requests and route to mock handlers
export const fetchWithMock = async (url: string, options: RequestInit = {}) => {
  console.log(`Intercepted API request to: ${url}`);
  
  try {
    // Admin authentication endpoints
    if (url.includes('/api/admin/register')) {
      const body = JSON.parse(options.body as string);
      return mockApi.adminRegister(body.name, body.email, body.password);
    }
    
    if (url.includes('/api/admin/login')) {
      const body = JSON.parse(options.body as string);
      return mockApi.adminLogin(body.email, body.password);
    }
    
    if (url.includes('/api/admin/profile')) {
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.adminProfile(token || '');
    }
    
    // Startup endpoints
    if (url.includes('/api/user/apply')) {
      const body = JSON.parse(options.body as string);
      return mockApi.startupApply(body);
    }
    
    if (url.includes('/api/user/login')) {
      const body = JSON.parse(options.body as string);
      return mockApi.startupLogin(body.email, body.password);
    }
    
    if (url.includes('/api/user/profile')) {
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.startupProfile(token || '');
    }
    
    // Events
    if (url.includes('/api/admin/create-event')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.createEvent(body, token || '');
    }
    
    if (url.includes('/api/user/events')) {
      return mockApi.getAllEvents();
    }
    
    if (url.includes('/api/admin/remove-event')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.removeEvent(body.eventId, token || '');
    }
    
    // Announcements
    if (url.includes('/api/admin/create-announcement')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.createAnnouncement(body, token || '');
    }
    
    if (url.includes('/api/user/announcements')) {
      return mockApi.getAllAnnouncements();
    }
    
    if (url.includes('/api/admin/remove-announcement')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.removeAnnouncement(body.announcementId, token || '');
    }
    
    // Startups
    if (url.includes('/api/admin/all-startups') && !url.includes('/:id')) {
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.getAllStartups(token || '');
    }
    
    // Match startups/:id URL pattern
    const startupDetailMatch = url.match(/\/api\/admin\/all-startups\/(.+)/);
    if (startupDetailMatch) {
      const startupId = startupDetailMatch[1];
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.getStartupDetails(startupId, token || '');
    }
    
    if (url.includes('/api/admin/approve-startup')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.approveStartup(body.startupId, token || '');
    }
    
    // Meetings
    if (url.includes('/api/admin/schedule-meeting')) {
      const body = JSON.parse(options.body as string);
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.scheduleMeeting(body, token || '');
    }
    
    if (url.includes('/api/admin/all-schedules')) {
      const token = options.headers?.['Authorization']?.split(' ')[1];
      return mockApi.getAllMeetings(token || '');
    }
    
    if (url.includes('/api/user/my-schedules')) {
      const token = options.headers?.['Authorization']?.split(' ')[1];
      const startupId = 'user-1'; // In a real app, this would be extracted from the token
      return mockApi.getStartupMeetings(startupId, token || '');
    }
    
    // Fallback for unhandled routes
    throw new Error(`Unhandled API route: ${url}`);
    
  } catch (error) {
    console.error("Mock API error:", error);
    toast.error(error instanceof Error ? error.message : "An error occurred");
    throw error;
  }
};

export default fetchWithMock;

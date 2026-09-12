"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types definition
export type Platform = "YouTube" | "Instagram" | "TikTok" | "Twitter" | "LinkedIn" | "Other";
export type Priority = "High" | "Medium" | "Low";
export type ContentCategory = "Long Form" | "Scripts" | "Reels" | "Shorts" | "Posts" | "Live Streams" | "Community Posts" | "Ideas";
export type ContentStatus = "Ideas" | "Research" | "Writing" | "Editing" | "Thumbnail" | "Review" | "Scheduled" | "Published";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  priority: Priority;
  category: ContentCategory;
  deadline: string;
  status: ContentStatus;
  tags: string[];
  referenceLinks: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  platform: Platform;
  contentId?: string;
  type: "upload" | "filming" | "meeting" | "deadline" | "other";
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown text
  folder: string;
  isPinned: boolean;
  updatedAt: string;
}

export type SponsorStatus = "Lead" | "Cold Email" | "Waiting" | "Negotiating" | "Accepted" | "Completed" | "Paid";

export interface Sponsor {
  id: string;
  brandName: string;
  contactPerson: string;
  email: string;
  phone: string;
  offerAmount: number;
  campaignName: string;
  status: SponsorStatus;
  nextFollowUp: string;
  notes: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: "Subscribers" | "Followers" | "Videos" | "Streak" | "Revenue";
  deadline: string;
  milestones: { text: string; completed: boolean }[];
}

export interface Asset {
  id: string;
  name: string;
  size: string;
  type: "video" | "image" | "audio" | "document";
  folder: string;
  url: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "danger";
  read: boolean;
  timestamp: string;
}

export interface UserSettings {
  profileName: string;
  profileEmail: string;
  profileBio: string;
  avatarUrl: string;
  subscriptionPlan: "Free" | "Pro" | "Team";
  theme: "dark" | "light";
  emailNotifications: boolean;
  connectedAccounts: {
    youtube: boolean;
    instagram: boolean;
    tiktok: boolean;
    twitter: boolean;
    github: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}

interface WorkspaceContextType {
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Auth state
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;
  
  // Content Items
  contentItems: ContentItem[];
  addContentItem: (item: Omit<ContentItem, "id" | "createdAt">) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  
  // Calendar Events
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  // Notes
  notes: Note[];
  folders: string[];
  addNote: (note: Omit<Note, "id" | "updatedAt">) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFolder: (folder: string) => void;
  deleteFolder: (folder: string) => void;
  
  // Sponsors CRM
  sponsors: Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, "id">) => void;
  updateSponsor: (id: string, updates: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Assets
  assets: Asset[];
  assetFolders: string[];
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
  deleteAsset: (id: string) => void;
  addAssetFolder: (folder: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (noti: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Initial Mock Data
const initialContentItems: ContentItem[] = [
  {
    id: "c1",
    title: "10 Next.js 15 Tips I Wish I Knew Sooner",
    description: "Deep dive into React Server Components, hydration improvements, static exports, and performance tweaks in Next.js 15.",
    platform: "YouTube",
    priority: "High",
    category: "Long Form",
    deadline: "2026-08-01",
    status: "Writing",
    tags: ["nextjs", "react", "webdev"],
    referenceLinks: ["https://nextjs.org/blog/nextjs-15", "https://react.dev"],
    isFavorite: true,
    isArchived: false,
    createdAt: "2026-07-20T10:00:00Z"
  },
  {
    id: "c2",
    title: "How to animate with Framer Motion in 30s",
    description: "Quick tutorial demonstrating standard layoutId transitions and bounce spring animations in React.",
    platform: "Instagram",
    priority: "Medium",
    category: "Reels",
    deadline: "2026-07-28",
    status: "Editing",
    tags: ["framermotion", "css", "uidesign"],
    referenceLinks: [],
    isFavorite: false,
    isArchived: false,
    createdAt: "2026-07-22T14:30:00Z"
  },
  {
    id: "c3",
    title: "Why SQL is better than NoSQL for SaaS apps",
    description: "A fast-paced YouTube short explaining ACID transactions, relations, and scalability of relational databases.",
    platform: "TikTok",
    priority: "Low",
    category: "Shorts",
    deadline: "2026-07-27",
    status: "Scheduled",
    tags: ["databases", "sql", "postgres"],
    referenceLinks: [],
    isFavorite: true,
    isArchived: false,
    createdAt: "2026-07-23T11:00:00Z"
  },
  {
    id: "c4",
    title: "Building a $10k/month SaaS in 24 Hours",
    description: "The ultimate challenge video. Writing code, setting up payments with Stripe, and running automated cold emails.",
    platform: "YouTube",
    priority: "High",
    category: "Long Form",
    deadline: "2026-07-24",
    status: "Published",
    tags: ["saas", "solopreneur", "coding"],
    referenceLinks: ["https://stripe.com", "https://resend.com"],
    isFavorite: true,
    isArchived: false,
    createdAt: "2026-07-15T09:00:00Z"
  },
  {
    id: "c5",
    title: "Excited to launch Nexora today! 🚀",
    description: "Announcement tweet and graphic about our new unified creator workspace. Highlighting key features.",
    platform: "Twitter",
    priority: "High",
    category: "Posts",
    deadline: "2026-07-26",
    status: "Scheduled",
    tags: ["saas", "indiehackers", "creator"],
    referenceLinks: [],
    isFavorite: false,
    isArchived: false,
    createdAt: "2026-07-25T12:00:00Z"
  },
  {
    id: "c6",
    title: "Designing the Ultimate Sponsor Pitch Deck",
    description: "Outline of slides, metrics, and templates you need to double your brand deals rates.",
    platform: "LinkedIn",
    priority: "Medium",
    category: "Posts",
    deadline: "2026-08-05",
    status: "Ideas",
    tags: ["sponsorships", "marketing", "creators"],
    referenceLinks: [],
    isFavorite: false,
    isArchived: false,
    createdAt: "2026-07-25T15:20:00Z"
  }
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Launch Post (Twitter)",
    start: "2026-07-26T10:00:00",
    end: "2026-07-26T11:00:00",
    platform: "Twitter",
    contentId: "c5",
    type: "upload"
  },
  {
    id: "e2",
    title: "Post SQL vs NoSQL Short",
    start: "2026-07-27T18:00:00",
    end: "2026-07-27T18:30:00",
    platform: "TikTok",
    contentId: "c3",
    type: "upload"
  },
  {
    id: "e3",
    title: "Edit Next.js 15 Tips Video",
    start: "2026-07-29T13:00:00",
    end: "2026-07-29T17:00:00",
    platform: "YouTube",
    contentId: "c1",
    type: "filming"
  },
  {
    id: "e4",
    title: "Vercel Sponsor Synch Call",
    start: "2026-07-28T16:00:00",
    end: "2026-07-28T16:30:00",
    platform: "Other",
    type: "meeting",
    notes: "Review content draft & thumbnail designs."
  }
];

const initialNotes: Note[] = [
  {
    id: "n1",
    title: "Next.js 15 Video Script Outline",
    content: `# Script Outline: 10 Next.js 15 Tips

## Introduction (0:00 - 1:30)
- Hook: The React 19 + Next.js 15 upgrade is confusing developers.
- Introduce the 10 speed tips that cut boilerplate.
- Dynamic montage showing final performance numbers.

## Section 1: Dynamic APIs & Async Layouts (1:30 - 5:00)
- Explain why \`params\` and \`searchParams\` are now promises.
- Code example showing how to cleanly await them.
- *Tip:* Use React's \`use\` hook in Client Components!

## Section 2: React Server Actions & Security (5:00 - 9:00)
- Form action pending states.
- Best practices on sanitizing server parameters.

## Conclusion (9:00 - 10:00)
- CTA: Like, subscribe, and download Nexora!`,
    folder: "Scripts",
    isPinned: true,
    updatedAt: "2026-07-25T16:00:00Z"
  },
  {
    id: "n2",
    title: "Brand Deal Email Pitch Templates",
    content: `# Brand Pitch Template - 2026

Subject: Partnership: [My Channel Name] x [Brand Name]

Hey [Brand Contact Name],

I've been a huge fan of [Product/Brand] for a long time, and I'm currently designing my upcoming video series focusing on modern web development and SaaS builds.

My audience consists of **42,000+ developers, tech enthusiasts, and SaaS builders** with an average engagement rate of **6.2%**.

I would love to pitch a dedicated sponsorship segment showcasing how developers can integrate [Product] into their stack.

Here are my details:
- **Average Views:** 15,000 - 30,000 per video
- **Primary audience location:** US, India, UK, Germany
- **Past sponsors:** Vercel, Stripe, Supabase

Let me know if you have budget for integrations in Q3/Q4.

Best,
[Your Name]`,
    folder: "Sponsors",
    isPinned: true,
    updatedAt: "2026-07-24T12:00:00Z"
  },
  {
    id: "n3",
    title: "Q4 Content Ideas & Brainstorming",
    content: `# Q4 Content Ideas 💡

- [ ] Rebuilding VS Code from scratch in the browser
- [ ] Tailwind CSS v4: Is it actually faster?
- [ ] Microservices vs Monolith: The 2026 Retrospective
- [ ] How I host 10 apps for free using cloudflare workers
- [ ] The truth about developer burnout and productivity`,
    folder: "Ideas",
    isPinned: false,
    updatedAt: "2026-07-25T10:00:00Z"
  }
];

const initialSponsors: Sponsor[] = [
  {
    id: "s1",
    brandName: "Vercel",
    contactPerson: "Sarah Jenkins",
    email: "sarah.j@vercel.com",
    phone: "+1 (555) 901-2345",
    offerAmount: 150000,
    campaignName: "Next.js 15 Launch Sponsor",
    status: "Accepted",
    nextFollowUp: "2026-07-28",
    notes: "Awaiting draft video link. Thumbnail approved."
  },
  {
    id: "s2",
    brandName: "Notion",
    contactPerson: "David Miller",
    email: "david@m.notion.so",
    phone: "+1 (555) 234-5678",
    offerAmount: 200000,
    campaignName: "Workspace Management Showcase",
    status: "Negotiating",
    nextFollowUp: "2026-07-30",
    notes: "Offered ₹2,00,000 for 1 integration. Asking for an extra social post."
  },
  {
    id: "s3",
    brandName: "Stripe",
    contactPerson: "Alex Rivera",
    email: "arivera@stripe.com",
    phone: "+1 (555) 345-6789",
    offerAmount: 300000,
    campaignName: "SaaS Checkout Tutorial",
    status: "Paid",
    nextFollowUp: "2026-08-10",
    notes: "Payment received! Video completed and published."
  },
  {
    id: "s4",
    brandName: "Epidemic Sound",
    contactPerson: "Linus Hallberg",
    email: "l.hallberg@epidemic.se",
    phone: "+46 8 123 45 67",
    offerAmount: 50000,
    campaignName: "Creator Soundtracks Sponsorship",
    status: "Lead",
    nextFollowUp: "2026-08-02",
    notes: "First touch sent. Follow up with pitch deck next week."
  }
];

const initialGoals: Goal[] = [
  {
    id: "g1",
    title: "Reach 50K YouTube Subscribers",
    target: 50000,
    current: 42500,
    unit: "subscribers",
    category: "Subscribers",
    deadline: "2026-12-31",
    milestones: [
      { text: "Pass 40k subscribers", completed: true },
      { text: "Pass 45k subscribers", completed: false },
      { text: "Pass 50k subscribers", completed: false }
    ]
  },
  {
    id: "g2",
    title: "100 Published Videos",
    target: 100,
    current: 89,
    unit: "videos",
    category: "Videos",
    deadline: "2026-10-01",
    milestones: [
      { text: "Publish video 90", completed: false },
      { text: "Publish video 95", completed: false },
      { text: "Publish video 100", completed: false }
    ]
  },
  {
    id: "g3",
    title: "30 Day Upload Streak",
    target: 30,
    current: 14,
    unit: "days",
    category: "Streak",
    deadline: "2026-08-15",
    milestones: [
      { text: "Reach 15 day streak", completed: false },
      { text: "Reach 20 day streak", completed: false },
      { text: "Reach 30 day streak", completed: false }
    ]
  },
  {
    id: "g4",
    title: "Sponsorship Revenue Target",
    target: 500000,
    current: 350000,
    unit: "INR",
    category: "Revenue",
    deadline: "2026-09-30",
    milestones: [
      { text: "Earn ₹2,00,000", completed: true },
      { text: "Earn ₹4,00,000", completed: false },
      { text: "Earn ₹5,00,000", completed: false }
    ]
  }
];

const initialAssets: Asset[] = [
  {
    id: "a1",
    name: "nexora-brand-logo.png",
    size: "1.2 MB",
    type: "image",
    folder: "Brand Kit",
    url: "/assets/brand-logo.png",
    createdAt: "2026-07-25T12:00:00Z"
  },
  {
    id: "a2",
    name: "intro-cinematic-hook.mp4",
    size: "45.8 MB",
    type: "video",
    folder: "Videos",
    url: "/assets/intro-cinematic-hook.mp4",
    createdAt: "2026-07-24T15:30:00Z"
  },
  {
    id: "a3",
    name: "ambient-coding-synth.mp3",
    size: "8.4 MB",
    type: "audio",
    folder: "Music",
    url: "/assets/ambient-coding-synth.mp3",
    createdAt: "2026-07-23T09:15:00Z"
  },
  {
    id: "a4",
    name: "nextjs15-thumbnail-draft.jpg",
    size: "2.1 MB",
    type: "image",
    folder: "Thumbnails",
    url: "/assets/nextjs15-thumbnail-draft.jpg",
    createdAt: "2026-07-25T14:45:00Z"
  }
];

const initialNotifications: Notification[] = [
  {
    id: "n_1",
    title: "Payment Received",
    description: "Stripe sponsorship payout of ₹3,00,000 cleared for campaign: SaaS Checkout Tutorial.",
    type: "success",
    read: false,
    timestamp: "2026-07-25T15:00:00Z"
  },
  {
    id: "n_2",
    title: "Thumbnail Approved",
    description: "Vercel marketing team approved the draft thumbnail for '10 Next.js 15 Tips'.",
    type: "success",
    read: false,
    timestamp: "2026-07-25T10:30:00Z"
  },
  {
    id: "n_3",
    title: "Streak Alert!",
    description: "Your upload streak is at 14 days. Keep it up to hit your 30-day milestone!",
    type: "info",
    read: true,
    timestamp: "2026-07-24T18:00:00Z"
  },
  {
    id: "n_4",
    title: "Action Required",
    description: "Sponsor draft for Notion integration is due in 2 days.",
    type: "warning",
    read: false,
    timestamp: "2026-07-24T09:00:00Z"
  }
];

const defaultSettings: UserSettings = {
  profileName: "Alex Mercer",
  profileEmail: "alex@nexora.app",
  profileBio: "Tech creator building web software and sharing tutorials about React, Next.js, and UX Design. Sharing the journey.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  subscriptionPlan: "Pro",
  theme: "dark",
  emailNotifications: true,
  connectedAccounts: {
    youtube: true,
    instagram: true,
    tiktok: true,
    twitter: true,
    github: true
  }
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  
  // Mock Data States
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<string[]>(["Scripts", "Sponsors", "Ideas", "General"]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetFolders, setAssetFolders] = useState<string[]>(["Brand Kit", "Videos", "Music", "Thumbnails"]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load from localStorage or load defaults
  useEffect(() => {
    // Check if user session exists
    const storedUser = localStorage.getItem("nexora_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setActiveTab("Dashboard");
      } catch {
        const defaultUser = {
          id: "u1",
          email: "alex@nexora.app",
          fullName: "Alex Mercer",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
        };
        setUser(defaultUser);
        localStorage.setItem("nexora_user", JSON.stringify(defaultUser));
        setActiveTab("Dashboard");
      }
    } else {
      const defaultUser = {
        id: "u1",
        email: "alex@nexora.app",
        fullName: "Alex Mercer",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
      };
      setUser(defaultUser);
      localStorage.setItem("nexora_user", JSON.stringify(defaultUser));
      setActiveTab("Dashboard");
    }

    const loadData = <T,>(key: string, initial: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setter(JSON.parse(stored));
        } catch {
          setter(initial);
        }
      } else {
        setter(initial);
        localStorage.setItem(key, JSON.stringify(initial));
      }
    };

    loadData("nexora_content", initialContentItems, setContentItems);
    loadData("nexora_events", initialCalendarEvents, setCalendarEvents);
    loadData("nexora_notes", initialNotes, setNotes);
    loadData("nexora_folders", ["Scripts", "Sponsors", "Ideas", "General"], setFolders);
    loadData("nexora_sponsors", initialSponsors, setSponsors);
    loadData("nexora_goals", initialGoals, setGoals);
    loadData("nexora_assets", initialAssets, setAssets);
    loadData("nexora_asset_folders", ["Brand Kit", "Videos", "Music", "Thumbnails"], setAssetFolders);
    loadData("nexora_notifications", initialNotifications, setNotifications);
    loadData("nexora_settings", defaultSettings, setSettings);
  }, []);

  // Save changes helper
  const syncStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Auth Operations
  const login = async (email: string, password?: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if we already have this user registered in settings
    let name = "Alex Mercer";
    let avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
    
    if (email === settings.profileEmail) {
      name = settings.profileName;
      avatar = settings.avatarUrl;
    } else {
      // Create some default name for other logins
      name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
    }

    const newUser = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      email,
      fullName: name,
      avatarUrl: avatar
    };
    
    setUser(newUser);
    localStorage.setItem("nexora_user", JSON.stringify(newUser));
    setActiveTab("Dashboard");
    
    addNotification({
      title: "Welcome back!",
      description: `Successfully signed in as ${newUser.fullName}.`,
      type: "success"
    });
    
    return true;
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      email,
      fullName: name,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    };
    setUser(newUser);
    localStorage.setItem("nexora_user", JSON.stringify(newUser));
    
    // Update settings as well
    const updatedSettings = {
      ...settings,
      profileName: name,
      profileEmail: email,
      avatarUrl: newUser.avatarUrl
    };
    setSettings(updatedSettings);
    syncStorage("nexora_settings", updatedSettings);
    setActiveTab("Dashboard");

    addNotification({
      title: "Welcome to Nexora!",
      description: "Your workspace is ready. Let's create something awesome.",
      type: "success"
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexora_user");
    setActiveTab("LandingPage");
  };

  // Content Operations
  const addContentItem = (item: Omit<ContentItem, "id" | "createdAt">) => {
    const newItem: ContentItem = {
      ...item,
      id: "c_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...contentItems];
    setContentItems(updated);
    syncStorage("nexora_content", updated);

    // If it has a scheduled deadline, let's create a corresponding calendar event
    if (newItem.status === "Scheduled" && newItem.deadline) {
      addCalendarEvent({
        title: `Publish: ${newItem.title}`,
        start: `${newItem.deadline}T10:00:00`,
        end: `${newItem.deadline}T11:00:00`,
        platform: newItem.platform,
        contentId: newItem.id,
        type: "upload"
      });
    }

    addNotification({
      title: "Item Created",
      description: `"${newItem.title}" has been added to your workspace.`,
      type: "info"
    });
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    const updated = contentItems.map(item => {
      if (item.id === id) {
        const result = { ...item, ...updates };
        // Sync status with scheduled events if deadline or status changes
        if (updates.status === "Published") {
          // Trigger confetti or notify streak
          setTimeout(() => {
            addNotification({
              title: "Content Published! 🎉",
              description: `Congratulations on publishing "${result.title}" to ${result.platform}!`,
              type: "success"
            });
            // Update goals streak or count
            setGoals(prev => {
              const res = prev.map(g => {
                if (g.category === "Videos" || g.category === "Streak") {
                  const updatedCurrent = g.current + 1;
                  return { ...g, current: Math.min(updatedCurrent, g.target) };
                }
                return g;
              });
              syncStorage("nexora_goals", res);
              return res;
            });
          }, 100);
        }
        return result;
      }
      return item;
    });
    setContentItems(updated);
    syncStorage("nexora_content", updated);
  };

  const deleteContentItem = (id: string) => {
    const item = contentItems.find(i => i.id === id);
    const updated = contentItems.filter(item => item.id !== id);
    setContentItems(updated);
    syncStorage("nexora_content", updated);
    
    // Also remove calendar event associated
    const updatedEvents = calendarEvents.filter(e => e.contentId !== id);
    setCalendarEvents(updatedEvents);
    syncStorage("nexora_events", updatedEvents);

    if (item) {
      addNotification({
        title: "Item Removed",
        description: `"${item.title}" was deleted.`,
        type: "info"
      });
    }
  };

  // Calendar Operations
  const addCalendarEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: "e_" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...calendarEvents, newEvent];
    setCalendarEvents(updated);
    syncStorage("nexora_events", updated);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const updated = calendarEvents.map(event => 
      event.id === id ? { ...event, ...updates } : event
    );
    setCalendarEvents(updated);
    syncStorage("nexora_events", updated);
  };

  const deleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter(event => event.id !== id);
    setCalendarEvents(updated);
    syncStorage("nexora_events", updated);
  };

  // Notes Operations
  const addNote = (note: Omit<Note, "id" | "updatedAt">): string => {
    const newId = "n_" + Math.random().toString(36).substr(2, 9);
    const newNote: Note = {
      ...note,
      id: newId,
      updatedAt: new Date().toISOString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    syncStorage("nexora_notes", updated);
    return newId;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
        : note
    );
    setNotes(updated);
    syncStorage("nexora_notes", updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(note => note.id !== id);
    setNotes(updated);
    syncStorage("nexora_notes", updated);
  };

  const addFolder = (folder: string) => {
    if (!folders.includes(folder)) {
      const updated = [...folders, folder];
      setFolders(updated);
      syncStorage("nexora_folders", updated);
    }
  };

  const deleteFolder = (folder: string) => {
    const updated = folders.filter(f => f !== folder);
    setFolders(updated);
    syncStorage("nexora_folders", updated);
    
    // Recategorize notes inside deleted folder to General
    const updatedNotes = notes.map(note => 
      note.folder === folder ? { ...note, folder: "General" } : note
    );
    setNotes(updatedNotes);
    syncStorage("nexora_notes", updatedNotes);
  };

  // Sponsors CRM Operations
  const addSponsor = (sponsor: Omit<Sponsor, "id">) => {
    const newSponsor: Sponsor = {
      ...sponsor,
      id: "s_" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [newSponsor, ...sponsors];
    setSponsors(updated);
    syncStorage("nexora_sponsors", updated);

    addNotification({
      title: "Sponsor Lead Added",
      description: `Campaign with "${newSponsor.brandName}" is now in your pipeline.`,
      type: "info"
    });
  };

  const updateSponsor = (id: string, updates: Partial<Sponsor>) => {
    const updated = sponsors.map(s => {
      if (s.id === id) {
        const result = { ...s, ...updates };
        if (updates.status === "Paid") {
          setTimeout(() => {
            addNotification({
              title: "Payment Received! 💰",
              description: `Sponsor payment of ₹${result.offerAmount.toLocaleString()} from ${result.brandName} has been processed.`,
              type: "success"
            });
            // Update revenue goal
            setGoals(prev => {
              const res = prev.map(g => {
                if (g.category === "Revenue") {
                  return { ...g, current: Math.min(g.current + result.offerAmount, g.target) };
                }
                return g;
              });
              syncStorage("nexora_goals", res);
              return res;
            });
          }, 100);
        }
        return result;
      }
      return s;
    });
    setSponsors(updated);
    syncStorage("nexora_sponsors", updated);
  };

  const deleteSponsor = (id: string) => {
    const s = sponsors.find(sp => sp.id === id);
    const updated = sponsors.filter(sp => sp.id !== id);
    setSponsors(updated);
    syncStorage("nexora_sponsors", updated);

    if (s) {
      addNotification({
        title: "Sponsor Lead Removed",
        description: `Campaign with "${s.brandName}" removed from CRM.`,
        type: "info"
      });
    }
  };

  // Goals Operations
  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: "g_" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    syncStorage("nexora_goals", updated);

    addNotification({
      title: "New Goal Set",
      description: `Goal "${newGoal.title}" has been created. Let's hit those milestones!`,
      type: "info"
    });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, ...updates } : g
    );
    setGoals(updated);
    syncStorage("nexora_goals", updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    syncStorage("nexora_goals", updated);
  };

  // Assets Operations
  const addAsset = (asset: Omit<Asset, "id" | "createdAt">) => {
    const newAsset: Asset = {
      ...asset,
      id: "a_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = [newAsset, ...assets];
    setAssets(updated);
    syncStorage("nexora_assets", updated);

    addNotification({
      title: "Asset Uploaded",
      description: `"${newAsset.name}" has been added to folder: ${newAsset.folder}.`,
      type: "success"
    });
  };

  const deleteAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    syncStorage("nexora_assets", updated);
  };

  const addAssetFolder = (folder: string) => {
    if (!assetFolders.includes(folder)) {
      const updated = [...assetFolders, folder];
      setAssetFolders(updated);
      syncStorage("nexora_asset_folders", updated);
    }
  };

  // Notifications Operations
  const addNotification = (noti: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNoti: Notification = {
      ...noti,
      id: "n_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    // Keep notifications cap at 20 items
    setNotifications(prev => {
      const updated = [newNoti, ...prev].slice(0, 20);
      syncStorage("nexora_notifications", updated);
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    syncStorage("nexora_notifications", updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    syncStorage("nexora_notifications", updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    syncStorage("nexora_notifications", []);
  };

  // Settings Operations
  const updateSettings = (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    syncStorage("nexora_settings", updated);
    
    // Update user profile representation as well if email or name changes
    if (user && (updates.profileName || updates.profileEmail || updates.avatarUrl)) {
      const updatedUser = {
        ...user,
        fullName: updates.profileName || user.fullName,
        email: updates.profileEmail || user.email,
        avatarUrl: updates.avatarUrl || user.avatarUrl
      };
      setUser(updatedUser);
      localStorage.setItem("nexora_user", JSON.stringify(updatedUser));
    }

    addNotification({
      title: "Settings Saved",
      description: "Your workspace settings have been successfully updated.",
      type: "success"
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        user,
        login,
        signup,
        logout,
        contentItems,
        addContentItem,
        updateContentItem,
        deleteContentItem,
        calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        notes,
        folders,
        addNote,
        updateNote,
        deleteNote,
        addFolder,
        deleteFolder,
        sponsors,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        assets,
        assetFolders,
        addAsset,
        deleteAsset,
        addAssetFolder,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        settings,
        updateSettings
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

export interface UserState {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  hasPaid: boolean;
  name: string;
  email: string;
  age: number;
  reason: string;
  startDate: string; // ISO Date string
  currentDay: number; // 1 to 108
  lastCompletionTime: string | null; // ISO Date string
  journalEntries: Record<number, JournalEntry>;
  unlockedBadges: string[];
}

export interface JournalEntry {
  whyStarted: string;
  temptations: string;
  dailyAnswer: string;
  date: string;
}

export interface DailyContent {
  day: number;
  quote: string;
  quoteSource: string;
  gitaVerse: string;
  gitaTranslation: string;
  task: string;
  videoTaskInstruction: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  dayRequired: number;
  description: string;
  color: string;
}

export enum AppScreen {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  COMMITMENT = 'COMMITMENT',
  AUTH = 'AUTH',
  PAYMENT = 'PAYMENT',
  DASHBOARD = 'DASHBOARD'
}
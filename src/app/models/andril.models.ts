export type AppLanguage = 'en' | 'ta' | 'si';

export type ModuleId = 'learning' | 'hobbies' | 'social';

export interface ModuleState {
  id: ModuleId;
  name: string;
  tagline: string;
  active: boolean;
  is18Plus?: boolean;
  deactivatedAt?: Date | null;
  daysRemaining?: number;
}

export interface LearningProfile {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsSought: string[];
  learningGoals: string[];
  weeklyHours: number;
  learningStyle: 'Self-Paced' | 'Peer Exchange' | 'Mentorship';
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  partnersCount: number;
  classroomsCount: number;
  isSetupComplete: boolean;
  privacy: {
    isPublic: boolean;
    showHandleOnly: boolean;
    allowMatching: boolean;
  };
}

export interface HobbiesProfile {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  interests: string[];
  skillLevel: 'Beginner' | 'Enthusiast' | 'Expert';
  flightPoints: number;
  level: number;
  levelTitle: string;
  clubsCount: number;
  mapContributions: number;
  isSetupComplete: boolean;
  privacy: {
    visibleInClubs: boolean;
    locationSharing: 'City Level' | 'Neighborhood' | 'Hidden';
    allowDirectMessages: boolean;
  };
}

export interface SocialProfile {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  ageVerified: boolean;
  optInAccepted: boolean;
  lookingFor: string[];
  moodTone: string;
  personalityAnswers: {
    chronotype: 'Night Owl' | 'Early Bird';
    conversationStyle: 'Deep Conversations' | 'Casual Banter';
    beveragePreference: 'Coffee' | 'Tea';
    weekendVibe: 'Spontaneous' | 'Planned';
  };
  socialSparkXp: number;
  level: number;
  levelTitle: string;
  matchesCount: number;
  activeChatsCount: number;
  isSetupComplete: boolean;
  privacy: {
    incognitoMode: boolean;
    strictAgeFilter: boolean;
    connectionsOnlyVisibility: boolean;
  };
}

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  language: AppLanguage;
  dob?: string;
  gender?: string;
  is18Plus: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  activeModule?: ModuleId;
  modules: {
    learning: boolean;
    hobbies: boolean;
    social: boolean;
  };
  premium: {
    active: boolean;
    tier: 'none' | 'individual' | 'full';
    selectedModule?: ModuleId;
    planDuration?: '1 Month' | '3 Months' | '6 Months';
    price?: string;
  };
  coins: {
    purchased: number;
    referral: number;
  };
  referralCode: string;
}

export interface ScreenInfo {
  id: string;
  code: string;
  title: string;
  route: string;
  category: 'onboarding' | 'settings' | 'auth' | 'learning' | 'hobbies' | 'social';
  imagePath: string;
  backRoute?: string;
  defaultNextRoute?: string;
}

export interface DemoStateDefinition {
  id: string;
  code: string;
  title: string;
  route: string;
  description: string;
  category: 'auth' | 'onboarding' | 'settings';
}

export const DEMO_STATES: DemoStateDefinition[] = [
  { id: 'M2-ST-01', code: '01', title: 'Create Account: Validation Errors', route: '/auth/register', description: 'Invalid email, empty field, weak password, mismatch, email taken', category: 'auth' },
  { id: 'M2-ST-02', code: '02', title: 'Email Verification: Incorrect OTP', route: '/auth/verify-email', description: 'Invalid OTP code feedback with retry attempt counter', category: 'auth' },
  { id: 'M2-ST-03', code: '03', title: 'Email Verification: Expired OTP', route: '/auth/verify-email', description: 'Expired OTP state with resend cooldown and action', category: 'auth' },
  { id: 'M2-ST-04', code: '04', title: 'Email Verification: Success', route: '/auth/verify-email', description: 'Verified success dialog and continue prompt', category: 'auth' },
  { id: 'M2-ST-05', code: '05', title: 'Eligibility: Social Age Restriction', route: '/onboarding/eligibility', description: 'Underage warning with continue without Social option', category: 'onboarding' },
  { id: 'M2-ST-06', code: '06', title: 'Choose Modules: Activation Confirmation', route: '/onboarding/modules', description: 'Confirmation modal with summary of selected eligible modules and loading', category: 'onboarding' },
  { id: 'M2-ST-07', code: '07', title: 'Forgot Password: Request Submitted', route: '/auth/forgot-password', description: 'Neutral confirmation that reset instructions were dispatched', category: 'auth' },
  { id: 'M2-ST-08', code: '08', title: 'Reset Password: Success', route: '/auth/reset-password', description: 'Password updated confirmation dialog and return to login', category: 'auth' },
  { id: 'M2-ST-09', code: '09', title: 'Login: Invalid Credentials', route: '/auth/login', description: 'Neutral incorrect credentials error with retry and loading simulation', category: 'auth' },
  { id: 'M2-ST-10', code: '10', title: 'Manage Modules: Deactivation Warning', route: '/settings/modules', description: '21-day retention policy warning confirmation bottom sheet', category: 'settings' },
  { id: 'M2-ST-11', code: '11', title: 'Manage Modules: Reactivation States', route: '/settings/modules', description: 'Variant A (Within 21 days) vs Variant B (Expired >21 days reset required)', category: 'settings' },
  { id: 'M2-ST-12', code: '12', title: 'Security: Password Change Success', route: '/settings/security', description: 'Success modal for account password change without showing password', category: 'settings' },
  { id: 'M2-ST-13', code: '13', title: 'Privacy: Global Block Confirmation', route: '/settings/privacy', description: 'Global cross-module block dialog with mock user identifiers', category: 'settings' },
  { id: 'M2-ST-14', code: '14', title: 'Premium: Plan Selection & Demo Checkout', route: '/settings/premium', description: 'Individual ($1.49) & Full ($2.99, $7.99, $14.99) checkout modal with demo flag', category: 'settings' },
  { id: 'M2-ST-15', code: '15', title: 'Payment History: Empty State', route: '/settings/payments', description: 'Neutral empty state illustration, filter tabs and demo receipts toggle', category: 'settings' },
  { id: 'M2-ST-16', code: '16', title: 'Invite Friends: Referral Progress', route: '/settings/invite', description: '4-stage referral progression: Pending, Qualified, Reward Pending, Rewarded', category: 'settings' },
  { id: 'M2-ST-17', code: '17', title: 'Logout: Confirmation', route: '/settings/logout', description: 'Session termination confirmation dialog and loading return to welcome', category: 'settings' },
  { id: 'M2-ST-18', code: '18', title: 'Delete Account: Final Confirmation', route: '/settings/delete-account', description: 'Permanent deletion warning, re-auth check, data retention notice', category: 'settings' }
];

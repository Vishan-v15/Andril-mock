import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppLanguage,
  DEMO_STATES,
  DemoStateDefinition,
  HobbiesProfile,
  LearningProfile,
  ModuleId,
  SocialProfile,
  UserSession
} from '../models/andril.models';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface PlaceholderModalInfo {
  title: string;
  subtitle: string;
  description: string;
  sourceScreen: string;
}

const DEFAULT_SESSION: UserSession = {
  isLoggedIn: true,
  email: 'alex.rivera@example.com',
  language: 'en',
  dob: '2001-05-18',
  gender: 'Prefer not to say',
  is18Plus: true,
  termsAccepted: true,
  privacyAccepted: true,
  activeModule: 'learning',
  modules: {
    learning: true,
    hobbies: true,
    social: true
  },
  premium: {
    active: false,
    tier: 'none'
  },
  coins: {
    purchased: 0,
    referral: 0
  },
  referralCode: 'ANDRIL-ALEX-7892'
};

const DEFAULT_LEARNING_PROFILE: LearningProfile = {
  handle: '@alex_learns',
  displayName: 'Alex Rivera (Learner)',
  bio: 'Studying full-stack development and distributed systems.',
  avatarUrl: 'assets/andril/learning/Q03_LUC-02_My_Learning_Profile_-_Owner_View.png',
  skillsOffered: ['TypeScript / Angular', 'Cloud Architecture'],
  skillsSought: ['Python / Data Science', 'Neural Networks', 'Distributed Systems'],
  learningGoals: ['Master Neural Networks', 'Build Distributed Systems', 'Read 2 Research Papers / week'],
  weeklyHours: 6,
  learningStyle: 'Self-Paced',
  xp: 450,
  level: 3,
  levelTitle: 'Dedicated Scholar',
  streakDays: 12,
  partnersCount: 5,
  classroomsCount: 2,
  isSetupComplete: true,
  privacy: {
    isPublic: true,
    showHandleOnly: false,
    allowMatching: true
  }
};

const DEFAULT_HOBBIES_PROFILE: HobbiesProfile = {
  handle: '@skye_hobbies',
  displayName: 'Morgan Skye (Creator)',
  bio: 'Weekend landscape photographer, outdoor camper, and urban sketcher.',
  avatarUrl: 'assets/andril/hobbies/H10_My_Hobbies_Profile.png',
  interests: ['Photography', 'Hiking', 'Urban Sketching', 'Coffee Brewing'],
  skillLevel: 'Enthusiast',
  flightPoints: 820,
  level: 4,
  levelTitle: 'Trail Explorer',
  clubsCount: 8,
  mapContributions: 3,
  isSetupComplete: true,
  privacy: {
    visibleInClubs: true,
    locationSharing: 'City Level',
    allowDirectMessages: true
  }
};

const DEFAULT_SOCIAL_PROFILE: SocialProfile = {
  handle: '@jordan_connect',
  displayName: 'Jordan K. (Social)',
  bio: 'Indie acoustic fan, specialty coffee enthusiast, weekend explorer.',
  avatarUrl: 'assets/andril/social/S20_My_Social_Profile.png',
  ageVerified: true,
  optInAccepted: true,
  lookingFor: ['Friendships', 'Activity Buddies', 'Casual Dating'],
  moodTone: 'Creative & Chill',
  personalityAnswers: {
    chronotype: 'Night Owl',
    conversationStyle: 'Deep Conversations',
    beveragePreference: 'Coffee',
    weekendVibe: 'Spontaneous'
  },
  socialSparkXp: 310,
  level: 2,
  levelTitle: 'Vibrant Connector',
  matchesCount: 6,
  activeChatsCount: 2,
  isSetupComplete: true,
  privacy: {
    incognitoMode: false,
    strictAgeFilter: true,
    connectionsOnlyVisibility: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class PrototypeStateService {
  readonly session = signal<UserSession>({ ...DEFAULT_SESSION });
  readonly toasts = signal<ToastMessage[]>([]);
  readonly placeholderModal = signal<PlaceholderModalInfo | null>(null);

  // Independent module profiles (Cross-Module Privacy Isolation)
  readonly learningProfile = signal<LearningProfile>({ ...DEFAULT_LEARNING_PROFILE });
  readonly hobbiesProfile = signal<HobbiesProfile>({ ...DEFAULT_HOBBIES_PROFILE });
  readonly socialProfile = signal<SocialProfile>({ ...DEFAULT_SOCIAL_PROFILE });

  // Currently viewed module
  readonly activeModule = signal<ModuleId>('learning');

  // Active Demo State selector signal
  readonly activeDemoState = signal<string | null>(null);

  // M2-ST-10 / M2-ST-11: Module Deactivation and Reactivation states
  readonly deactivationModalModule = signal<ModuleId | null>(null);
  readonly reactivationVariant = signal<'grace' | 'expired'>('grace');
  readonly moduleDaysRemaining = signal<Record<ModuleId, number>>({
    learning: 21,
    hobbies: 14,
    social: 7
  });

  // M2-ST-13: Global Block dialog
  readonly blockDialogUser = signal<{ id: string; handle: string } | null>(null);

  // M2-ST-14: Premium checkout modal
  readonly premiumCheckoutModal = signal<{
    type: 'individual' | 'full';
    name: string;
    price: string;
    period: string;
    details: string;
  } | null>(null);

  // M2-ST-16: Referral Pipeline Stage
  readonly referralStage = signal<'pending' | 'qualified' | 'reward_pending' | 'rewarded'>('reward_pending');

  // M2-ST-06: Choose Modules Activation Confirmation
  readonly modulesActivationModal = signal<boolean>(false);
  readonly modulesActivatingLoading = signal<boolean>(false);

  // M2-ST-17: Logout Confirmation
  readonly logoutModalOpen = signal<boolean>(false);
  readonly logoutLoading = signal<boolean>(false);

  // M2-ST-18: Delete Account Final Confirmation
  readonly deleteConfirmationModal = signal<boolean>(false);
  readonly deleteProcessing = signal<boolean>(false);

  constructor(private router: Router) {}

  showToast(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const id = Date.now();
    this.toasts.update(current => [...current, { id, text, type }]);
    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t.id !== id));
    }, 3500);
  }

  showPlaceholder(title: string, subtitle: string, description: string, sourceScreen: string) {
    this.placeholderModal.set({
      title,
      subtitle,
      description,
      sourceScreen
    });
  }

  closePlaceholder() {
    this.placeholderModal.set(null);
  }

  setDemoState(stateId: string | null) {
    this.activeDemoState.set(stateId);
    if (!stateId) return;

    const def = DEMO_STATES.find(s => s.id === stateId);
    if (def) {
      this.router.navigate([def.route], { queryParams: { state: stateId } });
      this.showToast(`Previewing ${def.id}: ${def.title}`, 'info');
    }
  }

  setLanguage(lang: AppLanguage) {
    this.session.update(s => ({ ...s, language: lang }));
    const names = { en: 'English', ta: 'Tamil (தமிழ்)', si: 'Sinhala (සිංහල)' };
    this.showToast(`Language updated to ${names[lang]}`, 'success');
  }

  requestModuleDeactivation(mod: ModuleId) {
    this.deactivationModalModule.set(mod);
  }

  cancelModuleDeactivation() {
    this.deactivationModalModule.set(null);
  }

  confirmModuleDeactivation() {
    const mod = this.deactivationModalModule();
    if (!mod) return;

    this.session.update(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [mod]: false
      }
    }));
    this.deactivationModalModule.set(null);
    const modTitle = mod.charAt(0).toUpperCase() + mod.slice(1);
    this.showToast(`${modTitle} module deactivated. 21-day grace period started.`, 'info');
  }

  reactivateModule(mod: ModuleId) {
    const isUnderage = !this.session().is18Plus;
    if (mod === 'social' && isUnderage) {
      this.showToast('Social module requires age 18+ verification.', 'warning');
      return;
    }

    this.session.update(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [mod]: true
      }
    }));
    const modTitle = mod.charAt(0).toUpperCase() + mod.slice(1);
    this.showToast(`${modTitle} module reactivated successfully!`, 'success');
  }

  toggleModule(mod: ModuleId, enforceAge: boolean = false): boolean {
    const s = this.session();
    const currentlyActive = s.modules[mod];

    // If active and user touches toggle, trigger deactivation warning (M2-ST-10)
    if (currentlyActive) {
      this.requestModuleDeactivation(mod);
      return false;
    }

    if (mod === 'social' && !s.is18Plus && enforceAge) {
      this.showToast('Social module requires 18+ age verification.', 'warning');
      return false;
    }

    this.session.update(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [mod]: true
      }
    }));

    const modTitle = mod.charAt(0).toUpperCase() + mod.slice(1);
    this.showToast(`${modTitle} module activated.`, 'success');
    return true;
  }

  setEligibility(dob: string, gender: string, terms: boolean, privacy: boolean) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const is18Plus = age >= 18;

    this.session.update(s => ({
      ...s,
      dob,
      gender,
      is18Plus,
      termsAccepted: terms,
      privacyAccepted: privacy
    }));
  }

  setRegistration(email: string) {
    this.session.update(s => ({
      ...s,
      email,
      isLoggedIn: true
    }));
    // Reset module setup completion flags for a new user onboarding journey
    this.learningProfile.update(p => ({ ...p, isSetupComplete: false }));
    this.hobbiesProfile.update(p => ({ ...p, isSetupComplete: false }));
    this.socialProfile.update(p => ({ ...p, isSetupComplete: false, optInAccepted: false }));
  }

  login(email: string) {
    this.session.update(s => ({
      ...s,
      email: email || 'alex.rivera@example.com',
      isLoggedIn: true
    }));
    this.showToast('Successfully logged in!', 'success');
    this.router.navigate(['/settings']);
  }

  logout() {
    this.session.update(s => ({
      ...s,
      isLoggedIn: false
    }));
    this.logoutModalOpen.set(false);
    this.showToast('You have been logged out from this session.', 'info');
    this.router.navigate(['/welcome']);
  }

  deleteAccount() {
    this.session.set({
      ...DEFAULT_SESSION,
      isLoggedIn: false,
      modules: { learning: false, hobbies: false, social: false }
    });
    this.deleteConfirmationModal.set(false);
    this.showToast('Account closed (DEMO) — Data scheduled for retention purge.', 'warning');
    this.router.navigate(['/welcome']);
  }

  setPremiumPlan(planType: 'individual' | 'full', module?: ModuleId, duration?: '1 Month' | '3 Months' | '6 Months', price?: string) {
    this.session.update(s => ({
      ...s,
      premium: {
        active: true,
        tier: planType,
        selectedModule: module,
        planDuration: duration,
        price
      }
    }));
  }

  openPremiumCheckout(planType: 'individual' | 'full', name: string, price: string, period: string, details: string) {
    this.premiumCheckoutModal.set({
      type: planType,
      name,
      price,
      period,
      details
    });
  }

  closePremiumCheckout() {
    this.premiumCheckoutModal.set(null);
  }

  confirmPremiumCheckout() {
    const p = this.premiumCheckoutModal();
    if (p) {
      this.showToast(`DEMO Checkout Confirmed for ${p.name} (${p.price}). No real payment charged.`, 'success');
      this.premiumCheckoutModal.set(null);
    }
  }

  openBlockDialog(user: { id: string; handle: string }) {
    this.blockDialogUser.set(user);
  }

  closeBlockDialog() {
    this.blockDialogUser.set(null);
  }

  confirmBlock() {
    const u = this.blockDialogUser();
    if (u) {
      this.showToast(`User ${u.handle} (${u.id}) has been blocked across Learning, Hobbies, and Social.`, 'warning');
      this.blockDialogUser.set(null);
    }
  }

  copyReferralLink(): boolean {
    const link = `https://andril.app/ref/${this.session().referralCode}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    this.showToast('Referral link copied to clipboard!', 'success');
    return true;
  }

  shareReferralLink() {
    const link = `https://andril.app/ref/${this.session().referralCode}`;
    if (navigator?.share) {
      navigator.share({
        title: 'Join me on ANDRIL',
        text: 'Connect across Learning, Hobbies, and Social with dedicated private profiles!',
        url: link
      }).catch(() => {});
    } else {
      this.copyReferralLink();
      this.showToast('Share dialog simulated (Link copied).', 'info');
    }
  }

  // ==========================================
  // PHASE 4 / PART 2: MODULE ONBOARDING & SWITCHING
  // ==========================================
  getNextIncompleteModule(): ModuleId | null {
    const s = this.session();
    const mods = s.modules;

    // 1. Check Learning
    if (mods.learning && !this.learningProfile().isSetupComplete) {
      return 'learning';
    }

    // 2. Check Hobbies
    if (mods.hobbies && !this.hobbiesProfile().isSetupComplete) {
      return 'hobbies';
    }

    // 3. Check Social (eligible only if 18+)
    if (mods.social && s.is18Plus && !this.socialProfile().isSetupComplete) {
      return 'social';
    }

    return null;
  }

  navigateToNextSetupOrHome(preferredHomeModule?: ModuleId) {
    const nextIncomplete = this.getNextIncompleteModule();

    if (nextIncomplete === 'learning') {
      this.activeModule.set('learning');
      this.showToast('Proceeding to Learning profile setup (DEMO)...', 'info');
      this.router.navigate(['/modules/learning/welcome']);
      return;
    }

    if (nextIncomplete === 'hobbies') {
      this.activeModule.set('hobbies');
      this.showToast('Proceeding to Hobbies profile setup (DEMO)...', 'info');
      this.router.navigate(['/modules/hobbies/profile']);
      return;
    }

    if (nextIncomplete === 'social') {
      this.activeModule.set('social');
      if (!this.socialProfile().optInAccepted) {
        this.showToast('Proceeding to Social 18+ opt-in (DEMO)...', 'info');
        this.router.navigate(['/modules/social/opt-in']);
      } else {
        this.showToast('Proceeding to Social profile setup (DEMO)...', 'info');
        this.router.navigate(['/modules/social/profile']);
      }
      return;
    }

    // All active eligible modules are configured
    const s = this.session();
    let target = preferredHomeModule || this.activeModule();
    if (!s.modules[target]) {
      if (s.modules.learning) target = 'learning';
      else if (s.modules.hobbies) target = 'hobbies';
      else if (s.modules.social && s.is18Plus) target = 'social';
      else target = 'learning';
    }
    this.activeModule.set(target);
    this.showToast(`Selected module profiles configured (DEMO). Opening ${target.charAt(0).toUpperCase() + target.slice(1)} Home.`, 'success');
    this.router.navigate([`/modules/${target}/home`]);
  }

  proceedFromModuleSelection() {
    const s = this.session().modules;
    const hasAny = s.learning || s.hobbies || s.social;
    if (!hasAny) {
      this.showToast('Please activate at least one module to continue.', 'warning');
      return;
    }
    this.navigateToNextSetupOrHome();
  }

  switchToModule(mod: ModuleId) {
    const s = this.session();
    if (!s.modules[mod]) {
      this.showToast(`DEMO: ${mod.charAt(0).toUpperCase() + mod.slice(1)} module is currently inactive. You can enable it in Settings or Module Selection.`, 'warning');
      this.router.navigate(['/settings/modules']);
      return;
    }

    if (mod === 'social') {
      if (!s.is18Plus) {
        this.showToast('DEMO Policy: Social module is restricted to verified adults aged 18 and older.', 'warning');
        return;
      }
      if (!this.socialProfile().optInAccepted) {
        this.activeModule.set('social');
        this.showToast('DEMO: Social module requires explicit opt-in before use.', 'info');
        this.router.navigate(['/modules/social/opt-in']);
        return;
      }
      if (!this.socialProfile().isSetupComplete) {
        this.activeModule.set('social');
        this.showToast('DEMO: Please complete your Social profile setup.', 'info');
        this.router.navigate(['/modules/social/profile']);
        return;
      }
    }

    if (mod === 'learning') {
      this.activeModule.set('learning');
      if (!this.learningProfile().isSetupComplete) {
        this.showToast('DEMO: Please complete your Learning profile setup.', 'info');
        this.router.navigate(['/modules/learning/welcome']);
        return;
      }
    }

    if (mod === 'hobbies') {
      this.activeModule.set('hobbies');
      if (!this.hobbiesProfile().isSetupComplete) {
        this.showToast('DEMO: Please complete your Hobbies profile setup.', 'info');
        this.router.navigate(['/modules/hobbies/profile']);
        return;
      }
    }

    this.activeModule.set(mod);
    this.router.navigate([`/modules/${mod}/home`]);
  }

  updateLearningProfile(updates: Partial<LearningProfile>) {
    this.learningProfile.update(current => ({ ...current, ...updates }));
  }

  completeLearningSetup() {
    this.learningProfile.update(p => ({
      ...p,
      isSetupComplete: true
      // No unapproved rewards issued
    }));
    this.showToast('Learning profile saved (DEMO).', 'success');

    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToNextSetupOrHome();
    } else {
      this.activeModule.set('learning');
      this.router.navigate(['/modules/learning/home']);
    }
  }

  updateHobbiesProfile(updates: Partial<HobbiesProfile>) {
    this.hobbiesProfile.update(current => ({ ...current, ...updates }));
  }

  completeHobbiesSetup() {
    this.hobbiesProfile.update(p => ({
      ...p,
      isSetupComplete: true
      // Flight Points are not issued merely for profile creation
    }));
    this.showToast('Hobbies profile saved (DEMO).', 'success');

    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToNextSetupOrHome();
    } else {
      this.activeModule.set('hobbies');
      this.router.navigate(['/modules/hobbies/home']);
    }
  }

  optInSocial() {
    if (!this.session().is18Plus) {
      this.showToast('DEMO Policy: Social module requires age 18+ verification.', 'warning');
      return false;
    }
    this.socialProfile.update(p => ({
      ...p,
      ageVerified: true,
      optInAccepted: true
    }));
    this.showToast('18+ Verification & Social Opt-in confirmed (DEMO).', 'success');
    this.router.navigate(['/modules/social/profile']);
    return true;
  }

  updateSocialProfile(updates: Partial<SocialProfile>) {
    this.socialProfile.update(current => ({ ...current, ...updates }));
  }

  completeSocialSetup() {
    this.socialProfile.update(p => ({
      ...p,
      isSetupComplete: true
      // No unapproved rewards issued
    }));
    this.showToast('Social profile saved (DEMO).', 'success');

    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToNextSetupOrHome();
    } else {
      this.activeModule.set('social');
      this.router.navigate(['/modules/social/home']);
    }
  }

  resetDemoSession() {
    this.session.set({ ...DEFAULT_SESSION });
    this.learningProfile.set({ ...DEFAULT_LEARNING_PROFILE });
    this.hobbiesProfile.set({ ...DEFAULT_HOBBIES_PROFILE });
    this.socialProfile.set({ ...DEFAULT_SOCIAL_PROFILE });
    this.activeModule.set('learning');
    this.activeDemoState.set(null);
    this.deactivationModalModule.set(null);
    this.blockDialogUser.set(null);
    this.premiumCheckoutModal.set(null);
    this.modulesActivationModal.set(false);
    this.logoutModalOpen.set(false);
    this.deleteConfirmationModal.set(false);
    this.showToast('Demo session reset to initial state.', 'info');
    this.router.navigate(['/splash']);
  }
}

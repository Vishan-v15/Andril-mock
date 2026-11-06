import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppLanguage, DEMO_STATES, DemoStateDefinition, ModuleId, UserSession } from '../models/andril.models';

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
  modules: {
    learning: true,
    hobbies: false,
    social: false
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

@Injectable({
  providedIn: 'root'
})
export class PrototypeStateService {
  readonly session = signal<UserSession>({ ...DEFAULT_SESSION });
  readonly toasts = signal<ToastMessage[]>([]);
  readonly placeholderModal = signal<PlaceholderModalInfo | null>(null);

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

  resetDemoSession() {
    this.session.set({ ...DEFAULT_SESSION });
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

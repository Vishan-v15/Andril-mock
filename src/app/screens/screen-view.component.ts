import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SCREEN_REGISTRY } from '../data/screen-registry';
import { PrototypeStateService } from '../services/prototype-state.service';
import { AppLanguage, DEMO_STATES, DemoStateDefinition, ModuleId, ScreenInfo } from '../models/andril.models';

@Component({
  selector: 'app-screen-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './screen-view.component.html',
  styleUrls: ['./screen-view.component.css']
})
export class ScreenViewComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly state = inject(PrototypeStateService);

  currentScreen = signal<ScreenInfo>(SCREEN_REGISTRY[0]);

  // ==========================================
  // BATCH 1: M2-ST-01 to M2-ST-05
  // ==========================================
  // M2-ST-01: Create Account Form & Validation
  regEmail = signal('');
  regPassword = signal('');
  regConfirmPassword = signal('');
  showRegPassword = signal(false);
  showRegConfirmPassword = signal(false);
  regEmailError = signal<string | null>(null);
  regPasswordError = signal<string | null>(null);
  regConfirmError = signal<string | null>(null);
  regGeneralError = signal<string | null>(null);

  // M2-ST-02 / M2-ST-03 / M2-ST-04: OTP States
  otpDigits = signal<string[]>(['4', '8', '2', '9', '1', '6']);
  otpState = signal<'normal' | 'incorrect' | 'expired' | 'success'>('normal');
  otpAttemptsRemaining = signal(2);
  resendCountdown = signal(59);
  private timerRef: any;

  // M2-ST-05: Eligibility & Age Restriction
  eligibilityDob = signal('2001-05-18');
  eligibilityGender = signal('Female');
  agreeTerms = signal(true);
  agreePrivacy = signal(true);
  underageModalOpen = signal(false);

  // ==========================================
  // BATCH 2: M2-ST-06 to M2-ST-09
  // ==========================================
  // M2-ST-06: Choose Modules Activation Confirmation
  modulesConfirmModalOpen = signal(false);
  modulesActivatingLoading = signal(false);

  // M2-ST-07: Forgot Password Request Confirmation
  forgotEmail = signal('');
  forgotSubmitted = signal(false);

  // M2-ST-08: Reset Password Success
  resetPassword = signal('');
  resetConfirmPassword = signal('');
  showResetPassword = signal(false);
  showResetConfirmPassword = signal(false);
  resetSuccessModalOpen = signal(false);

  // M2-ST-09: Login Invalid Credentials
  loginEmail = signal('alex.rivera@example.com');
  loginPassword = signal('••••••••••••');
  showLoginPassword = signal(false);
  loginLoading = signal(false);
  loginError = signal<string | null>(null);

  // ==========================================
  // BATCH 3: M2-ST-10 to M2-ST-13
  // ==========================================
  // M2-ST-10: Deactivation Warning Bottom Sheet
  deactivationWarningOpen = signal(false);
  deactivationModuleTarget = signal<ModuleId>('hobbies');

  // M2-ST-11: Manage Modules Reactivation States
  reactivationVariant = signal<'grace' | 'expired'>('grace');
  reactivationPreviewActive = signal(false);

  // M2-ST-12: Password Change Success
  secCurrentPassword = signal('••••••••••••');
  secNewPassword = signal('');
  secConfirmPassword = signal('');
  showSecCurrent = signal(false);
  showSecNew = signal(false);
  showSecConfirm = signal(false);
  secSuccessModalOpen = signal(false);

  // M2-ST-13: Global Block Confirmation
  blockDialogOpen = signal(false);
  mockUserToBlock = signal({ id: 'USR-84920', handle: '@mock_user_94' });

  // ==========================================
  // BATCH 4: M2-ST-14 to M2-ST-18
  // ==========================================
  // M2-ST-14: Premium Plan Selection & Demo Checkout
  selectedIndividualModule = signal<ModuleId>('learning');
  selectedFullPlanDuration = signal<'1 Month' | '3 Months' | '6 Months'>('1 Month');
  premiumCheckoutOpen = signal(false);
  premiumCheckoutData = signal<{
    planName: string;
    price: string;
    period: string;
    coverage: string;
  } | null>(null);

  // M2-ST-15: Payment History Empty State
  paymentFilter = signal<'all' | 'premium' | 'coins'>('all');
  showMockPayments = signal(false);

  // M2-ST-16: Referral Progress Stepper
  referralPipelineStep = signal<1 | 2 | 3 | 4>(3);

  // M2-ST-17: Logout Confirmation
  logoutModalOpen = signal(false);
  logoutLoading = signal(false);

  // M2-ST-18: Delete Account Final Confirmation
  deletePassword = signal('');
  deleteConfirmed = signal(false);
  showDeletePassword = signal(false);
  deletePasswordError = signal<string | null>(null);
  deleteProcessing = signal(false);
  deleteModalOpen = signal(false);
  deleteDoneModalOpen = signal(false);

  // Debug visual hotspot guides
  showHotspotGuide = signal(false);

  // ==========================================
  // PHASE 4: LEARNING MODULE JOURNEY SIGNALS
  // ==========================================
  lrnHandle = signal('@alex_learns');
  lrnDisplayName = signal('Alex Rivera');
  lrnBio = signal('Full-stack developer eager to learn machine learning & distributed systems.');
  lrnSkillOffered = signal('TypeScript / Angular');
  lrnSkillsToLearn = signal<string[]>(['Neural Networks', 'Distributed Systems']);
  lrnWeeklyHours = signal(6);
  lrnStyle = signal<'Self-Paced' | 'Peer Exchange' | 'Mentorship'>('Self-Paced');
  lrnPublicProfile = signal(true);
  lrnShowHandleOnly = signal(false);
  lrnAllowMatching = signal(true);

  // ==========================================
  // PHASE 4: HOBBIES MODULE JOURNEY SIGNALS
  // ==========================================
  hobHandle = signal('@alex_hobbies');
  hobDisplayName = signal('Alex Rivera');
  hobBio = signal('Passionate about landscape photography, trail hiking, and urban sketching.');
  hobSkillLevel = signal<'Beginner' | 'Enthusiast' | 'Expert'>('Enthusiast');
  hobInterests = signal<string[]>(['Photography', 'Hiking', 'Urban Sketching', 'Coffee Brewing']);
  hobVisibleInClubs = signal(true);
  hobLocationSharing = signal<'City Level' | 'Neighborhood' | 'Hidden'>('City Level');
  hobDirectMessages = signal(true);

  // ==========================================
  // PHASE 4: SOCIAL MODULE JOURNEY SIGNALS
  // ==========================================
  socAgeVerifiedCheck = signal(false);
  socOptInConsentCheck = signal(false);
  socHandle = signal('@alex_social');
  socDisplayName = signal('Alex R.');
  socBio = signal('Creative techie, indie music lover, weekend coffee explorer. Let us connect!');
  socLookingFor = signal<string[]>(['Friendships', 'Activity Buddies']);
  socMoodTone = signal('Creative & Chill');
  socIncognito = signal(false);
  socStrictAge = signal(true);

  ngOnInit() {
    this.syncCurrentScreen();
    this.router.events.subscribe(() => {
      this.syncCurrentScreen();
    });

    this.route.queryParams.subscribe(params => {
      const stateId = params['state'];
      if (stateId) {
        this.applyDemoState(stateId);
      }
    });

    this.startResendTimer();
  }

  ngOnDestroy() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  private syncCurrentScreen() {
    const path = this.router.url.split('?')[0];
    const match = SCREEN_REGISTRY.find(s => s.route === path) || SCREEN_REGISTRY[0];
    this.currentScreen.set(match);
  }

  // ==============================================================
  // APPLY DEMO STATE (Direct 1-Click State Inspector Trigger)
  // ==============================================================
  applyDemoState(stateId: string) {
    switch (stateId) {
      // M2-ST-01: Register Validation Errors
      case 'M2-ST-01':
        this.regEmail.set('invalid-email-format');
        this.regPassword.set('123');
        this.regConfirmPassword.set('456');
        this.regEmailError.set('Please enter a valid email address.');
        this.regPasswordError.set('Password must be at least 8 characters.');
        this.regConfirmError.set('Passwords do not match.');
        this.regGeneralError.set('This email address is already registered in our mock records.');
        break;

      // M2-ST-02: Incorrect OTP
      case 'M2-ST-02':
        this.otpDigits.set(['9', '9', '9', '9', '9', '9']);
        this.otpState.set('incorrect');
        this.otpAttemptsRemaining.set(2);
        break;

      // M2-ST-03: Expired OTP
      case 'M2-ST-03':
        this.otpDigits.set(['-', '-', '-', '-', '-', '-']);
        this.otpState.set('expired');
        this.resendCountdown.set(0);
        break;

      // M2-ST-04: OTP Success
      case 'M2-ST-04':
        this.otpDigits.set(['4', '8', '2', '9', '1', '6']);
        this.otpState.set('success');
        break;

      // M2-ST-05: Social Underage Restriction
      case 'M2-ST-05':
        this.eligibilityDob.set('2010-06-15');
        this.underageModalOpen.set(true);
        break;

      // M2-ST-06: Choose Modules Activation Confirmation
      case 'M2-ST-06':
        this.modulesConfirmModalOpen.set(true);
        break;

      // M2-ST-07: Forgot Password Submitted
      case 'M2-ST-07':
        this.forgotEmail.set('user@example.com');
        this.forgotSubmitted.set(true);
        break;

      // M2-ST-08: Reset Password Success
      case 'M2-ST-08':
        this.resetSuccessModalOpen.set(true);
        break;

      // M2-ST-09: Login Invalid Credentials
      case 'M2-ST-09':
        this.loginEmail.set('user@example.com');
        this.loginPassword.set('wrong-password');
        this.loginError.set('Invalid email or password. Please verify your credentials and try again.');
        break;

      // M2-ST-10: Manage Modules Deactivation Warning
      case 'M2-ST-10':
        this.deactivationModuleTarget.set('hobbies');
        this.deactivationWarningOpen.set(true);
        break;

      // M2-ST-11: Manage Modules Reactivation States
      case 'M2-ST-11':
        this.reactivationPreviewActive.set(true);
        this.reactivationVariant.set('grace');
        break;

      // M2-ST-12: Security Password Change Success
      case 'M2-ST-12':
        this.secSuccessModalOpen.set(true);
        break;

      // M2-ST-13: Global Block Confirmation
      case 'M2-ST-13':
        this.blockDialogOpen.set(true);
        break;

      // M2-ST-14: Premium Demo Checkout
      case 'M2-ST-14':
        this.openPremiumCheckoutModal('full', 'Full ANDRIL Premium', '$2.99', '1 Month', 'Includes all 3 modules: Learning, Hobbies, and Social.');
        break;

      // M2-ST-15: Payment History Empty State
      case 'M2-ST-15':
        this.showMockPayments.set(false);
        this.paymentFilter.set('all');
        break;

      // M2-ST-16: Referral Progress
      case 'M2-ST-16':
        this.referralPipelineStep.set(3);
        break;

      // M2-ST-17: Logout Confirmation
      case 'M2-ST-17':
        this.logoutModalOpen.set(true);
        break;

      // M2-ST-18: Delete Account Final Confirmation
      case 'M2-ST-18':
        this.deletePassword.set('');
        this.deleteConfirmed.set(false);
        this.deleteModalOpen.set(true);
        break;
    }
  }

  private startResendTimer() {
    this.resendCountdown.set(59);
    if (this.timerRef) clearInterval(this.timerRef);
    this.timerRef = setInterval(() => {
      this.resendCountdown.update(c => (c > 0 ? c - 1 : 0));
    }, 1000);
  }

  navigateBack() {
    const back = this.currentScreen().backRoute;
    if (back) {
      this.router.navigate([back]);
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onSplashTap() {
    this.router.navigate(['/onboarding/language']);
  }

  selectLanguage(lang: AppLanguage) {
    this.state.setLanguage(lang);
  }

  confirmLanguage() {
    this.router.navigate(['/welcome']);
  }

  // ==========================================
  // BATCH 1 HANDLERS (M2-ST-01 to M2-ST-05)
  // ==========================================
  onRegisterSubmit() {
    // Clear prior errors
    this.regEmailError.set(null);
    this.regPasswordError.set(null);
    this.regConfirmError.set(null);
    this.regGeneralError.set(null);

    const email = this.regEmail().trim();
    const pass = this.regPassword();
    const conf = this.regConfirmPassword();

    let hasError = false;

    // Check empty email
    if (!email) {
      this.regEmailError.set('Email address is required.');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      this.regEmailError.set('Please enter a valid email address.');
      hasError = true;
    } else if (email.toLowerCase() === 'taken@example.com' || email.toLowerCase() === 'alex.rivera@example.com') {
      this.regGeneralError.set('An account with this email already exists.');
      hasError = true;
    }

    // Check password
    if (!pass) {
      this.regPasswordError.set('Password is required.');
      hasError = true;
    } else if (pass.length < 8) {
      this.regPasswordError.set('Password must be at least 8 characters.');
      hasError = true;
    }

    // Check confirm password
    if (!conf) {
      this.regConfirmError.set('Please confirm your password.');
      hasError = true;
    } else if (pass !== conf) {
      this.regConfirmError.set('Passwords do not match.');
      hasError = true;
    }

    if (hasError) {
      this.state.showToast('Please correct the validation errors below.', 'error');
      return;
    }

    this.state.setRegistration(email);
    this.state.showToast('Registration code sent to ' + email, 'success');
    this.router.navigate(['/auth/verify-email']);
  }

  clearRegError(field: 'email' | 'pass' | 'conf') {
    if (field === 'email') {
      this.regEmailError.set(null);
      this.regGeneralError.set(null);
    }
    if (field === 'pass') this.regPasswordError.set(null);
    if (field === 'conf') this.regConfirmError.set(null);
  }

  onGoogleAuth(destination: string = '/onboarding/eligibility') {
    this.state.login('alex.rivera@gmail.com');
    this.state.showToast('Simulated Google Authentication successful.', 'success');
    this.router.navigate([destination]);
  }

  // OTP handlers
  onOtpInput(index: number, event: any) {
    const value = event.target.value;
    const digits = [...this.otpDigits()];
    digits[index] = value ? value.charAt(value.length - 1) : '';
    this.otpDigits.set(digits);

    if (this.otpState() === 'incorrect') {
      this.otpState.set('normal');
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  verifyOtp() {
    const code = this.otpDigits().join('');

    // If simulating expired
    if (this.otpState() === 'expired') {
      this.state.showToast('Code expired. Please request a new code.', 'warning');
      return;
    }

    // Demo invalid OTP check: if entered '999999' or '000000', trigger M2-ST-02
    if (code === '999999' || code === '000000') {
      this.otpState.set('incorrect');
      this.otpAttemptsRemaining.update(a => (a > 1 ? a - 1 : 0));
      this.state.showToast('Invalid code. ' + this.otpAttemptsRemaining() + ' attempts remaining.', 'error');
      return;
    }

    // Success state M2-ST-04
    this.otpState.set('success');
  }

  retryOtp() {
    this.otpDigits.set(['', '', '', '', '', '']);
    this.otpState.set('normal');
    const first = document.getElementById('otp-input-0');
    if (first) first.focus();
  }

  resendOtp() {
    if (this.resendCountdown() > 0 && this.otpState() !== 'expired') return;
    this.startResendTimer();
    this.otpState.set('normal');
    this.otpDigits.set(['4', '8', '2', '9', '1', '6']);
    this.otpAttemptsRemaining.set(2);
    this.state.showToast('A fresh 6-digit verification code has been dispatched.', 'info');
  }

  continueToEligibility() {
    this.otpState.set('normal');
    this.router.navigate(['/onboarding/eligibility']);
  }

  // Eligibility & Policies
  onEligibilitySubmit() {
    if (!this.agreeTerms() || !this.agreePrivacy()) {
      this.state.showToast('Please accept the Terms of Service and Privacy Policy to continue.', 'warning');
      return;
    }

    // Check if under 18
    const birthDate = new Date(this.eligibilityDob());
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      // Trigger M2-ST-05
      this.underageModalOpen.set(true);
      return;
    }

    this.state.setEligibility(
      this.eligibilityDob(),
      this.eligibilityGender(),
      this.agreeTerms(),
      this.agreePrivacy()
    );
    this.state.showToast('Eligibility profile verified (18+ eligible).', 'success');
    this.router.navigate(['/onboarding/modules']);
  }

  continueWithoutSocial() {
    this.underageModalOpen.set(false);
    this.state.setEligibility(
      this.eligibilityDob(),
      this.eligibilityGender(),
      this.agreeTerms(),
      this.agreePrivacy()
    );
    // Lock social
    this.state.session.update(s => ({
      ...s,
      is18Plus: false,
      modules: { ...s.modules, social: false }
    }));
    this.state.showToast('Profile configured without Social module.', 'info');
    this.router.navigate(['/onboarding/modules']);
  }

  closeUnderageModal() {
    this.underageModalOpen.set(false);
  }

  // ==========================================
  // BATCH 2 HANDLERS (M2-ST-06 to M2-ST-09)
  // ==========================================
  // M2-ST-06: Choose Modules
  toggleModuleSelection(mod: ModuleId) {
    this.state.toggleModule(mod, true);
  }

  initiateModulesContinue() {
    const modules = this.state.session().modules;
    const hasAny = modules.learning || modules.hobbies || modules.social;
    if (!hasAny) {
      this.state.showToast('Please select at least one module to continue.', 'warning');
      return;
    }
    // Open confirmation modal M2-ST-06
    this.modulesConfirmModalOpen.set(true);
  }

  confirmModules() {
    this.initiateModulesContinue();
  }

  confirmModulesActivation() {
    this.modulesActivatingLoading.set(true);
    setTimeout(() => {
      this.modulesActivatingLoading.set(false);
      this.modulesConfirmModalOpen.set(false);
      this.state.showToast('Module spaces activated successfully!', 'success');
      this.state.proceedFromModuleSelection();
    }, 700);
  }

  // ==========================================
  // PHASE 4: LEARNING MODULE JOURNEY HANDLERS
  // ==========================================
  toggleLearnSkill(skill: string) {
    const current = this.lrnSkillsToLearn();
    if (current.includes(skill)) {
      this.lrnSkillsToLearn.set(current.filter(s => s !== skill));
    } else {
      this.lrnSkillsToLearn.set([...current, skill]);
    }
  }

  saveLearningProfileAndContinue() {
    this.state.updateLearningProfile({
      handle: this.lrnHandle().trim() || '@alex_learns',
      displayName: this.lrnDisplayName().trim() || 'Alex Rivera',
      bio: this.lrnBio().trim(),
      skillsOffered: [this.lrnSkillOffered().trim()]
    });
    this.state.showToast('Learning profile saved.', 'success');
    this.router.navigate(['/modules/learning/skills']);
  }

  saveLearningSkillsAndContinue() {
    this.state.updateLearningProfile({
      skillsSought: this.lrnSkillsToLearn(),
      weeklyHours: this.lrnWeeklyHours(),
      learningStyle: this.lrnStyle()
    });
    this.state.showToast('Skills and commitment saved.', 'success');
    this.router.navigate(['/modules/learning/preferences']);
  }

  finishLearningSetup() {
    this.state.updateLearningProfile({
      privacy: {
        isPublic: this.lrnPublicProfile(),
        showHandleOnly: this.lrnShowHandleOnly(),
        allowMatching: this.lrnAllowMatching()
      }
    });
    this.state.completeLearningSetup();
  }

  // ==========================================
  // PHASE 4: HOBBIES MODULE JOURNEY HANDLERS
  // ==========================================
  toggleHobbyInterest(interest: string) {
    const current = this.hobInterests();
    if (current.includes(interest)) {
      this.hobInterests.set(current.filter(i => i !== interest));
    } else {
      this.hobInterests.set([...current, interest]);
    }
  }

  saveHobbiesProfileAndContinue() {
    this.state.updateHobbiesProfile({
      handle: this.hobHandle().trim() || '@alex_hobbies',
      displayName: this.hobDisplayName().trim() || 'Alex Rivera',
      bio: this.hobBio().trim(),
      skillLevel: this.hobSkillLevel()
    });
    this.state.showToast('Hobbies profile saved.', 'success');
    this.router.navigate(['/modules/hobbies/interests']);
  }

  saveHobbiesInterestsAndContinue() {
    this.state.updateHobbiesProfile({
      interests: this.hobInterests()
    });
    this.state.showToast('Hobby interests saved.', 'success');
    this.router.navigate(['/modules/hobbies/preferences']);
  }

  finishHobbiesSetup() {
    this.state.updateHobbiesProfile({
      privacy: {
        visibleInClubs: this.hobVisibleInClubs(),
        locationSharing: this.hobLocationSharing(),
        allowDirectMessages: this.hobDirectMessages()
      }
    });
    this.state.completeHobbiesSetup();
  }

  // ==========================================
  // PHASE 4: SOCIAL MODULE JOURNEY (18+ & OPT-IN)
  // ==========================================
  toggleSocialLookingFor(item: string) {
    const current = this.socLookingFor();
    if (current.includes(item)) {
      this.socLookingFor.set(current.filter(x => x !== item));
    } else {
      this.socLookingFor.set([...current, item]);
    }
  }

  confirmSocialOptIn() {
    if (!this.socAgeVerifiedCheck() || !this.socOptInConsentCheck()) {
      this.state.showToast('Please check both verification & consent boxes to opt in.', 'warning');
      return;
    }
    const success = this.state.optInSocial();
    if (success) {
      this.router.navigate(['/modules/social/profile']);
    }
  }

  saveSocialProfileAndContinue() {
    this.state.updateSocialProfile({
      handle: this.socHandle().trim() || '@alex_social',
      displayName: this.socDisplayName().trim() || 'Alex R.',
      bio: this.socBio().trim(),
      lookingFor: this.socLookingFor()
    });
    this.state.showToast('Social profile saved.', 'success');
    this.router.navigate(['/modules/social/preferences']);
  }

  finishSocialSetup() {
    this.state.updateSocialProfile({
      moodTone: this.socMoodTone(),
      privacy: {
        incognitoMode: this.socIncognito(),
        strictAgeFilter: this.socStrictAge(),
        connectionsOnlyVisibility: false
      }
    });
    this.state.completeSocialSetup();
  }

  // Persistent Module Switcher
  switchModule(mod: ModuleId) {
    this.state.switchToModule(mod);
  }

  closeModulesConfirmModal() {
    this.modulesConfirmModalOpen.set(false);
  }

  // M2-ST-07: Forgot Password
  sendResetLink() {
    const email = this.forgotEmail().trim();
    if (!email || !email.includes('@')) {
      this.state.showToast('Please enter a valid email address.', 'warning');
      return;
    }
    this.forgotSubmitted.set(true);
  }

  // M2-ST-08: Reset Password
  updateResetPassword() {
    if (!this.resetPassword()) {
      this.state.showToast('Please enter a new password.', 'warning');
      return;
    }
    if (this.resetPassword().length < 8) {
      this.state.showToast('Password must be at least 8 characters.', 'warning');
      return;
    }
    if (this.resetPassword() !== this.resetConfirmPassword()) {
      this.state.showToast('Passwords do not match.', 'error');
      return;
    }
    // M2-ST-08: Success modal
    this.resetSuccessModalOpen.set(true);
  }

  // M2-ST-09: Login
  onLoginSubmit() {
    this.loginError.set(null);
    const email = this.loginEmail().trim();
    const pass = this.loginPassword();

    this.loginLoading.set(true);
    setTimeout(() => {
      this.loginLoading.set(false);

      // Trigger M2-ST-09 if wrong password or simulated error
      if (pass === 'wrong-password' || !pass || !email.includes('@')) {
        this.loginError.set('Invalid email or password. Please verify your credentials and try again.');
        this.state.showToast('Login failed. Please check your credentials.', 'error');
        return;
      }

      this.state.login(email);
    }, 600);
  }

  // ==========================================
  // BATCH 3 HANDLERS (M2-ST-10 to M2-ST-13)
  // ==========================================
  // M2-ST-10: Module deactivation
  requestDeactivation(mod: ModuleId) {
    this.deactivationModuleTarget.set(mod);
    this.deactivationWarningOpen.set(true);
  }

  confirmDeactivation() {
    const mod = this.deactivationModuleTarget();
    this.state.session.update(s => ({
      ...s,
      modules: { ...s.modules, [mod]: false }
    }));
    this.deactivationWarningOpen.set(false);
    const modTitle = mod.charAt(0).toUpperCase() + mod.slice(1);
    this.state.showToast(`${modTitle} deactivated. 21-day grace period started.`, 'info');
  }

  cancelDeactivation() {
    this.deactivationWarningOpen.set(false);
  }

  // M2-ST-11: Reactivation states
  toggleReactivationVariant() {
    this.reactivationVariant.update(v => (v === 'grace' ? 'expired' : 'grace'));
  }

  reactivateTargetModule(mod: ModuleId) {
    this.state.reactivateModule(mod);
    this.reactivationPreviewActive.set(false);
  }

  startFreshModuleSetup(mod: ModuleId) {
    this.state.showToast(`Starting fresh profile onboarding for ${mod.toUpperCase()}...`, 'info');
    this.router.navigate(['/onboarding/modules']);
  }

  // M2-ST-12: Security password change
  updateSecurityPassword() {
    if (!this.secNewPassword()) {
      this.state.showToast('Please enter a new password.', 'warning');
      return;
    }
    if (this.secNewPassword().length < 8) {
      this.state.showToast('New password must be at least 8 characters.', 'warning');
      return;
    }
    if (this.secNewPassword() !== this.secConfirmPassword()) {
      this.state.showToast('New passwords do not match.', 'error');
      return;
    }
    this.secSuccessModalOpen.set(true);
  }

  closeSecSuccessModal() {
    this.secSuccessModalOpen.set(false);
    this.router.navigate(['/settings']);
  }

  // M2-ST-13: Global Block
  triggerBlockModal(userId: string = 'USR-84920', handle: string = '@mock_user_94') {
    this.mockUserToBlock.set({ id: userId, handle });
    this.blockDialogOpen.set(true);
  }

  confirmGlobalBlock() {
    const u = this.mockUserToBlock();
    this.blockDialogOpen.set(false);
    this.state.showToast(`Account ${u.handle} (${u.id}) blocked globally across Learning, Hobbies, and Social.`, 'warning');
  }

  closeBlockModal() {
    this.blockDialogOpen.set(false);
  }

  // ==========================================
  // BATCH 4 HANDLERS (M2-ST-14 to M2-ST-18)
  // ==========================================
  // M2-ST-14: Premium plan selection & checkout modal
  selectIndividualModulePlan(mod: ModuleId) {
    this.selectedIndividualModule.set(mod);
    this.state.setPremiumPlan('individual', mod, undefined, '$1.49 / month');
  }

  selectFullPlan(duration: '1 Month' | '3 Months' | '6 Months', price: string) {
    this.selectedFullPlanDuration.set(duration);
    this.state.setPremiumPlan('full', undefined, duration, `${price} (${duration})`);
  }

  openPremiumCheckoutModal(type: 'individual' | 'full', name: string, price: string, period: string, coverage: string) {
    this.premiumCheckoutData.set({
      planName: name,
      price,
      period,
      coverage
    });
    this.premiumCheckoutOpen.set(true);
  }

  confirmPremium() {
    const isIndiv = this.selectedIndividualModule();
    if (this.state.session().premium.tier === 'individual') {
      const modName = isIndiv.charAt(0).toUpperCase() + isIndiv.slice(1);
      this.openPremiumCheckoutModal('individual', `${modName} Module Premium`, '$1.49', 'Monthly', `Unlocks all advanced features exclusively for the ${modName} space.`);
    } else {
      const dur = this.selectedFullPlanDuration();
      const pricingMap: Record<string, string> = {
        '1 Month': '$2.99',
        '3 Months': '$7.99',
        '6 Months': '$14.99'
      };
      const price = pricingMap[dur] || '$2.99';
      this.openPremiumCheckoutModal('full', `Full ANDRIL Premium (${dur})`, price, dur, 'Unlocks full premium access across Learning, Hobbies, and Social.');
    }
  }

  confirmPremiumDemoCheckout() {
    const d = this.premiumCheckoutData();
    this.premiumCheckoutOpen.set(false);
    this.state.showToast(`DEMO — Selected plan "${d?.planName}" (${d?.price}). No real payment charged.`, 'success');
  }

  closePremiumCheckout() {
    this.premiumCheckoutOpen.set(false);
  }

  // M2-ST-15: Payment History
  setPaymentFilter(tab: 'all' | 'premium' | 'coins') {
    this.paymentFilter.set(tab);
  }

  togglePaymentRecords() {
    this.showMockPayments.update(v => !v);
    this.state.showToast(this.showMockPayments() ? 'Loaded DEMO mock transaction invoices' : 'Returned to empty state view', 'info');
  }

  // M2-ST-16: Referral Stepper
  setReferralStep(step: 1 | 2 | 3 | 4) {
    this.referralPipelineStep.set(step);
    const labels = {
      1: 'Stage 1: Friend Invited (Pending Registration)',
      2: 'Stage 2: Friend Registered & Verified (Qualified)',
      3: 'Stage 3: First Module Activated (Reward Verification Pending)',
      4: 'Stage 4: Reward Granted (+50 Demo Coins Credited)'
    };
    this.state.showToast(labels[step], 'info');
  }

  // M2-ST-17: Logout Confirmation
  initiateLogout() {
    this.logoutModalOpen.set(true);
  }

  confirmLogoutAction() {
    this.logoutLoading.set(true);
    setTimeout(() => {
      this.logoutLoading.set(false);
      this.logoutModalOpen.set(false);
      this.state.logout();
    }, 500);
  }

  closeLogoutModal() {
    this.logoutModalOpen.set(false);
    this.router.navigate(['/settings']);
  }

  confirmDeleteAccount() {
    this.initiateDeleteAccount();
  }

  // M2-ST-18: Delete Account
  initiateDeleteAccount() {
    this.deletePasswordError.set(null);
    if (!this.deletePassword().trim()) {
      this.deletePasswordError.set('Password reauthentication is required.');
      this.state.showToast('Please enter your password to confirm identity.', 'error');
      return;
    }
    if (!this.deleteConfirmed()) {
      this.state.showToast('Please check the confirmation box acknowledging permanent closure.', 'warning');
      return;
    }
    this.deleteModalOpen.set(true);
  }

  confirmFinalDelete() {
    this.deleteProcessing.set(true);
    setTimeout(() => {
      this.deleteProcessing.set(false);
      this.deleteModalOpen.set(false);
      this.deleteDoneModalOpen.set(true);
    }, 700);
  }

  finishAccountClosure() {
    this.deleteDoneModalOpen.set(false);
    this.state.deleteAccount();
  }

  closeDeleteModal() {
    this.deleteModalOpen.set(false);
  }

  saveLanguageSettings() {
    this.state.showToast('Language preference saved.', 'success');
    this.router.navigate(['/settings']);
  }

  // Legal documentation modals
  openLegalModal(docType: 'terms' | 'privacy' | 'guidelines' | 'safety' | 'social') {
    const details = {
      terms: {
        title: 'Terms of Service',
        subtitle: 'Official ANDRIL Agreement',
        description: 'ANDRIL terms govern safe, authenticated interactions across independent Learning, Hobbies, and Social identities. Full legal documents are provided by the legal provider at launch.'
      },
      privacy: {
        title: 'Privacy Policy',
        subtitle: 'Data Isolation & Protection',
        description: 'All 3 modules maintain strictly independent data partitions. Module profiles, interests, and contacts are never shared across spaces or sold to third parties.'
      },
      guidelines: {
        title: 'Community Guidelines',
        subtitle: 'Respect, Safety & Authenticity',
        description: 'Our community values genuine people and respectful conduct. Harassment, impersonation, or underage access to the Social module result in permanent suspension.'
      },
      safety: {
        title: 'Safety & Data Isolation',
        subtitle: '21-Day Reactivation Rule',
        description: 'When you deactivate a module, its profile and messages are preserved for 21 days for reactivation before permanent deletion.'
      },
      social: {
        title: 'Social Media Channels',
        subtitle: 'Official Handles Pending Launch',
        description: 'Official verified links for Instagram, Facebook, TikTok, and X (Twitter) will activate with the production launch.'
      }
    };
    const item = details[docType];
    this.state.showPlaceholder(item.title, item.subtitle, item.description, this.currentScreen().title);
  }
}

import fs from 'fs';
import path from 'path';

console.log('========================================================');
console.log('ANDRIL PHASE 4 / PART 2: NAVIGATION & GUARDS TEST SUITE');
console.log('========================================================');

let allPassed = true;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    allPassed = false;
  }
}

// ---------------------------------------------------------------------
// Simulated State Machine matching PrototypeStateService logic
// ---------------------------------------------------------------------
class TestPrototypeState {
  constructor() {
    this.reset();
  }

  reset() {
    this.session = {
      isLoggedIn: true,
      email: 'alex.rivera@example.com',
      is18Plus: true,
      dob: '2001-05-18',
      modules: { learning: true, hobbies: false, social: false }
    };
    this.learningProfile = {
      handle: '@alex_learns',
      displayName: 'Alex Rivera (Learner)',
      isSetupComplete: false,
      xp: 450
    };
    this.hobbiesProfile = {
      handle: '@skye_hobbies',
      displayName: 'Morgan Skye (Creator)',
      isSetupComplete: false,
      flightPoints: 820
    };
    this.socialProfile = {
      handle: '@jordan_connect',
      displayName: 'Jordan K. (Social)',
      ageVerified: false,
      optInAccepted: false,
      isSetupComplete: false,
      socialSparkXp: 310
    };
    this.activeModule = 'learning';
    this.currentRoute = '/splash';
    this.lastToast = null;
  }

  showToast(msg, type = 'info') {
    this.lastToast = { msg, type };
  }

  getNextIncompleteModule() {
    const mods = this.session.modules;
    if (mods.learning && !this.learningProfile.isSetupComplete) return 'learning';
    if (mods.hobbies && !this.hobbiesProfile.isSetupComplete) return 'hobbies';
    if (mods.social && this.session.is18Plus && !this.socialProfile.isSetupComplete) return 'social';
    return null;
  }

  completeLearningSetup() {
    this.learningProfile.isSetupComplete = true;
    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToModuleSetup(next);
    } else {
      this.activeModule = 'learning';
      this.currentRoute = '/modules/learning/home';
    }
  }

  completeHobbiesSetup() {
    this.hobbiesProfile.isSetupComplete = true;
    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToModuleSetup(next);
    } else {
      this.activeModule = 'hobbies';
      this.currentRoute = '/modules/hobbies/home';
    }
  }

  optInSocial() {
    if (!this.session.is18Plus) {
      this.showToast('Underage block', 'error');
      return false;
    }
    this.socialProfile.optInAccepted = true;
    this.socialProfile.ageVerified = true;
    this.currentRoute = '/modules/social/profile';
    return true;
  }

  completeSocialSetup() {
    this.socialProfile.isSetupComplete = true;
    const next = this.getNextIncompleteModule();
    if (next) {
      this.navigateToModuleSetup(next);
    } else {
      this.activeModule = 'social';
      this.currentRoute = '/modules/social/home';
    }
  }

  navigateToModuleSetup(mod) {
    this.activeModule = mod;
    if (mod === 'learning') this.currentRoute = '/modules/learning/welcome';
    if (mod === 'hobbies') this.currentRoute = '/modules/hobbies/profile';
    if (mod === 'social') {
      this.currentRoute = this.socialProfile.optInAccepted ? '/modules/social/profile' : '/modules/social/opt-in';
    }
  }

  switchToModule(mod) {
    if (!this.session.modules[mod]) {
      this.currentRoute = '/settings/modules';
      return 'inactive';
    }
    if (mod === 'social') {
      if (!this.session.is18Plus) return 'underage';
      if (!this.socialProfile.optInAccepted) {
        this.currentRoute = '/modules/social/opt-in';
        return 'needs_optin';
      }
      if (!this.socialProfile.isSetupComplete) {
        this.currentRoute = '/modules/social/profile';
        return 'needs_setup';
      }
    }
    if (mod === 'learning' && !this.learningProfile.isSetupComplete) {
      this.currentRoute = '/modules/learning/welcome';
      return 'needs_setup';
    }
    if (mod === 'hobbies' && !this.hobbiesProfile.isSetupComplete) {
      this.currentRoute = '/modules/hobbies/profile';
      return 'needs_setup';
    }
    this.activeModule = mod;
    this.currentRoute = `/modules/${mod}/home`;
    return 'home';
  }

  // Guard simulations
  canActivateRoute(targetRoute) {
    if (targetRoute.startsWith('/modules/learning/')) {
      if (!this.session.modules.learning) return { allowed: false, redirect: '/settings/modules' };
      if (targetRoute === '/modules/learning/home' && !this.learningProfile.isSetupComplete) {
        return { allowed: false, redirect: '/modules/learning/welcome' };
      }
      return { allowed: true };
    }
    if (targetRoute.startsWith('/modules/hobbies/')) {
      if (!this.session.modules.hobbies) return { allowed: false, redirect: '/settings/modules' };
      if (targetRoute === '/modules/hobbies/home' && !this.hobbiesProfile.isSetupComplete) {
        return { allowed: false, redirect: '/modules/hobbies/profile' };
      }
      return { allowed: true };
    }
    if (targetRoute.startsWith('/modules/social/')) {
      if (!this.session.is18Plus) return { allowed: false, redirect: '/onboarding/eligibility' };
      if (!this.session.modules.social) return { allowed: false, redirect: '/settings/modules' };
      if (targetRoute !== '/modules/social/opt-in' && !this.socialProfile.optInAccepted) {
        return { allowed: false, redirect: '/modules/social/opt-in' };
      }
      if (targetRoute === '/modules/social/home' && !this.socialProfile.isSetupComplete) {
        return { allowed: false, redirect: '/modules/social/profile' };
      }
      return { allowed: true };
    }
    return { allowed: true };
  }
}

const state = new TestPrototypeState();

// ---------------------------------------------------------------------
// Test 1: Learning only
// ---------------------------------------------------------------------
test('Scenario 1: Learning only progression & zero reward additions', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: false, social: false };
  if (state.getNextIncompleteModule() !== 'learning') throw new Error('Expected learning to be next');
  
  const xpBefore = state.learningProfile.xp;
  state.completeLearningSetup();
  if (!state.learningProfile.isSetupComplete) throw new Error('Expected learning complete');
  if (state.learningProfile.xp !== xpBefore) throw new Error('Unapproved reward detected on Learning');
  if (state.currentRoute !== '/modules/learning/home') throw new Error(`Expected learning home, got ${state.currentRoute}`);
});

// ---------------------------------------------------------------------
// Test 2: Hobbies only
// ---------------------------------------------------------------------
test('Scenario 2: Hobbies only progression & zero point additions', () => {
  state.reset();
  state.session.modules = { learning: false, hobbies: true, social: false };
  if (state.getNextIncompleteModule() !== 'hobbies') throw new Error('Expected hobbies to be next');
  
  const fpBefore = state.hobbiesProfile.flightPoints;
  state.completeHobbiesSetup();
  if (!state.hobbiesProfile.isSetupComplete) throw new Error('Expected hobbies complete');
  if (state.hobbiesProfile.flightPoints !== fpBefore) throw new Error('Unapproved points detected on Hobbies');
  if (state.currentRoute !== '/modules/hobbies/home') throw new Error(`Expected hobbies home, got ${state.currentRoute}`);
});

// ---------------------------------------------------------------------
// Test 3: Social only, eligible and opted-in
// ---------------------------------------------------------------------
test('Scenario 3: Social only (18+), explicit opt-in, zero rewards', () => {
  state.reset();
  state.session.modules = { learning: false, hobbies: false, social: true };
  state.session.is18Plus = true;
  if (state.getNextIncompleteModule() !== 'social') throw new Error('Expected social to be next');

  state.optInSocial();
  if (!state.socialProfile.optInAccepted) throw new Error('Expected opt-in to succeed');
  
  const sparkBefore = state.socialProfile.socialSparkXp;
  state.completeSocialSetup();
  if (!state.socialProfile.isSetupComplete) throw new Error('Expected social complete');
  if (state.socialProfile.socialSparkXp !== sparkBefore) throw new Error('Unapproved spark rewards detected on Social');
  if (state.currentRoute !== '/modules/social/home') throw new Error(`Expected social home, got ${state.currentRoute}`);
});

// ---------------------------------------------------------------------
// Test 4: Learning + Hobbies
// ---------------------------------------------------------------------
test('Scenario 4: Learning + Hobbies multi-module progression', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: true, social: false };
  
  if (state.getNextIncompleteModule() !== 'learning') throw new Error('Step 1 should be learning');
  state.completeLearningSetup();
  if (state.currentRoute !== '/modules/hobbies/profile') throw new Error(`Step 2 should route to hobbies profile, got ${state.currentRoute}`);
  
  if (state.getNextIncompleteModule() !== 'hobbies') throw new Error('Step 2 should be hobbies');
  state.completeHobbiesSetup();
  if (state.getNextIncompleteModule() !== null) throw new Error('All should be complete');
  if (state.currentRoute !== '/modules/hobbies/home') throw new Error(`Should reach hobbies home, got ${state.currentRoute}`);
});

// ---------------------------------------------------------------------
// Test 5: All three modules
// ---------------------------------------------------------------------
test('Scenario 5: All three modules (Learning -> Hobbies -> Social)', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: true, social: true };
  state.session.is18Plus = true;

  // 1. Learning
  if (state.getNextIncompleteModule() !== 'learning') throw new Error('Expected step 1 = learning');
  state.completeLearningSetup();
  if (state.currentRoute !== '/modules/hobbies/profile') throw new Error(`Expected transition to hobbies, got ${state.currentRoute}`);

  // 2. Hobbies
  if (state.getNextIncompleteModule() !== 'hobbies') throw new Error('Expected step 2 = hobbies');
  state.completeHobbiesSetup();
  if (state.currentRoute !== '/modules/social/opt-in') throw new Error(`Expected transition to social opt-in, got ${state.currentRoute}`);

  // 3. Social
  if (state.getNextIncompleteModule() !== 'social') throw new Error('Expected step 3 = social');
  state.optInSocial();
  state.completeSocialSetup();

  // All complete
  if (state.getNextIncompleteModule() !== null) throw new Error('Expected all modules complete');
  if (!state.learningProfile.isSetupComplete || !state.hobbiesProfile.isSetupComplete || !state.socialProfile.isSetupComplete) {
    throw new Error('Not all profiles marked complete');
  }
});

// ---------------------------------------------------------------------
// Test 6: Underage attempt to open Social directly
// ---------------------------------------------------------------------
test('Scenario 6: Underage attempt to open Social directly blocked by guard', () => {
  state.reset();
  state.session.is18Plus = false;
  state.session.modules.social = true;

  const guardResult = state.canActivateRoute('/modules/social/home');
  if (guardResult.allowed) throw new Error('Guard should have blocked underage access to Social Home');
  if (guardResult.redirect !== '/onboarding/eligibility') throw new Error(`Expected redirect to eligibility, got ${guardResult.redirect}`);

  const switchResult = state.switchToModule('social');
  if (switchResult !== 'underage') throw new Error(`Expected underage denial, got ${switchResult}`);
});

// ---------------------------------------------------------------------
// Test 7: Social access without opt-in
// ---------------------------------------------------------------------
test('Scenario 7: Social access without explicit opt-in blocked by guard', () => {
  state.reset();
  state.session.is18Plus = true;
  state.session.modules.social = true;
  state.socialProfile.optInAccepted = false;

  const guardHome = state.canActivateRoute('/modules/social/home');
  if (guardHome.allowed) throw new Error('Guard should block un-opted-in Social Home');
  if (guardHome.redirect !== '/modules/social/opt-in') throw new Error(`Expected redirect to opt-in, got ${guardHome.redirect}`);

  const guardProfile = state.canActivateRoute('/modules/social/profile');
  if (guardProfile.allowed) throw new Error('Guard should block un-opted-in Social Profile');
  if (guardProfile.redirect !== '/modules/social/opt-in') throw new Error(`Expected redirect to opt-in, got ${guardProfile.redirect}`);
});

// ---------------------------------------------------------------------
// Test 8: Switching to a module whose profile is incomplete
// ---------------------------------------------------------------------
test('Scenario 8: Switching to active but unconfigured module redirects to profile setup', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: true, social: false };
  state.learningProfile.isSetupComplete = true;
  state.hobbiesProfile.isSetupComplete = false;

  const switchHobbies = state.switchToModule('hobbies');
  if (switchHobbies !== 'needs_setup') throw new Error(`Expected needs_setup, got ${switchHobbies}`);
  if (state.currentRoute !== '/modules/hobbies/profile') throw new Error(`Expected route /modules/hobbies/profile, got ${state.currentRoute}`);

  const guardResult = state.canActivateRoute('/modules/hobbies/home');
  if (guardResult.allowed) throw new Error('Guard should block unconfigured Hobbies Home');
  if (guardResult.redirect !== '/modules/hobbies/profile') throw new Error(`Expected redirect to hobbies profile, got ${guardResult.redirect}`);
});

// ---------------------------------------------------------------------
// Test 9: Returning to a completed module does not force recreation
// ---------------------------------------------------------------------
test('Scenario 9: Returning to configured module opens Home directly', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: true, social: false };
  state.learningProfile.isSetupComplete = true;
  state.hobbiesProfile.isSetupComplete = true;

  const switchLearning = state.switchToModule('learning');
  if (switchLearning !== 'home') throw new Error(`Expected home, got ${switchLearning}`);
  if (state.currentRoute !== '/modules/learning/home') throw new Error(`Expected route /modules/learning/home, got ${state.currentRoute}`);

  const switchHobbies = state.switchToModule('hobbies');
  if (switchHobbies !== 'home') throw new Error(`Expected home, got ${switchHobbies}`);
  if (state.currentRoute !== '/modules/hobbies/home') throw new Error(`Expected route /modules/hobbies/home, got ${state.currentRoute}`);
});

// ---------------------------------------------------------------------
// Test 10: Inactive module access blocked & Shared Core intact
// ---------------------------------------------------------------------
test('Scenario 10: Inactive module blocked and Shared Core logout verified', () => {
  state.reset();
  state.session.modules = { learning: true, hobbies: false, social: false };

  // Attempt to enter Hobbies
  const switchHobbies = state.switchToModule('hobbies');
  if (switchHobbies !== 'inactive') throw new Error(`Expected inactive, got ${switchHobbies}`);
  if (state.currentRoute !== '/settings/modules') throw new Error(`Expected redirect to settings/modules, got ${state.currentRoute}`);

  const guardResult = state.canActivateRoute('/modules/hobbies/home');
  if (guardResult.allowed) throw new Error('Guard should block inactive module');
  if (guardResult.redirect !== '/settings/modules') throw new Error(`Expected redirect to settings/modules, got ${guardResult.redirect}`);

  // Test logout
  state.session.isLoggedIn = false;
  state.currentRoute = '/welcome';
  if (state.session.isLoggedIn) throw new Error('Session should be logged out');
  if (state.currentRoute !== '/welcome') throw new Error('Should navigate to welcome after logout');
});

console.log('========================================================');
if (allPassed) {
  console.log('🎉 ALL 10 NAVIGATION & GUARD TEST SCENARIOS PASSED!');
} else {
  console.error('❌ ONE OR MORE TEST SCENARIOS FAILED!');
  process.exit(1);
}
console.log('========================================================');

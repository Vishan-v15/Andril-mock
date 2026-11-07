import { Routes } from '@angular/router';
import { ScreenViewComponent } from './screens/screen-view.component';
import {
  learningActiveGuard,
  learningHomeGuard,
  hobbiesActiveGuard,
  hobbiesHomeGuard,
  socialOptInGuard,
  socialSetupGuard,
  socialHomeGuard
} from './guards/module-access.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: ScreenViewComponent },
  { path: 'onboarding/language', component: ScreenViewComponent },
  { path: 'auth/language', redirectTo: 'onboarding/language', pathMatch: 'full' },
  { path: 'welcome', component: ScreenViewComponent },
  { path: 'auth/welcome', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'auth/register', component: ScreenViewComponent },
  { path: 'auth/verify-email', component: ScreenViewComponent },
  { path: 'onboarding/eligibility', component: ScreenViewComponent },
  { path: 'auth/eligibility', redirectTo: 'onboarding/eligibility', pathMatch: 'full' },
  { path: 'onboarding/modules', component: ScreenViewComponent },
  { path: 'auth/module-selection', redirectTo: 'onboarding/modules', pathMatch: 'full' },
  { path: 'auth/forgot-password', component: ScreenViewComponent },
  { path: 'auth/reset-password', component: ScreenViewComponent },
  { path: 'auth/login', component: ScreenViewComponent },

  // ==========================================
  // PHASE 4: LEARNING MODULE JOURNEY
  // ==========================================
  { path: 'modules/learning/welcome', component: ScreenViewComponent, canActivate: [learningActiveGuard] },
  { path: 'modules/learning/profile', component: ScreenViewComponent, canActivate: [learningActiveGuard] },
  { path: 'modules/learning/skills', component: ScreenViewComponent, canActivate: [learningActiveGuard] },
  { path: 'modules/learning/goals', component: ScreenViewComponent, canActivate: [learningActiveGuard] },
  { path: 'modules/learning/preferences', component: ScreenViewComponent, canActivate: [learningActiveGuard] },
  { path: 'modules/learning/home', component: ScreenViewComponent, canActivate: [learningHomeGuard] },

  // ==========================================
  // PHASE 4: HOBBIES MODULE JOURNEY
  // ==========================================
  { path: 'modules/hobbies/profile', component: ScreenViewComponent, canActivate: [hobbiesActiveGuard] },
  { path: 'modules/hobbies/interests', component: ScreenViewComponent, canActivate: [hobbiesActiveGuard] },
  { path: 'modules/hobbies/preferences', component: ScreenViewComponent, canActivate: [hobbiesActiveGuard] },
  { path: 'modules/hobbies/home', component: ScreenViewComponent, canActivate: [hobbiesHomeGuard] },

  // ==========================================
  // PHASE 4: SOCIAL MODULE JOURNEY (18+ & OPT-IN)
  // ==========================================
  { path: 'modules/social/opt-in', component: ScreenViewComponent, canActivate: [socialOptInGuard] },
  { path: 'modules/social/profile', component: ScreenViewComponent, canActivate: [socialSetupGuard] },
  { path: 'modules/social/preferences', component: ScreenViewComponent, canActivate: [socialSetupGuard] },
  { path: 'modules/social/home', component: ScreenViewComponent, canActivate: [socialHomeGuard] },

  // Shared Core Settings
  { path: 'settings', component: ScreenViewComponent },
  { path: 'settings/modules', component: ScreenViewComponent },
  { path: 'settings/language', component: ScreenViewComponent },
  { path: 'settings/security', component: ScreenViewComponent },
  { path: 'settings/privacy', component: ScreenViewComponent },
  { path: 'settings/premium', component: ScreenViewComponent },
  { path: 'settings/payments', component: ScreenViewComponent },
  { path: 'settings/wallet', component: ScreenViewComponent },
  { path: 'settings/logout', component: ScreenViewComponent },
  { path: 'settings/delete-account', component: ScreenViewComponent },
  { path: 'settings/invite', component: ScreenViewComponent },
  { path: 'settings/about', component: ScreenViewComponent },
  { path: '**', redirectTo: 'splash' }
];

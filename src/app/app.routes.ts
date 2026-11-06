import { Routes } from '@angular/router';
import { ScreenViewComponent } from './screens/screen-view.component';

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
  { path: 'modules/learning/welcome', component: ScreenViewComponent },
  { path: 'modules/learning/profile', component: ScreenViewComponent },
  { path: 'modules/learning/skills', component: ScreenViewComponent },
  { path: 'modules/learning/goals', component: ScreenViewComponent },
  { path: 'modules/learning/preferences', component: ScreenViewComponent },
  { path: 'modules/learning/home', component: ScreenViewComponent },

  // ==========================================
  // PHASE 4: HOBBIES MODULE JOURNEY
  // ==========================================
  { path: 'modules/hobbies/profile', component: ScreenViewComponent },
  { path: 'modules/hobbies/interests', component: ScreenViewComponent },
  { path: 'modules/hobbies/preferences', component: ScreenViewComponent },
  { path: 'modules/hobbies/home', component: ScreenViewComponent },

  // ==========================================
  // PHASE 4: SOCIAL MODULE JOURNEY (18+ & OPT-IN)
  // ==========================================
  { path: 'modules/social/opt-in', component: ScreenViewComponent },
  { path: 'modules/social/profile', component: ScreenViewComponent },
  { path: 'modules/social/preferences', component: ScreenViewComponent },
  { path: 'modules/social/home', component: ScreenViewComponent },

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

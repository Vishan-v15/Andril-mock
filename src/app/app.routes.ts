import { Routes } from '@angular/router';
import { ScreenViewComponent } from './screens/screen-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: ScreenViewComponent },
  { path: 'onboarding/language', component: ScreenViewComponent },
  { path: 'welcome', component: ScreenViewComponent },
  { path: 'auth/register', component: ScreenViewComponent },
  { path: 'auth/verify-email', component: ScreenViewComponent },
  { path: 'onboarding/eligibility', component: ScreenViewComponent },
  { path: 'onboarding/modules', component: ScreenViewComponent },
  { path: 'auth/forgot-password', component: ScreenViewComponent },
  { path: 'auth/reset-password', component: ScreenViewComponent },
  { path: 'auth/login', component: ScreenViewComponent },
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

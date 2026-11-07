import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PrototypeStateService } from '../services/prototype-state.service';

/**
 * Learning Module Active Guard:
 * Enforces that Learning module is active in session.
 * Inactive module -> blocks access and redirects to Settings / Modules.
 */
export const learningActiveGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().modules.learning) {
    state.showToast('DEMO: Learning module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }
  return true;
};

/**
 * Learning Home Guard:
 * Requires module to be active AND profile setup to be completed.
 * Active but unconfigured -> redirects to profile setup.
 */
export const learningHomeGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().modules.learning) {
    state.showToast('DEMO: Learning module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }

  if (!state.learningProfile().isSetupComplete) {
    state.showToast('DEMO: Please complete your Learning profile setup before entering Learning Home.', 'info');
    return router.parseUrl('/modules/learning/welcome');
  }

  return true;
};

/**
 * Hobbies Module Active Guard:
 * Enforces that Hobbies module is active in session.
 * Inactive module -> blocks access and redirects to Settings / Modules.
 */
export const hobbiesActiveGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().modules.hobbies) {
    state.showToast('DEMO: Hobbies module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }
  return true;
};

/**
 * Hobbies Home Guard:
 * Requires module to be active AND profile setup to be completed.
 * Active but unconfigured -> redirects to profile setup.
 */
export const hobbiesHomeGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().modules.hobbies) {
    state.showToast('DEMO: Hobbies module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }

  if (!state.hobbiesProfile().isSetupComplete) {
    state.showToast('DEMO: Please complete your Hobbies profile setup before entering Hobbies Home.', 'info');
    return router.parseUrl('/modules/hobbies/profile');
  }

  return true;
};

/**
 * Social Opt-In Guard:
 * Enforces 18+ eligibility AND module active status.
 * Underage -> blocks access and redirects to Eligibility.
 */
export const socialOptInGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().is18Plus) {
    state.showToast('DEMO Policy: Social module is restricted to verified adults aged 18 and older.', 'error');
    return router.parseUrl('/onboarding/eligibility');
  }

  if (!state.session().modules.social) {
    state.showToast('DEMO: Social module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }

  return true;
};

/**
 * Social Setup Guard (profile, preferences):
 * Requires 18+ eligibility, module active, AND explicit opt-in confirmed.
 * Un-opted-in -> redirects to Social Opt-In.
 */
export const socialSetupGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().is18Plus) {
    state.showToast('DEMO Policy: Social module is restricted to verified adults aged 18 and older.', 'error');
    return router.parseUrl('/onboarding/eligibility');
  }

  if (!state.session().modules.social) {
    state.showToast('DEMO: Social module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }

  if (!state.socialProfile().optInAccepted) {
    state.showToast('DEMO: Social module requires explicit voluntary opt-in before setup.', 'warning');
    return router.parseUrl('/modules/social/opt-in');
  }

  return true;
};

/**
 * Social Home Guard:
 * Requires 18+ eligibility, module active, opt-in confirmed, AND profile setup complete.
 * Direct URL access cannot bypass eligibility, opt-in, or setup checks.
 */
export const socialHomeGuard: CanActivateFn = () => {
  const state = inject(PrototypeStateService);
  const router = inject(Router);

  if (!state.session().is18Plus) {
    state.showToast('DEMO Policy: Social module is restricted to verified adults aged 18 and older.', 'error');
    return router.parseUrl('/onboarding/eligibility');
  }

  if (!state.session().modules.social) {
    state.showToast('DEMO: Social module is inactive. Please activate it to continue.', 'warning');
    return router.parseUrl('/settings/modules');
  }

  if (!state.socialProfile().optInAccepted) {
    state.showToast('DEMO: Social module requires explicit voluntary opt-in before accessing Social Home.', 'warning');
    return router.parseUrl('/modules/social/opt-in');
  }

  if (!state.socialProfile().isSetupComplete) {
    state.showToast('DEMO: Please complete your Social profile setup before entering Social Home.', 'info');
    return router.parseUrl('/modules/social/profile');
  }

  return true;
};

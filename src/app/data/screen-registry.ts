import { ScreenInfo } from '../models/andril.models';

export const SCREEN_REGISTRY: ScreenInfo[] = [
  {
    id: 'scr-01',
    code: '01',
    title: 'Splash Screen',
    route: '/splash',
    category: 'onboarding',
    imagePath: 'assets/account creation and module select/01-Splash_Screen_modified.png',
    defaultNextRoute: '/onboarding/language'
  },
  {
    id: 'scr-02',
    code: '02',
    title: 'Choose Your Language',
    route: '/onboarding/language',
    category: 'onboarding',
    imagePath: 'assets/account creation and module select/02 Choose Your Language App Screen.png',
    backRoute: '/splash',
    defaultNextRoute: '/welcome'
  },
  {
    id: 'scr-03',
    code: '03',
    title: 'Welcome to Andril',
    route: '/welcome',
    category: 'onboarding',
    imagePath: 'assets/account creation and module select/03 Andril Welcome_screen.png',
    backRoute: '/onboarding/language',
    defaultNextRoute: '/auth/register'
  },
  {
    id: 'scr-04',
    code: '04',
    title: 'Create Account',
    route: '/auth/register',
    category: 'auth',
    imagePath: 'assets/account creation and module select/04 ANDRIL Create Account Screen.png',
    backRoute: '/welcome',
    defaultNextRoute: '/auth/verify-email'
  },
  {
    id: 'scr-05',
    code: '05',
    title: 'Verify Your Email',
    route: '/auth/verify-email',
    category: 'auth',
    imagePath: 'assets/account creation and module select/05 Email_Verification_No_Logo_1440x3120.png',
    backRoute: '/auth/register',
    defaultNextRoute: '/onboarding/eligibility'
  },
  {
    id: 'scr-06',
    code: '06',
    title: 'Eligibility & Policies',
    route: '/onboarding/eligibility',
    category: 'onboarding',
    imagePath: 'assets/account creation and module select/06 Eligibility & Policies Onboarding Screen.png',
    backRoute: '/auth/verify-email',
    defaultNextRoute: '/onboarding/modules'
  },
  {
    id: 'scr-07',
    code: '07',
    title: 'Choose Your Modules',
    route: '/onboarding/modules',
    category: 'onboarding',
    imagePath: 'assets/account creation and module select/07 Choose_Modules_No_Logo_1440x3120.png',
    backRoute: '/onboarding/eligibility',
    defaultNextRoute: '/settings'
  },
  {
    id: 'scr-08',
    code: '08',
    title: 'Forgot Password?',
    route: '/auth/forgot-password',
    category: 'auth',
    imagePath: 'assets/account creation and module select/08 Forgot_Password_No_Logo_1440x3120.png',
    backRoute: '/auth/login',
    defaultNextRoute: '/auth/reset-password'
  },
  {
    id: 'scr-09',
    code: '09',
    title: 'Create New Password',
    route: '/auth/reset-password',
    category: 'auth',
    imagePath: 'assets/account creation and module select/09 Create New Password UI.png',
    backRoute: '/auth/forgot-password',
    defaultNextRoute: '/auth/login'
  },
  {
    id: 'scr-10',
    code: '10',
    title: 'Log In',
    route: '/auth/login',
    category: 'auth',
    imagePath: 'assets/account creation and module select/10 ANDRIL Login Screen.png',
    backRoute: '/welcome',
    defaultNextRoute: '/settings'
  },
  {
    id: 'set-00',
    code: 'SET-00',
    title: 'Account Settings',
    route: '/settings',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-00 Mint Account Settings UI.png',
    backRoute: '/welcome'
  },
  {
    id: 'set-01',
    code: 'SET-01',
    title: 'Manage Modules',
    route: '/settings/modules',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-01 Manage Modules_ Learning, Hobbies & Social.png',
    backRoute: '/settings'
  },
  {
    id: 'set-02',
    code: 'SET-02',
    title: 'Language Settings',
    route: '/settings/language',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-02_Language.png',
    backRoute: '/settings'
  },
  {
    id: 'set-03',
    code: 'SET-03',
    title: 'Security & Password',
    route: '/settings/security',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-03_Security.png',
    backRoute: '/settings'
  },
  {
    id: 'set-04',
    code: 'SET-04',
    title: 'Privacy & Personal Data',
    route: '/settings/privacy',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-04_Privacy.png',
    backRoute: '/settings'
  },
  {
    id: 'set-05',
    code: 'SET-05',
    title: 'Premium Membership',
    route: '/settings/premium',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-05_Premium.png',
    backRoute: '/settings'
  },
  {
    id: 'set-06',
    code: 'SET-06',
    title: 'Payment History',
    route: '/settings/payments',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-06_Payment_History.png',
    backRoute: '/settings'
  },
  {
    id: 'set-07',
    code: 'SET-07',
    title: 'Coin Wallet',
    route: '/settings/wallet',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-07_Coin_Wallet.png',
    backRoute: '/settings'
  },
  {
    id: 'set-08',
    code: 'SET-08',
    title: 'Log Out Confirmation',
    route: '/settings/logout',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-08_Logout.png',
    backRoute: '/settings'
  },
  {
    id: 'set-09',
    code: 'SET-09',
    title: 'Delete Account',
    route: '/settings/delete-account',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-09_Delete_Account.png',
    backRoute: '/settings'
  },
  {
    id: 'set-10',
    code: 'SET-10',
    title: 'Invite Friends & Earn Coins',
    route: '/settings/invite',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-10_Invite_Friends.png',
    backRoute: '/settings'
  },
  {
    id: 'set-11',
    code: 'SET-11',
    title: 'About ANDRIL',
    route: '/settings/about',
    category: 'settings',
    imagePath: 'assets/main account setting screen/SET-11_About_ANDRIL.png',
    backRoute: '/settings'
  }
];


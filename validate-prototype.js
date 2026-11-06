const fs = require('fs');
const path = require('path');

console.log('--- STARTING PROTOTYPE VALIDATION ---');

// 1. Verify screen registry
const registryFile = fs.readFileSync('src/app/data/screen-registry.ts', 'utf8');
const routesFile = fs.readFileSync('src/app/app.routes.ts', 'utf8');
const htmlFile = fs.readFileSync('src/app/screens/screen-view.component.html', 'utf8');

const distBrowser = 'dist/andril-prototype/browser';
if (!fs.existsSync(distBrowser)) {
  console.error('FAIL: dist/andril-prototype/browser does not exist');
  process.exit(1);
}

// Check index.html exists
if (!fs.existsSync(path.join(distBrowser, 'index.html'))) {
  console.error('FAIL: index.html missing in dist');
  process.exit(1);
}

const screenCodes = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  'SET-00', 'SET-01', 'SET-02', 'SET-03', 'SET-04', 'SET-05',
  'SET-06', 'SET-07', 'SET-08', 'SET-09', 'SET-10', 'SET-11'
];

console.log(`Checking ${screenCodes.length} screen codes in template...`);
let missingTemplates = [];
for (const code of screenCodes) {
  if (!htmlFile.includes(`currentScreen().code === '${code}'`)) {
    missingTemplates.push(code);
  }
}

if (missingTemplates.length > 0) {
  console.error('FAIL: Missing template blocks for screens:', missingTemplates);
  process.exit(1);
} else {
  console.log('PASS: All 22 screens have interactive template blocks defined.');
}

// Verify Firebase config
const fbConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
if (fbConfig.hosting && fbConfig.hosting.public && fbConfig.hosting.rewrites) {
  console.log('PASS: Firebase Hosting SPA rewrite configured correctly.');
} else {
  console.error('FAIL: Invalid firebase.json configuration.');
  process.exit(1);
}

// Verify assets exist in dist
const assetList = [
  'assets/account creation and module select/01-Splash_Screen_modified.png',
  'assets/account creation and module select/02 Choose Your Language App Screen.png',
  'assets/account creation and module select/03 Andril Welcome_screen.png',
  'assets/account creation and module select/04 ANDRIL Create Account Screen.png',
  'assets/account creation and module select/05 Email_Verification_No_Logo_1440x3120.png',
  'assets/account creation and module select/06 Eligibility & Policies Onboarding Screen.png',
  'assets/account creation and module select/07 Choose_Modules_No_Logo_1440x3120.png',
  'assets/account creation and module select/08 Forgot_Password_No_Logo_1440x3120.png',
  'assets/account creation and module select/09 Create New Password UI.png',
  'assets/account creation and module select/10 ANDRIL Login Screen.png',
  'assets/main account setting screen/SET-00 Mint Account Settings UI.png',
  'assets/main account setting screen/SET-01 Manage Modules_ Learning, Hobbies & Social.png',
  'assets/main account setting screen/SET-02_Language.png',
  'assets/main account setting screen/SET-03_Security.png',
  'assets/main account setting screen/SET-04_Privacy.png',
  'assets/main account setting screen/SET-05_Premium.png',
  'assets/main account setting screen/SET-06_Payment_History.png',
  'assets/main account setting screen/SET-07_Coin_Wallet.png',
  'assets/main account setting screen/SET-08_Logout.png',
  'assets/main account setting screen/SET-09_Delete_Account.png',
  'assets/main account setting screen/SET-10_Invite_Friends.png',
  'assets/main account setting screen/SET-11_About_ANDRIL.png'
];

let missingAssets = [];
for (const rel of assetList) {
  const full = path.join(distBrowser, rel);
  if (!fs.existsSync(full)) {
    missingAssets.push(rel);
  }
}

if (missingAssets.length > 0) {
  console.error('FAIL: Missing dist assets:', missingAssets);
  process.exit(1);
} else {
  console.log('PASS: All 22 image source files exist in build output.');
}

// 4. Verify Phase 3: All 18 Demo States (M2-ST-01 to M2-ST-18)
console.log('Verifying Phase 3: 18 Shared Core UI States (M2-ST-01 to M2-ST-18)...');
const modelsFile = fs.readFileSync('src/app/models/andril.models.ts', 'utf8');
const componentTs = fs.readFileSync('src/app/screens/screen-view.component.ts', 'utf8');
const appHtml = fs.readFileSync('src/app/app.html', 'utf8');

const demoStates = [
  'M2-ST-01', 'M2-ST-02', 'M2-ST-03', 'M2-ST-04', 'M2-ST-05',
  'M2-ST-06', 'M2-ST-07', 'M2-ST-08', 'M2-ST-09', 'M2-ST-10',
  'M2-ST-11', 'M2-ST-12', 'M2-ST-13', 'M2-ST-14', 'M2-ST-15',
  'M2-ST-16', 'M2-ST-17', 'M2-ST-18'
];

for (const id of demoStates) {
  if (!modelsFile.includes(`id: '${id}'`)) {
    console.error(`FAIL: ${id} missing in DEMO_STATES definition in andril.models.ts`);
    process.exit(1);
  }
  if (!componentTs.includes(`case '${id}':`)) {
    console.error(`FAIL: ${id} missing in applyDemoState switch in screen-view.component.ts`);
    process.exit(1);
  }
}
console.log('PASS: All 18 demo state IDs registered in models & controller.');

// Verify Demo State dropdown in companion toolbar
if (appHtml.includes('demo-state-select-dropdown') && appHtml.includes('jumpToDemoState')) {
  console.log('PASS: Dedicated Demo States (18) dropdown present in companion toolbar.');
} else {
  console.error('FAIL: Demo state dropdown missing in app.html');
  process.exit(1);
}

console.log('--- ALL AUTOMATED VERIFICATION CHECKS PASSED ---');


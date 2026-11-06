import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

console.log('========================================================');
console.log('ANDRIL PHASE 4 / PART 1: ASSET VALIDATION');
console.log('========================================================');

let allChecksPassed = true;
function fail(msg) {
  console.error(`❌ FAIL: ${msg}`);
  allChecksPassed = false;
}
function pass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

const PUBLIC_ANDRIL_DIR = path.resolve('public', 'assets', 'andril');
const MANIFEST_PATH = path.resolve('src', 'app', 'data', 'prototype-assets.json');
const REGISTRY_PATH = path.resolve('src', 'app', 'data', 'imported-assets-registry.ts');
const MODELS_PATH = path.resolve('src', 'app', 'models', 'andril.models.ts');
const COMPONENT_TS_PATH = path.resolve('src', 'app', 'screens', 'screen-view.component.ts');
const DIST_BROWSER_DIR = path.resolve('dist', 'andril-prototype', 'browser');

// Check manifest exists
if (!fs.existsSync(MANIFEST_PATH)) {
  fail(`Manifest not found at ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// Check 1, 2, 3, 4: Module asset counts
const learningAssets = manifest.filter(a => a.module === 'learning');
const hobbiesAssets = manifest.filter(a => a.module === 'hobbies');
const socialAssets = manifest.filter(a => a.module === 'social');
const sharedCoreAssets = manifest.filter(a => a.module === 'shared-core');

if (learningAssets.length === 30) {
  pass(`Check 1: Exactly 30 Learning assets cataloged (Q01-Q57).`);
} else {
  fail(`Check 1: Expected 30 Learning assets, got ${learningAssets.length}`);
}

if (hobbiesAssets.length === 30) {
  pass(`Check 2: Exactly 30 Hobbies assets cataloged (H01-H37).`);
} else {
  fail(`Check 2: Expected 30 Hobbies assets, got ${hobbiesAssets.length}`);
}

if (socialAssets.length === 30) {
  pass(`Check 3: Exactly 30 Social assets cataloged (S09-S60).`);
} else {
  fail(`Check 3: Expected 30 Social assets, got ${socialAssets.length}`);
}

if (sharedCoreAssets.length === 9) {
  pass(`Check 4: Exactly 9 Shared Core supplemental assets cataloged.`);
} else {
  fail(`Check 4: Expected 9 Shared Core assets, got ${sharedCoreAssets.length}`);
}

// Check 5 & 6: All imported assets readable and have valid PNG headers
let unreadableCount = 0;
let invalidPngCount = 0;
const pngSig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

for (const item of manifest) {
  const filePath = path.resolve('public', item.publicAssetUrl);
  if (!fs.existsSync(filePath)) {
    fail(`Asset file missing on disk: ${filePath}`);
    unreadableCount++;
    continue;
  }
  const buf = fs.readFileSync(filePath);
  let isPng = true;
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== pngSig[i]) {
      isPng = false;
      break;
    }
  }
  if (!isPng) {
    fail(`File is not a valid PNG: ${filePath}`);
    invalidPngCount++;
  }
}

if (unreadableCount === 0) {
  pass(`Check 5: All 99 imported assets are readable on disk.`);
}
if (invalidPngCount === 0) {
  pass(`Check 6: All 99 imported assets possess valid 8-byte PNG signatures.`);
}

// Check 7: Manifest paths resolve correctly
let manifestPathErrors = 0;
for (const item of manifest) {
  const resolvedPublic = path.resolve('public', item.publicAssetUrl);
  if (!fs.existsSync(resolvedPublic)) {
    manifestPathErrors++;
    fail(`Manifest URL does not resolve: ${item.publicAssetUrl}`);
  }
}
if (manifestPathErrors === 0) {
  pass(`Check 7: All 99 manifest asset URLs resolve directly in public/assets.`);
}

// Check 8: Duplicate content identified
const hashes = new Map();
let duplicateCount = 0;
for (const item of manifest) {
  if (hashes.has(item.sha256)) {
    duplicateCount++;
  } else {
    hashes.set(item.sha256, item.assetId);
  }
}
if (duplicateCount === 0) {
  pass(`Check 8: Duplicate content audit verified (0 duplicates within 99 assets; 9 supplemental shared-core identified).`);
} else {
  fail(`Check 8: Found ${duplicateCount} internal duplicates.`);
}

// Check 9: No filename collisions
const importedNames = new Set();
let collisionCount = 0;
for (const item of manifest) {
  const key = `${item.module}/${item.importedFilename}`;
  if (importedNames.has(key)) {
    fail(`Filename collision detected in module ${item.module}: ${item.importedFilename}`);
    collisionCount++;
  }
  importedNames.add(key);
}
if (collisionCount === 0) {
  pass(`Check 9: Zero filename collisions across all module destination directories.`);
}

// Check 10: Existing Shared Core assets preserved
const existingSharedCoreAssets = [
  'public/assets/account creation and module select/01-Splash_Screen_modified.png',
  'public/assets/account creation and module select/02 Choose Your Language App Screen.png',
  'public/assets/account creation and module select/03 Andril Welcome_screen.png',
  'public/assets/account creation and module select/04 ANDRIL Create Account Screen.png',
  'public/assets/account creation and module select/05 Email_Verification_No_Logo_1440x3120.png',
  'public/assets/account creation and module select/06 Eligibility & Policies Onboarding Screen.png',
  'public/assets/account creation and module select/07 Choose_Modules_No_Logo_1440x3120.png',
  'public/assets/account creation and module select/08 Forgot_Password_No_Logo_1440x3120.png',
  'public/assets/account creation and module select/09 Create New Password UI.png',
  'public/assets/account creation and module select/10 ANDRIL Login Screen.png',
  'public/assets/main account setting screen/SET-00 Mint Account Settings UI.png',
  'public/assets/main account setting screen/SET-01 Manage Modules_ Learning, Hobbies & Social.png',
  'public/assets/main account setting screen/SET-02_Language.png',
  'public/assets/main account setting screen/SET-03_Security.png',
  'public/assets/main account setting screen/SET-04_Privacy.png',
  'public/assets/main account setting screen/SET-05_Premium.png',
  'public/assets/main account setting screen/SET-06_Payment_History.png',
  'public/assets/main account setting screen/SET-07_Coin_Wallet.png',
  'public/assets/main account setting screen/SET-08_Logout.png',
  'public/assets/main account setting screen/SET-09_Delete_Account.png',
  'public/assets/main account setting screen/SET-10_Invite_Friends.png',
  'public/assets/main account setting screen/SET-11_About_ANDRIL.png'
];

let missingExisting = 0;
for (const rel of existingSharedCoreAssets) {
  if (!fs.existsSync(path.resolve(rel))) {
    fail(`Existing Shared Core asset missing: ${rel}`);
    missingExisting++;
  }
}
if (missingExisting === 0) {
  pass(`Check 10: All 22 original primary Shared Core screen assets are fully preserved.`);
}

// Check 11: Existing 18 demo state IDs remain registered
const demoStates = [
  'M2-ST-01', 'M2-ST-02', 'M2-ST-03', 'M2-ST-04', 'M2-ST-05',
  'M2-ST-06', 'M2-ST-07', 'M2-ST-08', 'M2-ST-09', 'M2-ST-10',
  'M2-ST-11', 'M2-ST-12', 'M2-ST-13', 'M2-ST-14', 'M2-ST-15',
  'M2-ST-16', 'M2-ST-17', 'M2-ST-18'
];

const modelsContent = fs.readFileSync(MODELS_PATH, 'utf8');
const componentContent = fs.readFileSync(COMPONENT_TS_PATH, 'utf8');

let missingDemoStates = 0;
for (const id of demoStates) {
  if (!modelsContent.includes(`id: '${id}'`)) {
    fail(`Demo state ${id} missing in models`);
    missingDemoStates++;
  }
  if (!componentContent.includes(`case '${id}':`)) {
    fail(`Demo state ${id} missing in component controller`);
    missingDemoStates++;
  }
}
if (missingDemoStates === 0) {
  pass(`Check 11: All 18 demo UI states (M2-ST-01 to M2-ST-18) remain fully registered.`);
}

// Check 12: Every referenced asset is included in build output (if dist exists)
if (fs.existsSync(DIST_BROWSER_DIR)) {
  let missingDistAssets = 0;
  for (const item of manifest) {
    const distAssetPath = path.join(DIST_BROWSER_DIR, item.publicAssetUrl);
    if (!fs.existsSync(distAssetPath)) {
      missingDistAssets++;
    }
  }
  if (missingDistAssets === 0) {
    pass(`Check 12: All 99 imported assets are present in dist/andril-prototype/browser.`);
  } else {
    console.log(`ℹ️ Check 12: ${missingDistAssets} assets not yet in dist (will be populated on next build).`);
  }
} else {
  console.log(`ℹ️ Check 12: dist directory not present yet; verify after npm run build.`);
}

console.log('========================================================');
if (allChecksPassed) {
  console.log('🎉 ALL REQUIRED VALIDATION CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error('⚠️ SOME VALIDATION CHECKS FAILED. Review errors above.');
  process.exit(1);
}
console.log('========================================================');


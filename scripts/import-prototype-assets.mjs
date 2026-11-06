import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SOURCE_DIR = path.resolve('incoming', 'for prototype');
const DEST_PUBLIC_ROOT = path.resolve('public', 'assets', 'andril');
const DEST_ASSETS_ROOT = path.resolve('assets', 'andril');

const MANIFEST_JSON_PATH = path.resolve('src', 'app', 'data', 'prototype-assets.json');
const REGISTRY_TS_PATH = path.resolve('src', 'app', 'data', 'imported-assets-registry.ts');
const MODELS_TS_PATH = path.resolve('src', 'app', 'models', 'imported-assets.models.ts');

console.log('====================================================');
console.log('ANDRIL PHASE 4 / PART 1: ASSET IMPORT AND CATALOGING');
console.log('====================================================');
console.log(`Source directory: ${SOURCE_DIR}`);
console.log(`Public target root: ${DEST_PUBLIC_ROOT}`);

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`ERROR: Source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(SOURCE_DIR);
console.log(`Found ${files.length} source files.`);

if (files.length !== 99) {
  console.warn(`WARNING: Expected 99 files, found ${files.length}. Proceeding with detected files.`);
}

// Ensure target directories exist
const modules = ['learning', 'hobbies', 'social', 'shared-core-imported'];
modules.forEach(mod => {
  fs.mkdirSync(path.join(DEST_PUBLIC_ROOT, mod), { recursive: true });
  fs.mkdirSync(path.join(DEST_ASSETS_ROOT, mod), { recursive: true });
});

// Helper: read PNG dimensions
function readPngDimensions(buffer) {
  const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== sig[i]) return null;
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

// Helper: generate clean, safe imported filename
function sanitizeFilename(orig) {
  let name = orig;
  name = name.replace(/^Copy of\s+/i, '');
  name = name.replace(/\.png\.png$/i, '.png');
  name = name.replace(/[’']/g, '');
  name = name.replace(/[—–]/g, '-');
  name = name.replace(/[!?,]/g, '');
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  const cleanBase = base.replace(/[\s&]+/g, '_').replace(/_+/g, '_');
  return cleanBase + ext.toLowerCase();
}

// Helper: categorize
function categorize(f, mod) {
  if (mod === 'learning') {
    if (f.startsWith('Q01') || f.startsWith('Q02') || f.startsWith('Q03') || f.startsWith('Q05') || f.startsWith('Q06') || f.startsWith('Q07')) return 'Onboarding';
    if (f.startsWith('Q09')) return 'Home';
    if (f.startsWith('Q12') || f.startsWith('Q13') || f.startsWith('Q14')) return 'Discovery';
    if (f.startsWith('Q15') || f.startsWith('Q16') || f.startsWith('Q17')) return 'Connections';
    if (f.startsWith('Q18') || f.startsWith('Q19') || f.startsWith('Q21') || f.startsWith('Q23')) return 'Classrooms';
    if (f.startsWith('Q26') || f.startsWith('Q27') || f.startsWith('Q28') || f.startsWith('Q29')) return 'Learning Circles';
    if (f.startsWith('Q31') || f.startsWith('Q35') || f.startsWith('Q36') || f.startsWith('Q37') || f.startsWith('Q38')) return 'Skill Exchange';
    if (f.startsWith('Q45') || f.startsWith('Q46') || f.startsWith('Q47')) return 'Mentorship';
    if (f.startsWith('Q57')) return 'Progress';
    return 'General';
  }
  if (mod === 'hobbies') {
    if (f.startsWith('H01')) return 'Home';
    if (f.startsWith('H02') || f.startsWith('H03') || f.startsWith('H04')) return 'Discovery';
    if (f.startsWith('H05') || f.startsWith('H06') || f.startsWith('H07') || f.startsWith('H08')) return 'Connections';
    if (f.startsWith('H10')) return 'Profile';
    if (f.startsWith('H11') || f.startsWith('H12') || f.startsWith('H13') || f.startsWith('H14') || f.startsWith('H15')) return 'Clubs';
    if (f.startsWith('H16') || f.startsWith('H17') || f.startsWith('H18') || f.startsWith('H21') || f.startsWith('H22') || f.startsWith('H23') || f.startsWith('H24')) return 'Club Interactions';
    if (f.startsWith('H25') || f.startsWith('H26') || f.startsWith('H27') || f.startsWith('H28') || f.startsWith('H29')) return 'Andril Map';
    if (f.startsWith('H30') || f.startsWith('H31')) return 'Flight Points';
    if (f.startsWith('H35') || f.startsWith('H37')) return 'Privacy';
    return 'General';
  }
  if (mod === 'social') {
    const c = f.replace(/^Copy of\s+/i, '');
    if (c.startsWith('S21')) return 'Home';
    if (c.startsWith('S09') || c.startsWith('S14') || c.startsWith('S15') || c.startsWith('S25')) return 'Discovery';
    if (c.startsWith('S11') || c.startsWith('S54')) return 'Interest Requests';
    if (c.startsWith('S12') || c.startsWith('S28')) return 'Matching';
    if (c.startsWith('S13') || c.startsWith('S43')) return 'Connections';
    if (c.startsWith('S10') || c.startsWith('S20') || c.startsWith('S32') || c.startsWith('S37')) return 'Profile';
    if (c.startsWith('S16') || c.startsWith('S17') || c.startsWith('S18') || c.startsWith('S60')) return 'Chat';
    if (c.startsWith('S19') || c.startsWith('S22') || c.startsWith('S23') || c.startsWith('S24')) return 'Zones';
    if (c.startsWith('S29') || c.startsWith('S30') || c.startsWith('S31')) return 'Calls';
    if (c.startsWith('S41')) return 'MoodTone';
    if (c.startsWith('S33') || c.startsWith('S34') || c.startsWith('S35')) return 'Privacy and Safety';
    return 'General';
  }
  return 'Supplemental Reference';
}

// Helper: parse screen info
function parseScreenInfo(f, mod) {
  let screenId = '';
  let title = '';

  if (mod === 'learning') {
    const m = f.match(/^(Q\d+)(?:_([^_]+))?_(.+)\.png/i);
    if (m) {
      screenId = m[1].toUpperCase();
      title = m[3].replace(/[’']/g, "'").replace(/[—–]/g, '-').trim();
    } else {
      screenId = f.split('_')[0].toUpperCase();
      title = f.replace(/\.png$/, '');
    }
  } else if (mod === 'hobbies') {
    const m = f.match(/^(H\d+)_(.+)\.png/i);
    if (m) {
      screenId = m[1].toUpperCase();
      title = m[2].replace(/_/g, ' ').trim();
    } else {
      screenId = f.split('_')[0].toUpperCase();
      title = f.replace(/\.png$/, '');
    }
  } else if (mod === 'social') {
    const c = f.replace(/^Copy of\s+/i, '');
    const m = c.match(/^(S\d+)_(.+?)(?:\.png|\.png\.png)$/i);
    if (m) {
      screenId = m[1].toUpperCase();
      title = m[2].replace(/_/g, ' ').replace(/[!]/g, '').trim();
    } else {
      screenId = c.split('_')[0].toUpperCase();
      title = c.replace(/\.png(\.png)?$/, '');
    }
  } else {
    // Shared core
    if (f.startsWith('SET-')) {
      const parts = f.split(/[\s_]/);
      screenId = parts[0];
      title = f.replace(/^SET-\d+[\s_]/, '').replace(/\.png$/, '').replace(/_/g, ' ');
    } else {
      const m = f.match(/^(\d+)[-_\s](.+)\.png$/i);
      if (m) {
        screenId = m[1];
        title = m[2].replace(/_/g, ' ').trim();
      } else {
        screenId = f.split(/[-_\s]/)[0];
        title = f.replace(/\.png$/, '');
      }
    }
  }

  return { screenId, title };
}

// Existing shared core files for duplicate check
const existingSharedCoreHashes = new Set([
  'd205456e9a4a1f5ab34731a440b244a00c9a0a287dc0cab497d3dd811d80d9cb', // 01
  '2aa2d3bb7907feadf045a942baf53d1e7cb8ef79eb507a6655ae9ec04d7b23e2', // 03
  '2d73f6740151062c68cb96526f6383ea140583e8b26363ddfa20d8141df2257b', // 04
  'ef0eab08a59b34eaa44533486613bc004cac9c6a941d0b5c95502a47f0ff08d5', // 05
  '353cf6681791945a4ebfa1465ff52579b9d68908e9a37465bef3236ecc48a0ad', // 06
  'bc13b5c70659916cf5af2515d9ece30484e57234f8466e82f82dce80fa359938', // 07
  '9b9d8fe21e96f0c55e56337a32dd61f07b678fa494d3fe96de618ad9260833c8', // 10
  'b8b0114b0481ab02c8109ed057d372d6ca91f8694550a41ab29a7b1016627ec4', // SET-00
  '583762c10045185ef63c4728d72a12e6df92dfa5cba2dfa3beb3c3b1bbf7c955'  // SET-08
]);

const manifest = [];
let orderCounters = { learning: 0, hobbies: 0, social: 0, 'shared-core': 0 };

// Process files
for (const f of files) {
  const srcPath = path.join(SOURCE_DIR, f);
  const buf = fs.readFileSync(srcPath);
  const dims = readPngDimensions(buf);
  if (!dims) {
    console.error(`ERROR: File is not a valid PNG: ${f}`);
    continue;
  }

  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  let moduleName = 'shared-core';
  let targetSubdir = 'shared-core-imported';

  if (/^Q\d+/i.test(f)) {
    moduleName = 'learning';
    targetSubdir = 'learning';
  } else if (/^H\d+/i.test(f)) {
    moduleName = 'hobbies';
    targetSubdir = 'hobbies';
  } else if (/S\d+/i.test(f)) {
    moduleName = 'social';
    targetSubdir = 'social';
  }

  orderCounters[moduleName]++;
  const screenOrder = orderCounters[moduleName];

  const sanitized = sanitizeFilename(f);
  const screenInfo = parseScreenInfo(f, moduleName);
  const category = categorize(f, moduleName);

  const destPublicPath = path.join(DEST_PUBLIC_ROOT, targetSubdir, sanitized);
  const destAssetsPath = path.join(DEST_ASSETS_ROOT, targetSubdir, sanitized);

  // Copy file
  fs.copyFileSync(srcPath, destPublicPath);
  fs.copyFileSync(srcPath, destAssetsPath);

  const ratio = +(dims.width / dims.height).toFixed(4);
  let ratioLabel = 'Pixel 7 Pro (6:13)';
  if (ratio === 0.4615 || ratio === 0.4607) {
    ratioLabel = 'Pixel 7 Pro (6:13)';
  } else if (ratio === 0.5628) {
    ratioLabel = 'Standard Mobile (9:16)';
  } else if (ratio === 0.3333) {
    ratioLabel = 'Tall Scrollable Screen (1:3)';
  } else {
    ratioLabel = `Custom Aspect (${ratio})`;
  }

  const isSharedCoreDuplicate = moduleName === 'shared-core' && existingSharedCoreHashes.has(sha256);

  const assetId = `ast-${moduleName}-${screenInfo.screenId.toLowerCase()}`;
  const publicAssetUrl = `assets/andril/${targetSubdir}/${sanitized}`;

  manifest.push({
    assetId,
    module: moduleName,
    originalFilename: f,
    importedFilename: sanitized,
    publicAssetUrl,
    screenId: screenInfo.screenId,
    screenTitle: screenInfo.title,
    width: dims.width,
    height: dims.height,
    aspectRatio: ratio,
    aspectRatioLabel: ratioLabel,
    fileSize: buf.length,
    sha256,
    duplicateIndicator: isSharedCoreDuplicate ? 'identical-to-existing-shared-core' : 'none',
    proposedScreenOrder: screenOrder,
    provisionalCategory: category,
    importStatus: 'imported-and-verified'
  });
}

// Sort manifest logically: Learning (Q), Hobbies (H), Social (S), Shared-Core
manifest.sort((a, b) => {
  const modOrder = { learning: 1, hobbies: 2, social: 3, 'shared-core': 4 };
  if (modOrder[a.module] !== modOrder[b.module]) {
    return modOrder[a.module] - modOrder[b.module];
  }
  return a.screenId.localeCompare(b.screenId, undefined, { numeric: true, sensitivity: 'base' });
});

// Update proposedScreenOrder post-sort
const finalCounters = { learning: 0, hobbies: 0, social: 0, 'shared-core': 0 };
manifest.forEach(item => {
  finalCounters[item.module]++;
  item.proposedScreenOrder = finalCounters[item.module];
});

// Write JSON manifest
fs.writeFileSync(MANIFEST_JSON_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`\nWritten manifest to: ${MANIFEST_JSON_PATH}`);

// Write TypeScript models
const modelsTsContent = `export type PrototypeModule = 'learning' | 'hobbies' | 'social' | 'shared-core';

export interface PrototypeAssetRecord {
  assetId: string;
  module: PrototypeModule;
  originalFilename: string;
  importedFilename: string;
  publicAssetUrl: string;
  screenId: string;
  screenTitle: string;
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  fileSize: number;
  sha256: string;
  duplicateIndicator: 'none' | 'identical-to-existing-shared-core';
  proposedScreenOrder: number;
  provisionalCategory: string;
  importStatus: 'imported-and-verified';
}
`;
fs.writeFileSync(MODELS_TS_PATH, modelsTsContent, 'utf8');
console.log(`Written TypeScript models to: ${MODELS_TS_PATH}`);

// Write TypeScript registry
const registryTsContent = `import { PrototypeAssetRecord, PrototypeModule } from '../models/imported-assets.models';

export const PROTOTYPE_IMPORTED_ASSETS: PrototypeAssetRecord[] = ${JSON.stringify(manifest, null, 2)};

export function getImportedAssetById(assetId: string): PrototypeAssetRecord | undefined {
  return PROTOTYPE_IMPORTED_ASSETS.find(a => a.assetId === assetId);
}

export function getImportedAssetByScreenId(screenId: string): PrototypeAssetRecord | undefined {
  const clean = screenId.toUpperCase();
  return PROTOTYPE_IMPORTED_ASSETS.find(a => a.screenId.toUpperCase() === clean);
}

export function getImportedAssetsByModule(module: PrototypeModule): PrototypeAssetRecord[] {
  return PROTOTYPE_IMPORTED_ASSETS.filter(a => a.module === module);
}

export function getImportedAssetsByCategory(module: PrototypeModule, category: string): PrototypeAssetRecord[] {
  return PROTOTYPE_IMPORTED_ASSETS.filter(a => a.module === module && a.provisionalCategory.toLowerCase() === category.toLowerCase());
}
`;
fs.writeFileSync(REGISTRY_TS_PATH, registryTsContent, 'utf8');
console.log(`Written TypeScript registry to: ${REGISTRY_TS_PATH}`);

console.log('\n--- IMPORT SUMMARY ---');
console.log(`Total Assets Imported: ${manifest.length}`);
console.log(`- Learning (Q): ${manifest.filter(m => m.module === 'learning').length}`);
console.log(`- Hobbies (H): ${manifest.filter(m => m.module === 'hobbies').length}`);
console.log(`- Social (S): ${manifest.filter(m => m.module === 'social').length}`);
console.log(`- Shared Core Supplemental: ${manifest.filter(m => m.module === 'shared-core').length}`);
console.log('Import completed successfully.');

# ANDRIL — Interactive Mobile Prototype (Google Pixel 7 Pro)

ANDRIL interactive frontend prototype built with **Angular 22** standalone components, Angular Router, and Signals, faithfully modeling the native Google Pixel 7 Pro design resolution (1440 × 3120, 6:13 aspect ratio).

---

## 📱 Prototype Highlights

- **Shared Core Screens (22)**: Complete user onboarding flow, authentication, account registration, OTP email verification, eligibility & date-of-birth checking, module selection, and full Account Settings (SET-00 to SET-11).
- **Interactive UI State Groups (18)**: Complete coverage for error handling, validation warnings, deactivation/reactivation grace periods, global blocking, demo checkout, referral progression, and account closure:
  - `M2-ST-01` to `M2-ST-04`: Registration validation & OTP states (incorrect, expired, success)
  - `M2-ST-05`: Social age restriction (18+ requirement with DOB evaluation)
  - `M2-ST-06`: Module activation confirmation with loading simulation
  - `M2-ST-07` & `M2-ST-08`: Password reset submission & success states
  - `M2-ST-09`: Login invalid credentials feedback
  - `M2-ST-10` & `M2-ST-11`: Module deactivation warning & 21-day reactivation states (Variant A vs. Variant B)
  - `M2-ST-12`: Password changed confirmation
  - `M2-ST-13`: Global cross-module block confirmation
  - `M2-ST-14`: Premium plan selection & demo checkout ($1.49 indiv / $2.99, $7.99, $14.99 full)
  - `M2-ST-15`: Payment history empty state & demo receipt fixtures
  - `M2-ST-16`: 4-stage referral progression pipeline
  - `M2-ST-17` & `M2-ST-18`: Logout confirmation & final deletion compliance notice
- **Phase 4 Module Asset Collection (99 Assets)**:
  - **Learning (30)**: Q01–Q57 (Onboarding, Home, Discovery, Connections, Classrooms, Circles, Skill Exchange, Mentorship, Progress)
  - **Hobbies (30)**: H01–H37 (Home, Discovery, Connections, Profile, Clubs, Interactions, Andril Map, Flight Points, Privacy)
  - **Social (30)**: S09–S60 (Home, Discovery, Profile, Interest Requests, Matching, Connections, Chat, Zones, Calls, MoodTone, Safety)
  - **Shared Core (9)**: Supplemental reference assets with verified byte-for-byte checksums

---

## 🛠️ Project Structure

```text
├── public/
│   └── assets/
│       ├── account creation and module select/   # Original Shared Core assets (Screens 01-10)
│       ├── main account setting screen/         # Original Settings assets (SET-00 to SET-11)
│       └── andril/                              # 99 Module screen assets
│           ├── learning/                        # 30 Learning PNG assets
│           ├── hobbies/                         # 30 Hobbies PNG assets
│           ├── social/                          # 30 Social PNG assets
│           └── shared-core-imported/            # 9 Supplementary reference assets
├── scripts/
│   ├── import-prototype-assets.mjs              # Asset cataloging and manifest generator
│   └── validate-prototype-assets.mjs            # 12-point asset validation suite
├── src/
│   ├── app/
│   │   ├── data/
│   │   │   ├── prototype-assets.json            # Machine-readable asset manifest
│   │   │   ├── imported-assets-registry.ts      # Strongly typed TypeScript asset registry
│   │   │   └── screen-registry.ts               # Shared Core screens registry
│   │   ├── models/
│   │   │   ├── andril.models.ts                 # Core prototype data models & demo states
│   │   │   └── imported-assets.models.ts        # Imported asset interfaces & types
│   │   ├── screens/                             # Screen view component & interactive overlays
│   │   ├── services/                            # Prototype session state management
│   │   ├── app.html                             # Device frame & companion developer toolbar
│   │   ├── app.ts                               # Root controller & asset gallery
│   │   └── app.routes.ts                        # SPA router configuration
│   └── styles.css                               # Global typography & resets
├── angular.json                                 # Angular CLI workspace configuration
├── firebase.json                                # Firebase Hosting configuration & rewrites
├── .firebaserc                                  # Firebase project reference (andril-prototype-f176a)
└── validate-prototype.js                        # Primary screen & state validator
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser.

- Use the **Screen** dropdown in the top toolbar to jump between screens.
- Use the **Demo States (18)** selector or query params (`?state=M2-ST-XX`) to test state overlays.
- Click **Assets (99)** to browse and inspect all imported module assets in the dev gallery.
- Click **Inspect** to toggle visible hotspot bounding boxes.

### 3. Build Production Bundle

```bash
npm run build
```

The optimized production bundle is generated in `dist/andril-prototype/browser`.

### 4. Run Automated Validation Suites

```bash
node validate-prototype.js
node scripts/validate-prototype-assets.mjs
```

---

## 🌐 Deployment

The prototype is configured for Firebase Hosting project `andril-prototype-f176a`:

```bash
npx firebase deploy --only hosting --project andril-prototype-f176a
```

Live Demo URL: **https://andril-prototype-f176a.web.app**

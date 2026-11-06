import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SCREEN_REGISTRY } from './data/screen-registry';
import { PrototypeStateService } from './services/prototype-state.service';
import { ScreenInfo, DEMO_STATES, DemoStateDefinition } from './models/andril.models';
import { PROTOTYPE_IMPORTED_ASSETS } from './data/imported-assets-registry';
import { PrototypeAssetRecord, PrototypeModule } from './models/imported-assets.models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private router = inject(Router);
  readonly state = inject(PrototypeStateService);

  readonly screens = SCREEN_REGISTRY;
  readonly demoStates = DEMO_STATES;
  readonly importedAssets = PROTOTYPE_IMPORTED_ASSETS;

  currentRoute = signal('/splash');
  inspectMode = signal(false);
  deviceScaleMode = signal<'fit' | 'fill'>('fit');
  quickMenuOpen = signal(false);

  // Development Preview Asset Gallery
  assetGalleryOpen = signal(false);
  galleryFilter = signal<'all' | PrototypeModule>('all');
  gallerySearch = signal('');
  selectedPreviewAsset = signal<PrototypeAssetRecord | null>(null);

  filteredAssets = computed(() => {
    let list = this.importedAssets;
    const f = this.galleryFilter();
    if (f !== 'all') {
      list = list.filter(a => a.module === f);
    }
    const q = this.gallerySearch().trim().toLowerCase();
    if (q) {
      list = list.filter(a =>
        a.screenId.toLowerCase().includes(q) ||
        a.screenTitle.toLowerCase().includes(q) ||
        a.originalFilename.toLowerCase().includes(q) ||
        a.provisionalCategory.toLowerCase().includes(q)
      );
    }
    return list;
  });

  currentScreen = computed(() => {
    const route = this.currentRoute().split('?')[0];
    return this.screens.find(s => s.route === route) || this.screens[0];
  });

  currentDemoStateId = computed(() => {
    const url = this.currentRoute();
    const match = url.match(/[?&]state=([^&]+)/);
    return match ? match[1] : '';
  });

  onboardingScreens = computed(() => this.screens.filter(s => s.category === 'onboarding'));
  authScreens = computed(() => this.screens.filter(s => s.category === 'auth'));
  settingsScreens = computed(() => this.screens.filter(s => s.category === 'settings'));
  learningScreens = computed(() => this.screens.filter(s => s.category === 'learning'));
  hobbiesScreens = computed(() => this.screens.filter(s => s.category === 'hobbies'));
  socialScreens = computed(() => this.screens.filter(s => s.category === 'social'));

  demoStatesAuth = computed(() => this.demoStates.filter(d => d.category === 'auth'));
  demoStatesOnboarding = computed(() => this.demoStates.filter(d => d.category === 'onboarding'));
  demoStatesSettings = computed(() => this.demoStates.filter(d => d.category === 'settings'));

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute.set(e.urlAfterRedirects || e.url);
      });
  }

  jumpToScreen(route: string) {
    this.router.navigate([route]);
    this.quickMenuOpen.set(false);
  }

  jumpToDemoState(stateId: string) {
    if (!stateId) return;
    const match = this.demoStates.find(d => d.id === stateId);
    if (match) {
      this.router.navigate([match.route], { queryParams: { state: match.id } });
      this.state.showToast(`[${match.id}] ${match.title}`, 'info');
      this.quickMenuOpen.set(false);
    }
  }

  toggleInspectMode() {
    this.inspectMode.update(v => !v);
    const viewport = document.querySelector('.screen-viewport');
    if (viewport) {
      if (this.inspectMode()) {
        viewport.classList.add('show-debug');
      } else {
        viewport.classList.remove('show-debug');
      }
    }
    this.state.showToast(this.inspectMode() ? 'Hotspot Inspection Active' : 'Hotspot Inspection Off', 'info');
  }

  toggleScaleMode() {
    this.deviceScaleMode.update(m => (m === 'fit' ? 'fill' : 'fit'));
  }

  copyCurrentUrl() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    this.state.showToast('Current screen route copied!', 'success');
  }

  resetDemo() {
    this.state.resetDemoSession();
  }

  toggleAssetGallery() {
    this.assetGalleryOpen.update(v => !v);
  }

  setGalleryFilter(filter: 'all' | PrototypeModule) {
    this.galleryFilter.set(filter);
  }

  openAssetDetail(asset: PrototypeAssetRecord) {
    this.selectedPreviewAsset.set(asset);
  }

  closeAssetDetail() {
    this.selectedPreviewAsset.set(null);
  }
}

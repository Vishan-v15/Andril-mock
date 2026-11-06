export type PrototypeModule = 'learning' | 'hobbies' | 'social' | 'shared-core';

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

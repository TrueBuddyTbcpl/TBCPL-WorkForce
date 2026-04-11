// src/utils/imageLayoutUtils.ts

export type ImageOrientation = 'portrait' | 'landscape';

export interface LayoutImage {
  url: string;
  reason: string;
  orientation: ImageOrientation;
}

export interface ImageRow {
  images: LayoutImage[];
  centered: boolean;
  cols: 1 | 2 | 3;
}

/**
 * Smart auto-layout algorithm:
 * - 3 portraits          → 3-col row (not centered)
 * - 2 portrait + 1 land  → 3-col row (not centered)
 * - 2 landscapes         → 2-col row (not centered)
 * - 1 portrait alone     → centered
 * - 1 portrait + 1 land  → centered pair
 * - 1 landscape alone    → centered
 */
export function groupImagesIntoRows(images: LayoutImage[]): ImageRow[] {
  const rows: ImageRow[] = [];
  let i = 0;

  while (i < images.length) {
    const a = images[i];
    const b = images[i + 1];
    const c = images[i + 2];

    const oA = a?.orientation;
    const oB = b?.orientation;
    const oC = c?.orientation;

    if (oA === 'portrait') {

      if (oB === 'portrait' && oC === 'portrait') {
        // ✅ Rule 1: 3 portraits → full 3-col row
        rows.push({ images: [a, b, c], centered: false, cols: 3 });
        i += 3;

      } else if (oB === 'portrait' && oC === 'landscape') {
        // ✅ Rule 2: 2 portrait + 1 landscape → full 3-col row
        rows.push({ images: [a, b, c], centered: false, cols: 3 });
        i += 3;

      } else if (oB === 'portrait') {
        // 2 portraits only (last row, no 3rd image) → centered
        rows.push({ images: [a, b], centered: true, cols: 2 });
        i += 2;

      } else if (oB === 'landscape') {
        // ✅ Rule 5: 1 portrait + 1 landscape left → centered pair
        rows.push({ images: [a, b], centered: true, cols: 2 });
        i += 2;

      } else {
        // ✅ Rule 4: 1 portrait alone → centered single
        rows.push({ images: [a], centered: true, cols: 1 });
        i += 1;
      }

    } else {
      // oA === 'landscape'

      if (oB === 'landscape') {
        // ✅ Rule 3: 2 landscapes → full 2-col row
        rows.push({ images: [a, b], centered: false, cols: 2 });
        i += 2;

      } else if (oB === 'portrait') {
        // landscape + portrait (edge case) → centered pair
        rows.push({ images: [a, b], centered: true, cols: 2 });
        i += 2;

      } else {
        // ✅ Rule 6: 1 landscape alone → centered single
        rows.push({ images: [a], centered: true, cols: 1 });
        i += 1;
      }
    }
  }

  return rows;
}
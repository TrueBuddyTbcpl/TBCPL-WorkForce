// components/operations/report-create/sections/PhotographicEvidencePanel.tsx
import React, { useState, useEffect } from 'react';
import { Camera, X, LayoutGrid } from 'lucide-react';
import type { PhotographicEvidence } from '../types/report.types';
import ImageUploadWithCrop from '../ImageUploadWithCrop';
import SmartImageGrid from '../SmartImageGrid';

// ── Collage layout definitions ─────────────────────────────────────────────
export type CollageLayout =
  | '1-full'
  | '2-side'
  | '3-row'
  | '2+1'
  | '1+2'
  | '2x2'
  | '2+3'
  | '3x2'
  | 'auto';

interface CollageOption {
  id: CollageLayout;
  label: string;
  minImages: number;
  maxImages: number;
  preview: string;
}

const COLLAGE_OPTIONS: CollageOption[] = [
  { id: '1-full', label: '1 Full Width', minImages: 1, maxImages: 1, preview: '[  1  ]' },
  { id: '2-side', label: '2 Side by Side', minImages: 2, maxImages: 2, preview: '[1][2]' },
  { id: '3-row', label: '3 in a Row', minImages: 3, maxImages: 3, preview: '[1][2][3]' },
  { id: '2+1', label: '2 Top + 1 Bottom', minImages: 3, maxImages: 3, preview: '[1][2]\n[ 3 ]' },
  { id: '1+2', label: '1 Top + 2 Bottom', minImages: 3, maxImages: 3, preview: '[ 1 ]\n[2][3]' },
  { id: '2x2', label: '2×2 Grid', minImages: 4, maxImages: 4, preview: '[1][2]\n[3][4]' },
  { id: '2+3', label: '2 Top + 3 Bottom', minImages: 5, maxImages: 5, preview: '[1][2]\n[3][4][5]' },
  { id: '3x2', label: '3×2 Grid', minImages: 6, maxImages: 6, preview: '[1][2][3]\n[4][5][6]' },
  { id: 'auto', label: 'Auto (Smart)', minImages: 1, maxImages: 99, preview: 'Auto-fit' },
];

type ImageItem = {
  url: string;
  reason: string;
  orientation: 'portrait' | 'landscape';
};

interface PhotographicEvidencePanelProps {
  value: PhotographicEvidence;
  caseId: number | null;
  onChange: (val: PhotographicEvidence) => void;
}

const PhotographicEvidencePanel = ({
  value,
  caseId,
  onChange,
}: PhotographicEvidencePanelProps) => {

  // ✅ LOCAL STATE — gives instant UI feedback without waiting for parent re-render
  const [localImages, setLocalImages] = useState<ImageItem[]>(value.images ?? []);

  // ✅ Sync from parent only when parent pushes a genuinely different array
  // (e.g. on initial load from backend). Does NOT overwrite local edits mid-session.
  useEffect(() => {
    setLocalImages(value.images ?? []);
  }, [value.images]);

  // ✅ Single helper — updates local state immediately AND syncs up to parent
  const updateImages = (newImages: ImageItem[]) => {
    setLocalImages(newImages);
    onChange({ ...value, images: newImages });
  };

  // For non-image fields (heading, showHeading, collageLayout)
  const update = (patch: Partial<PhotographicEvidence>) =>
    onChange({ ...value, images: localImages, ...patch });

  // ✅ REPLACE handleAddImage with this:
  const handleAddImage = (image: any) => {
    const imageUrl = image.url || image.croppedDataUrl || image.secure_url || '';
    if (!imageUrl) {
      console.error('❌ No valid image URL received:', image);
      return;
    }

    // Auto-detect orientation from actual image dimensions
    const img = new Image();
    img.onload = () => {
      const orientation: 'portrait' | 'landscape' =
        img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape';

      updateImages([
        ...localImages,
        {
          url: imageUrl,
          reason: '',
          orientation,
        },
      ]);
    };
    img.onerror = () => {
      // Fallback if image fails to load
      updateImages([
        ...localImages,
        { url: imageUrl, reason: '', orientation: 'landscape' },
      ]);
    };
    img.src = imageUrl;
  };

  const handleReasonChange = (idx: number, reason: string) =>
    updateImages(localImages.map((img, i) => (i === idx ? { ...img, reason } : img)));

  const handleRemoveImage = (idx: number) =>
    updateImages(localImages.filter((_, i) => i !== idx));

  const imageCount = localImages.length;

  const availableLayouts = COLLAGE_OPTIONS.filter(
    (o) => imageCount >= o.minImages && imageCount <= o.maxImages
  );

  const selectedLayout = (value as any).collageLayout || 'auto';

  return (
    <div className="border-2 border-blue-300 rounded-xl bg-white shadow-sm overflow-hidden">

      {/* ── Panel Header ── */}
      <div className="bg-blue-600 px-5 py-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base">Photographic Evidence</h3>
          <p className="text-blue-100 text-xs mt-0.5">
            Appears as a dedicated section at the end of the report — after all content sections
          </p>
        </div>
        {imageCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {imageCount} image{imageCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">

        {/* ── Custom Heading Toggle ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-700">Custom Section Heading</span>
              <p className="text-xs text-gray-400 mt-0.5">
                Override default heading "Photographic Evidence"
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value.showHeading}
              onClick={() => update({ showHeading: !value.showHeading })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${value.showHeading ? 'bg-blue-500' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${value.showHeading ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
              <span
                className={`absolute text-[9px] font-bold ${value.showHeading ? 'left-1.5 text-white' : 'right-1.5 text-gray-400'
                  }`}
              >
                {value.showHeading ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {value.showHeading && (
            <input
              type="text"
              value={value.heading}
              onChange={(e) => update({ heading: e.target.value })}
              placeholder="e.g. Crime Scene Photographs"
              className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          )}
        </div>

        {/* ── Images ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Images</label>
            {imageCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                {imageCount}
              </span>
            )}
          </div>
          <>
            {/* Edit list — always shows all images with controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localImages.map((img, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <div className="relative bg-gray-100 flex justify-center items-center min-h-[140px]">
                    <img
                      src={img.url}
                      alt={img.reason || `Image ${idx + 1}`}
                      className="max-h-[180px] object-contain"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      #{idx + 1} · {img.orientation}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-2 bg-white border-t border-gray-100">
                    <input
                      type="text"
                      value={img.reason}
                      onChange={(e) => handleReasonChange(idx, e.target.value)}
                      placeholder="Caption (shows below image in report)"
                      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-2 pb-2">
                    <span className="text-xs text-gray-400">Orientation:</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateImages(
                          localImages.map((item, i) =>
                            i === idx
                              ? {
                                ...item,
                                orientation:
                                  item.orientation === 'portrait' ? 'landscape' : 'portrait',
                              }
                              : item
                          )
                        )
                      }
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border transition-colors ${img.orientation === 'portrait'
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : 'bg-orange-100 text-orange-700 border-orange-300'
                        }`}
                    >
                      {img.orientation === 'portrait' ? '↕ Portrait' : '↔ Landscape'}
                    </button>
                    <span className="text-xs text-gray-400">(click to toggle)</span>
                  </div>
                </div>

              ))}
            </div>

            {/* Live smart layout preview */}
            {localImages.length > 0 && (
              <div className="border border-blue-100 rounded-xl bg-blue-50/50 p-4 mt-2">
                <p className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">
                  Report Layout Preview
                </p>
                <SmartImageGrid images={localImages} showCaptions mode="preview" />
              </div>
            )}
          </>

          {/* Upload trigger */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors bg-white">
            <ImageUploadWithCrop
              caseId={caseId}
              label={imageCount > 0 ? '+ Add Another Image' : '+ Upload First Image'}
              onImageCropped={handleAddImage}
            />
          </div>

          {imageCount === 0 && (
            <p className="text-xs text-gray-400 text-center pb-1">
              No images yet. Click above to upload.
            </p>
          )}
        </div>

        {/* ── Collage Layout Picker (shown only when images exist) ── */}
        {imageCount > 0 && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Report Layout</span>
              <span className="text-xs text-gray-400">
                (how images appear in the report)
              </span>
            </div>

            {availableLayouts.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No collage templates match {imageCount} image{imageCount !== 1 ? 's' : ''}.
                Using auto-layout.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableLayouts.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    // ✅ Pass localImages so layout change never wipes uploaded images
                    onClick={() =>
                      onChange({
                        ...value,
                        images: localImages,
                        collageLayout: opt.id,
                      } as any)
                    }
                    className={`px-3 py-2.5 rounded-lg border-2 text-xs font-medium text-left transition-all ${selectedLayout === opt.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                  >
                    <CollagePreviewIcon layout={opt.id} />
                    <span className="mt-1 block">{opt.label}</span>
                    {selectedLayout === opt.id && (
                      <span className="text-[10px] text-blue-500 font-semibold">
                        ✓ Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// ── Small SVG preview icon per layout ─────────────────────────────────────
const CollagePreviewIcon = ({ layout }: { layout: CollageLayout }) => {
  const base = 'fill-current opacity-80';
  const icons: Record<CollageLayout, React.ReactElement> = {
    '1-full': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="36" height="24" rx="2" className={base} />
      </svg>
    ),
    '2-side': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="17" height="24" rx="2" className={base} />
        <rect x="21" y="2" width="17" height="24" rx="2" className={base} />
      </svg>
    ),
    '3-row': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="10" height="24" rx="2" className={base} />
        <rect x="15" y="2" width="10" height="24" rx="2" className={base} />
        <rect x="28" y="2" width="10" height="24" rx="2" className={base} />
      </svg>
    ),
    '2+1': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="21" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="8" y="15" width="24" height="11" rx="2" className={base} />
      </svg>
    ),
    '1+2': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="8" y="2" width="24" height="11" rx="2" className={base} />
        <rect x="2" y="15" width="17" height="11" rx="2" className={base} />
        <rect x="21" y="15" width="17" height="11" rx="2" className={base} />
      </svg>
    ),
    '2x2': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="21" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="2" y="15" width="17" height="11" rx="2" className={base} />
        <rect x="21" y="15" width="17" height="11" rx="2" className={base} />
      </svg>
    ),
    '2+3': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="21" y="2" width="17" height="11" rx="2" className={base} />
        <rect x="2" y="15" width="10" height="11" rx="2" className={base} />
        <rect x="15" y="15" width="10" height="11" rx="2" className={base} />
        <rect x="28" y="15" width="10" height="11" rx="2" className={base} />
      </svg>
    ),
    '3x2': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="10" height="11" rx="2" className={base} />
        <rect x="15" y="2" width="10" height="11" rx="2" className={base} />
        <rect x="28" y="2" width="10" height="11" rx="2" className={base} />
        <rect x="2" y="15" width="10" height="11" rx="2" className={base} />
        <rect x="15" y="15" width="10" height="11" rx="2" className={base} />
        <rect x="28" y="15" width="10" height="11" rx="2" className={base} />
      </svg>
    ),
    'auto': (
      <svg width="40" height="28" viewBox="0 0 40 28" className="text-current">
        <rect x="2" y="2" width="36" height="11" rx="2" className={`${base} opacity-30`} />
        <text x="20" y="11" textAnchor="middle" fontSize="7" className="fill-current font-bold">
          AUTO
        </text>
        <rect x="2" y="15" width="17" height="11" rx="2" className={`${base} opacity-60`} />
        <rect x="21" y="15" width="17" height="11" rx="2" className={`${base} opacity-60`} />
      </svg>
    ),
  };
  return icons[layout] ?? icons['auto'];
};

export default PhotographicEvidencePanel;
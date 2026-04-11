import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Crop } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const CONTAINER_W = 600;
const CONTAINER_H = 380;

type AspectRatio = '4:3-portrait' | '16:9-landscape';

interface CropSize { w: number; h: number }

const CROP_SIZES: Record<AspectRatio, CropSize> = {
  '4:3-portrait': { w: 225, h: 300 },  // 3:4 portrait
  '16:9-landscape': { w: 480, h: 270 },  // 16:9 landscape
};
type PhotoOrientation = 'portrait' | 'landscape';

interface Props {
  file: File | null;
  onConfirm(result: {
    croppedDataUrl: string;
    orientation: PhotoOrientation;
  }): void;
  onCancel(): void;
}
const ImageCropModal: React.FC<Props> = ({ file, onConfirm, onCancel }) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9-landscape');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Native Image element for canvas drawing
  const nativeImg = useRef(new Image());

  // ── Load image from file ────────────────────────────────────────────────────
  useEffect(() => {
    if (!file) return;
    setImgLoaded(false);
    setOffset({ x: 0, y: 0 });

    const url = URL.createObjectURL(file);
    const img = nativeImg.current;

    img.onload = () => {
      const crop = CROP_SIZES[aspectRatio];
      const fit = Math.max(crop.w / img.naturalWidth, crop.h / img.naturalHeight);
      setZoom(Math.max(fit, 0.3));
      setImgLoaded(true);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);                              // do NOT add aspectRatio here — only on file change

  // ── Auto fit when aspect ratio changes ─────────────────────────────────────
  useEffect(() => {
    if (!imgLoaded) return;
    const img = nativeImg.current;
    const crop = CROP_SIZES[aspectRatio];
    const fit = Math.max(crop.w / img.naturalWidth, crop.h / img.naturalHeight);
    setZoom(Math.max(fit, 0.3));
    setOffset({ x: 0, y: 0 });
  }, [aspectRatio]);

  // ── Mouse drag (pan) ────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => setIsDragging(false);

  // ── Touch drag (mobile) ─────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  // ── Scroll to zoom ──────────────────────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom(z => Math.min(Math.max(z + delta, 0.1), 5));
  };

  // ── Zoom controls ───────────────────────────────────────────────────────────
  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 5));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.1));
  const resetView = () => {
    const img = nativeImg.current;
    const crop = CROP_SIZES[aspectRatio];
    const fit = Math.max(crop.w / img.naturalWidth, crop.h / img.naturalHeight);
    setZoom(Math.max(fit, 0.3));
    setOffset({ x: 0, y: 0 });
  };

  // ── Crop & confirm ──────────────────────────────────────────────────────────
  const handleCrop = () => {
    const img = nativeImg.current;
    const crop = CROP_SIZES[aspectRatio];

    // 2× output resolution for crispness
    const OUT_SCALE = 2;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w * OUT_SCALE;
    canvas.height = crop.h * OUT_SCALE;
    const ctx = canvas.getContext('2d')!;

    // Image display dimensions inside the container
    const displayW = zoom * img.naturalWidth;
    const displayH = zoom * img.naturalHeight;

    // Top-left of rendered image in container coords
    const imgX = CONTAINER_W / 2 + offset.x - displayW / 2;
    const imgY = CONTAINER_H / 2 + offset.y - displayH / 2;

    // Top-left of crop box in container coords
    const boxX = (CONTAINER_W - crop.w) / 2;
    const boxY = (CONTAINER_H - crop.h) / 2;

    // Map crop box → source image pixels
    const srcX = (boxX - imgX) / zoom;
    const srcY = (boxY - imgY) / zoom;
    const srcW = crop.w / zoom;
    const srcH = crop.h / zoom;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
    onConfirm({
      croppedDataUrl: canvas.toDataURL('image/jpeg', 0.92),
      orientation: aspectRatio === '4:3-portrait' ? 'portrait' : 'landscape',
    });
  };

  if (!file) return null;

  // ── Derived layout values ───────────────────────────────────────────────────
  const crop = CROP_SIZES[aspectRatio];
  const cropLeft = (CONTAINER_W - crop.w) / 2;
  const cropTop = (CONTAINER_H - crop.h) / 2;
  const displayW = imgLoaded ? zoom * nativeImg.current.naturalWidth : 0;
  const displayH = imgLoaded ? zoom * nativeImg.current.naturalHeight : 0;
  const imgLeft = CONTAINER_W / 2 + offset.x - displayW / 2;
  const imgTop = CONTAINER_H / 2 + offset.y - displayH / 2;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: CONTAINER_W + 48 }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Crop className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Crop Image</h3>
              <p className="text-xs text-gray-500">
                Select ratio → drag to reposition → scroll or slider to zoom
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Aspect Ratio Selector ──────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Crop Ratio:
          </span>
          <div className="flex gap-2">
            {([
              { key: '4:3-portrait' as AspectRatio, label: '4:3 Portrait', iconW: 9, iconH: 12 },
              { key: '16:9-landscape' as AspectRatio, label: '16:9 Landscape', iconW: 16, iconH: 9 },
            ]).map(r => (
              <button
                key={r.key}
                onClick={() => setAspectRatio(r.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${aspectRatio === r.key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'text-gray-600 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
              >
                <span
                  className={`inline-block border-2 rounded-sm flex-shrink-0 ${aspectRatio === r.key ? 'border-white' : 'border-current'
                    }`}
                  style={{ width: r.iconW, height: r.iconH }}
                />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Crop Canvas ────────────────────────────────────────────────────── */}
        <div
          style={{
            width: CONTAINER_W,
            height: CONTAINER_H,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            background: '#1a1a2e',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
          onWheel={handleWheel}
        >
          {/* Rendered image (panned & zoomed) */}
          {imgLoaded && (
            <img
              src={nativeImg.current.src}
              alt="crop"
              draggable={false}
              style={{
                position: 'absolute',
                left: imgLeft,
                top: imgTop,
                width: displayW,
                height: displayH,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Dark overlays outside crop box (4 sides) */}
          <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: cropTop }} />
          <div className="absolute bg-black/60" style={{ top: cropTop + crop.h, left: 0, right: 0, bottom: 0 }} />
          <div className="absolute bg-black/60" style={{ top: cropTop, left: 0, width: cropLeft, height: crop.h }} />
          <div className="absolute bg-black/60" style={{ top: cropTop, left: cropLeft + crop.w, right: 0, height: crop.h }} />

          {/* Crop box outline + rule-of-thirds grid */}
          <div
            style={{
              position: 'absolute',
              top: cropTop,
              left: cropLeft,
              width: crop.w,
              height: crop.h,
              border: '2px solid rgba(255,255,255,0.9)',
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }}
          >
            {/* Rule-of-thirds lines */}
            {[1, 2].map(i => (
              <React.Fragment key={i}>
                <div style={{ position: 'absolute', left: `${(i / 3) * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.35)' }} />
                <div style={{ position: 'absolute', top: `${(i / 3) * 100}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.35)' }} />
              </React.Fragment>
            ))}
            {/* Corner handles */}
            {[
              { top: -2, left: -2 }, { top: -2, right: -2 },
              { bottom: -2, left: -2 }, { bottom: -2, right: -2 },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 12, height: 12, background: 'white', borderRadius: 1, ...s }} />
            ))}
          </div>

          {/* Loading indicator */}
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/70 text-sm">Loading image…</p>
            </div>
          )}
        </div>

        {/* ── Zoom Controls ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50">
          <button onClick={zoomOut} title="Zoom Out"
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors">
            <ZoomOut className="w-4 h-4 text-gray-700" />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <input
              type="range" min={10} max={500}
              value={Math.round(zoom * 100)}
              onChange={e => setZoom(Number(e.target.value) / 100)}
              className="flex-1 h-2 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs text-gray-500 font-mono w-11 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <button onClick={zoomIn} title="Zoom In"
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors">
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>

          <button onClick={resetView} title="Reset view"
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors">
            <RotateCcw className="w-4 h-4 text-gray-700" />
          </button>

          <span className="text-xs text-gray-400 pl-2 hidden sm:block">
            Drag to pan · Scroll to zoom
          </span>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            Adjust the image within the crop frame, then confirm.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={!imgLoaded}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Crop className="w-4 h-4" />
              Crop &amp; Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

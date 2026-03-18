import React, { useEffect, useRef, useState } from 'react';
import {
  X, Upload, Trash2, Loader2, ImageIcon,
  Building2, Stamp, PenLine, CheckCircle,
} from 'lucide-react';
import { loaAssetsApi } from '../../../services/api/loaAssetsApi';
import type { LoaAssetsResponse } from '../../../types/loaAssets.types';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Called after any successful upload/delete so PDF preview can reload */
  onAssetsChanged: () => void;
}

type AssetKey = 'logo' | 'stamp' | 'signature';

interface Section {
  key:         AssetKey;
  icon:        React.ElementType;
  label:       string;
  description: string;
  acceptHint:  string;
}

const SECTIONS: Section[] = [
  {
    key:         'logo',
    icon:        Building2,
    label:       'Company Logo',
    description: 'Appears top-left of the authority letter',
    acceptHint:  'PNG, JPG up to 5MB',
  },
  {
    key:         'signature',
    icon:        PenLine,
    label:       'Signature',
    description: 'Appears bottom-left above CEO name',
    acceptHint:  'PNG, JPG up to 5MB (transparent background recommended)',
  },
  {
    key:         'stamp',
    icon:        Stamp,
    label:       'Company Stamp',
    description: 'Appears bottom-right of the authority letter',
    acceptHint:  'PNG, JPG up to 5MB',
  },
];

const LoaStampsModal: React.FC<Props> = ({ isOpen, onClose, onAssetsChanged }) => {
  const [assets, setAssets]         = useState<LoaAssetsResponse>({ id: null, logoUrl: null, stampUrl: null, signatureUrl: null });
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [uploading, setUploading]   = useState<AssetKey | null>(null);
  const [deleting, setDeleting]     = useState<AssetKey | null>(null);

  // One ref per section for hidden file inputs
  const fileInputRefs = {
    logo:      useRef<HTMLInputElement>(null),
    stamp:     useRef<HTMLInputElement>(null),
    signature: useRef<HTMLInputElement>(null),
  };

  // Fetch current assets whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoadingFetch(true);
    loaAssetsApi.getAssets()
      .then(data => setAssets(data))
      .catch(() => toast.error('Failed to load current assets.'))
      .finally(() => setLoadingFetch(false));
  }, [isOpen]);

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleFileChange = async (key: AssetKey, file: File | null) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setUploading(key);
    try {
      let updated: LoaAssetsResponse;
      if (key === 'logo')      updated = await loaAssetsApi.uploadLogo(file);
      else if (key === 'stamp')  updated = await loaAssetsApi.uploadStamp(file);
      else                       updated = await loaAssetsApi.uploadSignature(file);

      setAssets(updated);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} uploaded successfully.`);
      onAssetsChanged();
    } catch {
      toast.error(`Failed to upload ${key}.`);
    } finally {
      setUploading(null);
      // Reset file input
      const ref = fileInputRefs[key];
      if (ref.current) ref.current.value = '';
    }
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async (key: AssetKey) => {
    if (!window.confirm(`Remove the ${key}? The PDF will no longer include it.`)) return;

    setDeleting(key);
    try {
      let updated: LoaAssetsResponse;
      if (key === 'logo')      updated = await loaAssetsApi.deleteLogo();
      else if (key === 'stamp')  updated = await loaAssetsApi.deleteStamp();
      else                       updated = await loaAssetsApi.deleteSignature();

      setAssets(updated);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} removed.`);
      onAssetsChanged();
    } catch {
      toast.error(`Failed to remove ${key}.`);
    } finally {
      setDeleting(null);
    }
  };

  // ── Get current URL by key ─────────────────────────────────────────────────
  const getUrl = (key: AssetKey): string | null => {
    if (key === 'logo')      return assets.logoUrl;
    if (key === 'stamp')     return assets.stampUrl;
    if (key === 'signature') return assets.signatureUrl;
    return null;
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a2235 0%, #1e2d40 60%, #16202e 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/20 border border-blue-400/30 rounded-lg flex items-center justify-center">
              <Stamp className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Stamps & Signature</h2>
              <p className="text-blue-300/60 text-xs mt-0.5">
                Manage company assets embedded in the Authority Letter PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {loadingFetch ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-500">Loading assets...</span>
            </div>
          ) : (
            SECTIONS.map(section => {
              const currentUrl = getUrl(section.key);
              const isUploading = uploading === section.key;
              const isDeleting  = deleting  === section.key;
              const Icon = section.icon;

              return (
                <div
                  key={section.key}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{section.label}</p>
                      <p className="text-xs text-gray-500 truncate">{section.description}</p>
                    </div>
                    {currentUrl && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex-shrink-0">
                        <CheckCircle className="w-3 h-3" />
                        Uploaded
                      </span>
                    )}
                  </div>

                  {/* Section body */}
                  <div className="p-5">
                    <div className="flex items-start gap-5">

                      {/* Preview box */}
                      <div
                        className={`flex-shrink-0 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
                          currentUrl
                            ? 'border-blue-300 bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                        style={{ width: 120, height: 100 }}
                      >
                        {currentUrl ? (
                          <img
                            src={currentUrl}
                            alt={section.label}
                            className="max-w-full max-h-full object-contain p-1"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                            <p className="text-[10px] text-gray-400 leading-tight">No image</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex-1 space-y-3">
                        <p className="text-xs text-gray-400">{section.acceptHint}</p>

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRefs[section.key]}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={e => handleFileChange(section.key, e.target.files?.[0] ?? null)}
                        />

                        {/* Upload / Update button */}
                        <button
                          onClick={() => fileInputRefs[section.key].current?.click()}
                          disabled={isUploading || isDeleting}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            currentUrl
                              ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isUploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                          ) : (
                            <><Upload className="w-4 h-4" />
                              {currentUrl ? `Update ${section.label}` : `Upload ${section.label}`}
                            </>
                          )}
                        </button>

                        {/* Remove button — only if image exists */}
                        {currentUrl && (
                          <button
                            onClick={() => handleDelete(section.key)}
                            disabled={isUploading || isDeleting}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Removing...</>
                            ) : (
                              <><Trash2 className="w-4 h-4" /> Remove</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <p className="text-xs text-gray-400">
            Changes apply to all future PDF previews and exports
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoaStampsModal;

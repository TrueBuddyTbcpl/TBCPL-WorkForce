import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import ImageCropModal from './ImageCropModal';
import { reportImageApi } from '../../../services/api/reportImageApi';
import { toast } from 'sonner';

interface Props {
  caseId:         number | null;
  onImageCropped: (s3Url: string) => void;
  label?:         string;
  disabled?:      boolean;
}

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageUploadWithCrop: React.FC<Props> = ({
  caseId,
  onImageCropped,
  label    = 'Attach Image',
  disabled = false,
}) => {
  const fileInputRef                  = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading,   setUploading]   = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!ALLOWED.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB.');
      return;
    }
    setPendingFile(file);
  };

  const handleCropConfirm = async (croppedDataUrl: string) => {
    setPendingFile(null);

    // ✅ FIXED: never store base64 in state — caseId is always required
    if (!caseId) {
      toast.error('Cannot upload image: case is not saved yet.');
      return;
    }

    setUploading(true);
    try {
      const result = await reportImageApi.uploadCroppedImage(caseId, croppedDataUrl);
      onImageCropped(result.url); // ✅ only S3 URL stored in state, never base64
      toast.success('Image uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300
                   rounded-lg text-gray-600 text-sm hover:border-blue-400 hover:text-blue-600
                   hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          : <><ImageIcon className="w-4 h-4" /> {label}</>
        }
      </button>

      {pendingFile && (
        <ImageCropModal
          file={pendingFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </>
  );
};

export default ImageUploadWithCrop;

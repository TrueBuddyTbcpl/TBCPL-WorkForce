import apiClient from './apiClient';

export interface UploadedImageResult {
    url: string;
    publicId: string;
    fileName: string;
}

export const reportImageApi = {

    uploadCroppedImage: async (
        caseId: number,
        dataUrl: string,
        index: number = 0,
    ): Promise<UploadedImageResult> => {

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `section-image-${Date.now()}-${index}.jpg`, {
            type: 'image/jpeg',
        });

        const form = new FormData();
        form.append('files', file);

        const response = await apiClient.post(
            `/operation/finalreport/${caseId}/images`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        const data = response.data.data; // ApiResponse<ImageUploadResponse>
        console.log('RAW BACKEND RESPONSE:', JSON.stringify(data));

        // ✅ FIX: backend returns `images[]`, not `urls[]`
        const uploaded: Array<{
            index: number;
            originalName: string;
            url: string;
            publicId: string;
            success: boolean;
            error: string;
        }> = data?.images ?? [];

        const first = uploaded[index] ?? uploaded[0];
        console.log('FIRST IMAGE:', first);         // ← and this
        console.log('URL:', first?.url);

        // ✅ Throw early if backend reported failure — never fall back to base64
        if (!first || !first.success) {
            throw new Error(first?.error ?? 'Image upload failed on server');
        }

        return {
            url: first.url,
            publicId: first.publicId ?? '',
            fileName: first.originalName ?? '',
        };
    },

};

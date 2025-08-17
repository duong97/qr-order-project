import config from "@/config";
export interface UploadResult {
    success: boolean;
    error?: string;
    fileId?: string;
    fileName?: string;
    fileUrl?: string;
}

export class UploadImageApi {

    /**
     *
     * @param fileContent
     * @param fileName
     * @param fileType
     * @return string {success: true, fileId: string, fileName: string, fileUrl: string}
     * @return string {success: false, error: string}
     */
    async upload(fileContent: string, fileName: string, fileType: string): Promise<UploadResult>
    {
        const formData = new FormData();
        formData.append('file', fileContent);
        formData.append('fileName', fileName);
        formData.append('fileType', fileType);
        return await fetch(config.uploadImageUrl, {
            method: 'POST',
            body: formData
        }).then((r) => r.json()).then(e => e);
    }
}
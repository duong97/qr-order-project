export class StringHelper {
    /**
     * Get random string
     * @param length
     */
    public static generateRandomString(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Get file extension from file name
     * @param fileName
     */
    public static getFileExtension(fileName: string) {
        const dotIndex = fileName.lastIndexOf('.');
        return dotIndex === -1 ? '' : fileName.slice(dotIndex);
    }

    public static getProductThumbName(productId: string) {
        const prefix = 'product_';
        return btoa(prefix + productId);
    }

    public static convertDriveLinkToDirectImageUrl(driveLink: string, width: number|string = 100): string {
        if (!driveLink) {
            return '/images/bread.jpeg';
        }
        if (!driveLink.startsWith('https://drive.google.com/')) {
            return driveLink;
        }

        // Regular expression to extract the file ID from the Google Drive link
        const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch) {
            return driveLink;
        }

        const fileId = fileIdMatch[1];
        // Construct the direct image URL using the extracted file ID
        return `https://lh3.googleusercontent.com/d/${fileId}=w${width}?authuser=0`;
    }
}
import {NextFunction, Request, Response} from 'express'
import {SignatureError} from './errorHandler'
import {aesDecrypt} from "@/utils/aes";

export const checkSignature = async (req: Request, res: Response, next: NextFunction) => {
    // Bỏ qua check request nếu truyền header này
    const isAdminRequest = (req.headers['imyourdaddy'] || '') as string;
    if (isAdminRequest) {
        return next();
    }

    // Lấy signature từ request
    const signature = (req.headers['qrt-signature'] || '') as string;
    if (!signature) {
        return next(new SignatureError("Invalid request: missing signature!"));
    }

    // Lấy secret để compare từ env
    const secret = process.env.API_SECRET_KEY;
    if (!secret) {
        return next();
    }

    // Compare secret key
    const decoded = await aesDecrypt(signature);
    const clientTime = Number(decoded.substring(0, 13));
    const keyDecoded = decoded.substring(13);

    // Check time of signature
    const diff = Math.abs(Date.now() - clientTime);
    const FIVE_MINUTES = 2 * 60 * 1000; // 2 phút
    const isRequestWithinValidTime = diff <= FIVE_MINUTES;

    if (!isRequestWithinValidTime || secret !== keyDecoded) {
        return next(new SignatureError("Invalid request: wrong signature!"));
    }
    return next();
}

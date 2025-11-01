import JSZip from "jszip";
import QRCode from "qrcode";
import { saveAs } from "file-saver";
import QrData from "@/interface/QrData";

export class QrCodeHelper {
    /**
     * Hàm chính: tự động chọn giữa tải 1 hoặc nhiều QR
     */
    public static async download(items: QrData[], saveAsFileName: string, progress?: { value: number }) {
        if (!items?.length) return;

        if (items.length === 1) {
            await this.downloadSingle(items[0], saveAsFileName);
        } else {
            await this.downloadBatch(items, saveAsFileName, progress);
        }
    }

    /**
     * Tải 1 QR code duy nhất → trực tiếp file PNG
     */
    private static async downloadSingle(item: QrData, saveAsFileName: string) {
        try {
            // @todo later: đưa vào config
            const dataUrl = await QRCode.toDataURL(item.content.toString(), {
                width: 400,
                margin: 2,
            });

            const res = await fetch(dataUrl);
            const blob = await res.blob();

            const safeName = this.makeSafeFileName(saveAsFileName || item.label || "qr");
            saveAs(blob, `${safeName}.png`);
        } catch (err) {
            console.error("Lỗi tải single QR:", err);
        }
    }

    /**
     * Tải nhiều QR code → gom ZIP, có thể chunk để tránh nghẽn bộ nhớ
     */
    private static async downloadBatch(items: QrData[], saveAsFileName: string, progress?: { value: number }) {
        const zip = new JSZip();
        // @todo later: đưa vào config
        const CHUNK_SIZE = 20; // xử lý 20 QR mỗi lần (tùy chỉnh theo hiệu năng)
        const total = items.length;

        for (let i = 0; i < total; i += CHUNK_SIZE) {
            const chunk = items.slice(i, i + CHUNK_SIZE);

            await Promise.all(
                chunk.map(async (item, idx) => {
                    const index = i + idx + 1;
                    const qrFileName = `${index}. QR ${this.makeSafeFileName(item.label || "QR")}.png`;

                    try {
                        const dataUrl = await QRCode.toDataURL(item.content.toString(), {
                            width: 400,
                            margin: 2,
                        });

                        const base64Data = dataUrl.split(",")[1];
                        zip.file(qrFileName, base64Data, { base64: true });

                        if (progress) {
                            progress.value = Math.round((index / total) * 100);
                        }
                    } catch (err) {
                        console.error(`Lỗi download batch QR [${qrFileName}]:`, err);
                    }
                })
            );
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const safeName = this.makeSafeFileName(saveAsFileName);

        // Reset về -1 để ẩn progress
        if (progress) {
            progress.value = -1;
        }
        saveAs(blob, `${safeName}.zip`);
    }

    /**
     * Làm sạch tên file: loại bỏ ký tự đặc biệt, giới hạn độ dài
     */
    private static makeSafeFileName(name: string): string {
        return name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu tiếng Việt
            .replace(/[^a-zA-Z0-9-_ ]/g, "") // chỉ giữ lại ký tự an toàn
            .trim()
            .replace(/\s+/g, "_") // thay khoảng trắng bằng "_"
            .substring(0, 100); // giới hạn tối đa 100 ký tự
    }
}

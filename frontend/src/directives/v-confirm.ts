import { showConfirmDialog } from "vant";

export default {
    mounted(el: HTMLElement, binding: any) {
        const message = binding.value;

        const handler = async (event: MouseEvent) => {
            // Nếu là fake event do chính v-confirm này tạo → bỏ qua
            if ((event as any).__fromConfirm__) return;

            // Chặn call event gốc (click)
            event.stopImmediatePropagation();
            event.preventDefault();

            try {
                // Show popup xác nhận
                await showConfirmDialog({
                    title: "Xác nhận",
                    message,
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Bỏ qua",
                });

                // Người dùng đồng ý → call lại event click
                const newEvent = new MouseEvent("click", { bubbles: true });
                (newEvent as any).__fromConfirm__ = true; // đánh dấu fake event gọi từ v-confirm
                el.dispatchEvent(newEvent);
            } catch {
                // Người dùng bấm Hủy → không làm gì
            }
        };

        // Gắn handler ở capture phase để chạy trước Vue @click
        el.addEventListener("click", handler, true);
        (el as any).__confirmHandler__ = handler;
    },

    unmounted(el: HTMLElement) {
        el.removeEventListener("click", (el as any).__confirmHandler__, true);
    },
};

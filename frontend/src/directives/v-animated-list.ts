import type { DirectiveBinding } from "vue";

interface AnimateOptions {
    name?: string;
    duration?: number;
    easing?: string;
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const opts: AnimateOptions =
            typeof binding.value === "object"
                ? binding.value
                : { name: binding.value as string };
        const name = opts.name || "fade";
        const duration = opts.duration || 300;
        const easing = opts.easing || "ease";

        // Apply base class
        el.classList.add("v-animate-list-container");

        // Observer để phát hiện khi thêm hoặc xóa node con
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Khi có node mới được thêm
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        node.classList.add(`${name}-enter-from`);
                        node.style.transition = `all ${duration}ms ${easing}`;
                        requestAnimationFrame(() => {
                            node.classList.add(`${name}-enter-active`);
                            node.classList.remove(`${name}-enter-from`);
                            setTimeout(() => {
                                node.classList.remove(`${name}-enter-active`);
                                node.style.transition = "";
                            }, duration);
                        });
                    }
                });

                // Khi có node bị xóa
                mutation.removedNodes.forEach((node) => {
                    if (node instanceof HTMLElement && !el.contains(node)) {
                        node.classList.add(`${name}-leave-active`);
                        node.style.transition = `all ${duration}ms ${easing}`;
                        setTimeout(() => {
                            node.remove();
                        }, duration);
                    }
                });
            }
        });

        observer.observe(el, { childList: true });
        (el as any).__animateObserver__ = observer;
    },

    unmounted(el: HTMLElement) {
        (el as any).__animateObserver__?.disconnect();
    },
};

import { onMounted, onUnmounted } from 'vue';

function useEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    onMountedExecuteOnce: boolean = false,
    target: HTMLElement | Window = window,
    optionsAdd?: boolean | AddEventListenerOptions,
    optionsRemove?: boolean | EventListenerOptions,
) {
    onMounted(() => {
        if (onMountedExecuteOnce && typeof listener === 'function') {
            const fc = listener as Function;
            fc();
        }
        target.addEventListener(type, listener, optionsAdd);
    });
    onUnmounted(() => {
        target.removeEventListener(type, listener, optionsRemove);
    });
}

export default useEventListener;

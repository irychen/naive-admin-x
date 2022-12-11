import { Ref, ComputedRef, onBeforeMount, watch } from 'vue';
import { UNIQUE_APP_PREFIX_KEY } from '@/config';

export function useLocalStorage<T>(key: string, ref: Ref<T>) {
    const storageKey = UNIQUE_APP_PREFIX_KEY + key;
    watch(
        () => ref.value,
        v => {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify({
                    value: v,
                }),
            );
        },
        {
            deep: true,
        },
    );
    onBeforeMount(() => {
        const dataStr = window.localStorage.getItem(storageKey);
        if (dataStr) {
            const { value: v } = JSON.parse(dataStr);
            ref.value = v;
        }
    });
}

import { Ref, ComputedRef, onBeforeMount, watch } from 'vue';

export function useLocalStorage<T>(key: string, ref: Ref<T>) {
    watch(
        () => ref.value,
        v => {
            window.localStorage.setItem(
                key,
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
        const dataStr = window.localStorage.getItem(key);
        if (dataStr) {
            const { value: v } = JSON.parse(dataStr);
            ref.value = v;
        }
    });
}

import { useThemeStore } from '@/store/themeStore';
import { ref, toRefs } from 'vue';
import useEventListener from '@/hooks/base/useEventListener';

function useAutoSetMenuCollapse() {
    const historyWidth = ref(window.innerWidth);
    const themeStore = useThemeStore();
    const { menuCollapsed } = toRefs(themeStore);

    function autoSetMenuCollapse() {
        const { innerWidth } = window;
        if (!menuCollapsed.value) {
            if (innerWidth < 768 && historyWidth.value >= innerWidth) {
                themeStore.toggleMenuCollapse();
            }
        }
        historyWidth.value = innerWidth;
    }

    useEventListener('resize', autoSetMenuCollapse, true);
}

export default useAutoSetMenuCollapse;

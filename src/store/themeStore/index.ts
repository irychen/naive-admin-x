import { darkTheme, GlobalThemeOverrides } from 'naive-ui';
import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import Color from 'color';
import { useLocalStorage } from '@/hooks/base/useLocalStorage';

export const headerColorLight = '#fff';
// 将主题配置放在 store 中，方便在不同页面更改主题
export const useThemeStore = defineStore('theme', () => {
    const currentLightMenuColor = ref('#161717');
    const currentDarkMenuColor = ref('#222');
    const themeIsDark = ref(false);
    useLocalStorage('currentDarkMenuColor', currentDarkMenuColor);
    useLocalStorage('currentLightMenuColor', currentLightMenuColor);
    useLocalStorage('themeIsDark', themeIsDark);

    const theme = computed(() => {
        return themeIsDark.value ? darkTheme : null;
    });
    const toggle = (val: boolean) => !val;
    const menuCollapsed = ref(false);
    const toggleMenuCollapse = () => {
        menuCollapsed.value = toggle(menuCollapsed.value);
    };
    const menuColor = computed(() => (themeIsDark.value ? currentDarkMenuColor.value : currentLightMenuColor.value));

    const menuColorIsDark = computed(() => {
        return Color(menuColor.value).isDark();
    });
    const primaryColor = ref('#2367ad');
    useLocalStorage('primaryColor', primaryColor);

    const menuIsInverted = computed(() => {
        return menuColorIsDark.value && !themeIsDark.value;
    });

    const primaryColorIsDark = computed(() => {
        return Color(primaryColor.value).isDark();
    });

    const lightThemeOverrides = reactive<GlobalThemeOverrides>({
        common: {
            primaryColor: primaryColor.value,
            primaryColorHover: Color(primaryColor.value).darken(0.1).hex(),
            primaryColorPressed: Color(primaryColor.value).darken(0.2).hex(),
        },
        Switch: {
            railColorActive: primaryColor.value,
        },
    });
    const darkThemeOverrides = reactive<GlobalThemeOverrides>({
        common: {
            primaryColor: primaryColor.value,
            primaryColorHover: Color(primaryColor.value).darken(0.1).hex(),
            primaryColorPressed: Color(primaryColor.value).darken(0.2).hex(),
        },
        Switch: {
            railColorActive: primaryColor.value,
        },
        Drawer: {
            color: '#181818',
        },
        Card:{
            color: '#333',
        }
    });

    watch(
        () => primaryColor.value,
        val => {
            lightThemeOverrides.common = {
                primaryColor: val,
                primaryColorHover: Color(val).darken(0.1).hex(),
                primaryColorPressed: Color(val).darken(0.2).hex(),
            };
            lightThemeOverrides.Switch = {
                railColorActive: val,
            };
            darkThemeOverrides.common = {
                primaryColor: val,
                primaryColorHover: Color(val).darken(0.1).hex(),
                primaryColorPressed: Color(val).darken(0.2).hex(),
            };
            darkThemeOverrides.Switch = {
                railColorActive: val,
            };
        },
    );

    const themeOverrides = computed(() => {
        return themeIsDark.value ? darkThemeOverrides : lightThemeOverrides;
    });

    return {
        currentLightMenuColor,
        currentDarkMenuColor,
        themeOverrides,
        themeIsDark,
        theme,
        menuCollapsed,
        menuIsInverted,
        primaryColorIsDark,
        toggleMenuCollapse,
        menuColorIsDark,
        primaryColor,
        menuColor,
    };
});

<script setup lang="ts">
import { NConfigProvider, NThemeEditor } from 'naive-ui';
import { toRefs } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import useAutoSetMenuCollapse from '@/hooks/advanced/useAutoSetMenuCollapse';

const themeStore = useThemeStore();
const { themeOverrides, theme } = toRefs(themeStore);
useAutoSetMenuCollapse();
</script>

<template>
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
        <router-view />
    </n-config-provider>
</template>

<style scoped></style>

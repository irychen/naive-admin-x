<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import { toRefs } from 'vue';
import { useThemeStore } from './store/themeStore';

const themeStore = useThemeStore();
const { NThemeConfig } = toRefs(themeStore);
</script>

<template>
    <n-config-provider :theme-overrides="NThemeConfig">
        <router-view />
    </n-config-provider>
</template>

<style scoped></style>

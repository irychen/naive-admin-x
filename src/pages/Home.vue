<script setup lang="ts">
import {
    NButton,
    NDivider,
    NDrawer,
    NDrawerContent,
    NLayout,
    NMenu,
    NTabs,
    NTab,
    NColorPicker,
    NLayoutFooter,
    NSwitch,
    NLayoutSider,
    NLayoutContent,
    NLayoutHeader,
    MenuOption,
    NIcon,
} from 'naive-ui';
import { h, ref, watch, onBeforeMount, Transition } from 'vue';
import { SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { MENUS_LIST, LOGO_TEXT, LOGO_SHORT_TEXT } from '@/config';
import { toRefs } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import { darkThemeMenuColorList, lightThemeMenuColorList } from '@/store/themeStore/index.js';
import CheckBoxColor from '@/components/CheckBoxColor/index.vue';

const themeStore = useThemeStore();
const { toggleMenuCollapse } = themeStore;
const {
    primaryColorIsDark,
    currentLightMenuColor,
    menuIsInverted,
    containerColor,
    headerColor,
    menuCollapsed,
    themeIsDark,
    menuColorIsDark,
    menuColor,
    primaryColor,
    currentDarkMenuColor,
} = toRefs(themeStore);
const router = useRouter();
const menuOptions: MenuOption[] = MENUS_LIST;

const delayedMenuCollapsed = ref(menuCollapsed.value);
let timeId: number;
watch(
    () => menuCollapsed.value,
    value => {
        if (!value) {
            if (timeId) clearTimeout(timeId);
            timeId = setTimeout(() => {
                delayedMenuCollapsed.value = value;
            }, 200);
        } else {
            delayedMenuCollapsed.value = value;
        }
    },
);

const tabs = ref([
    {
        name: 'Home',
        path: '/home',
        closable: true,
    },
    {
        name: 'settings',
        path: '/settings',
        closable: true,
    },
]);

// 20种不同主题色
const themeColorList = ['#2995fa', '#1777FF', '#9251ea', '#eb2f96', '#fa541c', '#fa8c16', '#efab25', '#fadb14', '#45bd15', '#0ea22c', '#13c2c2'];

const isShowThemeSettingDrawer = ref(false);

function handleMenuNameChange(names: string[]) {}
</script>

<template>
    <div
        class="home w-full min-h-screen relative"
        :class="{
            dark: themeIsDark,
        }"
    >
        <n-drawer v-model:show="isShowThemeSettingDrawer" :width="302" placement="right">
            <n-drawer-content closable title="主题设置">
                <n-divider style="margin: 10px 0 16px 0" title-placement="center"> 主题</n-divider>
                <div class="flex justify-center">
                    <n-switch v-model:value="themeIsDark">
                        <template #checked> Dark</template>
                        <template #unchecked> Light</template>
                    </n-switch>
                </div>
                <n-divider style="margin: 18px 0 16px 0" title-placement="center"> 主题色</n-divider>
                <div class="color-blocks flex flex-wrap mb-[10px]">
                    <CheckBoxColor
                        v-for="color in themeColorList"
                        :key="color"
                        :color="color"
                        :active="color === primaryColor"
                        @click="primaryColor = color"
                    />
                </div>
                <n-color-picker v-model:value="primaryColor" />
                <div>
                    <n-divider style="margin: 18px 0 16px 0" title-placement="center">菜单栏颜色</n-divider>
                    <div class="color-blocks flex flex-wrap mb-[10px]" v-if="!themeIsDark">
                        <CheckBoxColor
                            v-for="color in lightThemeMenuColorList"
                            :key="color"
                            :color="color"
                            :active="color === menuColor"
                            @click="currentLightMenuColor = color"
                        />
                    </div>
                    <div class="color-blocks flex flex-wrap mb-[10px]" v-else>
                        <CheckBoxColor
                            v-for="color in darkThemeMenuColorList"
                            :key="color"
                            :color="color"
                            :active="color === menuColor"
                            @click="currentDarkMenuColor = color"
                        />
                    </div>
                </div>
            </n-drawer-content>
        </n-drawer>
        <div
            @click="isShowThemeSettingDrawer = true"
            class="w-[45px] h-[40px] shadow cursor-pointer flex justify-center items-center absolute"
            :style="{
                backgroundColor: primaryColor,
                top: '50%',
                right: 0,
                zIndex: 999,
                borderRadius: '8px 0px 0px 8px',
            }"
        >
            <n-icon size="20" :color="primaryColorIsDark ? '#fff' : '#000'">
                <SettingOutlined />
            </n-icon>
        </div>
        <n-layout style="height: 100%">
            <n-layout-header style="height: 50px" class="flex items-center bg-white">
                <div
                    class="flex justify-center flex-shrink-0 items-center h-full overflow-hidden"
                    :style="{
                        backgroundColor: menuColor,
                        width: menuCollapsed ? '64px' : '240px',
                        transition: 'width 0.3s var(--n-bezier),background-color 0.3s var(--n-bezier)',
                        whiteSpace: 'nowrap',
                    }"
                >
                    <div
                        class="text-[18px]"
                        :style="{
                            color: menuColorIsDark ? '#fff' : '#000',
                        }"
                    >
                        {{ delayedMenuCollapsed ? LOGO_SHORT_TEXT : LOGO_TEXT }}
                    </div>
                </div>
                <div
                    :style="{
                        backgroundColor: themeIsDark ? menuColor : headerColor,
                        transition: 'background-color 0.3s var(--n-bezier)',
                    }"
                    class="main-header flex justify-between w-full h-full shadow z-10"
                >
                    <div class="header-left-box">
                        <div @click="toggleMenuCollapse" class="menu-trigger px-[15px] flex h-full items-center cursor-pointer">
                            <n-icon size="20">
                                <MenuFoldOutlined v-if="!menuCollapsed" />
                                <MenuUnfoldOutlined v-else />
                            </n-icon>
                        </div>
                    </div>
                    <div class="header-right-box"></div>
                </div>
            </n-layout-header>
            <n-layout has-sider>
                <n-layout-sider
                    collapse-mode="width"
                    :collapsed-width="64"
                    :width="240"
                    :collapsed="menuCollapsed"
                    @collapse="toggleMenuCollapse"
                    @expand="toggleMenuCollapse"
                    show-trigger
                    :style="{
                        backgroundColor: menuColor,
                    }"
                >
                    <n-menu
                        :inverted="menuIsInverted"
                        @update:value="handleMenuNameChange"
                        :collapsed="menuCollapsed"
                        :collapsed-width="64"
                        :options="menuOptions"
                    />
                </n-layout-sider>
                <n-layout-content
                    :content-style="{
                        backgroundColor: containerColor,
                        transition: 'background-color 0.3s var(--n-bezier)',
                        height: 'calc( 100vh - 50px)',
                    }"
                >
                    <n-tabs type="card">
                        <n-tab v-for="tab in tabs" :key="tab.path" :name="tab.name" :closable="tab.closable" />
                    </n-tabs>
                    <router-view />
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<style lang="scss" scoped>
/* we will explain what these classes do next! */
.v-enter-active {
    transition: opacity 0.5s ease;
}

.v-leave-active {
    transition: opacity 0s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

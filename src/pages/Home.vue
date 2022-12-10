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
import { h, ref, watch, onBeforeMount, Transition, onMounted } from 'vue';
import { SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { MENUS_LIST, LOGO_TEXT, LOGO_SHORT_TEXT, MenuRoute } from '@/config';
import { toRefs } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import { darkThemeMenuColorList, lightThemeMenuColorList } from '@/store/themeStore/index.js';
import CheckBoxColor from '@/components/CheckBoxColor/index.vue';
import { useLocalStorage } from '@/hooks/base/useLocalStorage';

const pageTypeMap = new Map<string, string>([
    ['edit', '编辑'],
    ['add', '新增'],
    ['detail', '详情'],
]);
const themeStore = useThemeStore();
const { toggleMenuCollapse } = themeStore;
const menuSelectedKey = ref<string>('');
useLocalStorage('admin_x_menuSelectedKey', menuSelectedKey);
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
// absolutePath Menu Map
const absolutePathMenuMap = new Map<string, MenuRoute>();
const nameMenuMap = new Map<string, MenuRoute>();
const currentTabKey = ref<string>('');
useLocalStorage('admin_x_currentTabKey', currentTabKey);

// 遍历菜单列表，生成菜单路由映射表（name、absolutePath）
function traverseMenuOptions(menuOptions: MenuRoute[]) {
    menuOptions.forEach(menuOption => {
        if (menuOption.absolutePath) {
            absolutePathMenuMap.set(menuOption.absolutePath, menuOption);
        }
        if (menuOption.name) {
            nameMenuMap.set(menuOption.name, menuOption);
        }
        if (menuOption.children) {
            traverseMenuOptions(menuOption.children);
        }
    });
}

traverseMenuOptions(MENUS_LIST);
type tabItem = {
    key: string;
    name?: string;
    label?: string;
    title?: string;
    absolutePath?: string;
    closable?: boolean;
};
const tabs = ref<tabItem[]>([]);
useLocalStorage('admin_x_x_tabs', tabs);
// 根据路由 设置选中的菜单
onMounted(() => {
    const path = router.currentRoute.value.path;
    const query = router.currentRoute.value.query;
    const fullPath = router.currentRoute.value.fullPath;
    let target = absolutePathMenuMap.get(fullPath);
    let notMenuPage = false;
    if (!target) {
        notMenuPage = true;
    }
    target = target || absolutePathMenuMap.get(path);
    if (target && target.name && !target.children) {
        if (target.absolutePath === fullPath) {
            menuSelectedKey.value = target.name;
        } else {
            menuSelectedKey.value = '';
        }
        let tab = tabs.value.find(i => i.name === target?.name);
        if (notMenuPage) {
            tab = tabs.value.find(i => i.key === fullPath);
        }
        const { type } = query;
        const labelPrefix = pageTypeMap.get(type as string) || '';
        if (!tab) {
            tabs.value.push({
                label: labelPrefix + target.tabName,
                key: fullPath,
                name: target.name,
                absolutePath: fullPath,
                closable: true,
            });
        }
        currentTabKey.value = fullPath;
    }
});

watch(
    () => router.currentRoute.value,
    newRoute => {
        const path = newRoute.path;
        const query = newRoute.query;
        const fullPath = newRoute.fullPath;
        let target = absolutePathMenuMap.get(fullPath);
        let notMenuPage = false;
        if (!target) {
            notMenuPage = true;
        }
        target = target || absolutePathMenuMap.get(path);
        if (target && target.name && !target.children) {
            if (target.absolutePath === fullPath) {
                menuSelectedKey.value = target.name;
            } else {
                menuSelectedKey.value = '';
            }
            let tab = tabs.value.find(i => i.name === target?.name);
            if (notMenuPage) {
                tab = tabs.value.find(i => i.key === fullPath);
            }
            const { type } = query;
            const labelPrefix = pageTypeMap.get(type as string) || '';
            if (!tab) {
                tabs.value.push({
                    label: labelPrefix + target.tabName,
                    key: fullPath,
                    name: target.name,
                    absolutePath: fullPath,
                    closable: true,
                });
            }
            currentTabKey.value = fullPath;
        }
    },
);

// 延迟菜单展开的状态 延迟全名显示Logo
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

// 20种不同主题色
const themeColorList = ['#2995fa', '#1777FF', '#9251ea', '#eb2f96', '#fa541c', '#fa8c16', '#efab25', '#fadb14', '#45bd15', '#0ea22c', '#13c2c2'];

const isShowThemeSettingDrawer = ref(false);

function handleMenuNameChange(name: string) {
    console.log(name);
    const target = nameMenuMap.get(name);
    if (target) {
        const tab = tabs.value.find(i => i.name === name);
        if (!tab) {
            tabs.value.push({
                label: target.tabName,
                key: target.absolutePath as string,
                name,
                absolutePath: target.absolutePath,
                closable: true,
            });
            currentTabKey.value = target.absolutePath as string;
        } else {
            if (tab.key !== target.absolutePath) {
                tabs.value.push({
                    label: target.tabName,
                    key: target.absolutePath as string,
                    name,
                    absolutePath: target.absolutePath,
                    closable: true,
                });
                currentTabKey.value = target.absolutePath as string;
            } else {
                currentTabKey.value = tab.key;
            }
        }
    }
}

function handleTabChange(key: string) {
    const target = tabs.value.find(i => i.key === key);
    if (target) {
        currentTabKey.value = key;
        router.push(key);
        const menu = absolutePathMenuMap.get(key);
        if (menu) {
            menuSelectedKey.value = menu.name as string;
        } else {
            menuSelectedKey.value = '';
        }
    }
}

function cleanLocalStorage() {
    localStorage.clear();
    window.location.reload();
}
</script>

<template>
    <div
        class="home w-full min-h-screen relative"
        :class="{
            dark: themeIsDark,
        }"
    >
        <n-drawer v-model:show="isShowThemeSettingDrawer" :width="302" placement="right">
            <n-drawer-content closable title="设置">
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
                <n-divider style="margin: 18px 0 16px 0" title-placement="center">菜单栏颜色</n-divider>
                <div>
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
                <n-divider style="margin: 18px 0 16px 0" title-placement="center">缓存</n-divider>
                <div>
                    <n-button @click="cleanLocalStorage" size="small" type="primary">清除缓存并重载</n-button>
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
                        v-model:value="menuSelectedKey"
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
                    <n-tabs type="card" v-model:value="currentTabKey" @update:value="handleTabChange">
                        <n-tab v-for="tab in tabs" :key="tab.key" :name="tab.key" :label="tab.label" :closable="tab.closable" />
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

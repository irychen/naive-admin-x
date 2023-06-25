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
    NSwitch,
    NLayoutSider,
    NLayoutContent,
    NLayoutHeader,
    MenuOption,
    NIcon,
} from 'naive-ui';
import { h, ref, watch, Transition, onMounted } from 'vue';
import { SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { MENUS_LIST, LOGO_TEXT, LOGO_SHORT_TEXT, MenuRoute } from '@/config';
import { toRefs } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import CheckBoxColor from '@/components/CheckBoxColor/index.vue';
import { useLocalStorage } from '@/hooks/base/useLocalStorage';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { DARK_THEME_MENU_COLORS, LIGHT_THEME_MENU_COLORS, THEME_PRIMARY_COLORS } from '@/config/index.js';
import useEventListener from '@/hooks/base/useEventListener';
import Color from 'color';
import { headerColorLight } from '@/store/themeStore/index.js';

const pageTypeMap = new Map<string, string>([
    ['edit', '编辑'],
    ['add', '新增'],
    ['detail', '详情'],
]);
const themeStore = useThemeStore();
const { toggleMenuCollapse } = themeStore;
const menuSelectedKey = ref<string>('');
useLocalStorage('menuSelectedKey', menuSelectedKey);
const {
    primaryColorIsDark,
    currentLightMenuColor,
    menuIsInverted,
    menuCollapsed,
    themeIsDark,
    menuColorIsDark,
    menuColor,
    primaryColor,
    currentDarkMenuColor,
} = toRefs(themeStore);
const router = useRouter();
const menuOptions: MenuOption[] = MENUS_LIST;
const openKeepAlive = ref<boolean>(true);
useLocalStorage('openKeepAlive', openKeepAlive);
// absolutePath Menu Map
const absolutePathMenuMap = new Map<string, MenuRoute>();
const nameMenuMap = new Map<string, MenuRoute>();
const currentTabKey = ref<string>('');
useLocalStorage('currentTabKey', currentTabKey);

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
useLocalStorage('tabs', tabs);
// 根据路由 设置选中的菜单
onMounted(() => {
    updateTabAndMenuKey(router.currentRoute.value);
});

const needWatchRoute = ref(true);
let needWatchRouteTimer: number;

function debouncePendingNeedWatchRoute() {
    needWatchRoute.value = false;
    clearTimeout(needWatchRouteTimer);
    needWatchRouteTimer = setTimeout(() => {
        needWatchRoute.value = true;
    }, 500);
}

// 监听路由变化，设置选中的菜单 浏览器前进后退
// 非浏览器前进后退，不会触发路由变化
watch(
    () => router.currentRoute.value,
    newRoute => {
        if (needWatchRoute.value) {
            updateTabAndMenuKey(newRoute);
        }
    },
);

// 根据路由 设置选中的菜单选中和tab标签页状态（currentTabKey、tabs）
function updateTabAndMenuKey(route: RouteLocationNormalizedLoaded) {
    const { query, path, fullPath } = route;
    // 用全路径匹配菜单 优先级最高
    let target = absolutePathMenuMap.get(fullPath);
    let notMenuPage = false;
    // 如果没有匹配到菜单，说明不是菜单页面，应该是非菜单页面
    if (!target) notMenuPage = true;
    // 如果没有匹配到菜单，用path匹配菜单
    target = target || absolutePathMenuMap.get(path);
    // 如果匹配到菜单
    if (target) {
        // 假设是菜单页面就用name寻找菜单tab
        let tab = tabs.value.find(i => i.name === target?.name);
        if (notMenuPage) {
            // 如果不是菜单页面，就用key寻找菜单tab
            tab = tabs.value.find(i => i.key === fullPath);
            // 如果是非菜单页面，直接设置菜单选中为空
            menuSelectedKey.value = '';
        } else {
            // 如果是菜单页面，设置菜单选中为菜单的name
            menuSelectedKey.value = target.name;
        }
        // 获取页面类型
        const { type } = query;
        // 获取页面类型对应的前缀
        const labelPrefix = pageTypeMap.get(type as string) || '';
        // 如果没有找到tab，就添加一个tab
        if (!tab) {
            tabs.value.push({
                label: labelPrefix + target.tabName,
                key: fullPath,
                name: target.name,
                absolutePath: fullPath,
                closable: true,
            });
        }
        // 设置当前选中的tab
        currentTabKey.value = fullPath;
    }
}

// 延迟菜单展开的状态 延迟全名显示Logo
const delayedMenuCollapsed = ref(menuCollapsed.value);
let timerId: number;
watch(
    () => menuCollapsed.value,
    value => {
        if (!value) {
            if (timerId) clearTimeout(timerId);
            timerId = setTimeout(() => {
                delayedMenuCollapsed.value = value;
            }, 200);
        } else {
            delayedMenuCollapsed.value = value;
        }
    },
);

const isShowThemeSettingDrawer = ref(false);

function handleMenuNameChange(name: string) {
    debouncePendingNeedWatchRoute();
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
        router.push(target.absolutePath as string);
    }
}

function handleTabChange(key: string) {
    debouncePendingNeedWatchRoute();
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

const canShowDrawerMenu = ref(false);
useEventListener(
    'resize',
    () => {
        canShowDrawerMenu.value = window.innerWidth <= 580;
    },
    true,
);
window.onorientationchange = () => {
    canShowDrawerMenu.value = window.innerWidth <= 580;
};
useEventListener('orientationchange', () => {
    canShowDrawerMenu.value = window.innerWidth <= 580;
});
</script>

<template>
    <div
        class="home w-full min-h-screen relative"
        :class="{
            dark: themeIsDark,
        }"
    >
        <n-drawer
            :style="{
                backgroundColor: menuColor,
            }"
            v-if="canShowDrawerMenu"
            :show="!menuCollapsed"
            @update:show="menuCollapsed = !menuCollapsed"
            :width="220"
            placement="left"
        >
            <n-drawer-content
                :header-style="{
                    border: 'none',
                    color: menuColorIsDark ? '#fff' : '#000',
                    borderBottom: menuColorIsDark ? '1px solid ' + Color(menuColor).lighten(0.4) : '1px solid ' + Color(menuColor).darken(0.1),
                }"
                :body-content-style="{
                    padding: '0',
                }"
                closable
                :title="LOGO_TEXT"
            >
                <n-menu v-model:value="menuSelectedKey" :inverted="menuIsInverted" @update:value="handleMenuNameChange" :options="menuOptions" />
            </n-drawer-content>
        </n-drawer>
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
                        v-for="color in THEME_PRIMARY_COLORS"
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
                            v-for="color in LIGHT_THEME_MENU_COLORS"
                            :key="color"
                            :color="color"
                            :active="color === menuColor"
                            @click="currentLightMenuColor = color"
                        />
                    </div>
                    <div class="color-blocks flex flex-wrap mb-[10px]" v-else>
                        <CheckBoxColor
                            v-for="color in DARK_THEME_MENU_COLORS"
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
                <n-divider style="margin: 18px 0 16px 0" title-placement="center">缓存标签页面</n-divider>
                <div class="flex justify-center">
                    <n-switch v-model:value="openKeepAlive">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
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
                    class="flex xs:hidden justify-center flex-shrink-0 items-center h-full overflow-hidden"
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
                        backgroundColor: themeIsDark ? menuColor : headerColorLight,
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
                    class="xs:hidden"
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
                        backgroundColor: themeIsDark ? Color(menuColor).lighten(0.4).hex() : '#f1f2f3',
                        transition: 'background-color 0.3s var(--n-bezier)',
                        height: 'calc( 100vh - 50px)',
                        padding: '6px',
                        boxSizing: 'border-box',
                    }"
                >
                    <n-tabs type="card" v-model:value="currentTabKey" @update:value="handleTabChange">
                        <n-tab v-for="tab in tabs" :key="tab.key" :name="tab.key" :label="tab.label" :closable="tab.closable" />
                    </n-tabs>
                    <!--这里使用overflow:hidden，是为了防止过渡时出现滚动条和布局显示异常-->
                    <!--因此子组件需要使用LayoutPageContainer组件进行包裹-->
                    <div class="w-full overflow-hidden" style="height: calc(100vh - 102px)">
                        <router-view v-if="openKeepAlive" v-slot="{ Component }">
                            <Transition>
                                <keep-alive>
                                    <component :is="Component" />
                                </keep-alive>
                            </Transition>
                        </router-view>
                        <router-view v-else v-slot="{ Component }">
                            <Transition>
                                <component :is="Component" />
                            </Transition>
                        </router-view>
                    </div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<style lang="scss" scoped>
/* we will explain what these classes do next! */
.v-enter-active {
    transition: opacity 0.3s ease;
}

.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

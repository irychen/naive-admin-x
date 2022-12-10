import { MenuOption, NIcon } from 'naive-ui';
import { h } from 'vue';
import { RouteRecordRaw, RouterLink } from 'vue-router';
import { HomeOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined, SettingOutlined } from '@vicons/antd';

export const LOCAL_TOKEN_KEY = 'naive-admin-x-token';
export const LOGO_TEXT = 'Naive Admin X';
export const LOGO_SHORT_TEXT = 'NAX';
export const LOGO_IMG = 'https://avatars.githubusercontent.com/u/25154432?s=200&v=4';
export const WEBSITE_DESC = 'a brilliant powerful admin, just manage what you want !';

function initMenuLabel(label: string, routerName?: string) {
    return routerName ? h(RouterLink, { to: { name: routerName } }, () => label) : label;
}

export const MENUS: (RouteRecordRaw &
    MenuOption & {
        isMenu?: boolean;
    })[] = [
    {
        isMenu: true,
        path: '/',
        name: 'HomeIndex',
        label: () => initMenuLabel('首页', 'HomeIndex'),
        key: 'home',
        icon: () => h(NIcon, null, { default: () => h(HomeOutlined) }),
        component: () => import('@/pages/HomePages/Index/Index.vue'),
    },
    {
        isMenu: true,
        path: '/settings/theme',
        name: 'Settings',
        label: () => initMenuLabel('设置'),
        key: 'settings',
        icon: () => h(NIcon, null, { default: () => h(SettingOutlined) }),
        children: [
            {
                label: () => initMenuLabel('主题', 'SettingsTheme'),
                isMenu: true,
                path: '/settings/theme',
                name: 'SettingsTheme',
                key: 'settings-theme',
                component: () => import('@/pages/HomePages/Settings/Theme/Index.vue'),
            },
        ],
    },
];

// 菜单列表
export const MENUS_LIST = (() => {
    const keysSet = new Set<string>();
    function traverse(list: any[]) {
        const sec = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (keysSet.has(item.key)) {
                throw new Error(`菜单key重复：${item.key}`);
            } else {
                keysSet.add(item.key);
            }
            // 忽略非菜单页面
            if (item.isMenu) {
                sec.push(item);
            }
            if (item.children) {
                item.children = traverse(item.children);
            }
        }
        return sec.length > 0 ? sec : null;
    }

    return (traverse(MENUS) || []) as MenuOption[];
})();

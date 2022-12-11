import { NIcon } from 'naive-ui';
import { h, VNodeChild } from 'vue';
import { HomeOutlined, SettingOutlined } from '@vicons/antd';

export const LOCAL_TOKEN_KEY = 'naive-admin-x-token';
export const UNIQUE_APP_PREFIX_KEY = 'naive-admin-x_';
export const LOGO_TEXT = 'Naive Admin X';
export const LOGO_SHORT_TEXT = 'NAX';
export const LOGO_IMG = 'https://avatars.githubusercontent.com/u/25154432?s=200&v=4';
export const WEBSITE_DESC = 'a brilliant powerful admin, just manage what you want !';
export const MENU_BASE_PATH = '/';

export const THEME_PRIMARY_COLORS = [
    '#2995fa',
    '#1777FF',
    '#9251ea',
    '#eb2f96',
    '#fa541c',
    '#fa8c16',
    '#efab25',
    '#fadb14',
    '#45bd15',
    '#0ea22c',
    '#13c2c2',
];

export const LIGHT_THEME_MENU_COLORS = ['#222', '#161717', '#18232d', '#fff', '#fbfcff', '#111', '#000', '#001427'];
export const DARK_THEME_MENU_COLORS = ['#222', '#121212', '#000', '#16181c'];

export type MenuRoute = {
    // 是否是菜单 在菜单栏显示
    isMenu: boolean;
    // 路由名称和菜单唯一标识（非空）
    name: string;
    // 路由路径
    path?: string;
    // 菜单名称
    label?: string | (() => VNodeChild);
    // 菜单图标
    icon?: () => VNodeChild;
    // 权限key
    authKey?: string;
    // 是否校验权限
    needCheckAuth?: boolean;
    // 菜单栏key
    key?: string;
    children?: MenuRoute[];
    // 路由页面组件
    component?: any;
    // 重定向
    redirect?: any;
    // 绝对路由路径
    absolutePath?: string;
    tabName?: string;
};

export const MENUS: MenuRoute[] = [
    {
        isMenu: true,
        path: '',
        name: 'HomeIndex',
        label: '首页',
        icon: () => h(NIcon, null, { default: () => h(HomeOutlined) }),
        component: () => import('@/pages/HomePages/Index/Index.vue'),
    },
    {
        isMenu: true,
        path: 'settings',
        name: 'Settings',
        label: '设置',
        icon: () => h(NIcon, null, { default: () => h(SettingOutlined) }),
        children: [
            {
                isMenu: true,
                label: '主题设置',
                path: 'theme',
                name: 'SettingsTheme',
                component: () => import('@/pages/HomePages/Settings/Theme/Index.vue'),
            },
        ],
    },
];

// 菜单列表
export const MENUS_LIST = (() => {
    const namesSet = new Set<string>();
    function traverse(list: any[], upperPath: string) {
        const sec = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (namesSet.has(item.name)) {
                // 菜单的name不能重复 重复的话会导致菜单栏显示异常 name === key
                throw new Error(`菜单name重复：${item.name}`);
            } else {
                namesSet.add(item.name);
            }
            // 忽略非菜单页面
            if (item.isMenu) {
                sec.push(item);
                // 路由绝对路径 = 上级路径 + 当前路径  方便浏览器地址栏跳转 菜单栏选中
                let currentAbsolutePath = '';
                if (item.path) {
                    currentAbsolutePath = upperPath.endsWith('/') ? `${upperPath}${item.path}` : `${upperPath}/${item.path}`;
                } else {
                    currentAbsolutePath = upperPath;
                }
                const label = item.label;
                item.tabName = item.tabName || label;
                // 菜单栏key = 路由名称
                item.key = item.name;
                item.absolutePath = currentAbsolutePath;
                if (item.children) item.children = traverse(item.children, currentAbsolutePath);
            }
        }
        return sec.length > 0 ? sec : null;
    }
    return (traverse(MENUS, MENU_BASE_PATH) || []) as MenuRoute[];
})();

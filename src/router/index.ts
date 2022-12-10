import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { close, start } from '@/utils/nprogress';
import { getToken } from '@/utils/token';
import { MENUS } from '@/config';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        children: MENUS,
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/About.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !getToken()) {
        next({ name: 'Login' });
    } else {
        next();
    }
});
router.beforeEach(() => {
    start();
});

router.afterEach(() => {
    close();
});
export default router;

<script setup lang="ts">
import { onMounted, ref, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { FormInst, NButton, NCheckbox, NForm, NFormItem, NInput } from 'naive-ui';
import { setToken } from '@/utils/token';
import { LOGO_TEXT, WEBSITE_DESC } from '@/config';
import { useThemeStore } from '@/store/themeStore';

const LocalFormDataKey = 'LocalFormDataKey-login-naive-admin-x';
const formRef = ref<FormInst | null>(null);
const themeStore = useThemeStore();
const { themeIsDark } = toRefs(themeStore);

interface FormData {
    account: string;
    password: string;
    remember: boolean;
}

const formData = ref<FormData>({
    account: '',
    password: '',
    remember: false,
});

watch(
    () => formData.value.remember,
    val => {
        if (val) {
            const dataStr = JSON.stringify(formData.value);
            localStorage.setItem(LocalFormDataKey, dataStr);
        } else {
            localStorage.removeItem(LocalFormDataKey);
        }
    },
);

onMounted(() => {
    const dataStr = localStorage.getItem(LocalFormDataKey);
    if (dataStr) {
        formData.value = JSON.parse(dataStr);
    }
});

const router = useRouter();

function handleLogin() {
    setToken('123456');
    router.push('/');
}

const getLogoFrontEndText = () => {
    const arr = LOGO_TEXT.split(' ');
    const end = arr.pop();
    return {
        front: arr.join(' '),
        end,
    };
};
const logoFrontEndText = getLogoFrontEndText();
</script>

<template>
    <div
        class="login p-[20px]"
        :class="{
            dark: themeIsDark,
        }"
    >
        <div class="center-box w-[920px] sm:w-[400px] min-h-[600px] dark:bg-[#222] bg-white rounded-lg shadow-md flex overflow-hidden">
            <div class="left-box w-[50%] shadow-md rounded-lg flex items-center justify-center sm:hidden">
                <div class="w-[70%] min-h-[60%] bg-[#ffffff22] shadow-md rounded-lg p-[20px] flex flex-col justify-center">
                    <h1 class="text-white text-[60px] m-0 leading-[0.9]">
                        {{ logoFrontEndText.front }} <span class="text-[#3ebb83]"> {{ logoFrontEndText.end }}</span>
                    </h1>
                    <p class="text-white text-[20px] font-bold">{{ WEBSITE_DESC }}</p>
                    <h2 class="text-[30px] text-[#333] dark:text-white m-0">Simply Managing</h2>
                </div>
            </div>
            <div class="right-box w-[50%] p-[30px] flex items-center justify-center sm:w-full">
                <div class="w-[72%] sm:w-[80%] ss:w-full">
                    <h1 class="sm:block m-0 dark:text-white">
                        {{ LOGO_TEXT }}
                        <span class="text-[#1777FF]">Login</span>
                    </h1>
                    <h3 class="dark:text-white">
                        Hello there, Welcome !
                        <span class="text-[26px]">👋</span>
                    </h3>
                    <n-form ref="formRef" :model="formData">
                        <n-form-item path="account" label="登陆账号">
                            <n-input v-model:value="formData.account" @keydown.enter.prevent placeholder="请输入登陆账号" />
                        </n-form-item>
                        <n-form-item path="password" label="账号密码">
                            <n-input v-model:value="formData.password" type="password" @keydown.enter.prevent placeholder="请输入账号密码" />
                        </n-form-item>
                    </n-form>
                    <!-- 记住密码 忘记密码 -->
                    <div class="w-full flex justify-between">
                        <n-checkbox v-model:checked="formData.remember">记住密码</n-checkbox>
                        <a href="#" class="text-[#1890ff]">忘记密码</a>
                    </div>
                    <div class="w-full flex justify-center py-[20px]">
                        <n-button type="primary" style="width: 100%" @click="handleLogin">登陆</n-button>
                    </div>
                    <!-- 没有账号 -->
                    <div class="w-full flex justify-center">
                        <a href="#" class="text-[#1890ff]">没有账号？去注册</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@keyframes motion {
    0% {
        background-size: 150%;
        background-position: center left;
    }
    100% {
        background-size: 150%;
        background-position: center right;
    }
}

.login {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    background-image: linear-gradient(120deg, #f5faff 10%, #b1dafa 100%);
    display: flex;
    justify-content: center;
    align-items: center;

    .left-box {
        background-image: linear-gradient(217deg, rgba(0, 174, 255, 0.906), rgba(255, 0, 0, 0) 60%),
            linear-gradient(50deg, rgba(0, 94, 255, 0.601), rgba(0, 255, 0, 0) 60%), linear-gradient(100deg, rgb(0, 254, 59), rgba(0, 255, 0, 0) 60%),
            linear-gradient(336deg, rgba(255, 0, 0, 0.79), rgba(0, 0, 255, 0) 60%);
        background-size: cover;
        animation: motion 3s linear infinite alternate-reverse;
    }
}

.login.dark {
    background-image: linear-gradient(120deg, #22416e, #1c1a1a);
    .left-box {
        background-image: linear-gradient(217deg, rgba(0, 174, 255, 1), rgba(255, 0, 0, 0) 60%),
            linear-gradient(50deg, rgba(0, 94, 255, 1), rgba(0, 255, 0, 0) 60%), linear-gradient(100deg, rgb(0, 254, 59), rgba(0, 255, 0, 0) 60%),
            linear-gradient(336deg, rgba(255, 0, 0, 1), rgba(0, 0, 255, 0) 60%);
    }
}
</style>

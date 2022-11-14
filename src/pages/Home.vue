<script setup lang="ts">
import { NButton } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();

function gotoAbout() {
    router.push('/about');
}
</script>

<template>
    <div class="text-center">
        <h1 class="font-[400]">Home Page</h1>
        <div class="flex justify-center">
            <n-button type="primary" @click="gotoAbout">Go to About</n-button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

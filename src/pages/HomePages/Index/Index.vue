<template>
    <LayoutPageContainer>
        <n-card>
            <div class="text-center">
                <n-gradient-text class="text-[30px]">Welcome to the Naive UI Admin Dashboard Template</n-gradient-text>
            </div>
            <p class="text-center">This is a template for Naive UI Admin Dashboard</p>
        </n-card>
        <div class="flex">
            <n-card title="Button">
                <n-space>
                    <n-button>Default</n-button>
                    <n-button type="tertiary"> Tertiary</n-button>
                    <n-button type="primary"> Primary</n-button>
                    <n-button type="info"> Info</n-button>
                    <n-button type="success"> Success</n-button>
                    <n-button type="warning"> Warning</n-button>
                    <n-button type="error"> Error</n-button>
                    <n-button dashed> Default</n-button>
                    <n-button type="primary" dashed> Primary</n-button>
                    <n-button type="info" dashed> Info</n-button>
                    <n-button type="success" dashed> Success</n-button>
                    <n-button type="warning" dashed> Warning</n-button>
                    <n-button type="error" dashed> Error</n-button>
                </n-space>
            </n-card>
            <n-card>
                <n-gradient-text type="info"> Live Forever</n-gradient-text>
                <br />
                <n-gradient-text type="danger"> Live Forever</n-gradient-text>
                <br />
                <n-gradient-text :size="24" type="warning"> Married with Children</n-gradient-text>
                <br />
                <n-gradient-text :size="24" type="success"> Back in the USSR</n-gradient-text>
            </n-card>
        </div>
    </LayoutPageContainer>
</template>

<script setup lang="ts">
import LayoutPageContainer from '@/components/LayoutPageContainer/Index.vue';
import { NCard, NButton, NSpace, NGradientText } from 'naive-ui';
</script>

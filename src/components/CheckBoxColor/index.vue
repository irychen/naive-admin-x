<template>
    <div
        class="color-checkbox-block flex-shrink-0 shadow-md cursor-pointer flex items-center justify-center w-[18px] h-[18px] rounded mb-[8px] mr-[6px]"
        :style="{
            backgroundColor: props.color,
        }"
    >
        <n-icon style="font-weight: 800" v-if="props.active" :color="Color(props.color).darken(0.2).isDark() ? '#fff' : '#000'" size="14">
            <CheckOutlined />
        </n-icon>
    </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { CheckOutlined } from '@vicons/antd';
import { watch, ref } from 'vue';
import Color from 'color';

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#fff',
    },
});
</script>

<template>
    <div>
        <n-input v-model="text" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NInput } from 'naive-ui';

const text = ref('');
</script>

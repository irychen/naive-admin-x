<template>
    <LayoutPageContainer>
        <div class="h-[4000px]">
            <n-card title="主题设置">
                <n-form>
                    <n-form-item label="主题色">
                        <div class="color-blocks flex flex-wrap mb-[0px]">
                            <CheckBoxColor
                                v-for="color in THEME_PRIMARY_COLORS"
                                :key="color"
                                :color="color"
                                :active="color === primaryColor"
                                @click="primaryColor = color"
                            />
                        </div>
                    </n-form-item>
                    <n-form-item label="菜单栏背景">
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
                    </n-form-item>
                </n-form>
            </n-card>
        </div>
    </LayoutPageContainer>
</template>

<script setup lang="ts">
import CheckBoxColor from '@/components/CheckBoxColor/Index.vue';
import { NForm, NFormItem, NCard, NSelect, FormInst, FormItemRule, useMessage } from 'naive-ui';
import { h, ref, watch, onMounted, toRefs } from 'vue';
import LayoutPageContainer from '@/components/LayoutPageContainer/Index.vue';
import { NInput } from 'naive-ui';
import { useThemeStore } from '@/store/themeStore';

const themeStore = useThemeStore();
const { primaryColor, themeIsDark, menuColor, currentLightMenuColor, currentDarkMenuColor } = toRefs(themeStore);

import { THEME_PRIMARY_COLORS, LIGHT_THEME_MENU_COLORS, DARK_THEME_MENU_COLORS } from '@/config';
</script>

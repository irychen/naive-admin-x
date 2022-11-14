import { GlobalThemeOverrides } from "naive-ui";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

// 将主题配置放在 store 中，方便在不同页面更改主题
export const useThemeStore = defineStore("theme", () => {
  const NThemeConfig = reactive<GlobalThemeOverrides>({
    common: {
      primaryColor: "#1677FF",
      primaryColorHover: "#1677FF",
    },
    Button: {
    
    },
    Select: {},
  });

  return { NThemeConfig };
});

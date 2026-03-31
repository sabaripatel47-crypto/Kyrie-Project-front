<template>
  <div
    class="h-[50px] flex items-center justify-center overflow-hidden"
    :style="{ background: getLogoBackground }"
  >
    <img
      v-if="logo"
      :src="logo"
      class="w-8 h-8"
      :class="collapse ? '' : 'mr-3'"
    />
    <h1
      v-if="!collapse"
      class="m-0 font-semibold text-sm whitespace-nowrap"
      :style="{ color: getLogoTextColor }"
    >
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo/logo.png";
import useSettingsStore from "@/store/modules/settings";
import variables from "@/assets/styles/variables.module.scss";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = import.meta.env.VITE_APP_TITLE;
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);

const getLogoBackground = computed(() => {
  if (settingsStore.isDark) return "var(--sidebar-bg)";
  if (settingsStore.navType == 3) return variables.menuLightBg;
  return sideTheme.value === "theme-dark"
    ? variables.menuBg
    : variables.menuLightBg;
});

const getLogoTextColor = computed(() => {
  if (settingsStore.isDark) return "var(--sidebar-text)";
  if (settingsStore.navType == 3) return variables.menuLightText;
  return sideTheme.value === "theme-dark" ? "#fff" : variables.menuLightText;
});
</script>

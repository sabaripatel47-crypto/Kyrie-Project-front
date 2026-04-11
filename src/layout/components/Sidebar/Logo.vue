<template>
  <div
    class="flex items-center gap-2"
    :class="collapse ? 'px-2 pt-4 pb-3 justify-center' : 'px-4 pt-6 pb-4'"
  >
    <img
      v-if="logo"
      :src="logo"
      :class="collapse ? 'w-10' : 'w-18'"
      class="object-contain shrink-0"
    />
    <template v-if="!collapse">
      <div>
        <h1
          class="text-sm font-extrabold m-0 leading-tight"
          :class="settingsStore.isDark ? 'text-[#ff85c9]' : 'text-[#914539]'"
        >
          {{ title }}
        </h1>
        <p
          class="text-xs m-0 mt-0.5"
          :class="settingsStore.isDark ? 'text-[#a9aab9]' : 'text-[#914539]/60'"
        >
          The Digital Hug
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo/logo.png";

import useSettingsStore from "@/store/modules/settings";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = import.meta.env.VITE_APP_TITLE;
const settingsStore = useSettingsStore();
</script>

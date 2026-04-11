<template>
  <div class="px-6 pt-6 pb-4">
    <template v-if="!collapse">
      <h1 class="text-xl font-extrabold text-[#914539] m-0 leading-tight">{{ title }}</h1>
      <p class="text-sm text-[#914539]/60 m-0 mt-0.5">The Digital Hug</p>
    </template>
    <template v-else>
      <img v-if="logo" :src="logo" class="w-8 h-8 object-contain" />
    </template>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo/logo.png";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = import.meta.env.VITE_APP_TITLE;
</script>

<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <svg-icon
      icon-class="paw-left"
      :class="{ 'is-active': isActive }"
      class="hamburger"
      :style="{ color: iconColor }"
    />
  </div>
</template>

<script setup lang="ts">
import useSettingsStore from "@/store/modules/settings";

defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits();
const toggleClick = () => {
  emit("toggleClick");
};

const settingsStore = useSettingsStore();
const iconColor = computed(() =>
  settingsStore.isDark ? "#ffffff" : "#914539"
);
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transform: rotate(-90deg);
  transition: transform 0.3s ease;
}

.hamburger.is-active {
  transform: rotate(90deg);
}
</style>

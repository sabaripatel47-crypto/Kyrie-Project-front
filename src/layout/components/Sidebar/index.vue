<template>
  <div
    :style="{ background: getMenuBackground }"
    :class="{ 'has-logo': showLogo }"
    class="sidebar-container"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="''"
        :text-color="''"
        :unique-opened="true"
        :active-text-color="'#ffffff'"
        :collapse-transition="false"
        mode="vertical"
        :class="sideTheme"
        class="border-none! h-full! w-full!"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const getMenuBackground = computed(() => {
  if (settingsStore.isDark)
    return "linear-gradient(180deg, #161926 0%, #0b0e18 100%)";
  return "linear-gradient(160deg, #fde8e4 0%, #fcf6ed 60%, #fdf4ec 100%)";
});

const getMenuTextColor = computed(() => {
  if (settingsStore.isDark) return "var(--sidebar-text)";
  return "#914539";
});

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) return meta.activeMenu;
  return path;
});
</script>

<style scoped>
.scrollbar-wrapper {
  background-color: transparent;
}

:deep(.el-menu-item.is-active:hover) {
  background-color: #fe9c8c !important;
  transform: rotate(1deg);
}
</style>

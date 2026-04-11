<template>
  <div
    class="navbar relative flex items-center overflow-hidden box-border h-[50px] bg-(--navbar-bg) shadow-[0_1px_4px_rgba(0,21,41,0.08)]"
    :class="'nav' + settingsStore.navType"
  >
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container inline-flex items-center shrink-0 h-full mr-2 cursor-pointer transition-[background] duration-300 [-webkit-tap-highlight-color:transparent] hover:bg-black/2.5"
      :class="{ 'hidden!': settingsStore.navType == 3 }"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      v-if="settingsStore.navType == 1"
      id="breadcrumb-container"
      class="shrink-0"
    />
    <top-nav
      v-if="settingsStore.navType == 2"
      id="topmenu-container"
      class="absolute left-[50px]"
    />
    <template v-if="settingsStore.navType == 3">
      <logo v-show="settingsStore.sidebarLogo" :collapse="false"></logo>
      <top-bar
        id="topbar-container"
        class="flex-1 min-w-0 flex items-center overflow-hidden ml-2"
      />
    </template>

    <div class="right-menu flex items-center h-full ml-auto focus:outline-none">
      <template v-if="appStore.device !== 'mobile'">
        <header-search
          id="header-search"
          class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66]"
        />

        <screenfull
          id="screenfull"
          class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66] cursor-pointer transition-[background] duration-300 hover:bg-black/2.5"
        />

        <el-tooltip content="主题模式" effect="dark" placement="bottom">
          <div
            class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66] cursor-pointer transition-[background] duration-300 hover:bg-black/2.5"
            @click="toggleTheme"
          >
            <svg-icon
              v-if="settingsStore.isDark"
              icon-class="sunny"
              class="transition-transform duration-300 hover:scale-[1.15]"
            />
            <svg-icon
              v-if="!settingsStore.isDark"
              icon-class="moon"
              class="transition-transform duration-300 hover:scale-[1.15]"
            />
          </div>
        </el-tooltip>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select
            id="size-select"
            class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66] cursor-pointer transition-[background] duration-300 hover:bg-black/2.5"
          />
        </el-tooltip>

        <el-tooltip content="消息通知" effect="dark" placement="bottom">
          <header-notice
            id="header-notice"
            class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66] cursor-pointer transition-[background] duration-300 hover:bg-black/2.5"
          />
        </el-tooltip>
      </template>

      <el-dropdown
        @command="handleCommand"
        class="inline-flex items-center px-2 h-full text-[18px] text-[#5a5e66] cursor-pointer transition-[background] duration-300 hover:bg-black/2.5"
        trigger="hover"
      >
        <div class="relative flex items-center">
          <img
            :src="userStore.avatar"
            class="cursor-pointer w-[30px] h-[30px] mr-2 rounded-full"
          />
          <span class="text-sm font-bold">{{ userStore.nickName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item
              command="setLayout"
              v-if="settingsStore.showSettings"
            >
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item command="lockScreen">
              <span>锁定屏幕</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import TopNav from "@/components/TopNav/index.vue";
import TopBar from "./TopBar/index.vue";
import Logo from "./Sidebar/Logo.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import SizeSelect from "@/components/SizeSelect/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useLockStore from "@/store/modules/lock";
import useSettingsStore from "@/store/modules/settings";
import HeaderNotice from "./HeaderNotice";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const lockStore = useLockStore();
const settingsStore = useSettingsStore();

function toggleSideBar(): void {
  appStore.toggleSideBar();
}

function handleCommand(command: string): void {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "lockScreen":
      lockScreen();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout(): void {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout(): void {
  emits("setLayout");
}

function lockScreen() {
  const currentPath = route.fullPath;
  lockStore.lockScreen(currentPath);
  router.push("/lock");
}

async function toggleTheme(event?: MouseEvent): Promise<void> {
  const x = event?.clientX || window.innerWidth / 2;
  const y = event?.clientY || window.innerHeight / 2;
  const wasDark = settingsStore.isDark;
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isSupported =
    typeof (document as any).startViewTransition === "function" &&
    !isReducedMotion;

  if (!isSupported) {
    settingsStore.toggleTheme();
    return;
  }

  try {
    const transition = document.startViewTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      settingsStore.toggleTheme();
      await nextTick();
    });
    await transition.ready;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      { clipPath: !wasDark ? [...clipPath].reverse() : clipPath },
      {
        duration: 650,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
        pseudoElement: !wasDark
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    );
    await transition.finished;
  } catch (error) {
    console.warn(
      "View transition failed, falling back to immediate toggle:",
      error
    );
    settingsStore.toggleTheme();
  }
}
</script>

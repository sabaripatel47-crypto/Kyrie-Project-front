<template>
  <div
    class="navbar relative flex items-center overflow-hidden box-border h-[60px] rounded-full mt-4 mx-4 px-6"
    :class="'nav' + settingsStore.navType"
    :style="
      settingsStore.isDark
        ? 'background: rgba(11,14,24,0.6); backdrop-filter: blur(16px); box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid rgba(69,71,84,0.3);'
        : 'background: rgba(252,246,237,0.75); backdrop-filter: blur(16px); box-shadow: 0 20px 40px -15px rgba(145,69,57,0.15);'
    "
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
          class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer"
          :class="settingsStore.isDark ? 'text-[#a9aab9]' : 'text-[#914539]'"
        />

        <el-tooltip :content="t('navbar.tooltip.language')" effect="dark" placement="bottom">
          <el-dropdown
            trigger="click"
            @command="setLang"
            class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
            :class="
              settingsStore.isDark
                ? 'text-[#a9aab9] hover:bg-[#222535]'
                : 'text-[#914539] hover:bg-[#fe9c8c]/20'
            "
          >
            <svg-icon
              icon-class="language"
              :color="settingsStore.isDark ? '#a9aab9' : '#914539'"
              class="transition-transform duration-300 hover:scale-[1.15]"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-cn">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <screenfull
          id="screenfull"
          class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
          :class="
            settingsStore.isDark
              ? 'text-[#a9aab9] hover:bg-[#222535]'
              : 'text-[#914539] hover:bg-[#fe9c8c]/20'
          "
        />

        <el-tooltip :content="t('navbar.tooltip.theme')" effect="dark" placement="bottom">
          <div
            class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
            :class="
              settingsStore.isDark
                ? 'text-[#a9aab9] hover:bg-[#222535]'
                : 'text-[#914539] hover:bg-[#fe9c8c]/20'
            "
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

        <el-tooltip :content="t('navbar.tooltip.size')" effect="dark" placement="bottom">
          <size-select
            id="size-select"
            class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
            :class="
              settingsStore.isDark
                ? 'text-[#a9aab9] hover:bg-[#222535]'
                : 'text-[#914539] hover:bg-[#fe9c8c]/20'
            "
          />
        </el-tooltip>

        <el-tooltip :content="t('navbar.tooltip.notice')" effect="dark" placement="bottom">
          <header-notice
            id="header-notice"
            class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
            :class="
              settingsStore.isDark
                ? 'text-[#a9aab9] hover:bg-[#222535]'
                : 'text-[#914539] hover:bg-[#fe9c8c]/20'
            "
          />
        </el-tooltip>
      </template>

      <el-dropdown
        @command="handleCommand"
        class="inline-flex items-center px-2 h-full text-[18px] cursor-pointer transition-[background] duration-300 rounded-full"
        :class="
          settingsStore.isDark
            ? 'text-[#a9aab9] hover:bg-[#222535]'
            : 'text-[#914539] hover:bg-[#fe9c8c]/20'
        "
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
              <el-dropdown-item>{{ t('navbar.dropdown.profile') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item
              command="setLayout"
              v-if="settingsStore.showSettings"
            >
              <span>{{ t('navbar.dropdown.layout') }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="lockScreen">
              <span>{{ t('navbar.dropdown.lock') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <span>{{ t('navbar.dropdown.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY, type AppLocale } from '@/i18n'
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

const { locale, t } = useI18n()

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
  ElMessageBox.confirm(t('navbar.logoutDialog.message'), t('navbar.logoutDialog.title'), {
    confirmButtonText: t('navbar.logoutDialog.confirm'),
    cancelButtonText: t('navbar.logoutDialog.cancel'),
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

function setLang(lang: AppLocale): void {
  locale.value = lang
  localStorage.setItem(LOCALE_STORAGE_KEY, lang)
}

const emits = defineEmits(["setLayout"]);
function setLayout(): void {
  emits("setLayout");
}
// 锁定屏幕,从router获取当前路径暂存
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

<template>
  <div
    class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-surface font-headline text-on-surface"
  >
    <!-- 背景气泡 -->
    <div
      class="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary-container opacity-40 blur-[60px] animate-pulse"
    ></div>
    <div
      class="pointer-events-none absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary-container opacity-40 blur-[60px]"
    ></div>
    <div
      class="pointer-events-none absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-tertiary-container opacity-40 blur-[60px]"
    ></div>

    <main
      class="relative z-10 w-full max-w-[1100px] px-6 flex flex-col lg:flex-row items-center justify-center gap-12"
    >
      <!-- 左侧插图 -->
      <div class="hidden lg:block relative w-1/2 max-w-md shrink-0">
        <div
          class="relative bg-surface-low rounded-[24px] p-8 -rotate-3 shadow-xl"
        >
          <img
            src="@/assets/images/login-background.jpg"
            alt="pets"
            class="w-full h-[460px] object-cover rounded-2xl"
          />
          <div
            class="absolute -bottom-4 -left-4 w-14 h-14 bg-secondary-container rounded-[16px] flex items-center justify-center shadow-lg rotate-6"
          >
            <span class="material-symbols-outlined text-secondary text-3xl"
              >pets</span
            >
          </div>
        </div>
      </div>

      <!-- 登录卡片 -->
      <div
        class="relative w-full max-w-[440px] bg-linear-to-br from-white to-[#fff5f2] rounded-[24px] p-10 shadow-[0_30px_60px_-15px_rgba(145,69,57,0.12)] border border-white/60 overflow-hidden"
      >
        <!-- 品牌区 -->
        <div class="flex flex-col items-center mb-8">
          <div
            class="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-5 shadow-lg hover:scale-110 transition-transform cursor-default"
          >
            <span class="material-symbols-outlined text-primary text-3xl"
              >favorite</span
            >
          </div>
          <h1
            class="text-2xl font-extrabold text-primary tracking-tight text-center"
          >
            {{ title }}
          </h1>
          <p class="text-sm text-on-surface-variant mt-2 text-center">
            您的毛茸茸朋友们正在等您回来
          </p>
        </div>

        <!-- 表单 -->
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="loginRules"
          class="field-form"
        >
          <!-- 账号 -->
          <el-form-item prop="username">
            <label class="field-label">账号</label>
            <div class="input-wrap group">
              <span
                class="material-symbols-outlined input-icon group-focus-within:text-primary"
                >person</span
              >
              <el-input
                v-model="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="请输入账号"
                class="login-input"
              />
            </div>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <label class="field-label">密码</label>
            <div class="input-wrap group">
              <span
                class="material-symbols-outlined input-icon group-focus-within:text-primary"
                >lock</span
              >
              <el-input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                auto-complete="off"
                placeholder="••••••••"
                class="login-input"
                @keyup.enter="handleLogin"
              />
              <span
                class="material-symbols-outlined input-suffix"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "visibility_off" : "visibility" }}
              </span>
            </div>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item v-if="captchaEnabled" prop="code">
            <label class="field-label">验证码</label>
            <div class="flex gap-3 items-center">
              <div class="input-wrap group flex-1">
                <span
                  class="material-symbols-outlined input-icon group-focus-within:text-primary"
                  >pin</span
                >
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  class="login-input"
                  @keyup.enter="handleLogin"
                />
              </div>
              <img
                :src="codeUrl"
                @click="getCode"
                class="h-[52px] rounded-xl cursor-pointer border border-surface-highest shrink-0"
                alt="验证码"
              />
            </div>
          </el-form-item>

          <!-- 记住密码 -->
          <div class="flex items-center gap-3 mb-5 pl-1">
            <input
              id="rememberMe"
              type="checkbox"
              v-model="loginForm.rememberMe"
              class="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <label
              for="rememberMe"
              class="text-sm text-on-surface-variant cursor-pointer select-none"
              >记住密码</label
            >
          </div>

          <!-- 登录按钮 -->
          <el-form-item>
            <button
              class="login-btn"
              :disabled="loading"
              @click.prevent="handleLogin"
            >
              <span>{{ loading ? "登 录 中..." : "登 录" }}</span>
              <span
                class="material-symbols-outlined text-xl"
                style="font-variation-settings: 'FILL' 1"
                >pets</span
              >
            </button>
          </el-form-item>
        </el-form>

        <!-- 注册入口 -->
        <div class="mt-6 pt-6 border-t border-primary/5 text-center">
          <p class="text-sm text-on-surface-variant">
            还没有账号？
            <router-link
              v-if="register"
              to="/register"
              class="font-bold text-primary hover:text-primary-dim transition-colors ml-1"
              >立即注册</router-link
            >
            <span v-else class="font-semibold text-outline ml-1"
              >联系管理员</span
            >
          </p>
        </div>

        <!-- 卡片内装饰气泡 -->
        <div
          class="pointer-events-none absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-secondary-container/20 blur-xl"
        ></div>
        <div
          class="pointer-events-none absolute -top-10 -left-10 w-24 h-24 rounded-full bg-tertiary-container/20 blur-xl"
        ></div>
      </div>
    </main>

    <!-- 底部版权 -->
    <footer
      class="fixed bottom-0 w-full h-10 flex items-center justify-center text-xs tracking-widest text-on-surface/40"
    >
      <span>{{ footerContent }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import defaultSettings from "@/settings";
import type { LoginForm } from "@/types/api/login";

const title = import.meta.env.VITE_APP_TITLE;
const footerContent = defaultSettings.footerContent;
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref<LoginForm>({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  code: "",
  uuid: "",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
};

const codeUrl = ref("");
const loading = ref(false);
const showPassword = ref(false);
const captchaEnabled = ref(true);
const register = ref(false);
const redirect = ref<string | undefined>(undefined);

watch(
  route,
  (newRoute: any) => {
    redirect.value = (newRoute.query && newRoute.query.redirect) as
      | string
      | undefined;
  },
  { immediate: true }
);

function handleLogin(): void {
  proxy.$refs.loginRef.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", String(loginForm.value.rememberMe), {
          expires: 30,
        });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      userStore
        .login(loginForm.value)
        .then(() => {
          const query = route.query;
          const otherQueryParams = Object.keys(query).reduce(
            (acc: Record<string, any>, cur) => {
              if (cur !== "redirect") acc[cur] = query[cur];
              return acc;
            },
            {}
          );
          router.push({ path: redirect.value || "/", query: otherQueryParams });
        })
        .catch(() => {
          loading.value = false;
          if (captchaEnabled.value) getCode();
        });
    }
  });
}

function getCode(): void {
  getCodeImg().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie(): void {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    code: "",
    uuid: "",
  };
}

getCode();
getCookie();
</script>

<style scoped>
/* el-form-item 纵向排列，label 在上 input 在下 */
.field-form :deep(.el-form-item) {
  display: block;
  margin-bottom: 20px;
}
.field-form :deep(.el-form-item__content) {
  display: block;
  line-height: normal;
}
.field-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #914539;
  margin-bottom: 8px;
  padding-left: 4px;
}

/* 输入框容器 */
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  background: #e8e2d7;
  transition: background 0.2s, box-shadow 0.2s;
}
.input-wrap:focus-within {
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(154, 225, 255, 0.5);
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 20px;
  color: rgba(145, 69, 57, 0.4);
  pointer-events: none;
  transition: color 0.2s;
  z-index: 1;
}
.input-suffix {
  position: absolute;
  right: 14px;
  font-size: 20px;
  color: rgba(145, 69, 57, 0.4);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}
.input-suffix:hover {
  color: #914539;
}

/* el-input 透明化 */
.login-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 12px;
  padding: 0 44px 0 46px;
  height: 52px;
}
.login-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #312e29;
  font-family: "Plus Jakarta Sans", sans-serif;
}
.login-input :deep(.el-input__inner::placeholder) {
  color: #b1ada5;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fe9c8c;
  color: #914539;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 24px;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 15px 30px -5px rgba(254, 156, 140, 0.5);
  transition: transform 0.15s, box-shadow 0.15s;
}
.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -5px rgba(254, 156, 140, 0.65);
}
.login-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

<template>
  <!-- fixed+inset-0,让其铺满整个屏幕,inset-0就是top/right/bottom/left四个都为0 -->
  <div class="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
    <!-- space-y控制每个子元素之间的间距 -->
    <div class="space-y-8 text-center">
      <div class="space-y-2">
        <div class="text-6xl font-light">
          {{ currentTime }}
        </div>
        <div class="text-sm text-white/60">
          {{ currentDate }}
        </div>
      </div>
      <!-- 下方卡片 -->
       <!-- backdrop-blur: 苹果ios毛玻璃效果 -->
      <div class="space-y-6 rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div class="space-y-3">
          <img
            :src="userStore.avatar"
            class="mx-auto h-20 w-20 rounded-full border-2 border-white/20"
            @error="onAvatarError"
          />
          <div class="text-lg font-medium">
            {{ userStore.nickName }}
          </div>
          <p class="text-sm text-white/60">
            系统已锁定，请输入登录密码解锁
          </p>
        </div>

        <div class="space-y-3">
          <!-- focus-within:元素内部有元素获得焦点时触发样式 -->
          <div
            :class="[
              'flex items-center rounded-full border border-white/15 bg-black/20 px-4 py-2 transition',
              'focus-within:border-white/40 focus-within:bg-black/30',
              isShaking && 'shake'
            ]"
          >
          <!-- autocomplete:关闭自动补全 ,即浏览器不会自动帮你填入之前输过的内容 -->
            <input
              ref="passwordInput"
              v-model="password"
              type="password"
              placeholder="请输入登录密码"
              autocomplete="off"
              class="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
              @keydown.enter="handleUnlock"
            />
            <!-- disabled:button的disabled生效的时候触发该样式 -->
            <button
              class="h-10 w-10 rounded-full bg-indigo-500 text-sm font-medium transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loading"
              @click="handleUnlock"
            >
              {{ loading ? '...' : '解锁' }}
            </button>
          </div>

          <p v-if="errorMsg" class="text-sm text-rose-300">
            {{ errorMsg }}
          </p>
        </div>

        <button class="text-sm text-white/50 transition hover:text-white/80" @click="goLogin">
          退出重新登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { unlockScreen } from '@/api/login'
import defAva from '@/assets/images/profile.jpg'
import useLockStore from '@/store/modules/lock'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const lockStore = useLockStore()

const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const isShaking = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const passwordInput = ref<HTMLInputElement | null>(null)

let timer: ReturnType<typeof setInterval> | null = null

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
// 图片加载错误时的处理
const onAvatarError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = defAva
}
// 更新时钟
const updateClock = () => {
  const now = new Date()
  // 简写的函数,相当于function pad(value: number){},在开头补0,至少两位,比如 5 -> 05, 10 -> 10
  const pad = (value: number) => String(value).padStart(2, '0')
  // map给数组每一项做一下pad的处理,join将数组每一项以:拼接成字符串
  currentTime.value = [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':')
  // 通过weekDays转换成中文的星期几
  currentDate.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`
}
// 密码输错或者其他情况的时候展示的内容
const showError = (message: string) => {
  errorMsg.value = message
  isShaking.value = true
  // 和直接setTimeout一样,这个表明是浏览器的API
  window.setTimeout(() => {
    isShaking.value = false
  }, 500)
}

// 解锁
const handleUnlock = async () => {
  if (!password.value) {
    showError('请输入密码')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await unlockScreen(password.value)
    
    const lockPath = lockStore.lockPath
    lockStore.unlockScreen()
    router.replace(lockPath)
  } catch (error: any) {
    // 展示接口报错信息
    showError(error?.message || String(error))
    password.value = ''
    nextTick(() => passwordInput.value?.focus())
  } finally {
    loading.value = false
  }
}
// 回到登录
const goLogin = async () => {
  lockStore.unlockScreen()
  await userStore.logOut()
  router.push('/login')
}

onMounted(() => {
  updateClock()
  // 每秒更新一次时钟
  timer = setInterval(updateClock, 1000)
  // 进入页面自动聚焦输入框(这里加nextTick的原因是输入框假如通过v-if="show"这个来控制渲染,那么组件挂载到DOM,响应式还没更新完成,输入框还没渲染,直接调用focus会报错)
  nextTick(() => passwordInput.value?.focus())
})
// 清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
/* 动态类名,密码错误的时候触发抖动动画 */
.shake {
  animation: shake 0.2s ease-in-out;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}
</style>

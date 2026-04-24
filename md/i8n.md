# 国际化
安装依赖(显示deprecated,因为是alpha版本)
```js
pnpm install vue-i18n@next
```
目录
```js
src/
└── i18n/
    ├── index.ts           # i18n 入口配置
    └── locales/
        ├── zh-cn.ts       # 中文语言包
        └── en.ts          # 英文语言包
```

src/i18n/locales/zh-cn.ts
```typescript
export default {
  common: {
    hello: '你好',
    welcome: '欢迎，{name}',
    confirm: '确认',
    cancel: '取消'
  },
  menu: {
    home: '首页',
    setting: '设置'
  }
}
```
src/i18n/locales/en.ts
```js
export default {
  common: {
    hello: 'Hello',
    welcome: 'Welcome, {name}',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  menu: {
    home: 'Home',
    setting: 'Setting'
  }
}
```

i18n 核心配置（src/i18n/index.ts）
```js
import { createI18n } from 'vue-i18n'
import zhCn from './locales/zh-cn'
import en from './locales/en'

const i18n = createI18n({
  legacy: false, // Vue3 必须关闭 Vue2 兼容模式
  locale: 'zh-cn', // 默认语言
  fallbackLocale: 'en', // 回退语言
  globalInjection: true, // 全局注入 $t
  messages: {
    'zh-cn': zhCn,
    'en': en
  }
})

export default i18n
```
全局注册（main.ts）
```js
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```


组件中使用
```js
<template>
  <div>{{ $t('common.hello') }}</div>
  <div>{{ $t('common.welcome', { name: 'Vue3' }) }}</div>
  <button>{{ $t('common.confirm') }}</button>
</template>


<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 切换语言
const changeLang = (lang: 'zh-cn' | 'en') => {
  locale.value = lang
  localStorage.setItem('lang', lang) // 持久化
}
</script>
```
element-plus国际化
与vue-i18n联动
合并语言包（src/i18n/index.ts）
```js
import { createI18n } from 'vue-i18n'
import zhCn from './locales/zh-cn'
import en from './locales/en'
// 引入 Element Plus 语言包
import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'zh-cn',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    'zh-cn': { ...zhCn, ...elZhCn }, // 合并自定义 + Element 中文
    'en': { ...en, ...elEn }          // 合并自定义 + Element 英文
  }
})

export default i18n
```
App.vue 中动态绑定 Element 语言
```vue
<template>
  <el-config-provider :locale="currentElLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import { useI18n } from 'vue-i18n'
import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

const { locale } = useI18n()
// 计算当前 Element 语言
const currentElLocale = computed(() => {
  return locale.value === 'zh-cn' ? elZhCn : elEn
})
</script>
```
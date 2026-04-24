import { createI18n } from 'vue-i18n'

import zhCn from './locales/zh-cn'
import en from './locales/en'

import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

export type AppLocale = 'zh-cn' | 'en'

export const LOCALE_STORAGE_KEY = 'lang'

export function getSavedLocale(): AppLocale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
  return (saved === 'en' || saved === 'zh-cn') ? saved : 'zh-cn'
}

const i18n = createI18n({
  // 不支持vue2的国际化
  legacy: false,
  locale: getSavedLocale(),
  // 国际化失败时转为英文
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    // 同时应用element国际化和国际化文件
    'zh-cn': { ...zhCn, ...elZhCn },
    'en': { ...en, ...elEn }
  }
})

export default i18n

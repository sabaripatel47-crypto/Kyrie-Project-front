import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { PluginOption } from 'vite'

export default function createVitePlugins(viteEnv: Record<string, string>, isBuild = false) {
  // 让 Vite 支持 Tailwind CSS,.vue 单文件组件
  const vitePlugins: PluginOption[] = [tailwindcss(), vue()]
  // 自动导入插件, 比如import Vue API（ref、reactive 等）
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  //把 SVG 当组件用
  vitePlugins.push(createSvgIcon(isBuild))
  // 只在打包时启用, 减少 dist 文件体积，加快网页加载速度
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}

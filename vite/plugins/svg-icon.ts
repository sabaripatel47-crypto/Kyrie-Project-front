import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default function createSvgIcon(isBuild: boolean) {
  return createSvgIconsPlugin({
    // 指定SVG 图标目录
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
    // 比如src/ assets / icons / svg / user.svg, 写成 < symbol id = "icon-user" > </symbol>(这个是自动转义,实际写为<use href="#icon-user">具体参考SvgIcon.vue)
    symbolId: 'icon-[dir]-[name]',
    // 是否开启 SVG 压缩优化（SVGO）
    svgoOptions: isBuild
  })
}

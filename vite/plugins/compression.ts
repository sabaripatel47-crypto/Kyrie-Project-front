import { PluginOption } from 'vite'
import compression from 'vite-plugin-compression'

export default function createCompression(env: Record<string, string>) {
  const { VITE_BUILD_COMPRESS } = env
  const plugin: PluginOption[] = []
  // 是否开启gzip压缩
  if (VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    if (compressList.includes('gzip')) {
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      plugin.push(
        compression({
          ext: '.gz',//压缩后的文件后缀,.gz
          deleteOriginFile: false//压缩后是否删除原文件
        })
      )
    }
    // 比gzip更先进的压缩算法,体积更小
    if (compressList.includes('brotli')) {
      plugin.push(
        compression({
          ext: '.br',
          algorithm: 'brotliCompress',
          deleteOriginFile: false
        })
      )
    }
  }
  return plugin
}

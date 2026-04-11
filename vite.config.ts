import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'

const baseUrl = 'http://localhost:8080' // 后端接口

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // 去“项目根目录”，读取.env.[mode] 文件里的内容
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    // 根据“环境变量 + 是否打包”，动态安装插件
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      // 导入文件无需后缀, 比如import utils from './utils/index'不用写index.js
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 打包配置
    build: {
      // https://vite.dev/config/build-options.html
      sourcemap: command === 'build' ? false : 'inline',
      // 打包后的文件
      outDir: 'dist',
      // 静态资源目录: dist / assets
      assetsDir: 'assets',
      //单个文件超过 2000KB（≈2MB） 才警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 拆分文件后的名字, 比如router/ index.ts, Home.vue变为static / js / Home.js, static/ js / router.js, static/ js / vendor.js   （vue、axios这些第三方库）
          chunkFileNames: 'static/js/[name]-[hash].js',
          // 应用入口文件的名字(main.ts)
          entryFileNames: 'static/js/[name]-[hash].js',
          // 例如logo.png, 变为static/ png / logo - xxx.png
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    // vite 相关配置
    server: {
      port: 80,
      //允许局域网访问
      host: true,
      open: true,
      proxy: {
        '/dev-api': {
          target: baseUrl,
          changeOrigin: true,//让后端以为是同源请求
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        },
        // springdoc proxy
        '^/v3/api-docs/(.*)': {
          target: baseUrl,
          changeOrigin: true,
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: any) => {
                // 在 CSS 打包过程中自动删除 @charset(@charset "UTF-8";)，避免冗余和兼容问题
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  }
})


import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    imports: [
      // 自动导入这些库的API,不用import
      'vue',
      'vue-router',
      'pinia'
    ],
    // TypeScript Declaration File, 自动生成auto- imports.d.ts
    dts: true
  })
}


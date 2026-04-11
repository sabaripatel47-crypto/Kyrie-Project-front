import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
// 用了后可以写name, <script setup name = "MyComponent" > </script>
export default function createSetupExtend() {
  return setupExtend({})
}

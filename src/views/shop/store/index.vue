<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center">
      
      <h1 class="text-xl font-bold text-gray-800 mb-4">
        Vue + Tailwind 示例
      </h1>

      <p class="text-gray-600 mb-4">
        你点击了 {{ count }} 次
      </p>

      <button
        @click="increment"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
      >
        点击 +1
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

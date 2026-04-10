<template>
  <div class="bg-blue-400 p-5">
    <!-- 去除线 -->
    <p><s>去除线</s></p>
  </div>
  <div class="bg-purple-400 p-5">
    手风琴
    <!-- accordion:同时只能打开一个collapse,像手风琴一样 -->
    <el-collapse accordion>
      <el-collapse-item title="手风琴1">
        <ol>
          <li>子元素1</li>
          <li>子元素2</li>
          <li>子元素3</li>
        </ol>
      </el-collapse-item>
      <el-collapse-item title="手风琴2">
        <ol>
          <li>子元素1</li>
        </ol>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
</script>

<style>
</style>
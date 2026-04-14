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
  <div class="bg-green-400 p-5">
    省市区选择
    <!-- emitPath设为false,选择最后一个区的区号 -->
    <el-cascader
      v-model="selectedArea"
      :options="areaData"
      :props="{
        value: 'value',
        label: 'label',
        children: 'children',
        emitPath: false,
      }"
      placeholder="请选择省/市/区"
      clearable
    />
    <p v-if="selectedArea">已选：{{ selectedArea }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { regionData } from "element-china-area-data";

const areaData = regionData;
const selectedArea = ref<string>("");
</script>

<style>
</style>
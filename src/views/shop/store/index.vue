<template>
  <div class="app-container">
    <el-form ref="queryRef" :model="queryParams" :inline="true" v-show="showSearch">
      <el-form-item label="店铺名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="模糊搜索"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="shopList">
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="Logo" align="center" width="100">
        <template #default="scope">
          <el-image
            v-if="resolveLogoUrl(scope.row.logo)"
            :src="resolveLogoUrl(scope.row.logo)"
            :preview-src-list="[resolveLogoUrl(scope.row.logo)]"
            fit="cover"
            style="width: 48px; height: 48px; border-radius: 6px"
            preview-teleported
          />
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center" prop="name" min-width="180" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="View"
            @click="handleDetail(scope.row)"
            v-hasPermi="['cs2:shop:query']"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="店铺详情" v-model="detailOpen" width="520px" append-to-body>
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="Logo">
          <el-image
            v-if="resolveLogoUrl(detail.logo)"
            :src="resolveLogoUrl(detail.logo)"
            :preview-src-list="[resolveLogoUrl(detail.logo)]"
            style="max-width: 200px; max-height: 200px"
            fit="contain"
            preview-teleported
          />
          <span v-else>—</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ parseTime(detail.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailOpen = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Cs2Store">
import { getShop, listShop } from '@/api/cs2/shop'
import type { Cs2Shop, Cs2ShopQueryParams } from '@/types/api/cs2/shop'

const { proxy } = getCurrentInstance()!

const baseApi = import.meta.env.VITE_APP_BASE_API

function resolveLogoUrl(path?: string | null) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return baseApi + path
}

const shopList = ref<Cs2Shop[]>([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const detailOpen = ref(false)
const detail = ref<Cs2Shop | null>(null)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined
  } as Cs2ShopQueryParams
})

const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listShop(queryParams.value).then(response => {
    shopList.value = response.rows ?? []
    total.value = response.total
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleDetail(row: Cs2Shop) {
  if (!row.id) return
  getShop(row.id).then(res => {
    detail.value = res.data ?? null
    detailOpen.value = true
  })
}

getList()
</script>

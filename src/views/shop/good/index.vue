<template>
  <div class="app-container">
    <el-form ref="queryRef" :model="queryParams" :inline="true" v-show="showSearch">
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="模糊搜索"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="全部" clearable style="width: 140px">
          <el-option v-for="item in productTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="稀有度" prop="rarity">
        <el-select v-model="queryParams.rarity" placeholder="全部" clearable style="width: 160px">
          <el-option v-for="item in rarityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 140px">
          <el-option label="在售" value="on_sale" />
          <el-option label="下架" value="off_sale" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺" prop="shopId">
        <el-select
          v-model="queryParams.shopId"
          placeholder="全部"
          filterable
          style="width: 200px"
        >
          <el-option v-for="s in shopOptions" :key="s.id!" :label="s.name" :value="s.id!" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['cs2:product:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate()"
          v-hasPermi="['cs2:product:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="DocumentChecked"
          :disabled="!hasPendingShopChanges || savingShops"
          :loading="savingShops"
          @click="saveShopBatch"
          v-hasPermi="['cs2:product:edit']"
        >保存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete()"
          v-hasPermi="['cs2:product:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="名称" align="center" prop="name" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="价格" align="center" prop="price" width="100" />
      <el-table-column label="库存" align="center" prop="stock" width="80" />
      <el-table-column label="类型" align="center" prop="type" width="100" />
      <el-table-column label="稀有度" align="center" prop="rarity" width="120" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'on_sale'" type="success">在售</el-tag>
          <el-tag v-else type="info">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="店铺" align="center" min-width="200">
        <template #default="scope">
          <el-select
            v-model="scope.row.shopId"
            placeholder="选择店铺"
            clearable
            filterable
            style="width: 100%"
            :disabled="!canEditProduct"
          >
            <el-option v-for="s in shopOptions" :key="s.id!" :label="s.name" :value="s.id!" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cs2:product:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cs2:product:remove']">删除</el-button>
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

    <el-dialog :title="title" v-model="open" width="640px" append-to-body>
      <el-form ref="productRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in productTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="稀有度" prop="rarity">
          <el-select v-model="form.rarity" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in rarityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="on_sale">在售</el-radio>
            <el-radio value="off_sale">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属店铺" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择店铺" clearable filterable style="width: 100%">
            <el-option v-for="s in shopOptions" :key="s.id!" :label="s.name" :value="s.id!" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">保 存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Cs2Good">
import { listProduct, getProduct, addProduct, updateProduct, delProduct, changeProductShop } from '@/api/cs2/product'
import { listShopOptions } from '@/api/cs2/shop'
import auth from '@/plugins/auth'
import type { Cs2Product, Cs2ProductQueryParams } from '@/types/api/cs2/product'
import type { Cs2Shop } from '@/types/api/cs2/shop'

const { proxy } = getCurrentInstance()!

const canEditProduct = computed(() => auth.hasPermi('cs2:product:edit'))

const productList = ref<Cs2Product[]>([])
const shopOptions = ref<Cs2Shop[]>([])
const open = ref(false)
const loading = ref(true)
const savingShops = ref(false)
/** 列表加载时的店铺归属，用于判断是否有未保存的下拉修改 */
const shopSnapshot = ref<Map<number, number | null>>(new Map())
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const productTypeOptions = [
  { label: '武器', value: 'weapon' },
  { label: '皮肤', value: 'skin' }
]

const rarityOptions = [
  { label: '消费级', value: 'consumer' },
  { label: '工业级', value: 'industrial' },
  { label: '军规级', value: 'mil_spec' },
  { label: '受限', value: 'restricted' },
  { label: '保密', value: 'classified' },
  { label: '隐秘', value: 'covert' },
  { label: '违禁', value: 'contraband' }
]

const hasPendingShopChanges = computed(() => {
  for (const r of productList.value) {
    if (r.id == null) continue
    const orig = shopSnapshot.value.get(r.id)
    const cur = r.shopId ?? null
    if ((orig ?? null) !== (cur ?? null)) return true
  }
  return false
})

const data = reactive({
  form: {} as Cs2Product,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    type: undefined,
    rarity: undefined,
    status: undefined,
    shopId: undefined
  } as Cs2ProductQueryParams,
  rules: {
    name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'change' }],
    stock: [{ required: true, message: '请输入库存', trigger: 'change' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    rarity: [{ required: true, message: '请选择稀有度', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

function captureShopSnapshot() {
  const m = new Map<number, number | null>()
  for (const r of productList.value) {
    if (r.id != null) m.set(r.id, r.shopId ?? null)
  }
  shopSnapshot.value = m
}

function loadShopOptions() {
  listShopOptions().then(res => {
    shopOptions.value = res.data ?? []
  })
}

function getList() {
  loading.value = true
  listProduct(queryParams.value).then(response => {
    productList.value = response.rows ?? []
    total.value = response.total
    captureShopSnapshot()
    loading.value = false
  })
}

/** 批量提交当前页表格中已修改的店铺 */
function saveShopBatch() {
  const tasks: Promise<unknown>[] = []
  for (const r of productList.value) {
    if (r.id == null) continue
    const orig = shopSnapshot.value.get(r.id)
    const cur = r.shopId ?? null
    if ((orig ?? null) === (cur ?? null)) continue
    if (cur != null) {
      tasks.push(changeProductShop({ id: r.id, shopId: cur }))
    } else {
      tasks.push(
        getProduct(r.id).then(res => {
          const data = res.data!
          return updateProduct({ ...data, shopId: null })
        })
      )
    }
  }
  if (!tasks.length) return
  savingShops.value = true
  Promise.all(tasks)
    .then(() => {
      proxy.$modal.msgSuccess('店铺已批量保存')
      getList()
    })
    .finally(() => {
      savingShops.value = false
    })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    id: undefined,
    name: '',
    price: 0,
    stock: 0,
    type: 'skin',
    rarity: 'classified',
    description: '',
    status: 'on_sale',
    shopId: undefined
  }
  proxy.resetForm('productRef')
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection: Cs2Product[]) {
  ids.value = selection.map(item => item.id!).filter(Boolean)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '新增商品'
}

function handleUpdate(row?: Cs2Product) {
  reset()
  const id = row?.id ?? ids.value[0]
  getProduct(id).then(response => {
    form.value = { ...response.data! }
    open.value = true
    title.value = '修改商品'
  })
}

function submitForm() {
  ;(proxy.$refs['productRef'] as any).validate((valid: boolean) => {
    if (!valid) return
    const req = form.value.id != null ? updateProduct(form.value) : addProduct(form.value)
    req.then(() => {
      proxy.$modal.msgSuccess(form.value.id != null ? '修改成功' : '新增成功')
      open.value = false
      getList()
    })
  })
}

function handleDelete(row?: Cs2Product) {
  const delIds = row?.id ?? ids.value
  proxy.$modal
    .confirm(`是否确认删除商品编号为「${delIds}」的数据？`)
    .then(() => delProduct(delIds))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

loadShopOptions()
getList()
</script>

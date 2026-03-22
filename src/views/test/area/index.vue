<template>
    <div class="app-container">

        <el-card shadow="never">
            <template #header>
                <span>1. 省 / 市 / 区 级联（Element Plus Cascader）</span>
            </template>
            <el-form label-width="100px">
                <el-form-item label="所在地区">
                    <el-cascader v-model="selectedCodes" :options="cascaderOptions" clearable filterable
                        placeholder="请选择省 / 市 / 区" style="width: 360px" @change="onCascaderChange" />
                </el-form-item>
                <el-form-item label="选中 code">
                    <el-tag v-if="selectedCodes.length" type="info">{{ selectedCodes.join(' → ') }}</el-tag>
                    <span v-else class="text-muted">未选择</span>
                </el-form-item>
                <el-form-item label="选中名称">
                    <el-tag v-if="selectedLabels.length" type="success">{{ selectedLabels.join(' / ') }}</el-tag>
                    <span v-else class="text-muted">未选择</span>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="TestArea">
import { computed, ref } from 'vue'
import pcaa from 'china-area-data/data.json'

type Pcaa = Record<string, Record<string, string>>
const data = pcaa as Pcaa
//结构如下
// {
//   "86": {                 // 国家（根）
//     "110000": "北京市",
//     "120000": "天津市",
//     ...
//   },
//   "110000": {            // 北京市下面的市级
//     "110100": "市辖区"
//   },
//   "110100": {            // 市辖区下面的区级
//     "110101": "东城区",
//     "110102": "西城区",
//     ...
//   }
// }

/** 递归构建 Cascader options需要的数据结构 */
// 传入 '86'(代表中国) → 拿到所有省
// 遍历每个省：
// 生成 { value, label }
// 再递归查这个省下面的市
// 市 → 再递归 → 区
// 最终生成一棵完整的树
//结构如下
// [
//   {
//     value: '110000',
//     label: '北京市',
//     children: [
//       {
//         value: '110100',
//         label: '市辖区',
//         children: [
//           {
//             value: '110101',
//             label: '东城区'
//           }
//         ]
//       }
//     ]
//   },
//   ...
// ]
function buildOptions(parentCode: string): any[] {
    const map = data[parentCode]
    if (!map) return []

    return Object.entries(map).map(([code, name]) => {
        // 递归得到children
        const children = buildOptions(code)
        return {
            value: code,
            label: name,
            //使用...的原因:没有children的时候不加入children字段到返回结果
            ...(children.length && { children }),
        }
    })
}

const cascaderOptions = buildOptions('86')

/** code → label */
//  ['110000', '110100', '110101']→['北京市', '市辖区', '东城区']
function codesToLabels(codes: string[]) {
    // res：结果数组（装名字）
    // code：当前处理的 code
    // i：索引（第几层）
    //用reduce相对于map来说可以过滤掉空的结果
    return codes.reduce<string[]>((res, code, i) => {
        // 第0层（省）→'86'（全国）
        // 第1层（市）→上一个 code（省）
        const parent = i === 0 ? '86' : codes[i - 1]
        // 因为无法直接通过code进行下标访问,所以只能通过父级来访问
        const name = data[parent]?.[code]
        if (name) res.push(name)
        return res
    }, [])
}

const selectedCodes = ref<string[]>([])
const selectedLabels = ref<string[]>([])

const onCascaderChange = (val: string[] = []) => {
    selectedLabels.value = codesToLabels(val)
}
</script>
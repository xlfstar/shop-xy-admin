<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="flex">
      <el-input v-model="specName" style="width: 220px" placeholder="规格名" />
      <el-button type="primary" @click="addSpec" class="ml-4"><i class="iconfont iconadd"></i>添加规格</el-button>
    </div>
    <div class="spec-box mt-6 w-full" v-for="(item, i) in specList" :key="i">
      <el-card>
        <template #header>
          <div class="card-header flex justify-between">
            <div class="flex">
              <el-input
                v-model="item.name"
                :disabled="item.disabled"
                @blur="item.disabled = true"
                size="small"
                class="mr-2" />
              <el-button link type="primary" @click="item.disabled = false" size="small"
                ><i class="iconfont iconedit1"></i>编辑</el-button
              >
              <el-button link type="danger" @click="handleDeleteSpec(i)" size="small"
                ><i class="iconfont iconshanchu1"></i>删除</el-button
              >
            </div>
            <div class="flex">
              <el-input v-model="attrName[i]" placeholder="规格值" size="small" class="mr-2" />
              <el-button type="primary" @click="handleAddSpecAttr(i)" size="small"
                ><i class="iconfont iconadd"></i>添加规格值</el-button
              >
            </div>
          </div>
        </template>
        <div class="min-h-8 flex gap-2">
          <el-tag
            v-for="(attr, k) in item.children"
            :key="attr.name"
            closable
            :disable-transitions="false"
            @close="handleDeleteAttr(i, k)">
            {{ attr.name }}
          </el-tag>
        </div>
      </el-card>
    </div>
    <el-button type="danger" class="my-4" @click="handleGenerateSkus"
      ><i class="iconfont iconshengchengpaiban mr-2"></i>生成SKU表格</el-button
    >
    <div class="flex-1 overflow-x-auto" v-if="!_.isEmpty(skus)">
      <el-table :data="skus" style="width: 100%" :header-cell-style="{ background: '#f8f8f8' }">
        <el-table-column v-for="col in extraColumns" :key="col" :label="col" fixed="left">
          <template #default="{ row, $index }">
            <span>{{ row[col] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" :width="60">
          <template #default="{ row, $index }">
            <upload-img :width="40" v-model="row.sku_image" />
          </template>
        </el-table-column>
        <el-table-column label="现价" :width="180">
          <template #default="{ row, $index }">
            <el-input-number placeholder="现价" :min="0" :precision="2" controls-position="right" v-model="row.price" />
          </template>
        </el-table-column>
        <el-table-column label="原价" :width="180">
          <template #default="{ row, $index }">
            <el-input-number
              placeholder="原价"
              :min="0"
              :precision="2"
              controls-position="right"
              v-model="row.cost_price" />
          </template>
        </el-table-column>
        <el-table-column label="库存" :width="180">
          <template #default="{ row, $index }">
            <el-input-number placeholder="库存" :min="0" controls-position="right" v-model="row.stock" />
          </template>
        </el-table-column>
        <el-table-column label="状态" :width="90">
          <template #default="{ row, $index }">
            <el-switch :inactive-value="0" :active-value="1" v-model="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="{ row, $index }">
            <el-button type="danger" @click="handleDeleteSku($index)"
              ><i class="iconfont iconshanchu"></i>删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { generateSkuTable, reverseEngineerData } from '@/utils'
import UploadImg from '../UploadImg.vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'
import { addSkus, getSkusList } from '@/api'
import { useTempSkusStore } from '@/stores/tempSuks'

const emit = defineEmits(['update:modelValue', 'onSuccess'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  submitParams: {
    type: Object
  }
})

const tempSkusStore = useTempSkusStore()
const excludeArr = [
  'id',
  'goods_id',
  'sku_image',
  'status',
  'stock',
  'price',
  'cost_price',
  'createdAt',
  'updatedAt',
  'spec_value_ids',
  'spec_values'
]

const route = useRoute()
const id = route.params.id

const specName = ref('')
const specList = ref([])
const attrName = ref([])
const extraColumns = ref([])

const skus = ref([])
//新增规格名称
const addSpec = () => {
  const isExist = specList.value.find((ele) => ele.name.toLowerCase().trim() === specName.value.toLowerCase().trim())
  if (isExist) return ElMessage.error('请勿添加重复的规格名！')
  const specRow = {
    name: specName.value,
    disabled: true,
    inputVisible: false,
    inputValue: '',
    children: []
  }
  specList.value.push(specRow)
  specName.value = ''
}
//删除规格名称
const handleDeleteSpec = (i) => {
  specList.value.splice(i, 1)
}
//添加规格值
const handleAddSpecAttr = (i) => {
  if (!attrName.value[i]) return ElMessage.error('请输入规格值')
  const isExist = specList.value[i].children.find(
    (ele) => ele.name.toLowerCase().trim() === attrName.value[i].toLowerCase().trim()
  )
  if (isExist) {
    ElMessage({ type: 'error', message: '请勿添加重复的规格值！' })
    return
  }
  specList.value[i].children.push({ name: attrName.value[i] })
  attrName.value[i] = ''
}
//删除规格值
const handleDeleteAttr = (i, k) => {
  specList.value[i].children.splice(k, 1)
}
//生成SKUS表
const handleGenerateSkus = () => {
  const efficientSpecList = specList.value.filter((ele) => !_.isEmpty(ele.children)) //有规格值的list
  if (_.isEmpty(efficientSpecList)) return ElMessage.error('没有可供生成SKUS的数据')
  let res = generateSkuTable(efficientSpecList)
  extraColumns.value = Object.keys(res[0])

  res = res.map((item) => {
    const obj = {}
    Object.entries(item).forEach(([key, value]) => {
      obj[key] = value
    })

    return { sku_image: '', price: 0, cost_price: 0, stock: 0, status: 0, spec_values: JSON.stringify(item), ...obj }
  })
  if (id) {
    res = res.map((item) => {
      let existItem = skus.value.find((i) => i.spec_values === item.spec_values)
      const { price, cost_price, ...values } = existItem || {}
      existItem = { ...values, price: price / 100, cost_price: cost_price / 100 }
      return existItem || item
    })
  }
  skus.value = res
}
//删除某个SKU
const handleDeleteSku = (i) => {
  skus.value.splice(i, 1)
}

//获取该商品下的SKUS列表
const fetchSkusList = async (goods_id) => {
  if (!goods_id) return
  try {
    const query = { goods_id }
    let { data, code, message } = await getSkusList({ query })
    if (code === 200) {
      console.log(code, data)

      let res = data.map((item, i) => {
        let { spec_values } = item || {}

        spec_values = JSON.parse(spec_values)
        const obj = {}
        Object.entries(spec_values).forEach(([key, value]) => {
          obj[key] = value
        })
        if (i < 1) {
          extraColumns.value = Object.keys(obj)
        }
        return Object.assign(item, obj)
      })

      const { price, cost_price, ...values } = res || {}

      const a = { ...values, ...{ price: price / 100, cost_price: cost_price / 100 } }
      console.log({ a })
      skus.value = res.map((item) => {
        item.price = item.price / 100
        item.cost_price = item.cost_price / 100
        return item
      })
      console.log({ skus: skus.value })
      let list = reverseEngineerData(res)
      list = list.filter((ele) => !excludeArr.includes(ele.name))
      list = list.map((ele) => {
        ele.children = _.uniqBy(ele.children, 'name')
        ele.disabled = true
        ele.inputVisible = false
        ele.inputValue = ''
        return ele
      })
      if (id) {
        specList.value = list
      }
    }
  } catch (error) {}
}
watch(
  () => props.modelValue,
  (n) => {
    skus.value = n
  }
)
watch(
  () => skus.value,
  (n) => {
    emit('update:modelValue', n)
  },
  { deep: true }
)
watch(
  () => props.submitParams,
  async (params) => {
    const { allowSubmit, body, goods_id } = params || {}
    // return
    if (allowSubmit && goods_id) {
      try {
        const { code, data, message } = await addSkus(goods_id, { body })
        if (code === 200) {
          emit('onSuccess', true)
        }
      } catch (error) {}
    }
  }
)

onMounted(() => {
  if (id) {
    fetchSkusList(id)
  }
})
</script>
<style lang="scss" scoped>
:deep(.spec-box .el-card__header) {
  padding: 8px 15px;
}
</style>

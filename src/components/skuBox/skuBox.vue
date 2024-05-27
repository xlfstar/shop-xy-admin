<template>
  <el-table :data="skus" border style="width: 100%" :header-cell-style="{ background: '#f8f8f8' }">
    <el-table-column
      v-for="item in extraCol"
      :key="item.id"
      :prop="item.name"
      :label="item.name"
      :width="100"></el-table-column>
    <el-table-column label="图片" :width="60">
      <template #default="{ row, $index }">
        <upload-img :width="40" v-model="row.sku_image" />
      </template>
    </el-table-column>
    <el-table-column label="现价">
      <template #default="{ row, $index }">
        <el-input-number placeholder="现价" :min="0" :precision="2" controls-position="right" v-model="row.price" />
      </template>
    </el-table-column>
    <el-table-column label="原价">
      <template #default="{ row, $index }">
        <el-input-number
          placeholder="原价"
          :min="0"
          :precision="2"
          controls-position="right"
          v-model="row.cost_price" />
      </template>
    </el-table-column>
    <el-table-column label="库存">
      <template #default="{ row, $index }">
        <el-input-number placeholder="库存" :min="0" controls-position="right" v-model="row.stock" />
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template #default="{ row, $index }">
        <el-switch :inactive-value="0" :active-value="1" v-model="row.status" />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row, $index }">
        <el-button type="danger"><i class="iconfont iconshanchu"></i>删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- <div class="py-2" style="border: 1px solid #ebeef5; border-top: none">
    <el-button @click="handleCreate" type="primary">提交</el-button>
  </div> -->
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { addSkus } from '@/api'
import UploadImg from '@/components/UploadImg.vue'
const emit = defineEmits(['submit', 'update:modelValue'])
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  extraCol: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const skus = ref([])

const change = (data, index, type) => {
  switch (type) {
    case 1: //图片
      skus.value[index].sku_image = data
      break
    case 2: //现价
      skus.value[index].price = data
      break
    case 3:
      skus.value[index].cost_price = data
      break
    case 4:
      skus.value[index].stock = data
      break
    case 5:
      skus.value[index].status = data
      break
    default:
      break
  }
}
function generateCombinations(specsArray) {
  // 递归函数用于生成规格组合
  function generateCombinationsRec(specsArray, index, currentCombination, combinations) {
    // 达到规格数组的末尾，将当前组合添加到结果中
    if (index === specsArray.length) {
      combinations.push(currentCombination)
      return
    }
    // 遍历当前规格的所有可能值
    for (let i = 0; i < specsArray[index].length; i++) {
      const newCombination = [...currentCombination]

      newCombination.push(specsArray[index][i])

      // 递归调用下一层规格
      generateCombinationsRec(specsArray, index + 1, newCombination, combinations)
    }
  }

  const combinations = []
  generateCombinationsRec(specsArray, 0, [], combinations)
  return combinations
}
function generateSKU() {
  const combinations = generateCombinations(props.data)
  let res = combinations.map((combination) => {
    const sku = {
      spec_value_ids: combination.map((spec) => spec.id).join(','),
      spec_value_names: combination.map((spec) => spec.name).join(', ')
    }

    props.extraCol.forEach((specType) => {
      const spec = combination.find((spec) => spec.spec_id === specType.id)
      sku[specType.name] = spec ? spec.name : ','
    })

    return sku
  })
  return res
}

// const handleCreate = () => {
//   console.log('提交最里层')
//   emit('submit', skus.value)
// }

watch(
  () => [props.data, props.extraCol],
  ([d, e]) => {
    console.log('props.data变了', props.data)
    skus.value = generateSKU()
    console.log('----skus.value', skus.value)
    emit('update:modelValue', skus.value)
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  // generateSKU()
})
</script>
<style lang="scss" scoped></style>

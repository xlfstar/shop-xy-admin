<template>
  <div class="w-full bg-gray-100 p-4 overflow-y-auto">
    <div class="spec-box flex">
      <div class="label text-slate-950">规格</div>
      <div class="spec-table flex-1">
        <choose-spec
          :data="spec_attr_list"
          @change="changeList"
          @add="handleAddAttr"
          @addSpec="handleAddSpec"
          :loading="loadingAttr" />
      </div>
    </div>
    <div class="sku-box flex mt-4" v-if="!_.isEmpty(skuFormData)">
      <div class="label text-slate-950">SKU表</div>
      <div class="flex-1 sku-table overflow-x-auto">
        <sku-box :data="skuFormData" :extra-col="extraCol" v-model="skus" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed, reactive } from 'vue'
import { addGoodsSpec, addGoodsAttr, getSpecList, getGoodsAttrList, getSkusList } from '@/api'
import chooseSpec from './skuBox/chooseSpec.vue'
import skuBox from './skuBox/skuBox.vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'
const emit = defineEmits(['submit', 'update:modelValue'])

const route = useRoute()

const goods_id = route.params.id

const skus = ref([])

const loadingAttr = ref(false)
const loadingSpec = ref(false)

const skuFormData = ref([])

const specList = ref([])
const attrList = ref([])

const spec_attr_list = ref([])
const extraCol = ref([])

const changeList = (e) => {
  console.log('list变了', e)
  skuFormData.value = e
  let res = e.flatMap((item) => item)
  res = res.flatMap((item) => item.spec_id)
  res = [...new Set(res)]
  res = specList.value.filter((i) => res.includes(i.id))
  extraCol.value = res
  console.log('extraCol.value----', extraCol.value)
}

const fetchSkusList = () => {
  if (!goods_id) return
  getSkusList({ query: goods_id }).then(({ code, data, message, count }) => {
    if (code === 200) {
      console.log({ data })
    }
  })
}

watch(
  () => [specList.value, attrList.value],
  ([s, a]) => {
    spec_attr_list.value = s.map((item) => {
      item.children = a.filter((ele) => ele.spec_id === item.id)
      return item
    })
  }
)

const fecthSpecList = () => {
  const query = { status: 1 }
  getSpecList({ query }).then(({ data, code, message }) => {
    if (code === 200) {
      specList.value = data
    }
  })
}

const fetchAttrList = () => {
  const query = { status: 1 }
  getGoodsAttrList({ query }).then(({ data, code, message }) => {
    if (code === 200) {
      attrList.value = data
    }
  })
}

const handleAddSpec = async (body) => {
  loadingSpec.value = true
  try {
    const { code, data, message } = await addGoodsSpec({ body })

    loadingSpec.value = false
    if (code === 200) {
      fecthSpecList()
    }
  } catch (error) {
    loadingSpec.value = false
  }
}

const handleAddAttr = (body) => {
  loadingAttr.value = true
  addGoodsAttr({ body })
    .then(({ code, message, data }) => {
      if (code === 200) {
        fetchAttrList()
      }
    })
    .finally(() => {
      loadingAttr.value = false
    })
}

watch(
  () => skus.value,
  (n) => {
    console.log('skus变了', skus)
    emit('update:modelValue', n)
  }
)

watch(
  () => skuFormData.value,
  (n) => {
    console.log('--skuFormData变了', n)
  },
  { deep: true }
)

onMounted(() => {
  fecthSpecList()
  fetchAttrList()
  fetchSkusList()
  // fetchSkusList()
})
</script>
<style lang="scss" scoped>
.spec-box,
.sku-box {
  .label {
    width: 100px;
    // background: #ebf1f6;
    text-align: right;
    padding: 0 10px;
    flex-shrink: 0;
  }
}
table,
th,
td {
  background: white;
  border: 1px solid #dcdfe6;
  border-collapse: collapse;
}
</style>

<template>
  <el-table :data="data" style="width: 100%" border :header-cell-style="{ background: '#f8f8f8' }">
    <el-table-column label="规格名" width="120">
      <template #default="{ row }">
        <span class="capitalize">{{ row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="规格值">
      <template #default="{ row, $index }">
        <div class="flex flex-wrap">
          <template v-if="!_.isEmpty(row.children)">
            <el-checkbox-group v-model="list[$index]" class="mr-4">
              <el-checkbox v-for="ele in row.children" :key="ele.id" :value="ele" border>
                {{ ele.name }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <el-button type="danger" @click="handleAddAttr(row)">
            <i class="iconfont iconadd"></i>
            规格值
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="py-2" style="border: 1px solid #ebeef5; border-top: none">
    <el-button @click="visible1 = true" type="danger"><i class="iconfont iconadd"></i>规格</el-button>
  </div>

  <el-dialog v-model="visible" title="添加规格值" width="500">
    <el-form :model="attrFormData" :rules="formRules" label-width="auto" ref="attrRef">
      <el-form-item label="规格名称" style="margin-bottom: 18px">
        <el-input v-model="current_spec.name" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="规格属性名称" prop="name">
        <el-input v-model="attrFormData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAttr(attrRef)" :loading="loading"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="visible1" title="添加规格" width="500">
    <el-form :model="specFormData" :rules="formRules" label-width="auto" ref="specRef">
      <el-form-item label="规格名称" style="margin-bottom: 18px">
        <el-input v-model="specFormData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitSpec(specRef)" :loading="loading"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'
import { getSkusList } from '@/api'
const emit = defineEmits(['change', 'add', 'addSpec'])
const props = defineProps({
  data: {
    type: Array,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const goods_id = route.params.id
const attrRef = ref(null)
const specRef = ref(null)

const current_spec = ref({})

const attrFormData = ref({})

const specFormData = ref({})

const formRules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const visible = ref(false)
const visible1 = ref(false)
const list = ref([])

const handleAddAttr = (row) => {
  current_spec.value = row
  visible.value = true
}

const handleSubmitAttr = async (el) => {
  if (!current_spec.value.id) return
  if (!el) return
  await el.validate(async (valid, fields) => {
    if (valid) {
      const body = { name: attrFormData.value.name, spec_id: current_spec.value.id }
      emit('add', body)
    } else {
    }
  })
}

const handleSubmitSpec = async (el) => {
  if (!el) return
  await el.validate(async (valid, fields) => {
    if (valid) {
      const body = { name: specFormData.value.name }
      emit('addSpec', body)
    } else {
    }
  })
}

// const fetchAttrList = () => {
//   getSkusList({ query: { goods_id } }).then(({ code, data, count, message }) => {
//     if (code === 200) {
//       let arr = []
//       arr = data.map((item) => item.spec_value_ids.split(','))
//       arr = arr.flatMap((i) => i)
//       arr = [...new Set(arr)]
//       arr = arr.map((item) => Number(item))
//     }
//   })
// }

watch(
  () => list.value,
  (n) => {
    emit('change', n)
  },
  {
    deep: true
  }
)

watch(
  () => props.loading,
  (n) => {
    if (!n) visible.value = false
  }
)

onMounted(() => {
  // fetchAttrList()
  if (goods_id) {
    setTimeout(() => {
      list.value = [
        [
          {
            id: 2,
            name: 'red',
            status: 1,
            spec_id: 1,
            createdAt: '2024-05-02T18:28:19.000Z',
            updatedAt: '2024-05-02T18:28:19.000Z'
          },
          {
            id: 4,
            name: 'yellow',
            status: 1,
            spec_id: 1,
            createdAt: '2024-05-03T07:20:02.000Z',
            updatedAt: '2024-05-03T07:20:02.000Z'
          }
        ],
        [
          {
            id: 1,
            name: 'm',
            status: 1,
            spec_id: 2,
            createdAt: '2024-05-02T18:26:11.000Z',
            updatedAt: '2024-05-02T18:26:11.000Z'
          },
          {
            id: 3,
            name: 'xl',
            status: 1,
            spec_id: 2,
            createdAt: '2024-05-02T18:29:28.000Z',
            updatedAt: '2024-05-02T18:29:28.000Z'
          }
        ]
      ]
    }, 200)
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-checkbox.is-bordered) {
  margin-bottom: 8px;
}
</style>

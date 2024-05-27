<template>
  <div class="page-main">
    <div class="filte-box">
      <el-form :model="filterParams" :inline="true" ref="filterRef">
        <el-form-item label="名称" prop="name"
          ><el-input placeholder="品牌名称" v-model="filterParams.name" style="width: 220px"
        /></el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status" style="width: 220px" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter" type="danger">筛选</el-button>
          <el-button @click="handleReset(filterRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex justify-between my-4">
      <el-button size="small" @click="handleDeleteList"><i class="iconfont iconshanchu1"></i>批量删除</el-button>
      <el-button size="small" type="danger" @click="handleAdd"><i class="iconfont iconadd"></i>创建品牌</el-button>
    </div>
    <div>
      <el-table
        :data="list"
        :header-cell-style="{ background: '#f5f7f8' }"
        show-overflow-tooltip
        v-loading="loading"
        style="width: 100%; flex: 1">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="goods_numbers" label="商品数量" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <span v-if="row.status === 1" class="text-green-500">启用</span>
            <span v-else class="text-red-700">禁用</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="180">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEditItem(row)"
              ><i class="iconfont iconedit1"></i>编辑</el-button
            >
            <el-button size="small" type="danger" @click="handleDelItem(row.id)" :loading="delLoading"
              ><i class="iconfont iconshanchu1"></i>删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page mt-4">
        <el-pagination
          v-model:current-page="page"
          :page-size="limit"
          :background="true"
          :page-sizes="[20, 40, 60, 100]"
          layout="total,size, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
  <el-dialog :title="dialogTitle" v-model="visible" width="500">
    <div>
      <el-form :model="editFormData" ref="eidtFormRef" label-position="auto" label-width="80">
        <el-form-item prop="name" label="名称">
          <el-input v-model="editFormData.name" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
            v-model="editFormData.status" />
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="editFormData.sort" :max="255" :min="1" />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-end flex-1">
            <el-button type="primary" @click="handleSubmit" :loading="dialogLoading">确认</el-button>
            <el-button @click="visible = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { getBrandList, addBrand, upBrand, delBrand } from '@/api'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import useTable from '@/hooks/useTable'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
// const list = ref([])
// const loading = ref(false)
const filterRef = ref(null)
const filterParams = ref({})
const dialogLoading = ref(false)
const eidtFormRef = ref(null)
const editFormData = ref({ status: 1, sort: 255, name: '' })
const dialogTitle = ref('')
const visible = ref(false)
const delLoading = ref(false)
const page = ref(1)
const limit = ref(20)
const refresh = ref(false)

const filterQuery = computed(() => {
  const { status, name } = filterParams.value || {}
  return Object.assign({ name }, (status === 0 || status === 1) && { status })
})
const { data: list, count: total, loading } = useTable(getBrandList, filterQuery, page, limit, refresh)

const handleAdd = () => {
  dialogTitle.value = '创建商品品牌'
  visible.value = true
}

const handleEditItem = (row) => {
  editFormData.value = row
  dialogTitle.value = `编辑商品品牌：${row.name}`
  visible.value = true
}

const handleFilter = () => {
  page.value = 1
  refresh.value = !refresh.value
}

const handleSubmit = async () => {
  const { id } = editFormData.value || {}
  const API = id ? upBrand : addBrand

  try {
    dialogLoading.value = true
    const body = editFormData.value
    const { code, data, message } = await API({ body })
    if (code === 200) {
      ElMessage({
        type: 'success',
        message
      })
      refresh.value = !refresh.value
    }
  } catch (error) {
  } finally {
    dialogLoading.value = false
    visible.value = false
  }
}

const handleDelItem = (id) => {
  if (!id) return
  ElMessageBox.confirm('确定要删除该选项？', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      const body = { id }
      delLoading.value = true
      delPayMethod({ body })
        .then(({ code, message }) => {
          if (code === 200) {
            ElMessage({
              type: 'success',
              message
            })
          }
        })
        .finally(() => {
          delLoading.value = false
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const handleReset = (el) => {
  if (!el) return
  el.resetFields()
  refresh.value = !refresh.value
}
const handleSizeChange = (size) => {
  limit.value = size
  refresh.value = !refresh.value
}

const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  refresh.value = !refresh.value
}
</script>
<style lang="scss" scoped></style>

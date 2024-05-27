<template>
  <div class="container-xy flex-col flex mb-7">
    <div class="filter shrink-0">
      <el-form :model="filterData" :inline="true" ref="filterRef" class="filter-form">
        <el-form-item label="名称" prop="title">
          <el-input v-model="filterData.title" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="cate_id">
          <el-select v-model="filterData.cate_id">
            <el-option label="全部" value="all" />
            <el-option v-for="(item, i) in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterData.status">
            <el-option label="全部" value="all" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter" type="danger">筛选</el-button>
          <el-button @click="handleReset(filterRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-full relative flex-col flex-1 flex">
      <div class="table-top">
        <div>
          <el-button size="small">批量删除</el-button>
          <el-button size="small">批量上架</el-button>
          <el-button size="small">批量下架</el-button>
        </div>
        <el-button size="small" type="danger" @click="handleAdd">创建商品</el-button>
      </div>
      <el-table
        :data="goodsList"
        :header-cell-style="{ background: '#f5f7f8' }"
        show-overflow-tooltip
        v-loading="loading"
        style="width: 100%; flex: 1"
        ref="tableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="main_image" label="图片" width="100" header-align="center">
          <template #default="{ row }">
            <el-image style="width: 60px; height: 60px" :src="row.main_image" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" width="280" />
        <el-table-column prop="sub_title" label="副标题" width="280" />
        <el-table-column prop="cate_id" label="分类" width="100">
          <template #default="{ row }">
            <span>{{ categories.find((i) => i.id === row.cate_id)?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span>{{ divideWithPrecision(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <span :class="[row.status === 1 ? 'text-green-500' : 'text-gray-300']">{{
              row.status === 1 ? '上架' : '下架'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="180">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="router.push({ name: 'goodsEdit', params: { id: row.id } })"
              ><i class="iconfont iconedit1"></i>编辑</el-button
            >
            <el-button size="small" type="danger"><i class="iconfont iconshanchu1"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
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
</template>
<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { getCategories, getGoodsList } from '@/api'
import { useRouter } from 'vue-router'
import { divideWithPrecision } from '@/utils'
import useTable from '@/hooks/useTable'

const router = useRouter()
const page = ref(1)
const limit = ref(20)
const refresh = ref(false)
const filterRef = ref(null)
const tableRef = ref(null)
const containerRef = ref(null)
const filterData = ref({
  title: '',
  cate_id: 'all',
  status: 'all'
})

const filterQuery = computed(() => {
  const { title, cate_id, status } = filterData.value || {}
  const res = Object.assign({ title }, cate_id !== 'all' && { cate_id }, status !== 'all' && { status })
  return res
})

const { data: goodsList, count: total, loading } = useTable(getGoodsList, filterQuery, page, limit, refresh)

const categories = ref([])
const fetchCategories = () => {
  getCategories({ query: { status: 1 } }).then((res) => {
    const { data, code, message } = res || {}
    if (code === 200) {
      categories.value = data
    }
  })
}

const handleFilter = () => {
  page.value = 1
  refresh.value = !refresh.value
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

const handleAdd = () => {
  router.push('/goods/add')
}

onMounted(() => {
  fetchCategories()
  nextTick(() => {
    window.onresize = () => {}
  })
})
</script>
<style lang="scss" scoped>
.container-xy {
  box-shadow: 0 0.375rem 0.75rem rgba(140, 152, 164, 0.075);
  padding: 20px;
  border: 1px solid rgba(231, 234, 243, 0.7);
  border-radius: 8px;
  background-color: #fff;

  .filter-form {
    .el-input {
      --el-input-width: 220px;
    }
    .el-select {
      --el-select-width: 220px;
    }
  }
}
.table-top {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
}
.page {
  margin-top: 20px;
}
</style>

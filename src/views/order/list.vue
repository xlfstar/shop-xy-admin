<template>
  <div class="order-main flex-col flex mb-7">
    <div class="filter shrink-0">
      <el-form :model="filterData" :inline="true" ref="filterRef" class="filter-form" :label-width="60">
        <el-form-item label="订单号" prop="oid">
          <el-input v-model="filterData.oid" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="filterData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterData.status" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="用户取消" :value="0" />
            <el-option label="待付款" :value="1" />
            <el-option label="待发货" :value="2" />
            <el-option label="已发货" :value="3" />
            <el-option label="已收货" :value="4" />
            <el-option label="已过期" :value="5" />
            <el-option label="已完成" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="payment_method">
          <el-select v-model="filterData.payment_method" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="" :value="1" />
            <el-option label="待发货" :value="2" />
            <el-option label="已发货" :value="3" />
            <el-option label="已收货" :value="4" />
            <el-option label="已过期" :value="5" />
            <el-option label="已完成" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="filterData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter" type="danger">筛选</el-button>
          <el-button @click="handleReset(filterRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-full relative flex-col flex-1 flex text-gray-300">
      <div class="table-top my-4">
        <div>
          <el-button size="small">批量删除</el-button>
        </div>
      </div>
      <el-table
        :data="orderList"
        :header-cell-style="{ background: '#f5f7f8' }"
        show-overflow-tooltip
        v-loading="loading"
        style="width: 100%; flex: 1"
        ref="tableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="oid" label="订单号" width="180" />
        <el-table-column prop="member_id" label="用户Id" width="100" />
        <el-table-column prop="member_name" label="订单姓名" width="120">
          <template #default="{ row }">
            <span>{{ `${row.first_name} ${row.last_name}` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="postal_code" label="邮政编码" width="100" />
        <el-table-column prop="payment_method" label="付款方式" width="100" />
        <el-table-column
          prop="sub_total"
          label="总价"
          width="100"
          :formatter="(row, col, cell, index) => divideWithPrecision(cell)" />
        <el-table-column
          prop="shipping_amount"
          label="运费"
          width="100"
          :formatter="(row, col, cell, index) => divideWithPrecision(cell)" />
        <el-table-column prop="discount" label="折扣" width="100" :formatter="(row, col, cell, index) => `${cell}%`" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <span v-if="row.status === 0" class="text-gray-300">用户取消</span>
            <span v-else-if="row.status === 1" class="text-fuchsia-300">待付款</span>
            <span v-else-if="row.status === 2" class="text-blue-300">待发货</span>
            <span v-else-if="row.status === 3" class="text-red-300">已发货</span>
            <span v-else-if="row.status === 4" class="text-green-300">已收货</span>
            <span v-else-if="row.status === 5" class="text-red-800">已过期</span>
            <span v-else-if="row.status === 6" class="text-green-500">已完成</span>
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
</template>
<script setup>
import { ref } from 'vue'
import useTable from '@/hooks/useTable'
import { getOrderList } from '@/api'
import { divideWithPrecision } from '@/utils'
//状态0:用户取消,1:待付款,2:已付款未发货，3:已付款已发货，4:已付款已收货，5:时间到未付款过期，6:已完成
const filterData = ref({})
const filterRef = ref(null)
const page = ref(1)
const limit = ref(20)
const refresh = ref(false)
const { data: orderList, count: total, loading } = useTable(getOrderList, filterData, page, limit, refresh)
// const { data: goodsList, count: total, loading } = useTable(getGoodsList, filterData, page, limit, refresh)

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
// const
</script>
<style lang="scss" scoped>
.order-main {
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
</style>

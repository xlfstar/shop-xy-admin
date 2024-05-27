<template>
  <div class="wrapper">
    <el-row :gutter="30">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <DataCard :today="888" :yesterday="1333" title="销售额" unit="$" :decimal="true" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <DataCard :today="10088" :yesterday="88" title="订单量" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <DataCard :today="9" :yesterday="5" title="新增用户" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <DataCard :today="14" :yesterday="14" title="新增商品" />
      </el-col>
    </el-row>
    <div class="order-echarts"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import DataCard from './components/dataCard.vue'
</script>
<style lang="scss" scoped>
.data-card-list {
  margin-left: -15px;
  margin-right: -15px;
  display: flex;
  .card {
    padding: 15px;
    width: 25%;
  }
}
</style>

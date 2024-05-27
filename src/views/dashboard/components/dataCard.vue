<template>
  <div class="item">
    <div class="top">
      <span class="title">{{ title }}</span>
      <span class="date">今日</span>
    </div>
    <div class="data">
      <el-statistic :value="todayValue" :precision="precision" :prefix="unit" :value-style="todayStyle" />
    </div>
    <div class="bottom flex">
      <div style="color: rgba(33, 37, 41, 0.75)">昨日</div>
      <div style="margin-left: 5px; color: rgba(33, 37, 41, 0.75)">
        <el-statistic :value="yesterdayValue" :precision="precision" :prefix="unit" :value-style="yesterdayStyle" />
      </div>
      <el-divider direction="vertical" />
      <div style="color: rgba(33, 37, 41, 0.75)">较前一日</div>
      <div :style="{ 'margin-left': '5px', color: isAddState === 1 ? 'green' : isAddState === 2 ? 'gray' : 'red' }">
        <el-statistic :value="percent" :precision="percent !== 0 ? 2 : 0" suffix="%" :value-style="yesterdayStyle" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { divideWithPrecision } from '@/utils'
const props = defineProps({
  today: {
    type: Number,
    default: 0
  },
  yesterday: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  decimal: {
    type: Boolean,
    default: false
  }
})

const isAddState = ref(1)

const percent = computed(() => {
  if (props.yesterday === 0) {
    if (props.today > 0) {
      return 1000
    } else {
      return 0
    }
  } else {
    const diff = props.today - props.yesterday
    if (diff > 0) {
      isAddState.value = 1
    } else if (diff === 0) {
      isAddState.value = 2
      return 0
    } else {
      isAddState.value = 3
    }
    return Number(divideWithPrecision(diff * 100, props.yesterday))
    // return (Math.abs(diff) / yesterday) * 100
  }
})

const todayStyle = { fontWeight: 'bold', 'font-size': '24px' }
const yesterdayStyle = Object.assign(
  { fontSize: '12px' },
  props.yesterday > props.today
    ? { color: '#F56C6C' }
    : props.yesterday === props.today
    ? { color: '#DCDFE6' }
    : { color: '#67C23A' }
)

const todayValue = computed(() => Number(props.decimal ? divideWithPrecision(props.today, 100) : props.today))
const yesterdayValue = computed(() =>
  Number(props.decimal ? divideWithPrecision(props.yesterday, 100) : props.yesterday)
)

const precision = computed(() => (props.decimal ? 2 : 0))
</script>
<style lang="scss" scoped>
.item {
  box-shadow: 0 0.375rem 0.75rem rgba(140, 152, 164, 0.075);
  padding: 20px;
  border: 1px solid rgba(231, 234, 243, 0.7);
  border-radius: 8px;
  margin-bottom: 20px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-weight: bold;
      font-size: 14px;
    }
    .date {
      padding: 5px 8px;
      border-radius: 2px;
      background: #ccf7e5;
      color: #00d97e;
      font-size: 12px;
    }
  }
  .data {
    font-size: 24px;
    font-weight: bold;
    padding: 15px 0;
  }
  .bottom {
    font-size: 12px;
  }
}
:deep(.el-statistic__content) {
  font-size: 12px;
}
</style>

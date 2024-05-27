<template>
  <div class="left">
    <aside class="menu">
      <div
        class="menu-item"
        v-for="(item, i) in menuList"
        :key="item.id"
        @click="handleChangeMenu(item)"
        :class="[currentMenuId === item.id && 'active', showSubMenu && 'other']">
        <i :class="['iconfont', item.icon]"></i>
        <span>{{ item.label }}</span>
      </div>
    </aside>

    <aside class="sub-menu" v-if="showSubMenu">
      <div class="title">{{ currentMenu.label }}</div>
      <div
        class="menu-item"
        v-for="(item, i) in sub_menuList.filter((ele) => !ele.hide)"
        :key="item.id"
        @click="handleChangeRoute(item)"
        :class="currentSubMenuId === item.id && 'active'">
        <span>{{ item.label }}</span>
        <i class="iconfont iconnext1"></i>
      </div>
    </aside>
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue'
import _ from 'lodash'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuList = reactive([
  {
    id: 1,
    label: '首页',
    icon: 'iconyibiaopan',
    path: '/dashboard',
    name: 'dashboard'
  },
  {
    id: 2,
    label: '订单',
    icon: 'icondingdan',
    children: [
      {
        id: 17,
        label: '订单管理',
        path: '/order/list',
        name: 'orderList'
      },
      {
        id: 18,
        label: '退货管理',
        path: '/order/back',
        name: 'orderBack'
      }
    ]
  },
  {
    id: 3,
    label: '商品',
    icon: 'iconshangpin-xianxing',
    children: [
      {
        id: 6,
        label: '商品管理',
        path: '/goods/list',
        name: 'goodsList'
      },
      {
        id: 7,
        label: '商品分类',
        path: '/goods/category',
        name: 'goodsCategory'
      },
      {
        id: 21,
        label: '品牌管理',
        path: '/goods/brand',
        name: 'goodsBrand'
      },
      {
        id: 8,
        label: '商品规格',
        path: '/goods/spec',
        name: 'goodsSpec'
      },
      {
        id: 19,
        label: '新增商品',
        path: '/goods/add',
        hide: true,
        name: 'goodsAdd',
        pid: 6
      },
      {
        id: 20,
        label: '编辑商品',
        path: '/goods/edit',
        hide: true,
        name: 'goodsEdit',
        pid: 6
      }
    ]
  },
  {
    id: 4,
    label: '用户',
    icon: 'iconyonghu',
    children: [
      {
        id: 9,
        label: '用户管理',
        path: '/member/list',
        name: 'memberList'
      },
      {
        id: 10,
        label: '用户组',
        path: '/member/group',
        name: 'memberGroup'
      }
    ]
  },
  {
    id: 5,
    label: '设置',
    icon: 'iconshezhi',
    children: [
      {
        id: 11,
        label: '系统设置',
        path: '/setting/system',
        name: 'settingSystem'
      },
      {
        id: 12,
        label: '管理员',
        path: '/setting/manager',
        name: 'settingManager'
      },
      {
        id: 13,
        label: '国家/地区',
        path: '/setting/area',
        name: 'settingArea'
      },
      {
        id: 14,
        label: '省份管理',
        path: 'setting/province',
        name: 'settingProvince'
      },
      {
        id: 15,
        label: '快递公司',
        path: '/setting/express',
        name: 'settingExpress'
      },
      {
        id: 16,
        label: '付款方式',
        path: '/setting/paymethod',
        name: 'settingPaymethod'
      }
    ]
  }
])

const currentMenuId = ref(1)
const currentSubMenuId = ref()

const currentMenu = ref({})
const sub_menuList = ref()

const showSubMenu = ref(false)

const handleChangeMenu = (item) => {
  currentMenu.value = item
  currentMenuId.value = item.id
  if (!_.isEmpty(item.children)) {
    sub_menuList.value = item.children
    currentSubMenuId.value = item.children[0]?.id
    showSubMenu.value = true
    router.push(item.children[0]?.path)
  } else {
    showSubMenu.value = false
    item.path && router.push(item.path)
  }
}

const handleChangeRoute = (item) => {
  const { path, id } = item || {}
  currentSubMenuId.value = id
  path && router.push(path)
}

watch(
  () => route.name,
  (name) => {
    let res = menuList.find((item) => item.name === name && item.name)
    if (res) {
      currentMenu.value = res
      currentMenuId.value = res.id
    } else {
      for (let i = 0; i < menuList.length; i++) {
        res = menuList[i]?.children?.find((c) => c.name === name)
        if (res) {
          currentMenu.value = menuList[i]
          currentMenuId.value = menuList[i].id
          if (res.hide) {
            currentSubMenuId.value = res.pid
          } else {
            currentSubMenuId.value = res.id
          }
          sub_menuList.value = menuList[i].children
          showSubMenu.value = true
          break
        }
      }
    }
  }
)

watch(
  () => showSubMenu.value,
  (n) => {
    console.log('---showSubMenu', n)
  }
)
</script>
<style scoped lang="scss">
.left {
  display: flex;
}
.menu {
  height: 100%;
  width: 92px;
  background-color: #ebf1f6;
  padding: 15px 0;
  .menu-item {
    padding: 15px 8px;
    display: flex;
    align-items: center;
    color: #333;
    cursor: pointer;
    transition: all linear 0.1s;
    position: relative;
    &:hover {
      background: #f9fbfd;
      &::before {
        background: radial-gradient(circle closest-side, transparent 0, transparent 50%, #fff 0) 200% 200% / 400% 400%;
        content: '';
        height: 8px;
        overflow: hidden;
        position: absolute;
        right: 0;
        width: 8px;
        top: -8px;
      }
      &::after {
        background: radial-gradient(circle closest-side, transparent 0, transparent 50%, #fff 0) 200% 200% / 400% 400%;
        content: '';
        height: 8px;
        overflow: hidden;
        position: absolute;
        right: 0;
        width: 8px;
        bottom: -8px;
        transform: scaleY(-1);
      }
    }
    &.active {
      background: #f9fbfd;
      &::before {
        background: radial-gradient(circle closest-side, transparent 0, transparent 50%, #fff 0) 200% 200% / 400% 400%;
        content: '';
        height: 8px;
        overflow: hidden;
        position: absolute;
        right: 0;
        width: 8px;
        top: -8px;
      }
      &::after {
        background: radial-gradient(circle closest-side, transparent 0, transparent 50%, #fff 0) 200% 200% / 400% 400%;
        content: '';
        height: 8px;
        overflow: hidden;
        position: absolute;
        right: 0;
        width: 8px;
        bottom: -8px;
        transform: scaleY(-1);
      }
    }
    &.other {
      // background-color: #ffffff;
      &:hover {
        background-color: #ffffff;
      }
      &.active {
        background-color: #ffffff;
      }
    }

    > span {
      // font-weight: 700;
      margin-left: 8px;
    }
  }
}
.sub-menu {
  height: 100%;
  width: 120px;
  border-right: 1px solid #f1f1f1;
  background-color: #ffffff;
  padding: 0 8px;
  .title {
    font-size: 20px;
    // font-weight: bold;
    line-height: 100px;
    text-align: center;
  }
  .menu-item {
    cursor: pointer;
    color: #333;
    margin-bottom: 15px;
    padding: 8px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background-color: #f2f3f6;
    }
    &.active {
      color: red;
    }
  }
}
</style>

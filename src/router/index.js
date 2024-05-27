import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { path: '/dashboard' }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/dashboard/index.vue'),
      meta: {
        title: '仪表盘'
      }
    },
    {
      path: '/goods/list',
      name: 'goodsList',
      meta: {
        title: '商品'
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/goods/list.vue')
    },
    {
      path: '/goods/add',
      name: 'goodsAdd',
      meta: {
        title: '新建商品'
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/goods/add.vue')
    },
    {
      path: '/goods/edit/:id',
      name: 'goodsEdit',
      meta: {
        title: '编辑商品'
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/goods/edit.vue')
    },
    {
      path: '/goods/category',
      name: 'goodsCategory',
      meta: {
        title: '商品分类'
      },
      component: () => import('../views/category/index.vue')
    },
    {
      path: '/goods/brand',
      name: 'goodsBrand',
      meta: {
        title: '商品品牌'
      },
      component: () => import('../views/goods/brand.vue')
    },
    {
      path: '/order/list',
      name: 'orderList',
      meta: {
        title: '订单列表'
      },
      component: () => import('../views/order/list.vue')
    },
    {
      path: '/setting/paymethod',
      name: 'paymethod',
      meta: {
        title: '付款方式'
      },
      component: () => import('../views/setting/paymethod.vue')
    }
  ]
})

export default router

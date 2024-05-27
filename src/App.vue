<template>
  <Suspense>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <!-- <transition mode='out-in' :name="route.meta.transition || 'fade'"> -->
        <!-- <keep-alive> -->
        <template v-if="route.path === '/login'">
          <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
        </template>
        <template v-else>
          <div class="wrapper">
            <header class="admin-header">
              <div class="header-left">logo</div>
              <div class="header-right">
                <span class="quit" @click="handleLogout">
                  <i class="iconfont iconhkquit"></i>
                </span>
              </div>
            </header>
            <main class="admin-main">
              <admim-aside />
              <main class="admin-content">
                <div class="content-header">{{ title }}</div>
                <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
              </main>
            </main>
          </div>
        </template>

        <!-- </keep-alive> -->
        <!-- </transition> -->
      </router-view>
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
<script setup>
import { computed } from 'vue'
import AdmimAside from '@/components/layout/aside.vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const title = computed(() => route?.meta?.title || '后台管理')
const handleLogout = () => {
  useUserStore().logout()
  router.push('/login')
}
</script>
<style scoped lang="scss">
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.admin-header {
  position: sticky;
  background: #ffffff;
  top: 0;
  flex-shrink: 0;
  height: 54px;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 999;
  .header-right {
    .quit {
      padding: 15px;
      cursor: pointer;
    }
  }
}
.admin-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  .admin-aside {
    flex-shrink: 0;
  }
  .admin-content {
    flex: 1;
    background-color: #f9fbfd;
    padding: 0 20px;
    overflow-y: auto;
    .content-header {
      font-size: 20px;
      padding: 15px 0;
    }
  }
}
</style>

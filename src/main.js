import '@/assets/main.css'
import { createApp } from 'vue'
import { createPinia, storeToRefs } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
const userStore = useUserStore()

const { isLogin } = storeToRefs(userStore)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (isLogin.value) {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  } else {
    if (!isLogin.value) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})
app.mount('#app')

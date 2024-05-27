import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login } from '@/api'

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref(null)
    const isLogin = ref(false)
    const token = ref('')

    const signIn = async (body) => {
      try {
        const { code, data, message, token: uToken } = await login({ body })
        console.log({ code, data, message }, 1111111)
        userInfo.value = data
        isLogin.value = true
        token.value = uToken
      } catch (error) {}
    }

    const logout = () => {
      userInfo.value = null
      isLogin.value = false
      token.value = ''
    }
    return { signIn, isLogin, userInfo, token, logout }
  },
  {
    persist: true
  }
)

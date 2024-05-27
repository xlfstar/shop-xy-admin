<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="title">管理后台登录</h2>
      <el-form ref="loginFormRef" :model="formData">
        <el-form-item prop="userName">
          <el-input v-model="formData.userName" size="large" placeholder="账号">
            <template #prefix>
              <i class="iconfont iconcustom-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" size="large" type="password" show-password placeholder="密码">
            <template #prefix> <i class="iconfont iconios-lock"></i> </template
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" size="large" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCategoriesStore } from '@/stores/categories'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()
const catgoriesStore = useCategoriesStore()

const loginFormRef = ref()

const formData = reactive({
  userName: '',
  password: ''
})

const { isLogin } = storeToRefs(userStore)

const handleLogin = async () => {
  if (!loginFormRef) return
  await loginFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      await userStore.signIn(formData)
      await catgoriesStore.getList()
      router.push('/')
    } else {
      console.log('error submit!', fields)
    }
  })
}
watch(
  () => isLogin.value,
  (n) => {
    if (n) {
      router.replace('/')
    }
  }
)
</script>
<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  background: #f7fdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    width: 75vw;
    height: 75vw;
    border-radius: 50%;
    background-color: #edf2fd;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:after {
    content: '';
    position: absolute;
    width: 50vw;
    height: 50vw;
    border-radius: 50%;
    background-color: #e1e8fd;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-form {
    position: relative;
    z-index: 1;
    width: 500px;
    box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 50px;
    border-radius: 10px;
  }
}
</style>

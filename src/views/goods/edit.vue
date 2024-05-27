<template>
  <div class="container-xy relative">
    <div class="absolute spec-set right-0 top-0">
      <el-button type="danger" @click="visible = true" :disabled="!id">规格设置</el-button>
    </div>
    <el-form :model="formData" ref="formRef" class="goods-form" :label-width="100" :rules="goodsRules">
      <el-form-item label="名称" prop="title">
        <el-input v-model="formData.title" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="副标题" prop="sub_title">
        <el-input v-model="formData.sub_title" placeholder="商品副标题" />
      </el-form-item>
      <el-form-item label="分类" prop="cate_id">
        <el-cascader
          :options="cascaderList"
          :show-all-levels="false"
          v-model="formData.cate_id"
          :props="{ label: 'name', value: 'id', emitPath: false }" />
      </el-form-item>
      <el-form-item label="促销语" prop="promotion">
        <el-input v-model="formData.promotion" placeholder="商品促销语" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="商品单位" />
      </el-form-item>
      <el-form-item label="主图" prop="main_image">
        <UploadImg :width="180" v-model="formData.main_image" />
      </el-form-item>
      <el-form-item label="现价" prop="price">
        <el-input-number v-model="formData.price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="原价" prop="cost_price">
        <el-input-number v-model="formData.cost_price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="formData.stock" :min="0" />
      </el-form-item>
      <el-form-item label="显示库存" prop="is_show_stock">
        <el-switch v-model="formData.is_show_stock" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="首页轮播" prop="is_index_recommend">
        <el-switch v-model="formData.is_index_recommend" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="轮播图" prop="banner_image" v-if="formData.is_index_recommend">
        <UploadImg :width="400" v-model="formData.banner_image" />
      </el-form-item>
      <el-form-item label="上架" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="规格设置" prop="goods_specs_type">
        <el-switch
          v-model="formData.goods_specs_type"
          :active-value="2"
          :inactive-value="1"
          active-text="多规格"
          inactive-text="统一规格" />
      </el-form-item>
      <el-form-item label="" v-if="formData.goods_specs_type === 2"
        ><SkusCom v-model="skus" :submitParams="submitParams" @onSuccess="onSuccess" />
      </el-form-item>
      <el-form-item label="SEO关键词" prop="seo_keyword">
        <el-input v-model="formData.seo_keyword" placeholder="SEO keywords" />
      </el-form-item>
      <el-form-item label="SEO描述" prop="seo_description">
        <el-input v-model="formData.seo_description" placeholder="SEO description" type="textarea" />
      </el-form-item>
      <el-form-item label="描述">
        <div class="edtor-box">
          <Toolbar
            style="border-bottom: 1px solid #dcdfe6"
            :editor="editorRef"
            :default-config="toolbarConfig"
            :mode="mode" />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="formData.description"
            :default-config="editorConfig"
            :mode="mode"
            @onCreated="handleCreated" />
        </div>
      </el-form-item>
      <el-form-item label=" ">
        <div class="flex justify-end flex-1">
          <el-button type="primary" size="large" :loading="loading" @click="handleSubmitGoods(formRef)"
            >保存并提交</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
//goods_specs_type
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ref, onMounted, shallowRef, onBeforeUnmount, reactive, watch } from 'vue'
import { getCategories, uploadImg, getGoodsById, upGoods } from '@/api'
import UploadImg from '@/components/UploadImg.vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import SkusCom from '@/components/skusCom/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { storeToRefs } from 'pinia'

const skus = ref([])

const router = useRouter()
const route = useRoute()
const id = route.params.id
const pageLoading = ref(false)
const formRef = ref(null)
const formData = ref({})
const categories = ref([])
const visible = ref(false)
const loading = ref(false)
const submitParams = ref({ allowSubmit: false, body: [], goods_id: route.params.id })

const { cascaderList } = storeToRefs(useCategoriesStore())

const goodsRules = reactive({
  title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  sub_title: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
  main_image: [{ required: true, message: '请上传商品主图', trigger: 'blur' }],
  cate_id: [{ required: true, message: '请选择分类', trigger: 'blur' }]
})

const fetchDetail = () => {
  pageLoading.value = true
  if (!id) return
  getGoodsById(id)
    .then(({ code, data, message }) => {
      if (code === 200) {
        const { price, cost_price, ...values } = data || {}
        formData.value = { ...values, ...{ price: price / 100, cost_price: cost_price / 100 } }
        // formData.value = data
      } else {
        ElMessage({ type: 'error', message })
      }
    })
    .finally(() => {
      pageLoading.value = false
    })
}

const editorRef = shallowRef()
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertImgFn) {
        console.log({ file })
        let formData = new FormData()
        formData.append('file', file)
        try {
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
              // percent.value = Math.floor((e.loaded / e.total) * 100)
            }
          }
          const res = await uploadImg({ body: formData }, config)
          console.log({ res })
          if (res.code === 200) {
            // setTimeout(() => {
            //   percent.value = 0
            // }, 2000)

            //插入操作 ,url:图片url，alt：图片alt，href：图片href
            insertImgFn(res.data.url)
          }
        } catch (error) {}
      },

      // server: 'http://localhost:3002/upload',
      fieldName: 'file',
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 10 * 1024 * 1024, // 10M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 10,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      meta: {
        // token: 'xxx',
        // otherKey: 'yyy'
        // file:''
      },
      // 将 meta 拼接到 url 参数中，默认 false
      metaWithUrl: false,

      // 自定义增加 http  header
      headers: {
        'Content-Type': 'multipart/form-data'
        // Accept: 'text/x-json',
        // otherKey: 'xxx'
      },

      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,

      // 超时时间，默认为 10 秒
      timeout: 10 * 1000 //10 秒
    }
  }
}

const toolbarConfig = {}
const mode = 'default'
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleSubmitGoods = async (el) => {
  if (!el) return
  await el.validate(async (valid, fields) => {
    if (valid) {
      try {
        const body = formData.value
        loading.value = true
        const { data, code, message } = await upGoods({ body })
        ElMessage({ type: code === 200 ? 'success' : 'error', message })
        submitParams.value = {
          allowSubmit: true,
          body: skus.value,
          goods_id: id
        }
      } catch (error) {
        ElMessage({ type: 'error', message: error })
      }
    } else {
    }
  })
}

const onSuccess = (e) => {
  if (e) {
    loading.value = false
    router.push('/goods/list')
  }
}

onMounted(() => {
  fetchDetail()
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<style lang="scss" scoped>
.container-xy {
  box-shadow: 0 0.375rem 0.75rem rgba(140, 152, 164, 0.075);
  padding: 20px;
  border: 1px solid rgba(231, 234, 243, 0.7);
  border-radius: 8px;
  background-color: #fff;
  .spec-set {
    transform: translateY(-50px);
  }
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.edtor-box {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  overflow: hidden;
  transition: all ease-in-out;
  &:hover {
    border: 1px solid #c0c4cc;
  }
}
.multiple {
  // display: flex;
  .spec-keys,
  .spec-values {
    // border: 1px solid #dcdfe6;
    .select {
      border: 1px solid #dcdfe6;
      padding: 1px 0 2px 15px;
    }
    margin-bottom: 15px;
    width: 100%;
    // width: 300px;
    .checked-list {
      margin-top: 2px;
      padding: 10px;
      border: 1px solid #dcdfe6;
      .checked-item {
        text-transform: capitalize;
        color: #409eff;
      }
    }
    .left {
      width: 200px;
    }
  }
  .spec-values {
    .select {
      border: 1px solid #dcdfe6;
      padding: 2px 0 2px 15px;
    }
  }
}
:deep(.is-error .upload) {
  border: 1px dashed #f56c6c;
}
</style>
<style>
.spec-modal .el-dialog {
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* padding-right: calc(2 * var(--el-dialog-padding-primary)); */
}
.spec-modal .el-dialog__body {
  flex: 1;
  overflow-y: auto;
}
</style>

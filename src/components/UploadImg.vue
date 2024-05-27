<template>
  <div class="upload" @click="handleChooseFile" :style="{ '--width': w, '--height': h, '--fit': fit }">
    <img :src="modelValue" v-if="modelValue" />
    <i v-else class="iconfont iconadd" style="font-size: 30px"></i>
  </div>
  <input type="file" name="file" ref="fileRef" style="display: none" @change="handleSelectFile" />
</template>

<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'
import { UPLOAD_IMAGE_URL } from '@/constant'

const emit = defineEmits(['success', 'update:modelValue', 'change'])
const props = defineProps({
  width: {
    type: [Number, String],
    default: 100
  },
  height: [Number, String],
  fit: {
    type: String,
    default: 'contain'
  },
  modelValue: ''
})

const w = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const h = computed(() => {
  if (props.height) {
    return typeof props.height === 'number' ? `${props.height}px` : props.height
  } else {
    return typeof props.width === 'number' ? `${props.width}px` : props.width
  }
})
const imgSrc = ref('')
const fileRef = ref('fileRef')

const handleChooseFile = () => {
  fileRef.value.click()
}

const handleSelectFile = (e) => {
  const files = e.target.files
  if (!files) return
  const file = files[0]

  const formData = new FormData()
  // Array.from(files).forEach(item=>{
  //   formData.append('file',item)
  // })
  formData.append('file', file)
  axios.post(UPLOAD_IMAGE_URL, formData).then((res) => {
    const { data } = res.data || {}
    imgSrc.value = data.url
    // emit('success',data)
    emit('update:modelValue', data.url)
    emit('change', data.url)
  })
}
</script>

<style lang="scss" scoped>
.upload {
  width: var(--width);
  height: var(--height);
  padding: 5px;
  border: 1px dashed #dcdfe6;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all linear 0.02s;
  &:hover {
    border: 1px dashed #409eff;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: var(--fit);
  }
}
</style>

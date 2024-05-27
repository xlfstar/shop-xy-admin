import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { getCategories } from '@/api'
import { groupByParentId } from '@/utils'

export const useCategoriesStore = defineStore(
  'categories',
  () => {
    const list = ref([])
    async function getList(query) {
      try {
        const { data, message, code } = await getCategories({ query })
        if (Array.isArray(data)) list.value = data
      } catch (error) {}
    }

    const cascaderList = computed(() => {
      // groupByParentId(list.value)
      let res = list.value?.map((item) => {
        item.disabled = item.status === 0
        return item
      })
      return groupByParentId(res)
    })

    return { list, getList, cascaderList }
  },
  { persist: true }
)

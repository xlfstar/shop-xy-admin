import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTempSkusStore = defineStore('tempSkus', () => {
  const tempSkuskus = ref([])
  const setTempSkus = (arr) => {
    tempSkuskus.value = arr
  }
  const addSkusItem = (arr) => {
    tempSkuskus.value = skus.value.contact(arr)
  }
  const clearTemSkus = () => {
    tempSkuskus.value = []
  }

  return { tempSkuskus, setTempSkus, clearTemSkus, addSkusItem }
})

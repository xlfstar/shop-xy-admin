import { onMounted, ref, Ref, watch } from 'vue'

// interface tableParams {
//   API: Function,
//   query?: Object

// }
type tableRes = {
  data: Ref<Array<any>>
  loading: Ref<Boolean>
  fetchFn: Function
  count: Ref<Number>
}

export default function useTable(API: Function, query: Ref, page: Ref, limit: Ref, refresh: Ref): tableRes {
  watch(
    () => [refresh.value, page.value, limit.value],
    () => {
      fetchFn()
    }
  )
  const data = ref([])
  const count = ref(0)
  const loading = ref(false)
  const fetchFn = async () => {
    try {
      loading.value = true
      let parmas = { page: page.value, limit: limit.value, ...query.value }
      const res = await API({ query: parmas })

      data.value = res.data
      count.value = res.count
      console.log({ data: data.value })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    fetchFn()
  })

  return { count, data, loading, fetchFn }
}

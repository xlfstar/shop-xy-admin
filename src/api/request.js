/**
 * request.get(url,options)
 * @param url
 * @param options ==> {body,query,params}
 */
import axios from 'axios'
import { compile } from 'path-to-regexp'
import { API_URL } from './config'
import { ElMessage } from 'element-plus'
// import { getToken } from '../utils/helper'

const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

const beforeFetch = (options) => {
  if (!options.headers) options.headers = {}
  // const { tokenInfo } = getToken() || {}
  // if (tokenInfo && tokenInfo.token) {
  //   options.headers['Authorization'] = `Bearer ${tokenInfo.token}`
  // }
  // 中断请求
  options.cancelToken = new axios.CancelToken((c) => {
    window.cancelRequest = c
  })

  return options
}
const afterFetch = (res) => {
  return res.data || {}
}
const errorFetch = (res) => {
  if (axios.isCancel(res)) return {}
  const { code, data } = res.response || {}
  if (code === 200) {
    return data
  }
  if (code === 401) {
    // clearLogin();
  }
  ElMessage({
    type: 'error',
    message: data.message
  })
  return Promise.reject(data)
}

// 添加请求拦截器
instance.interceptors.request.use(beforeFetch, errorFetch)
instance.interceptors.response.use(afterFetch, errorFetch)

const methods = ['get', 'post', 'put', 'patch', 'delete']
const request = {}

methods.forEach((method) => {
  request[method] = (path, { params, body, query, showError = true } = {}, config = {}) => {
    // console.log({path,params,query,body,config});
    const mergeUrlParams = compile(path)
    const urlMergedParams = mergeUrlParams(params)
    return instance({
      method,
      url: urlMergedParams,
      data: body,
      params: query,
      showError,
      ...config
    })
  }
})

export default request

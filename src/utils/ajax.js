import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const instance = axios.create({
  baseURL: '/real',
  timeout: 5000
})

//请求拦截器
instance.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Token'] = getToken()
    }
    return config
  }
)
//响应拦截器
instance.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code !== 200) {
      Message({
        message: res.data.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: /* error.message + */ '请求超时',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default instance

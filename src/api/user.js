import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data //请求体
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/Info',
    method: 'get',
    params: { token }  //params参数
  })
}

export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}

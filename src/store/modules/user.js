import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, allAsyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
function filterRoute(allAsyncRoutes, roles) {
  return allAsyncRoutes.filter(item => {
    if (roles.includes(item.name)) {
      if (item.children && item.children.length !== -1) {
        item.children = filterRoute(item.children, roles)
      }
      return true
    }
  })
}
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 权限相关的数据
    buttons: [],  //和按钮相关的权限
    roles: [], //和用户角色相关的权限数据
    routes: [],  //和用户相关的所有路由配置数组,这个数组是后期用户形成的最终路由数组,里面是路由对象而不是字符串
    asyncRoutes: []  //和用户相关的所有异步路由数组,这个数组里面也是路由对象
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
  },
  /* 用户的权限控制:根据后台返回来的用户信息决定展示哪些路由,先把常量路由异步路由和任意路由剔除出来,
     在获取用户信息的时候获取用户的routes(权限信息),commit过来,调用函数返回过滤过后的异步路由
  */
  SET_ASYNCROUTES(state, Myasyncroutes) {
    state.asyncRoutes = Myasyncroutes  //把过滤出来的异步路由保存起来
    state.routes = constantRoutes.concat(Myasyncroutes, anyRoutes) //使用常量路由拼接异步路由和任意路由
    router.addRoutes([...Myasyncroutes, anyRoutes])  //为路由器里面添加route配置,必须是个数组往里添,用到了解构
  }
}

const actions = {
  // user login
  //它上面自己写的代码
  /*   login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }, */
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    try {
      const response = await login({ username: username.trim(), password: password })
      const { data } = response
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      return 'ok'  //async返回一个promise成功的对象，值是ok
    } catch (error) {
      return Promise.reject(new Error(error)) //返回一个失败的promise，那边catch一下
    }
  },

  // get user info
  /*   getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }, */
  async getInfo({ commit, state }) {
    try {
      const response = await getInfo(state.token)
      commit('SET_USERINFO', response.data)
      commit('SET_ASYNCROUTES', filterRoute(cloneDeep(allAsyncRoutes), response.data.routes))
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 清除token
        resetRouter()  // 
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


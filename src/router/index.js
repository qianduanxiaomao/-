import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

//常量路由，不管是谁都能看到
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: '请登录' }
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]
//异步路由 根据返回来的权限决定
export const allAsyncRoutes = [
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    redirect: '/product/brand',
    meta: { title: '商品管理', icon: 'el-icon-milk-tea' },
    children: [
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/product/brand'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/attr'),
        meta: { title: '属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu'),
        meta: { title: 'spu管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku'),
        meta: { title: 'sku管理' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/product/category'),
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/acl',
    component: Layout,
    name: 'Acl',
    redirect: '/acl/user',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [
      {
        name: 'User',
        path: 'user',
        component: () => import('@/views/acl/user'),
        meta: { title: '用户管理' }
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/views/acl/role'),
        meta: { title: '角色管理' }
      },
      {
        name: 'Permission',
        path: 'permission',
        component: () => import('@/views/acl/permission'),
        meta: { title: '角色授权' }
      }
    ]
  }
]
//任意路由 用户输入任意值返回的路由
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

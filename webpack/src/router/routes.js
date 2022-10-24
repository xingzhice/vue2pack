import Layout from '@/layout'








/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight th e path you set
  }
 */

/* 
常量路由
包括登陆/404/首页
*/
export const constantRoutes = [
  //登录
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  //404
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]

export const asyncRoutes = [
  // 权限管理路由
  {
    path: '/acl',
    component: Layout,
    name:'Acl',
    redirect: '/acl/user',
    meta: { title: '权限管理', icon: 'el-icon-s-platform' },
    children: [
      //用户管理
      {
        name: 'User',
        path: '/acl/user',
        component: () => import('@/views/acl/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-s-release' },
      },
      //角色管理
      {
        name: 'Role',
        path: '/acl/name',
        component: () => import('@/views/acl/name/index'),
        meta: { title: '角色管理', icon: 'el-icon-s-data' }
      },
    ]
  },
  // 商品管理路由
  {
    path: '/product',
    component: Layout,
    name:'Product',
    redirect: '/product/trademark',
    meta: { title: '商品管理', icon: 'el-icon-film' },
    children: [
      //品牌管理
      {
        name: 'Trademark',
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index'),
        meta: { title: '品牌管理', icon: 'el-icon-cpu' },
      },
      //SKU
      {
        name: 'Sku',
        path: '/product/sku',
        component: () => import('@/views/product/sku/index'),
        meta: { title: 'SKU管理模块', icon: 'el-icon-watch-1' }
      },
    ]
  },

]

export const anyRoutes = [
  /*  任意路由跳转404 */
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]

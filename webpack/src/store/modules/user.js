import { login as loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {constantRoutes,asyncRoutes,anyRoutes} from '@/router/routes'
import _ from 'lodash'
import router from '@/router';
//递归遍历路由参数
const allAstyncRou = (asyncRoutes,routes) =>{
  return asyncRoutes.filter((item)=>{
    if(routes.indexOf(item.name)!=-1){
      if(item.children&&item.children.length>0){
        item.children = allAstyncRou(item.children,routes)
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
    roles: [],
    buttons: [],
    routes: [], // 本用户所有的路由,包括了固定的路由和下面的addRouters
    asyncRoutes: [] // 本用户的角色赋予的新增的动态路由
  }
}
const state = getDefaultState()
const mutations = {
  SET_USER: (state, userInfo) => {
    state.name = userInfo.name // 用户名
    state.avatar = userInfo.avatar // 头像
    state.roles = userInfo.roles // 角色列表
    state.buttons = userInfo.buttons // 按钮权限列表
    let userAsyncRoute = allAstyncRou(_.cloneDeep(asyncRoutes),userInfo.routes)
    router.addRoutes([...userAsyncRoute,...anyRoutes])
    state.routes = constantRoutes.concat(...userAsyncRoute)
  },

  SET_TOKEN (state, token) {
    state.token = token
  },

  RESET_USER (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginAPI.login(username, password)
        .then(result => {
          const { data } = result
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // 获取用户信息
  async getInfo ({ commit, state }) {
    const { data } = await loginAPI.getInfo()
    commit('SET_USER', data)
  },

  /* 
  重置用户信息
  */
  async resetUser ({ commit, state }) {
    // 如果当前是登陆的, 请求退出登陆
    if (state.name) {
      await loginAPI.logout()
    }
    // 删除local中保存的token
    removeToken()
    // 提交重置用户信息的mutation
    commit('RESET_USER')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
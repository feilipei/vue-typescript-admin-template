import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

// 接口（Interfaces）来定义对象的类型。接口一般首字母大写：用户状态
// export命令用于规定模块的对外接口
export interface IUserState {
  token: string // 令牌”，是服务端生成的一串字符串，作为客户端进行请求的一个标识
  name: string // 用户名
  avatar: string // 头像
  introduction: string // 用户简介
  roles: string[] // 角色，数组类型
  email: string
}

// Vuex允许我们将store分隔成模块（module），每个模块拥有自己的state，mutation，action，getter，甚至是嵌套子模块
@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  // Mutation：专注于修改State，理论上是修改State的唯一途径，必须同步执行。
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  // Action：业务代码、异步请求，但不能直接操作State。
  // async作为一个关键字放到函数前面，表示函数是一个异步函数，意味着该函数的执行不会阻塞后面代码的执行。
  // 声明一个异步函数，async函数返回的是一个promise对象，如果要获取到promise返回值，我们应该用then 方法
  // async用于声明一个函数是异步的，async返回的都是一个Promise对象同时async适用于任何类型的函数上。
  // 使用async、await完成异步操作代码可读与写法上更像是同步的，也更容易让人理解。
  @Action
  public async Login(userInfo: { username: string, password: string}) {
    let { username, password } = userInfo // 临时对象变量
    username = username.trim()
    // await关键字只能放到async 函数里面，是等待的意思。
    // await 后面放置的就是返回promise对象的一个表达式
    // 代码遇到await之后代码就暂停执行了，等后面的promise对象执行完毕，然后拿到promise resolve 的值并进行返回，返回值拿到之后，它继续向下执行
    // 调用访问后台函数login，后台返回data
    const { data } = await login({ username, password })
    setToken(data.accessToken)
    this.SET_TOKEN(data.accessToken)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({ /* Your params here */ })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles, name, avatar, introduction, email } = data.user
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_NAME(name)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(introduction)
    this.SET_EMAIL(email)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

// export命令用于规定模块的对外接口，导出UserModule函数表达式
export const UserModule = getModule(User)

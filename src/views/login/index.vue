<template>
  <!-- class 属性规定元素的类名（classname）。大多数时候用于指向样式表中的类 -->
  <div class="login-container">
    <!-- Form 表单：由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据，在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件 -->
    <!-- model表单数据对象 rules表单验证规则 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          <!-- 国际化$t -->
          {{ $t('login.title') }}
        </h3>
        <!-- 调用子组件：语言切换 -->
        <lang-select class="set-language" />
      </div>

      <!-- 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件 -->
      <el-form-item prop="username">
        <!-- <span> 标签被用来组合文档中的行内元素。 -->
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <!-- Input 输入框：通过鼠标或键盘输入字符 -->
        <!-- 使用 v-model 实现双向数据绑定 -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- 密码显示 -->
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>

      <!-- Button 按钮登录，事件方法handleLogin，.native监听组件根元素的原生事件，主要是给自定义组件添加原生事件 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <!-- 文字提示 ，在CSS中,“position: relative”是设置定位类型为相对定位-->
      <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>
        <div class="tips">
          <span>{{ $t('login.username') }} : editor </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>

        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog=true"
        >
          {{ $t('login.thirdparty') }}
        </el-button>
      </div>
    </el-form>

    <!-- 对话框 -->
    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <!-- 子组件 -->
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vuex'
// Element UI 是一套采用 Vue 2.0 作为基础框架实现的组件库
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'

// 使用 class 定义类，使用 extends 关键字实现继承
@Component({
  name: 'Login',
  // 注册子组件
  components: {
    LangSelect,
    SocialSign
  }
})
export default class extends Vue {
  // data属性表示实例数据，Vue 实例的数据对象。Vue 将会递归将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化。
  // 箭头函数,任意值（Any）用来表示允许赋值为任意类型。Function代表函数类型
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) { // 检验用户名
      callback(new Error('Please enter the correct user name'))
    } else {
      callback()
    }
  }
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('The password can not be less than 6 digits'))
    } else {
      callback()
    }
  }
  // 表单数据对象
  private loginForm = {
    username: 'admin',
    password: '111111'
  }
  // 表单验证规则
  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }], // 验证器,触发器
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string // 可选属性的含义是该属性可以不存在。
  private otherQuery: Dictionary<string> = {} // 泛型对象类型(键值对)，初始默认值为{}

  // 一个对象：键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。
  // Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。
  // 想要响应更改的数据执行异步或昂贵的操作时，这非常有用。
  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  // 父母通过道具将数据传递给孩子，孩子通过事件向父母发送消息
  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  // methods属性
  // 在 TypeScript的类型定义中，函数表达式中=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
  // 在 ES6 中，=> 叫做箭头函数
  // 函数声明（Function Declaration）
  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    // as类型断言（Type Assertion）可以用来手动指定一个值的类型。
    // 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的。
    // async代表异步函数
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        await UserModule.Login(this.loginForm)
        // 使用 this.$router.push(location) 来修改url完成跳转
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
        // Just to simulate the time of the request
        // setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。
        // 定时器向任务队列添加定时任务，setTimeout指定某个函数或某段代码，在多少毫秒后执行
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    // reduce方法依次处理数组的每个成员，最终累计为一个值。
    // reduce方法第一个参数都是一个函数，第二个参数相当于设定了默认值，处理空数组时尤其有用。
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $loginCursorColor; }
    input::first-line { color: $lightGray; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

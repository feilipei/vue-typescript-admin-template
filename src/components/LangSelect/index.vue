<template>
  <!-- el-dropdown下拉菜单，trigger触发下拉的行为 @command指令事件，点击菜单项触发的事件回调 -->
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <!-- 矢量图标 -->
      <svg-icon
        name="language"
        class="international-icon"
      />
    </div>
    <!-- 通过组件slot来设置下拉触发的元素以及需要通过具名slot为dropdown 来设置下拉菜单 -->
    <el-dropdown-menu slot="dropdown">
      <!-- :disabled指令属性绑定 -->
      <el-dropdown-item
        :disabled="language==='zh'"
        command="zh"
      >
        中文
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='en'"
        command="en"
      >
        English
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='es'"
        command="es"
      >
        Español
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='ja'"
        command="ja"
      >
        日本語
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Login'
})
export default class extends Vue {
  // 存取器：使用 getter 和 setter 可以改变属性的赋值和读取行为
  // get/set访问器不是对象的属性，而是属性的特性，
  get language() {
    return AppModule.language
  }

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang
    AppModule.SetLanguage(lang)
    // 消息提示：Element 注册了一个$message方法用于调用
    this.$message({
      message: 'Switch Language Success',
      type: 'success'
    })
  }
}
</script>

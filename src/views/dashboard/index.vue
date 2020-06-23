<template>
  <div class="dashboard-container">
    <!-- 动态组件component：由当前用户角色控制，依 is 的值来决定哪个组件被渲染 -->
    <!-- Vue内置的标签,它的用途是可以动态绑定我们的组件 -->
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// 使用vuex来保存我们需要管理的状态值
import { UserModule } from '@/store/modules/user'

// 导入子组件，导入默认输出export default
import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'

// 装饰器
@Component({
  name: 'Dashboard',
  components: {
    AdminDashboard,
    EditorDashboard
  }
})
export default class extends Vue {
  // data属性：数据
  private currentRole = 'admin-dashboard'

  // computed计算属性：角色数组
  // TypeScript实现了存取器（getter/setter）,存取器非常像Vue里的计算属性，你可以通过get/set方法来处理一些事务。
  // 获取用户角色
  get roles() {
    return UserModule.roles
  }

  // 在实例创建完成后被立即调用。此时实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editor-dashboard'
    }
  }
}
</script>

<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SwitchRoles from './components/SwitchRoles.vue'

@Component({
  name: 'PagePermission',
  components: {
    SwitchRoles
  }
})
export default class extends Vue {
  private handleRolesChange() {
    // 想要导航到不同的URL，使用router.push()方法，这个方法会向history栈添加一个新纪录，所以，当用户点击浏览器后退按钮时，会回到之前的URL
    this.$router.push({ path: '/permission/index?' + +new Date() })
  }
}
</script>

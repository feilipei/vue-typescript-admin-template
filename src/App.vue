<template>
  <!-- App.vue是主组件,单页面主体，所有组件都是在App.vue下进行切换的。 -->
  <div id="app">
    <!-- 路由出口，路由匹配到的组件将渲染在这里，它用于渲染匹配的组件 -->
    <!-- router-view 当做是一个容器，定义显示部分，它渲染的组件是使用 vue-router 指定的 -->
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {}
</script>

import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

// 表格路由配置，定义一组路由
const tableRoutes: RouteConfig = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'table',
    icon: 'table'
  },
  children: [
    {
      // 动态表格
      path: 'dynamic-table',
      component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      // 可拖拽表格
      path: 'draggable-table',
      component: () => import(/* webpackChunkName: "draggable-table" */ '@/views/table/draggable-table.vue'),
      name: 'DraggableTable',
      meta: { title: 'draggableTable' }
    },
    {
      // 表格内编辑
      path: 'inline-edit-table',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/table/inline-edit-table.vue'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      // 综合表格
      path: 'complex-table',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}

export default tableRoutes

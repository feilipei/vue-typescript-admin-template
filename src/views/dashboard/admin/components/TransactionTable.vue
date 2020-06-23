<template>
  <!-- Table 表格用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。 -->
  <!-- data属性注入对象数组list，显示的数据,用于存放请求数据回来的数组 -->
  <el-table
    :data="list"
    style="width: 100%;padding-top: 15px;"
  >
    <!-- OrderID列 -->
    <el-table-column
      label="OrderID"
      min-width="200"
    >
      <!-- label属性定义表格的列名 -->
      <template slot-scope="scope">
        <!-- 当要封装一个列表组件，就需要使用作用域插槽 -->
        <!-- 非插槽模板指的是html模板，指的是‘div、span、ul、table’这些，非插槽模板的显示与隐藏以及怎样显示由插件自身控制 -->
        <!-- 插槽模板是slot，它是一个空壳子，因为它显示与隐藏以及最后用什么样的html模板显示由父组件控制。插槽显示的位置确由子组件自身决定，slot写在组件template的哪块，父组件传过来的模板将来就显示在哪块。 -->
        <!-- slot-scope用于将元素表示为作用域插槽，scope会得到当前模板的数据 -->
        <!-- slot-scope实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件,scope会得到当前模板的数据 -->
        <!-- 在 template上使用特殊的 slot-scope 特性，可以接收传递给插槽的 prop -->
        <!-- scope.row 直接取到该单元格对象，就是数组里的元素对象 -->
        {{ scope.row.orderId | orderNoFilter }}
      </template>
    </el-table-column>

    <!-- Price列 -->
    <el-table-column
      label="Price"
      width="195"
      align="center"
    >
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>

    <!-- Status列 -->
    <el-table-column
      label="Status"
      width="100"
      align="center"
    >
      <template slot-scope="{row}">
        <!-- slot-scope 的值可以接收任何有效的可以出现在函数定义的参数位置上的 JavaScript 表达式 -->
        <!-- tag标签 type属性来选择tag的类型-->
        <el-tag :type="row.status | transactionStatusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTransactions } from '@/api/transactions'
import { ITransactionData } from '@/api/types'

@Component({
  name: 'TransactionTable',
  // Vue.js允许你自定义过滤器，可被用于一些常见的文本格式化。
  filters: {
    // 箭头函数
    transactionStatusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        success: 'success',
        pending: 'danger'
      }
      // 根据key取value
      return statusMap[status]
    },
    orderNoFilter: (str: string) => str.substring(0, 30),
    // Input 10000 => Output "10,000"，数字转换
    toThousandFilter: (num: number) => {
      return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
  }
})
export default class extends Vue {
  // data属性：数据list类型为ITransactionData数组
  private list: ITransactionData[] = []

  // 一般可以在created函数中调用ajax异步获取页面初始化所需的数据。
  // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  // created运行时，还未挂载到DOM，不能访问到$el属性，可用于初始化一些数据，但和DOM操作相关的不能在created中执行
  created() {
    this.fetchData()
  }

  // 异步函数fetchData
  private async fetchData() {
    // 等待与后台通信函数getTransactions返回值data
    const { data } = await getTransactions({ /* Your params here */ })
    // slice切片方法可从已有的数组中返回选定的元素。返回一个新的数组
    this.list = data.items.slice(0, 8)
  }
}
</script>

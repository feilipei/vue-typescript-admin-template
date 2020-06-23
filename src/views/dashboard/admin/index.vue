<template>
  <div class="dashboard-editor-container">
    <!-- 1、GitHub链接子组件 -->
    <github-corner class="github-corner" />

    <!-- 2、面板子组件：接收子组件传递回来的数据type给父组件方法使用 -->
    <!-- 用 v-on 指令监听 DOM 事件，并在触发时运行一些 JavaScript 代码。 -->
    <!-- @handleSetLineChartData代表子组件事件，handleSetLineChartData代表父组件方法 -->
    <!-- 子组件为事件源被用户触发，传递事件消息给监听器父组件，然后调用父组件方法对事件消息处理 -->
    <!-- 子组件：事件源   父组件：监听器    传递值：事件 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <!-- 3、线状图子组件 -->
    <!-- Layout布局：通过基础的24分栏，迅速简便地创建布局。通过 row 行和 col 列组件 -->
    <el-row
      style="background:#fff;
      padding:16px 16px 0px;
      margin-bottom:32px;"
    >
      <!-- 盒子模型   margin:外边距    border：边框    padding：内边距(填充)  content：内容 -->
      <!-- 元素宽度=内容宽度+左填充+右填充+左边框+右边框+左边距+右边距 -->
      <!-- 绑定数据，父组件数据lineChartData传给子组件属性chartdata -->
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!-- 4、非线状图子组件 -->
    <!-- Layout布局：通过基础的24分栏，迅速简便地创建布局。通过 row 行和 col 列组件 -->
    <el-row
      :gutter="32"
    >
      <!-- 雷达图 -->
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <radar-chart />
        </div>
      </el-col>
      <!-- 饼图 -->
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <!-- 柱状图 -->
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <!-- 5、非线状图子组件 -->
    <el-row :gutter="8">
      <!-- 交易表子组件 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <transaction-table />
      </el-col>
      <!-- 待办列表 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <todo-list />
      </el-col>
      <!-- 盒子 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
// import命令用于输入其他模块提供的功能
// import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。

// macrons主题线条比较柔和，柱形不尖锐
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import GithubCorner from '@/components/GithubCorner/index.vue'
import BarChart from './components/BarChart.vue'
import BoxCard from './components/BoxCard.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import PanelGroup from './components/PanelGroup.vue'
import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
import TodoList from './components/TodoList/index.vue'
import TransactionTable from './components/TransactionTable.vue'

// typescript语法：对象类型{ [type: string]: ILineChartData }任意属性
const lineChartData: { [type: string]: ILineChartData } = {
  // 属性名为字符串string，属性值为对象ILineChartData
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

@Component({
  name: 'DashboardAdmin',
  components: { // 子组件
    GithubCorner,
    BarChart,
    BoxCard,
    LineChart,
    PanelGroup,
    PieChart,
    RadarChart,
    TodoList,
    TransactionTable
  }
})
export default class extends Vue {
  // export命令除了输出变量，还可以输出函数或类（class）。export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
  // export语句输出的接口与其对应的值是动态绑定关系，即通过该接口可以取到模块内部实时的值。
  // export default命令，为模块指定默认输出。其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。一个模块只能有一个默认输出

  // 子组件与子组件通信：通过父组件为中介

  // data属性：用于父组件向子组件传值。
  // 初始化lineChartData，默认值为lineChartData.newVisitis。
  private lineChartData = lineChartData.newVisitis

  // methods属性：用于事件绑定，父组件接收子组件传回来的值
  // 修改lineChartData的值
  private handleSetLineChartData(type: string) {
    this.lineChartData = lineChartData[type]
  }
}
</script>

<style lang="scss" scoped>
// .类选择器、 #id选择器
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute; //绝对定位的元素位置相对于最近的已定位父元素，如果没有父元素则相对于<html>
    // 设置定位元素的上外边距边界与其包含块上边界之间的偏移。
    top: 0px;
    // 设置定位元素右外边距边界与其包含块右边界之间的偏移。
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0; //填充：上  左右  下
    margin-bottom: 32px;  // 设置元素的下外边距。
  }
}

@media (max-width:1024px) { //针对不同的屏幕尺寸设置不同的样式
  .chart-wrapper {
    padding: 8px; //上下左右
  }
}
</style>

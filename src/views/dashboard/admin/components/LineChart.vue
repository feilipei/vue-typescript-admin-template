<template>
  <!-- HTML <div> 元素是块级元素，它可用于组合其他 HTML 元素的容器。 -->
  <!-- Vue.js 样式绑定 -->
  <div
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// 接口用来定义复合数据类型
export interface ILineChartData {
  expectedData: number[] // 数值数组
  actualData: number[]
}

// @Component 装饰器是用以声明子组件。
@Component({
  name: 'LineChart'
})
export default class extends mixins(ResizeMixin) {
  // props属性：可以是数组或对象，用于接收来自父组件的数据。
  // @Prop 装饰器是用以接收来自父组件的数据(props)，。
  // !表示确定变量有值
  @Prop({ required: true }) private chartData!: ILineChartData // Echart数据
  @Prop({ default: 'chart' }) private className!: string // class属性名
  @Prop({ default: '100%' }) private width!: string // 宽度
  @Prop({ default: '350px' }) private height!: string // 高度

  // @Watch 装饰器是用以监控数据是否改变。watch监视chartData，当其值变化时调用回调函数
  @Watch('chartData', { deep: true })
  private onChartDataChange(value: ILineChartData) {
    this.setOptions(value)
  }

  // monuted运行时，实例已经挂在到DOM，此时可以通过DOM API获取到DOM节点。
  mounted() {
    // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
    // nextTick里面的代码会在DOM更新后执行；
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    // Vue 实例的数据对象
    this.chart = null
  }

  // methods属性
  private initChart() {
    // this指向组件的实例。$el指向当前组件的DOM元素。
    // HTMLDivElement 接口提供了一些特殊属性（它也继承了通常的 HTMLElement 接口）来操作 <div> 元素。
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.setOptions(this.chartData)
  }

  // 设置Echarts
  private setOptions(chartData: ILineChartData) {
    if (this.chart) {
      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // x轴值
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: 8
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [{
          name: 'expected',
          itemStyle: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          },
          smooth: true,
          type: 'line', // 线形图
          data: chartData.expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'actual',
          itemStyle: {
            color: '#3888fa',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            }
          },
          smooth: true,
          type: 'line', // 线形图
          data: chartData.actualData, // 数组
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      } as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>

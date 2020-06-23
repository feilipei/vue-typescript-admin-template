<template>
  <div
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

@Component({
  name: 'PieChart'
})
export default class extends mixins(ResizeMixin) {
  // @Prop 装饰器是用以接收来自父组件的数据(props)，!表示确定变量有值。
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'item', // 数据项图形触发，主要在饼图等无类目轴的图表
        // 字符串模板a,b,c,d分别表示系列名series.name、数据名series.data.name、数值series.data.value、计算的比例
        formatter: '{a} <br/>{b} : {c} ({d}%)' // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
      },
      series: [
        {
          name: 'WEEKLY WRITE ARTICLES', // 系列名，用于tooltip的显示
          type: 'pie', // 饼图
          roseType: 'radius', // 南丁格尔图
          radius: [15, 95], // 饼图半径，第一项是内半径，第二项是外半径
          center: ['50%', '38%'], // 圆心
          data: [
            { value: 320, name: 'Industries' }, // 数据值，数据项名
            { value: 240, name: 'Technology' },
            { value: 149, name: 'Forex' },
            { value: 100, name: 'Gold' },
            { value: 59, name: 'Forecasts' }
          ],
          animationEasing: 'cubicInOut', // 初始动画缓动效果
          animationDuration: 2600 // 初始动画时长
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>

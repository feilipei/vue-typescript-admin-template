<template>
  <div class="app-container">
    <!-- 筛选器: div块级元素通常会以新行来开始（和结束）。class 属性通常用于指向样式表的类 -->
    <div class="filter-container">
      <!-- Input 为输入框组件，它总会显示 Vue 绑定的变量值。 -->
      <!-- v-model绑定变量，用于用户输入值绑定到vue的data上 -->
      <!-- placeholder输入框占位文本,提示信息作用 -->
      <!-- style 属性规定元素的行内样式（inline style）。 -->
      <!-- v-on在监听键盘enter回车事件，如果用了封装组件比如element，使用按键修饰符需要加上.native -->
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.title')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- Select 选择器，当选项过多时使用下拉菜单展示并选择内容。 -->
      <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
      <!-- clearable是否可以清空选项,默认为false -->
      <el-select
        v-model="listQuery.importance"
        :placeholder="$t('table.importance')"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <!-- 循环使用 v-for 指令 -->
        <!-- importanceOptions为数字数组，value为数组元素 -->
        <!-- label选项的标签界面显示的文字，若不设置则默认与 value 相同 -->
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <!-- Select 选择器，使用下拉菜单展示并选择内容。 -->
      <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
      <!-- clearable是否可以清空选项,默认为false -->
      <el-select
        v-model="listQuery.type"
        :placeholder="$t('table.type')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <!-- calendarTypeOptions为对象数组 -->
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <!-- Select 选择器，使用下拉菜单展示并选择内容。 -->
      <!-- v-model的值为当前被选中的el-option的 value 属性值 -->
      <!-- change选中值发生变化时触发 -->
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <!-- sortOptions为对象数组 -->
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <!-- Button 按钮，使用type、plain、round和circle属性来定义 Button 的样式。 -->
      <!-- type：按钮类型 -->
      <!-- icon图标类名， v-waves为vue插件，点击按钮为水波样式 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <!-- Button 按钮，使用type、plain、round和circle属性来定义 Button 的样式。 -->
      <!-- icon图标类名， v-waves为vue插件，点击水波样式 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <!-- Button 按钮，使用type、plain、round和circle属性来定义 Button 的样式。 -->
      <!-- icon图标类名， v-waves为vue插件，点击水波样式 ，loading是否加载中状态-->
      <!-- :属性绑定数据变量  @事件绑定方法 -->
      <!-- loading：在按钮上显示加载状态 -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
      <!-- Checkbox 多选框，一组备选项中进行多选 -->
      <!-- 在el-checkbox元素中定义v-model绑定变量，单一的checkbox中，默认绑定变量的值会是Boolean，选中为true。 -->
      <!-- 选中后表格会加一列，即表格列数tableKey加1 -->
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >
        {{ $t('table.reviewer') }}
      </el-checkbox>
    </div>

    <!-- Table 表格，展示多条结构类似的数据，可对数据进行排序、筛选 -->
    <!-- key的作用让每个item有一个唯一的识别身份 -->
    <!-- 使用v-loading在接口为请求到数据之前，显示加载中直到请求到数据后消失。 -->
    <!-- data显示的数据，绑定的list为对象数组，fit列的宽度是否自撑开，highlight-current-row是否要高亮当前行 -->
    <!-- sort-change当表格的排序条件发生变化的时候会触发该事件sortChange,被l-table-column的sortable监听 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- 1序号 -->
      <!-- label属性来定义表格的列名 -->
      <!-- prop对应列内容的字段名，属性来对应对象数组list中的键名即可填入数据 -->
      <!-- width属性来定义列宽 -->
      <!-- sortable实现以该列为基准的排序，设置为 'custom'，则代表用户希望远程排序，需要监听Table 的sort-change 事件 -->
      <!-- class-name列的 className -->
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <!-- slot-scope是vue2.10新增的一个作用域插槽 -->
        <!-- scope定义为插槽作用域的名字 -->
        <template slot-scope="scope">
          <!-- scope.row是当前表格一行的所有数据 -->
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 2时间 -->
      <el-table-column
        :label="$t('table.date')"
        width="180px"
        align="center"
      >
        <template slot-scope="scope">
          <!-- Parse the timestamp to string调用功能函数parseTime -->
          <span>{{ scope.row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>
      <!-- 3标题 -->
      <el-table-column
        :label="$t('table.title')"
        min-width="150px"
      >
        <!-- row等同于scope.row，{row}等同于scope -->
        <!-- 通过slot-scope获取el-table定义的row -->
        <template slot-scope="{row}">
          <!-- link-type样式为超链接 -->
          <!-- 点击标题文字事件更新内容 -->
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >
            {{ row.title }}
          </span>
          <!-- Tag 标签用于标记和选择。 -->
          <el-tag>
            <!-- 过滤器可以用在两个地方：双花括号插值和 v-bind 表达式 -->
            {{ row.type | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 4作者 -->
      <el-table-column
        :label="$t('table.author')"
        width="180px"
        align="center"
      >
        <!-- 与prop="author"等价 -->
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <!-- 5审核人 -->
      <!-- v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true 值的时候被渲染。 -->
      <el-table-column
        v-if="showReviewer"
        :label="$t('table.reviewer')"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span style="color:red;">
            {{ scope.row.reviewer }}
          </span>
        </template>
      </el-table-column>
      <!-- 6重要性 -->
      <el-table-column
        :label="$t('table.importance')"
        width="105px"
      >
        <template slot-scope="scope">
          <!-- v-for 指令根据一组数组的选项列表进行渲染 -->
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            name="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>
      <!-- 7阅读数 -->
      <el-table-column
        :label="$t('table.readings')"
        align="center"
        width="95"
      >
        <template slot-scope="{row}">
          <!-- v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true 值的时候被渲染。 -->
          <!-- 阅读数大于0时，点击文字获取阅读统计 -->
          <span
            v-if="row.pageviews"
            class="link-type"
            @click="handleGetPageviews(row.pageviews)"
          >
            {{ row.pageviews }}
          </span>
          <span v-else>
            0
          </span>
        </template>
      </el-table-column>
      <!-- 8状态 -->
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <!-- 由type属性来选择tag的类型，也可以通过color属性来自定义背景色。 -->
          <!-- type的值可选项success/info/warning/danger -->
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 9操作 -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <!-- 发布、草稿、删除三个按钮只能存在2个 -->
          <!-- 状态修改按钮：发布 -->
          <el-button
            v-if="row.status!=='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >
            {{ $t('table.publish') }}
          </el-button>
          <!-- 状态修改按钮:草稿 -->
          <el-button
            v-if="row.status!=='draft'"
            size="mini"
            @click="handleModifyStatus(row,'draft')"
          >
            {{ $t('table.draft') }}
          </el-button>
          <!-- 状态修改按钮：删除 -->
          <el-button
            v-if="row.status!=='deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'deleted')"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件，total表示总条目数 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- Dialog 对话框:在保留当前页面状态的情况下，告知用户并承载相关操作。 -->
    <!-- 当点击添加按钮或编辑按钮时，改变变量dialogFormVisible的值，弹出对话框 -->
    <!-- title属性用于定义对话框标题，它是可选的，默认值为空 -->
    <!-- visible属性，当为true时显示 Dialog。 -->
    <!-- Dialog 分为两个部分：body和footer -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <!-- rules表单验证规则；label-position表单域标签的位置 -->
      <!-- model:表单数据对象 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- label标签文本 -->
        <!-- prop：表单域 model 字段 -->
        <!-- 1类型 -->
        <el-form-item
          :label="$t('table.type')"
          prop="type"
        >
          <el-select
            v-model="tempArticleData.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <!-- 2时间 -->
        <el-form-item
          :label="$t('table.date')"
          prop="timestamp"
        >
          <!-- 日期时间选择器,type属性指定为日期时间选择器类型，绑定的为单一变量Date -->
          <!-- 设置type为datetimerange即可选择日期和时间范围，则绑定的变量为Date数组 -->
          <!-- range-separator选择范围时的分隔符 -->
          <!-- value-format可选，绑定值的格式。不指定则绑定值为Date对象 -->
          <el-date-picker
            v-model="tempArticleData.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <!-- 3标题 -->
        <el-form-item
          :label="$t('table.title')"
          prop="title"
        >
          <el-input v-model="tempArticleData.title" />
        </el-form-item>
        <!-- 4状态 -->
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="tempArticleData.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 5重要性 -->
        <el-form-item :label="$t('table.importance')">
          <!-- Rate评分组件 -->
          <el-rate
            v-model="tempArticleData.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
        </el-form-item>
        <!-- 6点评 -->
        <el-form-item :label="$t('table.remark')">
          <el-input
            v-model="tempArticleData.abstractContent"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <!-- footer需要具名为footer的slot -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <!-- 取消按钮 -->
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <!-- 确定按钮 -->
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 当点击阅读统计时，弹出对话框 -->
    <el-dialog
      :visible.sync="dialogPageviewsVisible"
      title="Reading statistics"
    >
      <!-- 表格，展示多条结构类似的数据，可对数据进行排序、筛选 -->
      <el-table
        :data="pageviewsData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- Channel列 -->
        <el-table-column
          prop="key"
          label="Channel"
        />
        <!-- pageviews列 -->
        <el-table-column
          prop="pageviews"
          label="Pageviews"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPageviewsVisible = false"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getArticles, getPageviews, createArticle, updateArticle, defaultArticleData } from '@/api/articles'
import { IArticleData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

// 常量：日历类型选项
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
// 数组转换为对象
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc: { [key: string]: string }, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {}) as { [key: string]: string }

@Component({
  name: 'ComplexTable',
  components: {
    Pagination
  },
  filters: {
    // 过滤器，用于一些常见的文本格式化
    typeFilter: (type: string) => {
      return calendarTypeKeyValue[type]
    }
  }
})
export default class extends Vue {
  private tableKey = 0 // 表格列数
  private list: IArticleData[] = [] // 文章数据数组
  private total = 0
  private listLoading = true
  // 查询条件
  private listQuery = {
    page: 1,
    limit: 20,
    importance: undefined, // 重要性
    title: undefined, // 标题
    type: undefined, // 类型
    sort: '+id' // 排序
  }
  private importanceOptions = [1, 2, 3] // 重要性选项
  private calendarTypeOptions = calendarTypeOptions
  private sortOptions = [
    { label: 'ID Ascending', key: '+id' }, // 升序
    { label: 'ID Descending', key: '-id' } // 降序
  ]
  private statusOptions = ['published', 'draft', 'deleted'] // 状态选项
  private showReviewer = false // 是否展示评论人标志
  private dialogFormVisible = false // 编辑对话框标志
  private dialogStatus = ''
  private textMap = {
    update: 'Edit',
    create: 'Create'
  }
  private dialogPageviewsVisible = false // 统计对话框标志
  private pageviewsData = []
  // 表单验证规则
  private rules = {
    type: [{ required: true, message: 'type is required', trigger: 'change' }],
    timestamp: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
    title: [{ required: true, message: 'title is required', trigger: 'blur' }]
  }
  private downloadLoading = false
  private tempArticleData = defaultArticleData

  created() {
    this.getList()
  }

  // 异步操作：从最早的回调函数，到 Promise 对象，再到 Generator 函数，最后到async 函数
  // async 函数就是 Generator 函数的语法糖。它的调用会返回一个promise 对象。
  // async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await
  // async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。
  // 同 Generator 函数一样，async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数
  private async getList() {
    this.listLoading = true
    // 当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句
    // await 命令只能用在 async 函数之中，如果用在普通函数，就会报错。
    const { data } = await getArticles(this.listQuery)
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    // 用于在指定的毫秒数后调用函数或计算表达式。
    setTimeout(() => {
      this.listLoading = false
    }, 5 * 1000)
  }

  // 执行筛选查询
  private handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  // 修改按钮状态
  private handleModifyStatus(row: any, status: string) {
    this.$message({
      message: '操作成功',
      type: 'success'
    })
    row.status = status
  }

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }

  private getSortClass(key: string) {
    const sort = this.listQuery.sort
    // ` 用来定义 ES6 中的模板字符串，${expr} 用来在模板字符串中嵌入表达式
    return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
  }

  // 重置临时数据
  private resetTempArticleData() {
    this.tempArticleData = cloneDeep(defaultArticleData)
  }

  // 添加按钮点击调用
  private handleCreate() {
    this.resetTempArticleData()
    this.dialogStatus = 'create'
    // 该变对话框显示标志为true，则弹出对话框
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 对话框中按钮
  private createData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        let { id, ...articleData } = this.tempArticleData
        articleData.author = 'vue-typescript-admin'
        const { data } = await createArticle({ article: articleData })
        this.list.unshift(data.article)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  // 编辑按钮
  private handleUpdate(row: any) {
    this.tempArticleData = Object.assign({}, row)
    this.tempArticleData.timestamp = +new Date(this.tempArticleData.timestamp)
    this.dialogStatus = 'update'
    // 该变对话框显示标志为true，则弹出对话框
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  // 对话框中确定按钮
  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempArticleData)
        tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        const { data } = await updateArticle(tempData.id, { article: tempData })
        for (const v of this.list) {
          if (v.id === data.article.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, data.article)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  // 阅读列点击时触发
  private async handleGetPageviews(pageviews: string) {
    const { data } = await getPageviews({ /* Your params here */ })
    this.pageviewsData = data.pageviews
    // 该变对话框显示标志为true，则弹出对话框
    this.dialogPageviewsVisible = true
  }

  // 下载导出按钮触发
  private handleDownload() {
    this.downloadLoading = true
    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    const data = formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }
}
</script>

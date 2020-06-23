// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// Filter for article status 文档状态
export const articleStatusFilter = (status: string) => {
  // 对象statusMap赋值
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  // 返回值
  return statusMap[status]
}

// Filter to uppercase the first character 首字母大写，箭头函数
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// Filter for article status �ĵ�״̬
export const articleStatusFilter = (status: string) => {
  // ����statusMap��ֵ
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  // ����ֵ
  return statusMap[status]
}

// Filter to uppercase the first character ����ĸ��д����ͷ����
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

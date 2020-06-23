// ����axiosʵ����requestΪaxiosʵ��
import request from '@/utils/request'

// ES6 �����ڴ��������棬ֱ��д������ͺ�������Ϊ��������Ժͷ���,��ʱ���������Ǳ�����, ����ֵ���Ǳ���ֵ
// ����ͨ���� axios ���������������������axios(config)
export const getTransactions = (params: any) =>
  request({
    url: '/transactions', // ��������ķ����� URL
    method: 'get', // ��������ʱʹ�õķ���
    params // ����������һ���͵�URL����������һ���޸�ʽ����(plain object)�� URLSearchParams ����
  })

// request��������:��Щ�Ǵ�������ʱ�����õ�����ѡ�ֻ�� url �Ǳ����
// `headers` �Ǽ��������͵��Զ�������ͷ
// `data` ����Ϊ�������屻���͵�����,ֻ��������Щ���󷽷� 'PUT', 'POST', �� 'PATCH'
// `responseType` ��ʾ��������Ӧ���������ͣ������� 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
// 'proxy' ���������������������ƺͶ˿�

// response��Ӧ�ṹ:ĳ���������Ӧ����������Ϣ
// `data` �ɷ������ṩ����Ӧ
// `status` ���Է�������Ӧ�� HTTP ״̬��

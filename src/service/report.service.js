import { post } from '@/utils/request'

// 查询检查报告单列表
export function getReportExamList (params) {
  return post('/portal/exam/list', {data: params})
}
// 获取检查报告详情
export function getReportExamDetail (params) {
  return post('/portal/exam/detail', {data: params})
}
// 查询检验报告单列表
export function getReportLabList (params) {
  return post('/portal/lab/list', {data: params})
}
// 查询检验报告单详情
export function getReportLabDetail (params) {
  return post('/portal/lab/common', {data: params})
}

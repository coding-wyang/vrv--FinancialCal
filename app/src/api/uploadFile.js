import request from './request.js';
// 保存数据
export function saveFile(year, month) {
  return request({
    method: 'post',
    url: '/saveFile',
    data: {
      year,
      month,
    }
  });
}
// 下载表格
export function downloadExcel(data, type) {
  return request({
    url: '/downloadExcel',
    params: {
      pc: data.pc,
      sdk: data.sdk,
      rtc: data.rtc,
      pm: data.pm,
    },
    responseType: type
  });
}
// 多表查询
export function multiTableQuery(data) {
  return request({
    url: '/moreList',
    params: { year: data.year, month: data.month }
  });
}
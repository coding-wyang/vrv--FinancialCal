import request from './request.js';
// 获取数据
export function getData() {
  return request({
    url: '/getData',
  });
}
// 修改数据
export function editUser(data) {
  return request({
    method: 'put',
    url: '/editUser',
    params: {
      id: data.id,
      name: data.name,
      group: data.group,
    }
  });
}
// 添加数据
export function saveData(data) {
  return request({
    method: 'post',
    url: '/saveData',
    data: {
      id: data.id,
      name: data.name,
      group: data.group,
    }
  });
}
// 删除数据
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: '/deleteUser',
    params: {
      id
    }
  });
}
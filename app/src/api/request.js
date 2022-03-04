import axios from 'axios';
import baseURL from './config.js';

const service = axios.create({
  baseURL, // api 的 base_url
  timeout: 5000// request timeout //设置请求时长
});
service.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);
service.interceptors.response.use(
  (response) => {
    // console.log('拦截响应数据', response);
    // response 根据不同status 状态返回 对应不同的comfirm
    const res = response.data;
    if (res.code === '后端返回的status或者code获取其他状态码') {
      // console.log('登录状态已过期')
    } else {
      return res;
    }
  },
  error => Promise.reject(error)

);
export default service;
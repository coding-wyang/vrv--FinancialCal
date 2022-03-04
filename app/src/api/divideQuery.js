import request from './request.js';

export default data => request({
  url: '/divide',
  params: { year: data.year, month: data.month, group: data.group }
});

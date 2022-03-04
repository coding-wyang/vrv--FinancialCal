const express = require('express');
// 创建静态服务器对象
const app = express();
// 设置跨域
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 连接数据库
require('./model/index');
// 接口
let userRouter = require('./routes/userMessage');
let manageRouter = require('./routes/divideGroup');
app.use(userRouter);
app.use(manageRouter);
app.listen('5000',(err,data)=>{
  console.log('server is running!');
})

module.exports = app;


var express = require('express');
var router = express.Router();
const path = require('path');
// 计算公式
const Workman = require('../src/workman');
// 设计的数据库
var user = require('../model/userMessage');
// 读取xlsx文件的模块
const xlsx = require('node-xlsx');
// 解析form表单数据
const formidable = require('formidable');
// 判断是否有计算结果的文件
let testFile = require('../common/publicMethods');
testFile();
let resultFile = path.join(__dirname, '../result_file/data.xls');
// 项目开始 上传文件
router.post('/api/upload', (req, res) => {
  try {
    // 创建formidable表单解析对象
    const form = new formidable.IncomingForm();
    // 解析客户端传递过来的FormData对象
    form.parse(req, (err, fields, files) => {
      // 将客户端传递过来的文件地址响应到客户端
      // xlsx文件
      let wm = new Workman(`${files.file.path}`, resultFile);
      wm.calculate();
      res.send('上传成功');
    });
  } catch (err) {
    return err;
  }
});

function saveData(times, data) {
  let dataList = data[0].data;
  for (var i = 1; i < dataList.length - 2; i++) {
    new user({
      year: parseInt(times.year),
      month: parseInt(times.month),
      name: dataList[i][0],
      traffic: dataList[i][1],
      meal: dataList[i][2],
      total: dataList[i][3],
    }).save();
  }
}
// 保存数据到数据库
router.post('/saveFile', async (req, res) => {
  try {
    var times = req.body;
    let ret = await user.find(times);
    console.log(ret);
    if (ret.length === 0) {
      const data = xlsx.parse(resultFile);
      saveData(times, data);
      res.send({
        status: 200,
        message: '保存数据库成功'
      });
    } else {
      await user.remove({
        year: parseInt(times.year),
        month: parseInt(times.month)
      }).then(() => {
        const data = xlsx.parse(resultFile);
        saveData(times, data);
        res.send({
          status: 201,
          message: '更新数据库成功'
        });
      });
    }
  } catch (err) {
    res.send({
      status: 500,
      messag: '保存数据库失败'
    });
    return;
  }
});

function shareData(dataIndex, item) {
  var data = JSON.parse(item);
  var arr = [];
  arr.push(data.name);
  arr.push(data.traffic);
  arr.push(data.meal);
  arr.push(data.total);
  dataIndex.push(arr);
}

function addData(...arg) {
  arg.forEach((item) => {
    item.unshift(['姓名', '餐补', '交补', '合计']);
  });
}
// 下载文件
router.get('/downloadExcel', (req, res) => {
  try {
    var pcList = [];
    var sdkList = [];
    var rtcList = [];
    var pmList = [];
    let result = req.query;
    result.pc.forEach((item) => {
      shareData(pcList, item);
    });
    result.sdk.forEach((item) => {
      shareData(sdkList, item);
    });
    result.rtc.forEach((item) => {
      shareData(rtcList, item);
    });
    result.pm.forEach((item) => {
      shareData(pmList, item);
    });
    addData(pcList, sdkList, rtcList, pmList);
    let buffer = xlsx.build([{
        name: 'PC',
        data: pcList,
      },
      {
        name: 'SDK',
        data: sdkList,
      },
      {
        name: 'RTC',
        data: rtcList,
      },
      {
        name: 'PM',
        data: pmList,
      },
    ]);
    res.send(buffer);
  } catch (err) {
    return err;
  }
});
// 多表查询,按月和年查找
router.get('/moreList', (req, res) => {
  try {
    let data = req.query;
    user.aggregate(
      [{
          $lookup: {
            from: 'managemen',
            localField: 'name',
            foreignField: 'name',
            as: 'dataList',
          },
        },
        {
          $match: {
            year: parseInt(data.year),
            month: parseInt(data.month),
          },
        },
      ],
      function (err, data) {
        res.send(data);
      }
    );
  } catch (err) {
    res.send(err);
  }
});
// 按照年月查找 || 按照年月组查找
router.get('/divide', async (req, res) => {
  try {
    let data = req.query;
    console.log(data);
    if (data.group === '') {
      let divide = await user.aggregate([{
        $match: {
          year: parseInt(data.year),
          month: parseInt(data.month)
        }
      }]);
      let divideData = [];
      divide.forEach((item)=>{
        let { name, meal, traffic, total } = item;
        divideData.push({
          name: name,
          meal: meal,
          traffic: traffic === 0 ? 0 : traffic.toFixed(2),
          total: total
        });
      });
      res.send(divideData);
    } else {
      let divide = await user.aggregate(
        [{
            $lookup: {
              from: 'managemen',
              localField: 'name',
              foreignField: 'name',
              as: 'dataList',
            },
          },
          {
            $match: {
              year: parseInt(data.year),
              month: parseInt(data.month),
            },
          },
        ]
      );
      let divideData = [];
      divide.forEach((item) => {
        if (item.dataList.length !== 0 && item.dataList[0].group === data.group) {
          let { name, meal, traffic, total } = item;
          divideData.push({
            name: name,
            meal: meal,
            traffic: traffic === 0 ? 0 : traffic.toFixed(2),
            total: total
          });
        }
      });
      res.send(divideData);
    }
  } catch (err) {
    res.send(err);
  }
})
module.exports = router;
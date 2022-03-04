var express = require('express');
var router = express.Router();
var group = require('../model/divideGroup');
// 保存到数据库
router.post('/saveData', (req, res) => {
  try {
    let data = req.body;
    new group({
      group: data.group,
      name: data.name,
      id: data.id,
    }).save((err, ret) => {
      res.send({status: 200, ret});
    });
  } catch (err) {
    res.send(err);
  }
});
// 获取数据
router.get('/getData', (req, res) => {
  group.find(function (err, ret) {
    if (err) {
      res.send(err);
    } else {
      res.send(ret);
    }
  });
});
// 删除数据
router.delete('/deleteUser', (req, res) => {
  try {
    let data = req.query;
    group.remove({
      id: data.id
    }, function (err, ret) {
      res.send({ status:200, ret });
    });
  } catch (err) {
    res.send(err);
  }
});
// 更新数据
router.put('/editUser', (req, res) => {
  try {
    let data = req.query;
    group.findOneAndUpdate(
      {
        id: data.id
      }, 
      {
        $set: {
          name: data.name,
          group: data.group
        }
      },
      function (err, ret) {
        res.send(ret);
      }
    );
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
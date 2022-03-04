let xlsx = require('node-xlsx');

class Workman {
  constructor(srcfile, distfile) {
    this.amount = 0;
    this.worker = {
      name: '',
      traffic: 0,
      meal: 0,
      total: 0,
    };
    this.workers = [];
    this.srcfile = srcfile;
    this.distfile = distfile;
    this.trafficObj = null;
    this.mealObj = null;
    this.average = 15;

    this.init();
  }
  // 解析xlsx表格
  init() {
    let xlsx = require('node-xlsx');
    let xlsObj = xlsx.parse(this.srcfile);
    this.trafficObj = xlsObj[0].data.slice(3);
    this.mealObj = xlsObj[1].data.slice(2);
  }
  calculate() {
    let ret = this.mealCount();
    if (ret === -1) {
      return ret;
    }

    ret = this.trafficCount();
    if (ret === -1) {
      return ret;
    }

    this.makeResult();
  }

  //  计算餐补
  mealCount() {
    if (!this.mealObj) {
      return -1;
    }

    const nameIndex = 5;

    //  创建一个map {'name': count}
    const mapMeal = new Map();

    for (let i = 0; i < this.mealObj.length; i++) {
      if (this.mealObj[i][nameIndex] === undefined) {
        continue;
      }
      
      for (let name of this.mealObj[i][nameIndex].split(' ')) {
        if (name === '' || name === '人员') {
          continue;
        }
        console.log('name:', name)
        const countNum = mapMeal.has(name) ? mapMeal.get(name) + 1 : 1;
        mapMeal.set(name, countNum);
      }
    };
    console.log('map:', mapMeal);
    
    for (let [name, count] of mapMeal.entries()) {
      console.log(name, count);
      let worker = {
        name: name,
        traffic: 0,
        meal: count * this.average,
        total: 0,
      };
      this.workers.push(worker);
    }

    console.log('workers:',  this.workers);
  }

  //  计算交补
  trafficCount() {
    if (!this.trafficObj) {
      return -1;
    }
    const nameIndex = 0;
    const fareIndex = 3;
    //  创建一个map {'name': count}
    const mapTraffic = new Map();

    for (let i = 0; i < this.trafficObj.length; i++) {
      if (this.trafficObj[i][nameIndex] === undefined) {
        continue;
      }

      for (let name of this.trafficObj[i][nameIndex].split(' ')) {
        console.log('name:', this.trafficObj[i][fareIndex])
        if (undefined === this.trafficObj[i][fareIndex]) {
          continue;
        }
        const fare = Number(this.trafficObj[i][fareIndex])
        
        const totalFare = mapTraffic.has(name) ? mapTraffic.get(name) + fare : fare;
        mapTraffic.set(name, totalFare);
      }
    };
    // mapTraffic.set('高凤', 9.5);
    console.log('map:', mapTraffic);

    for (let [name, fare] of mapTraffic.entries()) {
      console.log(name, fare);
 
      let worker = {
        name: name,
        traffic: fare,
        meal: 0,
        total: 0,
      };

      const index = this.workers.findIndex((worker) => {
        return worker.name === name;
      });
      console.log('finde work:', worker);
      if (index === -1) {
        this.workers.push(worker);
        continue;
      }
      
      this.workers[index].traffic = fare;
    }
    console.log('workers:',  this.workers);
  }
  // 生成一个数组对象，保存到数据库中
  makeResult() {
    let resultObj = [
      ['姓名', '车补', '餐补', '合计']
    ];
    let money = 0;
    for (let i = 0; i < this.workers.length; i++) {
      this.workers[i].total = this.workers[i].traffic + this.workers[i].meal;
      money += this.workers[i].total;
      resultObj.push([this.workers[i].name, this.workers[i].traffic, this.workers[i].meal, this.workers[i].total]);
    }

    resultObj.push([]);
    resultObj.push(['部门合计', '-', '-', Number(money)]);
    console.log('workers:',  resultObj);
    let buffer = xlsx.build([{name: 'sheet1', data: resultObj}]);
    const fs = require('fs');
    fs.writeFileSync(this.distfile, buffer, {'flag':'w'});//保存文件

  }
  
  sayHello() {
    console.log('hello');
  }

};
module.exports = Workman;

// const workman = new Workman('./test/data.xls', './test/result.xls');
// workman.calculate();
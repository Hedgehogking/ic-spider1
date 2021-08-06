// Excel表格导出+node自带文件系统（4.以Excel形式导出）
const excelPort = require('excel-export');
const fs = require("fs");

module.exports = class Excel {
  constructor(colOpts = [], data = [], fileName = '') {
    this.colOpts = colOpts;
    this.data = data;
    this.fileName = fileName;
    this.cols = [];
    this.rows = [];
    this.rowKeys = [];

    this.formatOptions();
    this.formatData();
  }

  formatOptions() {
    this.cols = this.colOpts.map(item => {
      this.rowKeys.push(item.key);
      return { caption: item.title, width: item.width || 100, type: 'string' };
    })
  }

  formatData() {
    // 循环导入从传参中获取的表内容
    this.data.forEach(item => {
      const tmpArr = [];
      this.rowKeys.forEach(key => {
        tmpArr.push(item[key]);
      })
      this.rows.push(tmpArr);
    })
  }

  writeExcel() {
    // 定义表格存放路径
    return new Promise((resolve, reject) => {
      if (!this.rows.length) {
        reject('no list')
        return;
      }
      if (!this.fileName) {
        reject('no fileName')
        return;
      }
      // 定义表头
      let conf = { cols: this.cols, rows: this.rows };
      // 生成表格
      const result = excelPort.execute(conf);
      if (!fs.existsSync('./export-files')) {
        fs.mkdirSync('./export-files');
      }
      fs.writeFile(`./export-files/${this.fileName}.xlsx`, result, 'binary', function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }
}

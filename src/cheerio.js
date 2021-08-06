// 请求模块（1.访问网站）
const request = require('request');
// 可以看做成node版的jQuery（2.获取页面指定数据源）
const cheerio = require("cheerio");
const Excel = require('./excel');

module.exports = class GetListByCheerio {
  constructor({ url, colOptions = [], getListAfterLoadPage }) {
    this.page = 0;
    this.allList = [];
    this.companyName = '';
    this.getUrl = url;
    this.colOptions = colOptions;
    this.getListAfterLoadPage = getListAfterLoadPage;
  }

  async run() {
    this.allList = await this.getList(this.page);
    const excel = new Excel(this.colOptions, this.allList, this.companyName);
    await excel.writeExcel();
    console.log('\x1B[32m%s\x1B[0m', `${this.companyName} export excel file success`);
  }

  // 自动判断页数
  async getList(page) {
    const list = await this.requestPage(page);
    // 最后一页
    if (list.length < 8) {
      return list
    }
    // 后面的页
    const nextPageList = await this.getList(++this.page)
    return [...list, ...nextPageList];
  }

  // 单次请求页面
  requestPage(page) {
    return new Promise((resolve, reject) => {
      request({
        url: this.getUrl(page),
        method: 'get',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          // 这里巨坑！这里开启了gzip的话http返回来的是Buffer。
          // 'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cache-Control': 'no-cache',
        },
        // 想请求回来的html不是乱码的话必须开启encoding为null
        encoding: null
      }, async (err, res, body) => {
        if (err) {
          reject([]);
          return;
        }
        //  console.log('打印HTML', body.toString()); // <html>xxxx</html>
        let list = [];
        const $ = cheerio.load(body.toString());
        if (this.getListAfterLoadPage) {
          list = this.getListAfterLoadPage(this, $);
        }
        if (list.length) {
          console.log(`get page ${this.page} data success`);
        }
        resolve(list);
      }
      );
    })
  }

  // 设置公司名称
  setCompanyName(name) {
    this.companyName = name;
  }
}

const GetListByCheerio = require('./src/cheerio')

module.exports = async function hqewCheerio(oldDomain) {
  // 传入公司的二级域名
  const domain = oldDomain || process.argv[2];

  if (!domain) {
    console.log('\x1B[33m%s\x1B[0m', 'no domain');
    return;
  }

  const ic = new GetListByCheerio({
    colOptions: [
      { title:'型号/型号规格', key:'model' },
      { title:'分类', key:'type' },
      { title:'品牌', key:'brand' },
      { title:'封装', key:'pkg' },
      { title:'批号', key:'batchNum' },
      { title:'数量', key:'quantity' },
    ],
    url(page) {
      return `http://${domain}.hqew.com/product?k=&r=0&cid=&p=${page}`;
    },
    getListAfterLoadPage(ic, $) {
      ic.setCompanyName($('.shop-title').text().trim());

      const list = [];
      // 获取指定元素
      let hs_content = $('tbody#js-productList tr');
      // 循环得到元素的跳转地址和名称
      hs_content.map((i, item) => {
        let obj = {};
        obj.model = $(item).children().eq(0).text();
        obj.type = $(item).children().eq(2).text();
        obj.brand = $(item).children().eq(3).text();
        obj.pkg = $(item).children().eq(4).text();
        obj.batchNum = $(item).children().eq(5).text();
        obj.quantity = $(item).children().eq(6).text();
        list.push(obj);
      });
      return list;
    }
  })

  await ic.run()

}

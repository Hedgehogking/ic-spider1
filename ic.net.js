const GetListByCheerio = require('./src/cheerio')

// 传入公司的二级域名
const domain = process.argv[2];

if (!domain) {
  console.log('\x1B[33m%s\x1B[0m', 'no domain');
  return;
}

const ic = new GetListByCheerio({
  colOptions: [
    { title:'型号', key:'name', width:150 },
    { title:'厂家', key:'factory', width:100 },
    { title:'批号', key:'batch', width:50 },
    { title:'数量', key:'number', width:50 },
    { title:'封装', key:'package', width:100 },
    { title:'说明', key:'prompt', width:100 },
  ],
  url(page) {
    return `https://${domain}.ic.net.cn/userHomePage/hotStock.php?Page=${page}`;
  },
  getListAfterLoadPage(ic, $) {
    ic.setCompanyName($('#company_name').text());

    const list = [];
    // 获取指定元素
    let hs_content = $('#hot_stock .hs_content');
    // 循环得到元素的跳转地址和名称
    hs_content.map((i, item) => {
      // 这里的map跟jq一样，跟js原生的参数是互换的
      let obj = {};
      obj.name = $(item).children('.hs_name').text();
      obj.factory = $(item).children('.hs_factory').text();
      obj.batch = $(item).children('.hs_batch').text();
      obj.number = $(item).children('.hs_number').text();
      obj.package = $(item).children('.hs_package').text();
      obj.prompt = $(item).children('.hs_prompt').text();
      list.push(obj);
    });
    return list;
  }
})

ic.run()

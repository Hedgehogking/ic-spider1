
const MAX_RT = 3;													// 重试次数
const LIST_TITLE = 'table#js-tbList thead tr th';			// 表头选择器
const LIST = 'tbody#js-productList tr';	// 列表选择器
const COMPANY_NAME = '.shop-title';  // 公司名称

module.exports = async function getHqewData(browser, page) {
  console.log('start to find table element in page...');
  const title = await page.waitForSelector(LIST_TITLE).catch(ex=>{
    console.log("oh....no...!!!, i can not see anything!!!");
  });
  const list = await page.waitForSelector(LIST).catch(ex => {
    console.log('no parent');
  })
  if (!title || !list) {
    await browser.close().catch();
    return;
  }
  console.log('yes! table is visible');

  console.log('start to get info from table element...');

  let data = {
    companyName: '',
    chapterTitle: [],
    chapterList: [],
  }

  for (var i = 0; i < MAX_RT; i++) {

    if (data.chapterList.length) {
      break;
    }

    data = await page.evaluate((titleSelector, listSelector, companySelector) => {
      const keyArr = ['model', 'type', 'brand', 'pkg', 'batchNum', 'quantity'];
      function getDataFromEleArr(arr = [], handler = () => {}) {
        return arr.filter(child => !!child.textContent.trim()).slice(0, -1).map(handler);
      }

      let companyName = document.querySelector(companySelector).textContent.trim();

      let chapterTitle = getDataFromEleArr(Array.from(document.querySelectorAll(titleSelector)), (child, index) => {
        return {
          title: child.textContent.trim(),
          key: keyArr[index]
        };
      });

      let chapterList = [];
      let trArr = Array.from(document.querySelectorAll(listSelector));
      trArr.forEach(tr => {
        const tmpObj = {};
        getDataFromEleArr(Array.from(tr.querySelectorAll('td')), (child, index) => {
          tmpObj[keyArr[index]] = child.textContent.trim();
        });
        chapterList.push(tmpObj);
      })

      return {
        companyName,
        chapterTitle,
        chapterList,
      };
    }, LIST_TITLE, LIST, COMPANY_NAME).catch(ex=>{
      console.log('fail to query chapter list!' + ex);
      if (i <= MAX_RT-1) {
        console.log('now retry...');
      }
    });
  }
  return data;
}

const puppeteer = require('puppeteer');
const slide = require('./src/hack-awsc');
const getHqewData = require('./src/get-hqew-data');
const Excel = require('./src/excel')
const hqewCheerio = require('./hqew-cheerio')

const domain = 'szyuda';
const page = 1;

const MAX_RT = 3;
const BUTTON_ID = '#nc_1_n1z';
const BUTTON_PARENT_ID = '#nc_1_n1t';
const CHAPTERS_URL = `http://${domain}.hqew.com/product?k=&r=0&cid=&p=${page}`;		//目录地址


module.exports = async function hack() {
	var tempbrowser;
	for (var i = MAX_RT; i > 0; i--) {

		if (tempbrowser) {
			break;
		}

		console.log('start to init browser...');
		tempbrowser = await puppeteer.launch({
		headless:false,
		args: [
			'--window-size="1200,1000"',
		//   '--start-fullscreen',
		//   '--proxy-server=socks5://127.0.0.1:1080'
		]
		}).catch(ex => {
			if (i-1 > 0) {
				console.log('browser launch failed. now retry...');
			} else {
				console.log('browser launch failed!');
			}

		});
	}

	if (!tempbrowser) {
		reject('fail to launch browser');
		return;
	}
	var browser = tempbrowser;

	console.log('start to new page...');
	var page = await browser.newPage().catch(ex=>{
		console.log(ex);
	});
	if (!page) {
		await browser.close().catch();
		reject('fail to open page!');
		return;
	}

	var num = 0;
	page.on("load", async () => {
		num += 1;
		console.log(`load page success => ${page.url()}`);

		if (num === 2 || page.url() === CHAPTERS_URL) {

			// puppeteer 方式
			// console.log('load second page');
			// const { chapterTitle, chapterList, companyName } = await getHqewData(browser, page)
			// if (chapterList.length) {
			// 	console.log('get second page data success !!!!!!!!!!');
			// 	const excel = new Excel(chapterTitle, chapterList, companyName);
			// 	await excel.writeExcel();
			// 	console.log('\x1B[32m%s\x1B[0m', `${companyName} export excel file success`);
			// 	console.log('close the browser');
			// } else {
			// 	console.log('get second page data empty');
			// }

			await browser.close().catch(ex=>{
				console.log('fail to close the browser!');
			});

			// cheerio 方式
			await hqewCheerio(domain);

		} else if (num === 1) {

			console.log('start to find button element in page...');
			const button = await page.waitForSelector(BUTTON_ID).catch(ex=>{
				console.log("oh....no...!!!, i can not see anything!!!");
			});
			const parent = await page.waitForSelector(BUTTON_PARENT_ID).catch(ex => {
				console.log('no parent');
			})
			if (button && parent) {
				console.log('yes! button is visible');
				console.log('start to slide the button...');
				// 模拟滑动躲过机器人检测
				await slide(page, parent, button)
			}
		}
	})

	var respond;
	for (var i = MAX_RT; i > 0; i--) {

		if (respond) {
			break;
		}

		console.log('start to goto page...');
		respond = await page.goto(CHAPTERS_URL, {
			'waitUntil':'domcontentloaded',
			'timeout':120000
		}).catch(ex=>{
			if(i-1 > 0) {
				console.log('fail to goto website. now retry...');
			} else {
				console.log('fail to goto website!');
			}

		});
	}
	if (!respond) {
		await browser.close().catch();
		reject('fail to go to website!');
		return;
	}
}

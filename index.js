console.log("======= Const Start =======");
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');
require('dotenv').config();

const urlList = require('./urlList.json');
console.log("======= Const End =======");

(async () => {
	// const proxyUrl = await proxyChain.anonymizeProxy(process.env.PROXY_URL);

	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			// `--proxy-server=${proxyUrl}`
		]
	});

	const page = await browser.newPage();

	await page.setViewport({width: 1440, height: 768});

	console.log("======= Access Start =======");
	for (key in urlList) {
		// let saveFileName = urlList[key].url.replace(process.env.URL_PREFIX, '');
		let saveFileName = urlList[key].title;
		console.log(saveFileName);

		await page.authenticate({username: process.env.AUTH_ID, password: process.env.AUTH_PW});
		await page.goto(process.env.URL_PREFIX + urlList[key].url, {waitUntil: 'domcontentloaded'});

		await page.screenshot({path: 'dist/' + saveFileName.replace('/', '') + '.png', fullPage: true});
	}

	await browser.close();
	console.log('✨✨✨ DONE! ✨✨✨');
})();

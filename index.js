const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');
require('dotenv').config();

const urlList = require('./urlList.json');

(async () => {
	const proxyUrl = await proxyChain.anonymizeProxy(process.env.PROXY_URL);

	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			`--proxy-server=${proxyUrl}`
		]
	});

	const page = await browser.newPage();

	await page.setViewport(
		{
			width: 1080, height: 768
		});
	for (key in urlList) {
		let saveFileName = urlList[key].url.replace(process.env.URL_PREFIX, '');

		await page.authenticate({username: process.env.AUTH_ID, password: process.env.AUTH_PW});
		await page.goto(urlList[key].url, {waitUntil: 'domcontentloaded'});

		await page.screenshot({path: 'dist/' + saveFileName.replace('/', '') + '.png', fullPage: true});
	}
	await browser.close();
	console.log('✨ DONE!');
})();

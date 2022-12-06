const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

const urlList = require('./urlList.json');

(async () => {
	const proxyUrl = await proxyChain.anonymizeProxy('https://proxyurl.com/');

	const browser = await puppeteer.launch(
		{
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
		let saveFileName = urlList[key].url.replace('https://', '');

		await page.goto(urlList[key].url, {
			waitUntil: 'networkidle2'
		});

		await page.screenshot(
			{
				path: 'dist/' + saveFileName.replace('/', '') + '.png', fullPage: true
			});
	}
	await browser.close();
	console.log('✨ DONE!');
})();

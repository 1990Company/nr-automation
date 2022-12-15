import playwright from 'playwright'
import got from 'got'
import dayjs from 'dayjs'
import * as dotenv from "dotenv";
dotenv.config();

const now = dayjs();
const day = now.get('day');
const arg = process.argv.at(2) || 0;
const options = () => ({
	delay: 1000 * Math.random() + 400,
});

(async () => {
	const browser = await playwright.chromium.launch({
		timeout: 60000,
		headless: false,
	});
	const context = await browser.newContext();
	const page = await context.newPage();
	const forPopup = new Promise(x => page.once('popup', x));

	// Go to target page
	await page.goto('https://new.smartplace.naver.com/bizes?menu=order');

	await page.click('text=확인', options());
	await page.waitForSelector('#id')
	await page.fill('#id', process.env.ID, options());
	await page.fill('#pw', process.env.PW, options());
	await page.click('.btn_login', options());

	await page.goto('https://partner.booking.naver.com/bizes/809400/biz-items/4770774/schedules', options());

	// 예약 내역에 따른 스케쥴 마감 진행 필요
	/*
		1. 예약 내역 [년,월,일,시작시간,종료시간] 아규먼트로 받기? 시작시간, 종료시간 두개만?
		*한 주의 시작은 월요일부터 토요일까지
		2. 현재 날짜의 요일을 구하고, 요일에 따라 다음주로 넘어가는지 체크
			ㄱ. 다음주로 넘어가는 경우, 현재 날짜와 시작시간 기준으로 몇 주차인지 체크
			ㄴ. 다음주로 넘어가지 않는 경우, 시작시간 기준으로 어느 요일인지 체크
		3. 예약 내역의 요일 클릭
		4. 예약 내역의 시작시간, 종료시간에 따라 마감 클릭
		2. 예약 내역이 있으면 마감 진행
		3. 예약 내역이 없으면 예약 진행
	*/

	// 요일 클릭
	await page.click('#app > div.BaseLayout__root__Ggyoo > div.BaseLayout__container__yTsQz > div.BaseLayout__contents__ZMr-6 > div > div.Schedules__root__3azKv > div > div.TimeTable__root__1yYtS.TimeTable__type-beauty__2PUx3 > div.TimeTable__schedules-time__ldjS- > div.TimeTable__time-contents__16d9a > div:nth-child(5) > div.TimeTable__day-time__1GiIU > button', options());
	// waitForSelector 필요할수도?

	// 마감 전환할 시간 클릭
	await page.click('.modal-content :text("06:00") ~ label', options());

	await page.click('.modal-content :text("취소")', options());
})();
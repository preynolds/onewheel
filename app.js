const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');


const ORDERNUMBER = '#ordernumber';
const EMAIL = '#email';
const BUTTON_SELECTOR = '#submit_btn';
const DELIVERY_SINGLE = '.delivery-single';


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

var mailOptions = {
  from: '',
  to: '',
  subject: 'Float Day',
  text: '',
  attachments: [
        {   
            filename: 'SHIPDAY.png',
            path: 'screenshots/SHIPDAY.png'
        }
  ]
};

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('https://onewheel.com/pages/dude-wheres-my-onewheel', {waitUntil: 'networkidle2'});

  await page.click(ORDERNUMBER);
  await page.keyboard.type('23493');

  await page.click(EMAIL);
  await page.keyboard.type('patrick@soniczen.com');

  await page.click(BUTTON_SELECTOR);

  await page.waitForSelector(DELIVERY_SINGLE);

  await page.waitFor(3000); // to wait for 1000ms

  const textContenDay = await page.evaluate(() => document.querySelector('#ship_day').textContent);
  const textContentMonth = await page.evaluate(() => document.querySelector('.arrival-small').textContent);

  console.log(textContentMonth, textContenDay);

  await page.screenshot({ path: 'screenshots/SHIPDAY.png' });

  await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  await browser.close();
};


run();


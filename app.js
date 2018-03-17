const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');



const ORDERNUMBER = '#ordernumber';
const EMAIL = '#email';
const BUTTON_SELECTOR = '#submit_btn';
const SHIPDAY = '.delivery-single';

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

  await page.waitForSelector(SHIPDAY);

  await page.screenshot({ path: 'screenshots/SHIPDAY.png' });

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  await browser.close();
};


run();

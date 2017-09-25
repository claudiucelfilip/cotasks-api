const phantom = require('phantom');
const router = require('express').Router()
const fs = require('fs');
const request = require('request');
const CHROMECAST_URL = 'https://clients3.google.com/cast/chromecast/home?slideshow-period=10';
const BACKDROPS_DIR = './backdrops/';

function getImages () {
  setInterval(async function () {
    let image = await getImage();
    let imageName = `${image.replace(/.*\//g, '')}.png`;

    if (fs.readdirSync(BACKDROPS_DIR).indexOf(imageName) === -1) {
      request(image).pipe(fs.createWriteStream(`${BACKDROPS_DIR}${imageName}`))
    }
  }, 3000);
}


async function getImage () {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function (requestData) {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open(CHROMECAST_URL);

  const image = await page.evaluate(function () {
    return document.querySelector('#picture-background').src;
  });
  instance.exit();
  return image;
}

let images = fs.readdirSync(BACKDROPS_DIR)

router.get('/:day', (req, res, next) => {
  let imageName = images[req.params.day];
  if (!imageName) {
    res.sendStatus(404);
  }
  fs.createReadStream(`${BACKDROPS_DIR}${imageName}`).pipe(res);
})

module.exports = router
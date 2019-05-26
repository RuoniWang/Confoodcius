const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');

const visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'ApO_CRWd7hdw3_tnU2WxeCdpULPWUFQVwqzBLJ7tfGPf',
});

const images_file = fs.createReadStream('./fruitbowl.jpg');
const classifier_ids = ['DefaultCustomModel_903980064'];
const threshold = 0.6;

const params = {
  images_file,
  classifier_ids,
  threshold,
};

visualRecognition.classify(params, (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(response, null, 2));
  }
});

const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    //first argument refers to if there are errors
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  let incomingExt = file.mimetype.split('/').pop();
  let acceptedExt = ['png', 'jpg', 'jpeg'];
  console.log(incomingExt);
  if (acceptedExt.includes(incomingExt)) {
    console.log('ext passed!');
    console.log(file);
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = upload;

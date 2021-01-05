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
  let mime = file.mimetype.split('/').pop();
  console.log(mime);
  if (mime === 'png' || mime === 'jpg' || mime === 'jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = upload;

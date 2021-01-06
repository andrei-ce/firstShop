const fs = require('fs');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      //This err should bubble up and express middleware should be able to handle this error
      throw err;
    }
  });
};

module.exports = { deleteFile };

const multer = require('multer');
const path = require('path');

// Set storage engine (Memory storage because we process immediately)
const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Check file type
const checkFileType = (file, cb) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDFs Only!');
  }
};

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

function uploadFile(req, res, next) {
  // limit filesize to 4MB
  const uploadSingle = multer({ storage, fileFilter, limits: { fileSize: 4000000 } }).single(
    'image'
  );

  uploadSingle(req, res, (err) => {
    if (err) {
      res.status(422);
      return next(new Error(err));
    }
    next();
  });
}

module.exports = { uploadFile };

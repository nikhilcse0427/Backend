const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(uploadPath));

app.get('/', (req, res) => {
  res.sendFile('./index.html');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('profileImg'), (req, res) => {
  console.log('Uploaded File:', req.file);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log(`app is running on port num. 3000`);
});

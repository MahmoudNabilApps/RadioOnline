const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// إنشاء مجلد الرفع إذا لم يكن موجود
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// صفحة رئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>راديو بسيط</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        input, button { padding: 10px; margin: 10px; }
        audio { width: 100%; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎵 راديو بسيط</h1>
        
        <h3>رفع موسيقى:</h3>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="music" accept="audio/*" required>
          <button type="submit">رفع</button>
        </form>
        
        <h3>قائمة الأغاني:</h3>
        <div id="playlist">
          <audio controls>
            <source src="/stream" type="audio/mpeg">
            متصفحك لا يدعم تشغيل الصوت
          </audio>
        </div>
      </div>
    </body>
    </html>
  `);
});

// رفع الملفات
app.post('/upload', upload.single('music'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('لم يتم رفع أي ملف');
  }
  res.send('تم رفع الملف بنجاح! <a href="/">العودة للرئيسية</a>');
});

// بث الموسيقى
app.get('/stream', (req, res) => {
  const uploadsDir = './uploads';
  const files = fs.readdirSync(uploadsDir);
  
  if (files.length === 0) {
    return res.status(404).send('لا توجد ملفات صوتية');
  }
  
  // تشغيل أول ملف صوتي
  const firstAudio = files.find(file => 
    file.endsWith('.mp3') || file.endsWith('.wav')
  );
  
  if (firstAudio) {
    const filePath = path.join(uploadsDir, firstAudio);
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).send('لا توجد ملفات صوتية');
  }
});

app.listen(PORT, () => {
  console.log(`الراديو يعمل على http://localhost:${PORT}`);
});

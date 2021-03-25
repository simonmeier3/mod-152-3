import express = require('express');
import multer = require('multer');

let app = express();

let store = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + '/uploads')
    },
    filename: (req, file, cb) => {
            cb(null, Date.now() + "_" + file.originalname);
        }
});

let upload = multer({storage: store});

app.post('/api/videos', upload.array('files'), (req,res,next ) => {
    res.json("Done")
});

app.listen(process.env.PORT || 3000);
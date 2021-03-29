"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
var fs = require('fs');
var uploadFolder = './uploads';
var path = require('path');
var ext;
var app = express();
var store = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: store });
var fileName = '';
app.post('/api/videos', upload.array('files'), function (req, res, next) {
    var videos = fs.readdirSync(uploadFolder);
    var fileNameParam = req.query.fileName;
    var turnParam = req.query.turn;
    var widthParam = req.query.width;
    var heightParam = req.query.height;
    var bitrateParam = req.query.videoBitrate;
    var ffmpegvideos = ffmpeg();
    videos.forEach(function (file) {
        if (file === '.gitkeep') {
            return;
        }
        else {
            ffmpegvideos = ffmpegvideos.mergeAdd(process.cwd() + '/uploads/' + file);
            console.log(file);
            ext = path.extname(__dirname + 'mergedVideo' + file);
            console.log(ext);
            fileName = "Uploaded_Video" + ext;
        }
    });
    if (fileNameParam) {
        fileName = fileNameParam + ext;
        console.log("Changed Filename to " + fileName);
    }
    ffmpegvideos.on('error', function (err) {
        console.log(err);
    })
        .on('end', function () {
        console.log('finished with merge file' + fileName);
        editVideo();
    })
        .mergeToFile(process.cwd() + '/mergedVideo/' + fileName);
    console.log("Waiting for Video to finish merging");
    function editVideo() {
        ffmpegvideos = ffmpeg();
        ffmpegvideos.input(process.cwd() + '/mergedVideo/' + fileName);
        if (turnParam === 'yes') {
            ffmpegvideos
                .withVideoFilter('transpose=1, transpose=1');
            console.log("Added turn Param");
        }
        if (bitrateParam) {
            ffmpegvideos
                .videoBitrate(bitrateParam);
            console.log("Added Bitrate Param");
        }
        if (heightParam && !widthParam) {
            ffmpegvideos
                .size('?x' + heightParam);
            console.log("Added height Param");
        }
        if (widthParam && !heightParam) {
            ffmpegvideos
                .size(widthParam + 'x?');
            console.log("Added width Param");
        }
        if (widthParam && heightParam) {
            ffmpegvideos
                .size(widthParam + 'x' + heightParam);
            console.log("Added width and height Param");
        }
        ffmpegvideos.on('error', function (err) {
            console.log(err);
        })
            .on('end', function () {
            console.log('finished editing Video');
            response();
        });
        ffmpegvideos.saveToFile(process.cwd() + '/editedVideo/' + fileName);
        console.log("Waiting for Video to finish editing");
    }
    function response() {
        res.json({
            data: {
                video: {
                    location: "http://localhost:3000/mod-152-3/editedVideo/" + fileName
                }
            }
        });
    }
});
app.use(express.static('editedVideo'));
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=server.js.map
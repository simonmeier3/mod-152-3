import express = require('express');
import multer = require('multer');
import * as ffmpeg from "fluent-ffmpeg";

const fs = require('fs');
const uploadFolder = './uploads';
const path = require('path');
let ext;
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
let fileName = '';


app.post('/api/videos', upload.array('files'), (req,res,next ) => {

    const videos = fs.readdirSync(uploadFolder);
    let fileNameParam: any = req.query.fileName;
    let turnParam: any = req.query.turn;
    let widthParam: any = req.query.width;
    let heightParam: any = req.query.height;
    let bitrateParam: any = req.query.videoBitrate;

    let ffmpegvideos = ffmpeg();
    videos.forEach(file => {
        if(file === '.gitkeep'){
            return
        }
        else {
            ffmpegvideos = ffmpegvideos.mergeAdd(process.cwd() + '/uploads/' + file);
            console.log(file);
            ext = path.extname(__dirname + 'mergedVideo' + file);
            console.log(ext);
            fileName = "Uploaded_Video" + ext;

        }
    });

    if(fileNameParam){
        fileName = fileNameParam + ext;
        console.log("Changed Filename to " + fileName);
    }

    ffmpegvideos.on('error', (err) => {
            console.log(err);
        })
        .on('end', () => {
            console.log('finished with merge file' + fileName);
            editVideo();
        })
        .mergeToFile(process.cwd() + '/mergedVideo/' + fileName);
        console.log("Waiting for Video to finish merging")

    function editVideo(){
        ffmpegvideos = ffmpeg();
        ffmpegvideos.input(process.cwd() + '/mergedVideo/' + fileName)
        if(turnParam === 'yes'){
            ffmpegvideos
                .withVideoFilter('transpose=1, transpose=1')
            console.log("Added turn Param");
        }
        if(bitrateParam){
            ffmpegvideos
                .videoBitrate(bitrateParam);
            console.log("Added Bitrate Param");
        }
        if(heightParam && !widthParam){
            ffmpegvideos
                .size('?x' + heightParam)
            console.log("Added height Param");
        }
        if(widthParam && !heightParam){
            ffmpegvideos
                .size(widthParam + 'x?')
            console.log("Added width Param");
        }
        if(widthParam && heightParam){
            ffmpegvideos
                .size(widthParam + 'x' + heightParam)
            console.log("Added width and height Param");
        }
        ffmpegvideos.on('error', (err) => {
            console.log(err);
        })
            .on('end', () => {
                console.log('finished editing Video');
                response();
            })
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
            }
        );
    }
});

app.use(express.static('editedVideo'));

app.listen(process.env.PORT || 3000);
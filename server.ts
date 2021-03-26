import express = require('express');
import multer = require('multer');
import * as ffmpeg from "fluent-ffmpeg";

const fs = require('fs');
const uploadFolder = './uploads';
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

    const videos = fs.readdirSync(uploadFolder);

    let ffmpegvideos = ffmpeg();

    videos.forEach(file => {
        if(file === '.gitkeep'){
            return
        }
        else {
            ffmpegvideos = ffmpegvideos.mergeAdd(process.cwd() + '/uploads/' + file);
            console.log(file);
        }
    });

    mergeVideos().then(r => {
        console.log("finished merging Videos")
    });

    async function mergeVideos() {
        ffmpegvideos
            .mergeToFile(process.cwd() + '/merged.mp4');
            console.log(process.cwd() + '/merged.mp4');
    }

    function response() {
        res.json({
                data: {
                    video: {
                        location: "http://localhost/api/video/merged.mp4"
                    }
                }
            }
        );
    }


});

app.listen(process.env.PORT || 3000);
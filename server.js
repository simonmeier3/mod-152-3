"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multer = require("multer");
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
app.post('/api/videos', upload.array('files'), function (req, res, next) {
    res.json("Done");
});
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=server.js.map
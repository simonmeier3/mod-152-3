"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ffmpeg = require("fluent-ffmpeg");
ffmpeg()
    .mergeAdd(process.cwd() + '/Big_Buck_Bunny_1.mp4')
    .mergeAdd(process.cwd() + '/Big_Buck_Bunny_2.mp4')
    .mergeToFile(process.cwd() + '/merged.mp4');
//# sourceMappingURL=mergevideos.js.map
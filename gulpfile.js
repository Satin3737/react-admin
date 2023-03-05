// main module
import gulp from 'gulp';

// path import
import {path} from "./gulp/config/path.js";

// plugins import
import {plugins} from "./gulp/config/plugins.js";

// make global variable
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
}

// tasks import
import {gulpCopy} from "./gulp/tasks/gulp-copy.js";
import {gulpReset} from "./gulp/tasks/gulp-reset.js";
import {gulpHtml} from "./gulp/tasks/gulp-html.js";
import {gulpScss} from "./gulp/tasks/gulp-scss.js";
import {gulpJs} from "./gulp/tasks/gulp-js.js";
import {gulpImages} from "./gulp/tasks/gulp-images.js";
import {otfToTtf, ttfToWoff, woff, fontsStyle} from "./gulp/tasks/gulp-fonts.js";
import {gulpZip} from "./gulp/tasks/gulp-zip.js";

// create watcher
function watcher() {
    gulp.watch(path.watch.files, gulpCopy);
    gulp.watch(path.watch.html, gulpHtml);
    gulp.watch(path.watch.scss, gulpScss);
    gulp.watch(path.watch.js, gulpJs);
    gulp.watch(path.watch.images, gulpImages);
}

// task for fonts
const fonts = gulp.series(otfToTtf, ttfToWoff, woff, fontsStyle);

// main tasks
const mainTasks = gulp.series(fonts, gulp.parallel(gulpCopy, gulpHtml, gulpScss, gulpJs, gulpImages)) ;

// create scenarios for tasks
const dev = gulp.series(gulpReset, mainTasks, gulp.parallel(watcher));
const build = gulp.series(gulpReset, mainTasks);
const deployZIP = gulp.series(gulpReset, mainTasks, gulpZip);

//export scenarios
export {dev};
export {build};
export {deployZIP};

// start default task
gulp.task('default', dev);
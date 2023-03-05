import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browsersync from 'browser-sync';
import newer from 'gulp-newer';
import ifPlugin from 'gulp-if';
import {deleteAsync} from 'del';

export const plugins = {
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
    ifPlugin: ifPlugin,
    del: deleteAsync
}
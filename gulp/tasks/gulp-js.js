import webpack from 'webpack-stream';

export const gulpJs = () => {
    return app.gulp.src(app.path.src.js, {sourcemap: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'JS',
                message: 'Error <%= error.message %>'
            })
        ))
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            entry: {
                app: app.path.src.js + '/app.js'
            },
            output: {
                filename: '[name].js'
            },
            devtool: "source-map",
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env'],
                                    "@babel/react"
                                ],
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browsersync.stream())
}
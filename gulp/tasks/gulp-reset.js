export const gulpReset = () => {
    return app.plugins.del(app.path.clean)
}
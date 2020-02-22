// 获取gulp等
const gulp = require('gulp')
const watch = require('gulp-watch')
// 使用插件压缩HTML文件
const htmlClean = require('gulp-htmlclean')
// 使用插件压缩image文件
const imageMin = require('gulp-imagemin')
// 使用插件压缩js文件
const uglify = require('gulp-uglify')
// 使用插件删除js文件中的调试语句
const stripDebug = require('gulp-strip-debug')
// 使用插件将less文件转换为css文件
const less = require('gulp-less')
// 使用插件压缩css文件
const cleanCss = require('gulp-clean-css')
// 使用插件给css3属性添加前缀
const postCss = require('gulp-postcss')
const autopreFixer = require('autoprefixer')
// 使用插件开启服务器
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
// 创建打包路径
const folder = {
    src: 'src/',
    dist: 'dist/'
}
// 设置环境变量
// export NODE_ENV=development （命令行） mac版
// set NODE_ENV=development （命令行） win版
// 判断当前环境变量
const devMod = process.env.NODE_ENV == "development"
console.log(devMod, process.env.NODE_ENV)

// 打包文件
gulp.task("html", function () {
    let page = gulp.src(folder.src + "html/*")
    if (!devMod) {
        page.pipe(htmlClean())
    }
    page.pipe(gulp.dest(folder.dist + "html/"))
        .pipe(reload({stream:true}))
})
gulp.task("css", function () {
    let page = gulp.src(folder.src + "css/*")
        .pipe(less())
        .pipe(postCss([autopreFixer()]))
    if (!devMod) {
        page.pipe(cleanCss())
    }
    page.pipe(gulp.dest(folder.dist + "css/"))
        .pipe(reload({stream:true}))
})
gulp.task("js", function () {
    let page = gulp.src(folder.src + "js/*")
    if (!devMod) {
        page.pipe(stripDebug())
            .pipe(uglify())
    }    
    page.pipe(gulp.dest(folder.dist + "js/"))
        .pipe(reload({stream:true}))
})
gulp.task("image", function () {
    let page = gulp.src(folder.src + "image/*")
    if (!devMod) {
        page.pipe(imageMin())
    }
    page.pipe(gulp.dest(folder.dist + "image/"))
        .pipe(reload({stream:true}))
})
gulp.task("source", function () {
    let page = gulp.src(folder.src + "source/*")
    if (!devMod) {
        page.pipe(imageMin())
    }
    page.pipe(gulp.dest(folder.dist + "source/"))
        .pipe(reload({stream:true}))
})

// 开启服务 
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "html/index.html"
        },
        port: 8090
    })
})

// 开启监听
gulp.task("watch", function () {
    watch([folder.src + "html/*.html"], gulp.series("html")).on("change", reload)
    watch([folder.src + "css/*"], gulp.series("css")).on("change", reload)
    watch([folder.src + "js/*.js"], gulp.series("js")).on("change", reload)
    watch([folder.src + "image/*"], gulp.series("image")).on("change", reload)
})

// 默认任务
gulp.task("default", gulp.parallel("html", "css", "js", "image", "source", "server", "watch"))
// აქ აიწყობა საბოლოო პროეტი.
let project_folder = "dist";
// სამუშაო სორს ფაილები.
let sourse_folder = "#src";


let path = {
    // გზა სადაც გალპი ჩატვირთავს დამუშავებულ ფაილებს.
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    // სამუშაო სორს ფაილების მდებარეობა.
    src: {
        // კითხულობს ყველა HTML ფაილს რომელიც არის სორს ფაილში,
        // შემდეგ გამორიცხავს ფაილებს რომეის იჭყება "_"-ზე.
        html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
        css: sourse_folder + "/scss/style.scss",
        js: sourse_folder + "/js/script.js",
        img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourse_folder + "/fonts/*.ttf",
    },
    // თვალთვალი ფაილებზე.
    watch: {
        html: sourse_folder + "/**/*.html",
        css: sourse_folder + "/scss/**/*.scss",
        js: sourse_folder + "/js/**/*.js",
        img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    // შლის პროეკტს ყოველ გალპის გაშვებაზე.
    clean: "./" + project_folder + "/"
};

// აცხადერბს ცვლადს და ანიჭებს პლაგინს.
let { src, dest } = require('gulp'),
    gulp = require('gulp');
    browsersync = require("browser-sync").create();
    fileinclude = require("gulp-file-include");
    del = require("del");
    scss = require("gulp-sass");
    autoprefixer = require("gulp-autoprefixer");
    group_media = require("gulp-group-css-media-queries");
    clean_css = require("gulp-clean-css");
    rename = require("gulp-rename");
    uglify = require('gulp-uglify-es').default;
    image_min = require('gulp-imagemin');
    ttf2woff = require('gulp-ttf2woff');
    ttf2woff2 = require('gulp-ttf2woff2');


// ფუნქცია რომელიც აახლებს გვერდს.
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

// ფუნქცია რომელიც ამუშავებს HTML ფაილებს.
function html() {
    // მიმართვა სორს ფაილებზე.
    return src(path.src.html)
        // ათავსებს არხში "pipe()" და ააწყოს "აკავშირებს" HTML ფაილებს.
        .pipe(fileinclude())
        // გამზადებულის ჩატვირთვა.
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

// ფუნქცია რომელიც ამუშავებს CSS ფაილებს.
function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true,
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

// ფუნქცია რომელიც ამუშავებს JS ფაილებს.
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

// ფუნქცია რომელიც ამუშავებს სურათებს.
function images() {
    return src(path.src.img)
        .pipe(
            image_min({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3, //0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

// ფუნქსია რომელიც ამუშავებს ფონტებს
function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

// ფუნქცია უთვალთვალებს ფაილებს.
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

// ფუნქცია რომელიც შლის ფაილებს.
function clean() {
    return del(path.clean);
}

// ფუნქცია რომელიც ჯერ შლის dist ფოლდერს და შემდეგ ასრულებს ფუნქციებს.
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
// ცვლადი ასრულებს ფუნქციებს.
let watch = gulp.parallel(build, watchFiles, browserSync);


// აკავშირებს გალპს ცვლადებთან.
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
// ანიჭებს ცვლადს დეფოლტ ბრძანებას ანუ gulp.
exports.default = watch;
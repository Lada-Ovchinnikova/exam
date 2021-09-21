'use strict';

 const gulp = require ('gulp'),
 plumber = require ('gulp-plumber'),
  autoprefixer = require ('gulp-autoprefixer'),
  terser = require ('gulp-terser'),
 sass = require ('gulp-sass') (require ('node-sass')),
   rigger = require ('gulp-rigger'),
 browserSync = require('browser-sync'),
rimraf = require ('rimraf'),
 reload = browserSync.reload;

 const path = {
  build: {
    html: 'build/',
    scss: 'build/css/',
    js: 'build/js/',
    img: 'build/img',
  },
   src: {
     html: 'index.html',
    scss: 'scss/style.scss',
     js: 'js/libs.js',
    img: 'img/**/*.{jpeg,jpg,png,svg,gif,webp}',
   },
  watch:{
    html: 'index.html',
    scss: 'scss/**/*.scss',
     js: 'js/**/*..js',
    img: 'img/**/*.{jpeg,jpg,png,svg,gif,webp}',
  },
  clean: 'build/'
},
config ={
  server: {
    baseDir: 'build/'
  },
  tunnel:true,
  port:7787,
  logPrefix: "WebDev"
 };

gulp.task('clean', function (done){
  rimraf(path.clean, done);

});


gulp.task('mv:img', function (done){
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream:true}));
  done();
});

 gulp.task('mv:html', function (done){
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('build:scss', function (done){
  gulp.src(path.src.scss, {sourcemaps:true})
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      cascade: false,
      remove: true
    }))
    .pipe(gulp.dest(path.build.scss, {sourcemaps:'.'}))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('build:js', function (done){
  gulp.src(path.src.js)
    .pipe(plumber())
     .pipe(rigger())
     .pipe(terser())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream:true}));
  done();
});

gulp.task('watch', function (done) {
  gulp.watch(path.watch.html, gulp.series('mv:html'));
  gulp.watch(path.watch.scss, gulp.series('build:scss'));
   gulp.watch(path.watch.js, gulp.series('build:js'));
  gulp.watch(path.watch.img, gulp.series('mv:img'));
  done();
});

gulp.task('webserver', function (done){
  browserSync(config);
  done();
});
// gulp.task('default', gulp.series('clean', 'mv:fonts', 'mv:img', 'build:html', 'build:scss','build:js','watch','webserver'));
gulp.task('default', gulp.series('clean','mv:html','mv:img','build:scss','build:js','watch','webserver'));
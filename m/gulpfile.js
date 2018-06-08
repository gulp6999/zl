const gulp 			= require('gulp');
const watch 		= require('gulp-watch');
const plumber 		= require('gulp-plumber');
const notify 		= require('gulp-notify');
const sass 			= require('gulp-sass');
const postcss 		= require('gulp-postcss');
const cssnano 		= require('cssnano');
const autoprefixer 	= require('autoprefixer');
const flieInclude 	= require('gulp-file-include');
const htmlBeautify 	= require('gulp-html-beautify');
const babel 		= require('gulp-babel');
const browserSync 	= require('browser-sync').create();
const reload 		= browserSync.reload;
gulp.task('scss',function(){
	gulp.src('src/scss/*.scss')
		.pipe(plumber({ errorHandler: notify.onError('script in Error : <%= error.message %>') }))
		.pipe(sass({useFileCache: true}))
		.pipe(postcss([autoprefixer({ browsers: ['last 6 versions', '>1%'], cascade: true,}), cssnano() ]))
		.pipe(gulp.dest('public/css'))
		.pipe(reload({ stream: true }));
});
gulp.task('script',()=>{
	gulp.src('src/js/*.js')
		.pipe(plumber({ errorHandler: notify.onError('script in Error : <%= error.message %>') }))
		.pipe(babel({ presets: ['env'] }))
		.pipe(gulp.dest('public/js'))
});
gulp.task('html',()=>{
	gulp.src(['views/*.html','!views/common/*.html'])
		.pipe(plumber({ errorHandler: notify.onError('html in Error : <%= error.message %>') }))
	    .pipe(flieInclude({ prefix: '@@', basepath: '@file'}))
	    .pipe(htmlBeautify({'indent_size': 4, 'indent_char': ' '}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({ stream: true }));		
});
gulp.task('watch:scss',['scss'],()=>{
	return watch(['src/scss/*.scss','src/scss/**/*.scss'],()=>{
		gulp.start('scss');
	});
});
gulp.task('watch:script',['script'],()=>{
	return watch('src/js/*.js',()=>{
		gulp.start('js');
	});
});
gulp.task('watch:html',['html'],()=>{
	return watch(['views/*.html','views/**/*.html'],()=>{
		gulp.start('html');
	});
});
gulp.task('browserSync',()=>{
    browserSync.init({
        server: {
            baseDir: ['./dist', './'],
            index: '/dist/index.html',
            // middleware: proxyMiddleware('/api', {
            //     target: 'http://www.aiqin.com/',
            //     pathRewrite: { '^/api': '/' }, // 重写路径
            //     changeOrigin: true
            // })
        },
        port: 8383,
        ui: {
            port: 8383
        },
	});
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['scss']).on('change', reload);
    gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['script']).on('change', reload);
    gulp.watch(['views/*.html', 'views/**/*.html'], ['html']).on('change', reload);
});
gulp.task('server', ['browserSync', 'watch:scss',  'watch:html', 'watch:script'])
gulp.task('default', ['server']);
var autoprefixer = require('autoprefixer');
var gulp     	 = require('gulp');
var concat 		 = require('gulp-concat');
var cleanCss 	 = require('gulp-clean-css');
var postcss      = require('gulp-postcss');
var sass 		 = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var rename 		 = require('gulp-rename');
var uglify 		 = require('gulp-uglify');

function handleError(err) {
    console.log(err.toString());
}

/**
1. Compile SCSS:
	- Build: scss
	- Watch: scss:watch

2. Compile JS:
	- Build: js

3. Watch CSS & JS:
	- Build: watch
*/

var paths = {
	src: {
		scss : 'src/scss',
		js : 'src/js'
	},
	dist: {
		css : 'assets/css',
		js : 'assets/js'
	},
	node_modules: 'node_modules'
}

/* Compile SCSS */
gulp.task('scss', () => {
	return gulp.src(paths.src.scss + '/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss([ autoprefixer({
        browsers: ["> 0.3%", "last 7 versions", "Android >= 4", "Firefox >= 20", "iOS >= 8"]
    }) ]))
	.pipe(gulp.dest(paths.dist.css))
    .pipe(rename({ suffix: '.min' }))
	.pipe(cleanCss({level: {1: {specialComments: 0}}}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(paths.dist.css))
});

gulp.task('scss:watch', ['scss'], () => {
	gulp.watch(paths.src.scss + '/**/*', ['scss']);
});


/* Compile JS */
gulp.task('js', () => {
	return gulp.src([
            // 'Your URL',
            // paths.node_modules + '/jquery/dist/jquery.min.js',
            paths.src.js + '/main.js'
		])
	.pipe(sourcemaps.init())
	.pipe(concat('style.js'))
	.pipe(gulp.dest(paths.dist.js))

	.pipe(rename('style.min.js'))
	.pipe(uglify())
	.on('error', handleError)
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(paths.dist.js));
});

gulp.task('js:watch', ['js'], () => {
	gulp.watch(paths.src.js + '/main.js', ['js']);
});

/* Watch All */
gulp.task('watch', ['scss:watch', 'js:watch']);
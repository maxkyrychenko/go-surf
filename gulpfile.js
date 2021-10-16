const { src, dest, watch, parallel, series} = require('gulp')
const fs = require('fs')

// Source Folder
const sourceFolder = 'src'

// App Folder
const appFolder = 'app'

// Modules 
const 
browserSync      = require('browser-sync'),
fileInclude      = require('gulp-file-include'),
sass             = require('gulp-sass'),
autoprefixer     = require('gulp-autoprefixer'),
rename           = require('gulp-rename'),
uglify 			     = require('gulp-uglify-es').default,
clean            = require('del'),
imagemin         = require('gulp-imagemin'),
webpackStream    = require('webpack-stream'),
imageminPngquant = require('imagemin-pngquant'),
imageminMozjpeg  = require('imagemin-mozjpeg'),
imageminSvgo     = require('imagemin-svgo'),
imageminWebp     = require('imagemin-webp')


// Watching
function watch_files() {
	browserSync.init({
		server: {
			baseDir: appFolder,
		},
		notify: false
	})

	watch([sourceFolder + '/index.html', sourceFolder + '/html/*.html'], html)
	watch([sourceFolder + '/scss/*.scss', sourceFolder + '/scss/utils/*.scss'], css)
	watch([sourceFolder + '/js/*.js'], js),
	watch([sourceFolder + '/images/**/*'], images)
}

// Clean App

function clean_app() {
	return clean(appFolder)
}

// HTML

function html() {
	return src(sourceFolder + '/index.html')
		.pipe(fileInclude())
		.pipe(dest(appFolder))
		.pipe(browserSync.stream())
}

// SCSS-CSS

function css() {
	return src(sourceFolder + '/scss/style.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer())
		.pipe(rename('style.min.css'))
		.pipe(dest(appFolder + '/css/'))
		.pipe(browserSync.stream())
}

// JS 

function js() {
	return src(sourceFolder + '/js/scripts.js')
		.pipe(webpackStream({
			output: {
				filename: 'scripts.min.js'
			},
			mode: 'development',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'babel-loader',
								options: {
									presets: [
										['@babel/preset-env', {
											"targets": "> 0.25%, not dead"
										}]
									]
								}
							}
						]
					},
				]
			}
		}))
		.pipe(uglify())
		.pipe(dest(appFolder + '/js/'))
		.pipe(browserSync.stream())
}

function js_build() {
	return src(sourceFolder + '/js/scripts.js')
		.pipe(webpackStream({
			output: {
				filename: 'scripts.min.js'
			},
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env', {
										"targets": "> 0.25%, not dead"
									}]
								]
							}
						}
					}
				]
			}
		}))
		.pipe(uglify())
		.pipe(dest(appFolder + '/js/'))
}

// IMAGES

function images() {
	src(sourceFolder + '/images/**/*')
		.pipe(imagemin([
				imageminPngquant({
					quality: [0.8, 0.9], // When used more then 70 the image wasn't saved
					speed: 1, // The lowest speed of optimization with the highest quality
					floyd: 1 // Controls level of dithering (0 = none, 1 = full).
				}),
				imageminMozjpeg({
					quality: 80,
					progressive: true
				}),
				imageminSvgo({
					plugins: [
						{removeViewBox: false}
					]
				})
		]))
		.pipe(dest(appFolder + '/images/'))
	return src(sourceFolder + '/images/**/*.{png,jpg}')
		.pipe(imagemin([
			imageminWebp({
				quality: 80
			})
		]))
		.pipe(rename({extname: '.webp'}))
	.pipe(dest(appFolder + '/images/'))
}

// FONTS

function fonts() {
	return src(sourceFolder + '/fonts/**/*')
	.pipe(dest(appFolder + '/fonts/'))
}

function fonts_style(cb) {
	let file_content = fs.readFileSync(sourceFolder + '/scss/utils/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(sourceFolder + '/scss/utils/_fonts.scss', '', cb);
		return fs.readdir(appFolder + '/fonts/', function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(sourceFolder + '/scss/utils/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
	cb()
}

exports.clean_app = clean_app
exports.fonts_style = fonts_style
exports.images = images

exports.default = series(clean_app, parallel(html, css, js, images, fonts), watch_files)
exports.build = series(clean_app, parallel(html, css, js_build, images, fonts))
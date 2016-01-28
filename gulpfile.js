var gulp         = require( "gulp" );
var sass         = require( "gulp-sass" );
var concat       = require( "gulp-concat" );
var cssnano      = require( "gulp-cssnano" );
var autoprefixer = require( "gulp-autoprefixer" );
var rename       = require( "gulp-rename" );
var order        = require( "gulp-order" );
var uglify       = require( "gulp-uglify" );
var cached       = require( "gulp-cached" );
var remember     = require( "gulp-remember" );
var sourcemaps   = require( "gulp-sourcemaps" );
var vinylPaths   = require( "vinyl-paths" );
var del          = require( "del" );
var plumber      = require( "gulp-plumber" );
var browserify   = require( "browserify" );
var source       = require( 'vinyl-source-stream' );
var buffer       = require( 'vinyl-buffer' );

var cssOutputDirectory = "";
var jsOutputDirectory  = "";

/**
 * Removes css files from output directory
 *
 * @returns {*}
 */
function cleanCss() {
	return gulp
			.src( "*.css", { cwd: cssOutputDirectory } )
			.pipe( vinylPaths( del ) );
}

/**
 * Removes js files from output directory
 *
 * @returns {*}
 */
function cleanJs() {
	return gulp
			.src( [
				      "*.js",
				      "!gulpfile.js"
			      ], { cwd: jsOutputDirectory } )
			.pipe( vinylPaths( del ) );
}

/**
 * Builds the css files
 *
 * @returns {*}
 */
function buildCss() {
	return gulp.src(
			[
				"src/scss/material-framework.scss"
			] )
			.pipe( plumber() )
			.pipe( sass() )
			.pipe( gulp.dest( cssOutputDirectory ) )
			.pipe( sourcemaps.init() )
			.pipe( concat( "material-framework.css" ) )
			.pipe( cssnano( { zindex: false } ) )
			.pipe( rename( { extname: ".min.css" } ) )
			.pipe( sourcemaps.write( "maps" ) )
			.pipe( gulp.dest( cssOutputDirectory ) );
}

/**
 *
 */
function buildJs() {
	return browserify(
			{
				entries: [ "src/js/material-framework.js" ]
			} )
			.bundle()
			.pipe( source( "material-framework.js" ) )
			.pipe( buffer() )
			.pipe( plumber() )
			.pipe( gulp.dest( jsOutputDirectory ) )
			.pipe( sourcemaps.init() )
			.pipe( uglify() )
			.pipe( rename( { extname: ".min.js" } ) )
			.pipe( sourcemaps.write( "maps" ) )
			.pipe( gulp.dest( jsOutputDirectory ) );
}

function customWatchers() {
	gulp.watch(
			"src/scss/**/*.scss",
			[ "css" ]
	);
	gulp.watch(
			"src/js/**/*.js",
			[ "js" ]
	);
}

gulp.task( "clean:css", cleanCss );
gulp.task( "css", [ "clean:css" ], buildCss );
gulp.task( "clean:js", cleanJs );
gulp.task( "js", [ "clean:js" ], buildJs );
gulp.task( "watch", [ "default" ], customWatchers );
gulp.task( "default", [ "css", "js" ] );
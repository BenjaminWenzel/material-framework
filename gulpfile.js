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

function cleanCss() {
	return gulp
			.src( "*.css", { cwd: "" } )
			.pipe( vinylPaths( del ) );
}

function buildCss() {
	gulp.src(
			[
				"src/scss/material-framework.scss"
			] )
			.pipe( plumber() )
			.pipe( sass() )
			.pipe( sourcemaps.init() )
			.pipe( concat( "material-framework.css" ) )
			.pipe( cssnano( { zindex: false } ) )
			.pipe( rename( { extname: ".min.css" } ) )
			.pipe( sourcemaps.write( "maps" ) )
			.pipe( gulp.dest( "" ) );
}

function cleanJs() {
	return gulp
			.src( "*.js", { cwd: "" } )
			.pipe( vinylPaths( del ) );
}

function buildJs() {
	gulp.src(
			[
				"src/js/material-framework.js",
				"src/js/**/*.js"
			] )
			.pipe( plumber() )
			.pipe( cached( "js" ) )
			.pipe( sourcemaps.init() )
			.pipe( order(
					[
						"material-framework.js",
						"**/*.js"
					], { base: "src/js" } ) )
			.pipe( uglify() )
			.pipe( remember( "js" ) )
			.pipe( concat( "material-framework.js", { newLine: ";" } ) )
			.pipe( rename( { extname: ".min.js" } ) )
			.pipe( sourcemaps.write( "maps" ) )
			.pipe( gulp.dest( "" ) );
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
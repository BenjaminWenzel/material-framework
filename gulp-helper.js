"use strict";

const argv         = require( "minimist" )( process.argv.slice( 2 ) );
const autoprefixer = require( "gulp-autoprefixer" );
const babel        = require( "gulp-babel" );
const babelify     = require( "babelify" );
const browserify   = require( "browserify" );
const buffer       = require( "vinyl-buffer" );
const concat       = require( "gulp-concat" );
const cssnano      = require( "gulp-cssnano" );
const del          = require( "del" );
const gulp         = require( "gulp" );
const gulpif       = require( "gulp-if" );
const gutil        = require( "gulp-util" );
const order        = require( "gulp-order" );
const plumber      = require( "gulp-plumber" );
const pug          = require( "gulp-pug" );
const rename       = require( "gulp-rename" );
const sass         = require( "gulp-sass" );
const sourcemaps   = require( "gulp-sourcemaps" );
const uglify       = require( "gulp-uglify" );
const vinylPaths   = require( "vinyl-paths" );
const source       = require( "vinyl-source-stream" );
const webserver    = require( "gulp-webserver" );
const wrap         = require( "gulp-wrap" );


class GulpHelper {
	static mergeCss( sources, filename, destination ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( sourcemaps.init() )
				.pipe( order( sources ) )
				.pipe( concat( `${filename}.css` ) )
				.pipe( gulp.dest( destination ) )
				.pipe( cssnano( {
					zindex : false
				} ) )
				.pipe( rename( {
					extname : ".min.css"
				} ) )
				.pipe( sourcemaps.write( "maps" ) )
				.pipe( gulp.dest( destination ) )
				.on( "end", ()=> {
					gutil.log( "Created", gutil.colors.green( `${filename}.min.css` ) );
				} );
		};
	}

	static buildScss( sources, filename, destination ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( sourcemaps.init() )
				.pipe( sass.sync() )
				.pipe( autoprefixer() )
				.pipe( order( sources ) )
				.pipe( concat( `${filename}.css` ) )
				.pipe( gulp.dest( destination ) )
				.pipe( cssnano( {
					zindex : false
				} ) )
				.pipe( rename( {
					extname : ".min.css"
				} ) )
				.pipe( sourcemaps.write( "maps" ) )
				.pipe( gulp.dest( destination ) )
				.on( "end", ()=> {
					gutil.log( "Created", gutil.colors.green( `${filename}.min.css` ) );
				} );
		};
	}

	static browserify( mainFile, filename, destination ) {
		return ()=> {
			return browserify( mainFile )
				.transform( "babelify", {
					presets : [ "es2015" ]
				} )
				.bundle()
				.pipe( source( `${filename}.js` ) )
				.pipe( buffer() )
				.pipe( sourcemaps.init() )
				.pipe( gulp.dest( destination ) )
				.pipe( uglify() )
				.pipe( rename( {
					extname : ".min.js"
				} ) )
				.pipe( sourcemaps.write( "maps" ) )
				.pipe( gulp.dest( destination ) )
				.on( "end", ()=> {
					gutil.log( "Created", gutil.colors.green( `${filename}.min.js` ) );
				} );
		};
	}

	static mergeJs( sources, filename, destination ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( sourcemaps.init() )
				.pipe( concat( `${filename}.js` ) )
				.pipe( gulp.dest( destination ) )
				.pipe( uglify() )
				.pipe( rename( {
					extname : ".min.js"
				} ) )
				.pipe( sourcemaps.write( "maps" ) )
				.pipe( gulp.dest( destination ) )
				.on( "end", ()=> {
					gutil.log( "Created", gutil.colors.green( `${filename}.min.js` ) );
				} );
		};
	}

	static buildJs( sources, filename, destination, useBabel, iife ) {
		useBabel = useBabel || false;
		iife     = iife || false;
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( sourcemaps.init() )
				.pipe( gulpif( iife, wrap( "(function(){ \"use strict\"; <%= contents %> })();" ) ) )
				.pipe( gulpif( useBabel, babel( {
					presets : [ "es2015" ]
				} ) ) )
				.pipe( concat( `${filename}.js` ) )
				.pipe( gulp.dest( destination ) )
				.pipe( uglify() )
				.pipe( rename( {
					extname : ".min.js"
				} ) )
				.pipe( sourcemaps.write( "maps" ) )
				.pipe( gulp.dest( destination ) )
				.on( "end", ()=> {
					gutil.log( "Created", gutil.colors.green( `${filename}.min.js` ) );
				} );
		};
	}

	static copy( sources, destination ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( gulp.dest( destination ) );
		};
	}

	static clean( sources ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( vinylPaths( del ) );
		};
	}

	static buildPug( sources, destination ) {
		return ()=> {
			return gulp.src( sources )
				.pipe( plumber() )
				.on( "data", GulpHelper.logFile )
				.pipe( pug( {
					pretty : true
				} ) )
				.pipe( gulp.dest( destination ) );
		};
	}

	static logFile( file ) {
		if( !!argv.dev ) {
			gutil.log( "Processing", gutil.colors.green( file.relative ) );
		}
	}

	static watch( glob, opt, task ) {
		return ()=> {
			gulp.watch( glob, opt, task )
				.on( "change", file => {
					gutil.log( "File changed", gutil.colors.green( file ) );
				} );
		};
	}

	static launchWebserver( sourceDirectory ) {
		return ()=> {
			return gulp.src( sourceDirectory )
				.pipe( webserver( {
					livereload       : true,
					directoryListing : false,
					open             : true,
					defaultFile      : "index.html",
					port             : 1337
				} ) );
		};
	}
}

module.exports = GulpHelper;

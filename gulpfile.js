"use strict";

const gulp    = require( "gulp" );
const helper  = require( "./gulp-helper" );
const dir     = {
	source      : "src",
	destination : "dist"
};
const sources = {
	css   : [
		`${dir.source}/scss/**/*.scss`
	],
	js    : [
		`${dir.source}/js/material-framework.js`,
		`${dir.source}/js/**/*.js`
	],
	fonts : [
		`${dir.source}/fonts/**/*.*`
	]
};

/** ----- ----- ----- ----- -----
 * Cleaning
 */
const cleanCss         = helper.clean(
	[
		`${dir.destination}/css/**/*.css`,
		`${dir.destination}/css/**/*.map`
	]
);
cleanCss.displayName   = "Cleaning CSS";
const cleanJs          = helper.clean(
	[
		`${dir.destination}/js/**/*.js`,
		`${dir.destination}/js/**/*.map`
	]
);
cleanJs.displayName    = "Cleaning JS";
const cleanFonts       = helper.clean( `${dir.destination}/fonts/**/*.*` );
cleanFonts.displayName = "Cleaning Fonts";
const clean            = gulp.parallel( cleanCss, cleanJs, cleanFonts );

/** ----- ----- ----- ----- -----
 * CSS
 */
const buildCss       = helper.buildScss( sources.css, "material-framework", `${dir.destination}/css` );
buildCss.displayName = "Creating CSS";
gulp.task( "build:css", gulp.series( cleanCss, buildCss ) );

/** ----- ----- ----- ----- -----
 * JS
 */
const buildJs       = helper.browserify(
	`${dir.source}/js/material-framework.js`,
	"material-framework",
	`${dir.destination}/js`
);
buildJs.displayName = "Creating Main JS";
gulp.task( "build:js", gulp.series( cleanJs, buildJs ) );

/** ----- ----- ----- ----- -----
 * Fonts
 */
const copyFonts       = helper.copy( sources.fonts, `${dir.destination}/fonts` );
copyFonts.displayName = "Copying Fonts";
gulp.task( "copy:fonts", gulp.series( cleanFonts, copyFonts ) );

/** ----- ----- ----- ----- -----
 * Watcher
 */
const watchCss       = helper.watch( sources.css, buildCss );
watchCss.displayName = "Watching CSS Files";
const watchJs        = helper.watch( sources.js, buildJs );
watchJs.displayName  = "Watching JS Files";
gulp.task( "watch:css", watchCss );
gulp.task( "watch:js", watchJs );
gulp.task( "watch", gulp.parallel( watchCss, watchJs ) );

/** ----- ----- ----- ----- -----
 * Build
 */
gulp.task( "default", gulp.series( clean, gulp.parallel( buildCss, buildJs, copyFonts ) ) );

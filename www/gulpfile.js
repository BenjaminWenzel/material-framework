"use strict";

const gulp    = require( "gulp" );
const helper  = require( "../gulp-helper" );
const dir     = {
	source      : "src",
	destination : "dist",
	material    : "../dist"
};
const sources = {
	css      : [ `${dir.source}/scss/**/*.scss` ],
	js       : [ `${dir.source}/js/**/*.js` ],
	pug      : [ `${dir.source}/pug/views/**/*.pug` ],
	material : [ `${dir.material}/**/*` ]
};

/** ----- ----- ----- ----- -----
 * Cleaning
 */
const cleanCss        = helper.clean(
	[
		`${dir.destination}/assets/css/**/*.css`,
		`${dir.destination}/assets/css/**/*.map`
	]
);
cleanCss.displayName  = "Cleaning CSS";
const cleanJs         = helper.clean(
	[
		`${dir.destination}/assets/js/**/*.js`,
		`${dir.destination}/assets/js/**/*.map`
	]
);
cleanJs.displayName   = "Cleaning JS";
const cleanHtml       = helper.clean( `${dir.destination}/**/*.html` );
cleanHtml.displayName = "Cleaning HTML";
const clean           = gulp.parallel( cleanCss, cleanJs, cleanHtml );
clean.displayName     = "Cleaning Assets";

/** ----- ----- ----- ----- -----
 * CSS
 */
const buildCss       = helper.buildScss( sources.css, "main", `${dir.destination}/assets/css` );
buildCss.displayName = "Creating CSS";
gulp.task( "build:css", gulp.series( cleanCss, buildCss ) );

/** ----- ----- ----- ----- -----
 * JS
 */
const buildJs       = helper.buildJs( sources.js, "main", `${dir.destination}/assets/js`, true );
buildJs.displayName = "Creating JS";
gulp.task( "build:js", gulp.series( cleanJs, buildJs ) );

/** ----- ----- ----- ----- -----
 * HTML
 */
const buildHtml       = helper.buildPug( sources.pug, dir.destination );
buildHtml.displayName = "Creating HTML";
gulp.task( "build:html", gulp.series( cleanHtml, buildHtml ) );

/** ----- ----- ----- ----- -----
 * Material
 */
const copyMaterial        = helper.copy( sources.material, `${dir.destination}/assets/material-framework` );
copyMaterial.displayName  = "Copying material framework";
const cleanMaterial       = helper.clean( `${dir.destination}/material-framework/**/*.*` );
cleanMaterial.displayName = "Cleaning Material Framework";
gulp.task( "copy:material", gulp.series( cleanMaterial, copyMaterial ) );

/** ----- ----- ----- ----- -----
 * Watcher
 */
const watchMaterial       = ()=> {
	gulp.watch( sources.material, copyMaterial );
};
watchMaterial.displayName = "Watching Material Framework";
const watchCss            = ()=> {
	gulp.watch( sources.css, buildCss );
};
watchCss.displayName      = "Watching CSS Files";
const watchJs             = ()=> {
	gulp.watch( sources.js, buildJs );
};
watchJs.displayName       = "Watching JS Files";
const watchHtml           = ()=> {
	gulp.watch(
		[
			`${dir.source}/pug/**/*.pug`
		],
		buildHtml
	);
};
watchHtml.displayName     = "Watching HTML Files";
gulp.task( "watch", gulp.parallel( watchMaterial, watchCss, watchJs, watchHtml ) );

/** ----- ----- ----- ----- -----
 * Build
 */
const build       = gulp.parallel(
	gulp.series(
		clean,
		gulp.parallel(
			buildCss,
			buildJs,
			buildHtml
		)
	),
	gulp.series(
		cleanMaterial,
		copyMaterial
	)
);
build.displayName = "Complete Build";
gulp.task( "default", build );

/** ----- ----- ----- ----- -----
 * Local server
 */
const localServer       = helper.launchWebserver( dir.destination );
localServer.displayName = "Local Server";
gulp.task( "serve", gulp.series( build, localServer, "watch" ) );

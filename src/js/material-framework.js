var Parallax    = require( "./md_parallax" );
var FormHandler = require( "./md_form-handler" );

var MaterialFramework = function () {
};

MaterialFramework.prototype.ready = function MaterialFramework$ready( callback ) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener( "DOMContentLoaded", callback );
};

window.mfw = mfw = new MaterialFramework();

mfw.ready( function () {

	var parallaxContainer = document.getElementsByClassName( "parallax-container" );
	if ( parallaxContainer ) {
		[].forEach.call( parallaxContainer, function ( el ) {
			new Parallax( el );
		} );
	}

	var inputGroups = document.getElementsByClassName( "md-input-group" );
	if ( inputGroups ) {
		[].forEach.call( inputGroups, function ( el ) {
			var formHandler = new FormHandler( el );
			formHandler.init();
		} );
	}
} );
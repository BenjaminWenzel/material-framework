var Parallax    = require( "./md_parallax" );
var FormHandler = require( "./md_form-handler" );
var DataTable   = require( "./md_data-table" );

var MaterialFramework = function () {
};

MaterialFramework.prototype.ready = function MaterialFramework$ready( callback ) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener( "DOMContentLoaded", callback );
};

MaterialFramework.prototype.dataTable = function MaterialFramework$dataTable( s ) {
	var table = new DataTable( s );
	table.init();
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
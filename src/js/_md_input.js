domReady( function () {

	var FormHandler = function ( el ) {
		var labelElement    = el.getElementsByClassName( "md-input-label" )[ 0 ];
		this.__inputElement = document.getElementById( labelElement.getAttribute( "for" ) );
	}

	FormHandler.prototype.init = function FormHandler$init() {
		var self = this;
		self.__inputElement.addEventListener( "change", function () {
			self.handleChange()
		} );
	};

	FormHandler.prototype.handleChange = function FormHandler$handleChange() {
		var self = this;
		if ( (self.__inputElement === document.activeElement) || self.__inputElement.placeholder || self.__inputElement.value ) {
			console.log( "add active to: " + inputElement );
		} else {
			console.log( "remove active from: " + inputElement );
		}
	};

	var inputGroups = document.getElementsByClassName( "md-input-group" );
	if ( inputGroups ) {
		[].forEach.call( inputGroups, function ( el ) {
			new FormHandler( el );
		} );
	}
} );
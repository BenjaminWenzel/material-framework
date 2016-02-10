var SelectHandler   = require( "./form-handler/md_select-handler" );
var TextAreaHandler = require( "./form-handler/md_textarea-handler" );

var FormHandler = function ( el ) {
	this.__element      = el;
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
}

FormHandler.prototype.init = function FormHandler$init() {
	var self = this;

	if ( self.__inputElement.tagName.toLowerCase() === "select" ) {
		if ( !self.__inputElement.hasAttribute( "multiple" ) ) {
			var selectHandler = new SelectHandler( self.__element );
			selectHandler.init();
		}
	}

	if ( self.__inputElement.tagName.toLowerCase() === "textarea" ) {
		var textAreaHandler = new TextAreaHandler( self.__element );
		textAreaHandler.init();
	}

	self.handleChange();
	self.__inputElement.addEventListener( "change", function () {
		self.handleChange()
	} );

	self.handleSubmit();
};

FormHandler.prototype.handleSubmit = function FormHandler$handleSubmit() {
	var self = this;

	var submitButtons = document.getElementsByClassName( "form-action" );
	if ( submitButtons && submitButtons.length < 0 ) {
		[].forEach.call( submitButtons, function ( s ) {
			s.addEventListener( "click", function ( e ) {
				console.log( e );
			}, false );
		} );
	}
};

FormHandler.prototype.handleChange = function FormHandler$handleChange() {
	var self = this;
	if ( (self.__inputElement === document.activeElement) || self.__inputElement.placeholder !== "" || self.__inputElement.value !== "" ) {
		self.__labelElement.classList.add( "active" );
	} else {
		self.__labelElement.classList.remove( "active" );
	}
};

module.exports = FormHandler;
var SelectHandler = require( "./form-handler/md_select-handler" );

var FormHandler = function ( el ) {
	this.__element      = el;
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
}

FormHandler.prototype.init = function FormHandler$init() {
	var self = this;

	if ( self.__inputElement.tagName.toLowerCase() === "select" ) {
		var selectHandler = new SelectHandler( self.__element );
		selectHandler.init();
	}
	self.handleChange();
	self.__inputElement.addEventListener( "change", function () {
		self.handleChange()
	} );
	if ( self.__inputElement.tagName.toLowerCase() === "textarea" ) {
		var hidden = document.createElement( "div" );
		hidden.classList.add( "md-hidden-textarea" );
		hidden.id = self.__inputElement.id + "-clone";
		self.__inputElement.parentNode.appendChild( hidden );

		self.updateTextarea();

		self.__inputElement.addEventListener( "input", function () {
			self.updateTextarea();
		} );
	}
};

FormHandler.prototype.updateTextarea = function FormHandler$updateTextarea() {
	var self = this;

	var input  = self.__inputElement.value.split( /\r\n|\r|\n/g );
	var hidden = document.getElementById( self.__inputElement.id + "-clone" );

	hidden.innerHTML = "";

	[].forEach.call( input, function ( e ) {
		hidden.innerHTML = hidden.innerHTML + e.outerHTML + "<br/>";
	} );

	hidden.style.height              = "auto";
	hidden.style.display             = "block";
	self.__inputElement.style.height = hidden.offsetHeight + "px";
	hidden.style.display             = "none";
}

FormHandler.prototype.handleChange = function FormHandler$handleChange() {
	var self = this;
	if ( (self.__inputElement === document.activeElement) || self.__inputElement.placeholder !== "" || self.__inputElement.value !== "" ) {
		self.__labelElement.classList.add( "active" );
	} else {
		self.__labelElement.classList.remove( "active" );
	}
};

module.exports = FormHandler;
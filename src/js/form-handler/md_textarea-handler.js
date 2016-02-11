function TextAreaHandler( el ) {
	this.__element      = el;
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
	this.__hiddenDiv    = document.createElement( "div" );
}

TextAreaHandler.prototype.init = function TextAreaHandler$init() {
	var self = this;

	self.__hiddenDiv.classList.add( "md-hidden-textarea" );
	self.__hiddenDiv.id = self.__inputElement.id + "-clone";
	self.__inputElement.parentNode.appendChild( hidden );

	self.updateTextarea();

	self.__inputElement.addEventListener( "input", function () {
		self.updateTextarea();
	} );
};

TextAreaHandler.prototype.updateTextarea = function TextAreaHandler$updateTextarea() {
	var self  = this;
	var input = self.__inputElement.value.split( /\r\n|\r|\n/g );

	self.__hiddenDiv.innerHTML = "";

	[].forEach.call( input, function ( e ) {
		self.__hiddenDiv.innerHTML = self.__hiddenDiv.innerHTML + e.outerHTML + "<br/>";
	} );

	self.__hiddenDiv.style.height    = "auto";
	self.__hiddenDiv.style.display   = "block";
	self.__inputElement.style.height = self.__hiddenDiv.offsetHeight + "px";
	self.__hiddenDiv.style.display   = "none";
}

module.exports = TextAreaHandler;
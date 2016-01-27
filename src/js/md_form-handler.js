var FormHandler = function ( el ) {
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
}

FormHandler.prototype.init = function FormHandler$init() {
	var self = this;
	self.handleChange();
	self.__inputElement.addEventListener( "change", function () {
		self.handleChange()
	} );
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
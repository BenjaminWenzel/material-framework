var MaterialFramework = function () {
};

MaterialFramework.prototype.ready = function MaterialFramework$ready( callback ) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener( "DOMContentLoaded", callback );
};

var mfw = new MaterialFramework();

mfw.ready( function () {

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

	var inputGroups = document.getElementsByClassName( "md-input-group" );
	if ( inputGroups ) {
		[].forEach.call( inputGroups, function ( el ) {
			var formHandler = new FormHandler( el );
			formHandler.init();
		} );
	}
} );

mfw.ready( function () {

	var Parallax = function ( el ) {
		this.__element         = el;
		this.__image           = this.__element.getElementsByTagName( "img" )[ 0 ];
		this.__initialPosition = this.__image.y;
		this.__speed           = 0.5;

		this.init();
	};

	Parallax.prototype.init = function Parallax$init() {
		var self = this;
		document.addEventListener( "scroll", function () {
			self.handleScroll()
		} );
	};

	Parallax.prototype.handleScroll = function Parallax$handleScroll() {
		var self                 = this;
		var positionBottom       = self.__element.offsetHeight + self.__initialPosition;
		var scrollPositionTop    = document.body.scrollTop;
		var scrollPositionBottom = scrollPositionTop + window.innerHeight;

		if ( self.__initialPosition <= scrollPositionBottom && positionBottom >= scrollPositionTop ) {
			var y                        = self.__speed * scrollPositionTop;
			self.__image.style.transform = "translate(0," + y + "px)";
		}
	};

	var parallaxContainer = document.getElementsByClassName( "parallax-container" );
	if ( parallaxContainer ) {
		[].forEach.call( parallaxContainer, function ( el ) {
			new Parallax( el );
		} );
	}
} );
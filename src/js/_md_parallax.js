domReady( function () {
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
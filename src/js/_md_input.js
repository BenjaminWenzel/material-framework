(function mdInput() {
	var mdInputGroups = document.getElementsByClassName( "md-input-group" );
	[].forEach.call( mdInputGroups, function ( element ) {
		var labelElements = element.getElementsByClassName( "md-input-label" );
		var labelForValue = labelElements[ 0 ].getAttribute( "for" );
		var inputElement = document.getElementById( labelForValue );
		if ( (inputElement === document.activeElement) || inputElement.placeholder || inputElement.value ) {
			addClass( labelElements[ 0 ], "active" );
		} else {
			removeClass( labelElements[ 0 ], "active" );
		}
		if ( inputElement.tagName.toLowerCase() === "textarea" ) {

			var hidden = document.createElement( "div" );
			addClass( hidden, "md-hidden-textarea" );
			hidden.id = inputElement.id + "-clone";
			inputElement.parentNode.appendChild( hidden );

			inputElement.addEventListener( "input", function updateHeight() {
				var hidden = document.getElementById( this.id + "-clone" );
				hidden.style.height = "auto";
				hidden.innerHTML = this.value.replace( /\n/g, "<br>" ) + "<br>";
				hidden.style.display = "block";
				this.style.height = hidden.offsetHeight + "px";
				hidden.style.display = "none";
			} );
		}
	} );
})();

function hasClass( el, className ) {
	if ( el.classList )
		return el.classList.contains( className );
	else
		return !!el.className.match( new RegExp( '(\\s|^)' + className + '(\\s|$)' ) );
}

function addClass( el, className ) {
	if ( el.classList )
		el.classList.add( className );
	else
		if ( !hasClass( el, className ) ) el.className += " " + className
}

function removeClass( el, className ) {
	if ( el.classList )
		el.classList.remove( className );
	else
		if ( hasClass( el, className ) ) {
			var reg = new RegExp( '(\\s|^)' + className + '(\\s|$)' )
			el.className = el.className.replace( reg, ' ' )
		}
}
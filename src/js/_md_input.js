(function mdInput() {
	var mdInputGroups = document.getElementsByClassName( "md-input-group" );

	console.log( "FCK!!!" );

	[].forEach.call( mdInputGroups, function ( element ) {
		var labelElements = element.getElementsByClassName( "md-input-label" );
		var labelForValue = labelElements[ 0 ].getAttribute( "for" );
		var inputElement  = document.getElementById( labelForValue );

		if ( (inputElement === document.activeElement) || inputElement.placeholder || inputElement.value ) {
			console.log( "add active to: " + inputElement );
		} else {
			console.log( "remove active from: " + inputElement );
		}
	} );
})();
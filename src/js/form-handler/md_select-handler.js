function SelectHandler( el ) {
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
}

SelectHandler.prototype.handleSelect = function SelectHandler$handleSelect() {
	var self = this;

	var uid          = self.getUid();
	var wrapperDiv   = document.createElement( "div" );
	var optionList   = document.createElement( "ul" );
	var optionListId = "md-select-options-" + uid;
	var options      = self.__inputElement.getElementsByTagName( "option" );
	var inputSelect  = document.createElement( "input" );
	var listItem     = null;

	wrapperDiv.classList.add( "md-select" );

	/*** Input field to trigger dropdown ***/
	inputSelect.type = "text";
	inputSelect.classList.add( "md-select-dropdown" );
	inputSelect.dataset.activates = optionListId;
	inputSelect.value             = options[ 0 ].textContent;
	inputSelect.readOnly          = true;
	inputSelect.addEventListener( "click", function () {
		var target = document.getElementById( this.dataset.activates );
		if ( this.className.indexOf( "active" ) !== -1 ) {
			this.classList.remove( "active" );
			target.classList.remove( "open" );
		} else {
			this.classList.add( "active" );
			target.classList.add( "open" );
		}
		document.body.addEventListener( "click", hideDropdown, false );
	} );

	function hideDropdown( e ) {
		if ( e.target.dataset.activates !== optionListId ) {
			document.body.removeEventListener( "click", hideDropdown, false );
			var inputSelect = self.__inputElement.parentNode.getElementsByClassName( "md-select-dropdown" )[ 0 ];
			inputSelect.classList.remove( "active" );
			var dropDown = document.getElementById( optionListId );
			dropDown.classList.remove( "open" );
		}
	}

	/*** Dropdown list ***/
	[].forEach.call( options, function ( o ) {
		listItem = document.createElement( "li" );
		if ( o.selected ) {
			listItem.classList.add( "selected" );
			inputSelect.value = o.textContent;
		}
		listItem.dataset.value = o.value;
		listItem.innerHTML     = o.textContent;

		if ( o.disabled ) {
			listItem.classList.add( "disabled" );
		} else {
			listItem.addEventListener( "click", function ( e ) {
				var options = self.__inputElement.getElementsByTagName( "option" );
				for ( var i = 0; i < options.length; i++ ) {
					if ( options[ i ].value === e.target.dataset.value ) {
						self.__inputElement.selectedIndex = i;
						options[ i ].setAttribute( "selected", "true" );
						inputSelect.value = options[ i ].textContent;
					} else {
						options[ i ].removeAttribute( "selected" );
					}
				}
				[].forEach.call( optionList.childNodes, function ( li ) {
					if ( li.dataset.value === e.target.dataset.value ) {
						li.classList.add( "selected" );
					} else {
						li.classList.remove( "selected" );
					}
				} );
			} );
		}

		optionList.appendChild( listItem );
	} );
	optionList.id = optionListId;
	optionList.classList.add( "md-select-dropdown-content" );

	wrapperDiv.appendChild( inputSelect );
	wrapperDiv.appendChild( optionList );
	self.__inputElement.parentNode.insertBefore( wrapperDiv, self.__inputElement );
};

SelectHandler.prototype.init = function SelectHandler$init() {
	var self = this;

	if ( self.__inputElement.tagName.toLowerCase() === "select" ) {
		self.handleSelect();
	}
};

SelectHandler.prototype.getUid = function SelectHandler$getUid() {
	function s4() {
		return Math.floor( (1 + Math.random()) * 0x10000 )
				.toString( 16 )
				.substring( 1 );
	}

	return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

module.exports = SelectHandler;
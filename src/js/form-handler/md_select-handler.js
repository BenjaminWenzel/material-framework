function SelectHandler( el ) {
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
	this.__uid          = mfw.getUid();
	this.__wrapperDiv   = document.createElement( "div" );
	this.__optionList   = document.createElement( "ul" );
	this.__optionListId = "md-select-options-" + this.__uid;
	this.__options      = self.__inputElement.getElementsByTagName( "option" );
	this.__inputSelect  = document.createElement( "input" );
}

SelectHandler.prototype.init = function SelectHandler$init() {
	var self = this;

	self.__wrapperDiv.classList.add( "md-select" );

	/*** Input field to trigger dropdown ***/
	self.__inputSelect.type = "text";
	self.__inputSelect.classList.add( "md-select-dropdown" );
	self.__inputSelect.dataset.activates = self.__optionListId;
	self.__inputSelect.value             = self.__options[ 0 ].textContent;
	self.__inputSelect.readOnly          = true;
	self.__inputSelect.addEventListener( "click", function () {
		var target = document.getElementById( this.dataset.activates );
		if ( this.className.indexOf( "active" ) !== -1 ) {
			this.classList.remove( "active" );
			target.classList.remove( "open" );
		} else {
			this.classList.add( "active" );
			target.classList.add( "open" );
		}
		document.body.addEventListener( "click", self.hideDropdown, false );
	} );

	/*** Dropdown list ***/
	var listItem = null;
	[].forEach.call( self.__options, function ( o ) {
		listItem = document.createElement( "li" );
		if ( o.selected ) {
			listItem.classList.add( "selected" );
			self.__inputSelect.value = o.textContent;
		}
		listItem.dataset.value = o.value;
		listItem.innerHTML     = o.textContent;

		if ( o.disabled ) {
			listItem.classList.add( "disabled" );
		} else {
			listItem.addEventListener( "click", function ( e ) {
				for ( var i = 0; i < self.__options.length; i++ ) {
					if ( self.__options[ i ].value === e.target.dataset.value ) {
						self.__inputElement.selectedIndex = i;
						self.__options[ i ].setAttribute( "selected", "true" );
						self.__inputSelect.value = options[ i ].textContent;
					} else {
						self.__options[ i ].removeAttribute( "selected" );
					}
				}
				[].forEach.call( self.__optionList.childNodes, function ( li ) {
					if ( li.dataset.value === e.target.dataset.value ) {
						li.classList.add( "selected" );
					} else {
						li.classList.remove( "selected" );
					}
				} );
			} );
		}

		self.__optionList.appendChild( listItem );
	} );
	self.__optionList.id = self.__optionListId;
	self.__optionList.classList.add( "md-select-dropdown-content" );

	self.__wrapperDiv.appendChild( self.__inputSelect );
	self.__wrapperDiv.appendChild( self.__optionList );
	self.__inputElement.parentNode.insertBefore( self.__wrapperDiv, self.__inputElement );
};

SelectHandler.prototype.hideDropdown = function SelectHandler$hideDropdown( e ) {
	var self = this;

	if ( e.target.dataset.activates !== self.__optionListId ) {
		document.body.removeEventListener( "click", self.hideDropdown, false );
		self.__inputSelect.classList.remove( "active" );
		var dropDown = document.getElementById( self.__optionListId );
		dropDown.classList.remove( "open" );
	}
}

module.exports = SelectHandler;
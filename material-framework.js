(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function SelectHandler( el ) {
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
	this.__uid          = self.getUid();
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

SelectHandler.prototype.getUid = function SelectHandler$getUid() {
	function s4() {
		return Math.floor( (1 + Math.random()) * 0x10000 )
				.toString( 16 )
				.substring( 1 );
	}

	return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

module.exports = SelectHandler;
},{}],2:[function(require,module,exports){
var Parallax    = require( "./md_parallax" );
var FormHandler = require( "./md_form-handler" );
var DataTable   = require( "./md_data-table" );

var MaterialFramework = function () {
};

MaterialFramework.prototype.ready = function MaterialFramework$ready( callback ) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener( "DOMContentLoaded", callback );
};

MaterialFramework.prototype.dataTable = function MaterialFramework$dataTable( s ) {
	var table = new DataTable( s );
	table.init();
};

window.mfw = mfw = new MaterialFramework();

mfw.ready( function () {

	var parallaxContainer = document.getElementsByClassName( "parallax-container" );
	if ( parallaxContainer ) {
		[].forEach.call( parallaxContainer, function ( el ) {
			new Parallax( el );
		} );
	}

	var inputGroups = document.getElementsByClassName( "md-input-group" );
	if ( inputGroups ) {
		[].forEach.call( inputGroups, function ( el ) {
			var formHandler = new FormHandler( el );
			formHandler.init();
		} );
	}
} );
},{"./md_data-table":3,"./md_form-handler":4,"./md_parallax":5}],3:[function(require,module,exports){
function DataTable( selector ) {
	this.__container      = null;
	this.__sortingTrigger = null;
	this.__tbody          = null;
	this.__rows           = null;
	this.__dataHandler    = null;
	this.__lastCellNumber = null;
	this.__cellNumber     = null;
	this.__searchBox      = null;
	this.__searchTerms    = null;

	if ( selector.indexOf( "." ) !== -1 ) {
		this.__container = document.getElementsByClassName( selector.substring( 1 ) )[ 0 ];
	} else
		if ( selector.indexOf( "#" ) !== -1 ) {
			this.__container = document.getElementById( selector.substring( 1 ) );
		}
}

DataTable.prototype.init = function DataTable$init() {
	var self = this;

	if ( self.__container ) {
		var table             = self.__container.getElementsByClassName( "md-data-table" )[ 0 ];
		self.__tbody          = table.tBodies[ 0 ];
		self.__rows           = self.__tbody.getElementsByTagName( "tr" );
		self.__sortingTrigger = table.getElementsByTagName( "th" );
		self.__searchBox      = self.__container.querySelector( "#filter" );

		self.__searchBox.addEventListener( "input", function () {
			var query          = self.__searchBox.value;
			// Strip whitespaces
			query              = query.replace( /\s+$/, "" );
			self.__searchTerms = query.split( " " );
			self.filter();
		} );

		[].forEach.call( self.__sortingTrigger, function ( el ) {
			el.addEventListener( "click", function ( e ) {
				self.sortBy( e.path[ 0 ].cellIndex )
			} )
		} );

		self.applyStyles();
	}
};

DataTable.prototype.applyStyles = function DataTable$applyStyles() {
	var self = this;

	var visibleRows = self.__tbody.querySelectorAll( "tr:not(.hidden)" );
	for ( var i = 0; i < visibleRows.length; i++ ) {
		if ( i % 2 === 0 ) {
			if ( visibleRows[ i ].className.indexOf( "even" ) !== -1 ) {
				visibleRows[ i ].classList.remove( "even" );
			}
			visibleRows[ i ].classList.add( "odd" );
		} else {
			if ( visibleRows[ i ].className.indexOf( "odd" ) !== -1 ) {
				visibleRows[ i ].classList.remove( "odd" );
			}
			visibleRows[ i ].classList.add( "even" );
		}
	}
}

DataTable.prototype.filter = function DataTable$filter() {
	var self = this;

	[].forEach.call( self.__rows, function ( el ) {
		if ( self.rowMatches( el ) ) {
			el.classList.remove( "hidden" );
		} else {
			el.classList.add( "hidden" );
		}
	} );

	self.applyStyles();
}

DataTable.prototype.rowMatches = function DataTable$rowMatches( row ) {
	var self            = this;
	var result          = true;
	var exposedElements = [];

	for ( var i = 0; i < row.cells.length; i++ ) {
		if ( row.cells[ i ].dataset.table === "include" ) {
			exposedElements.push( row.cells[ i ] );
		}
	}

	if ( self.__searchTerms === "" || self.__searchTerms[ 0 ] === "" || exposedElements.length < 1 ) {
		return true;
	}

	var haystack = "";
	[].forEach.call( exposedElements, function ( exposedElement ) {
		haystack = haystack + exposedElement.textContent.toLowerCase() + " ";
	} );

	[].forEach.call( self.__searchTerms, function ( searchTerm ) {
		if ( haystack.indexOf( searchTerm.toLowerCase() ) === -1 ) {
			result = false;
		}
	} );

	return result;
}

DataTable.prototype.reverse = function DataTable$reverse() {
	var self = this;

	for ( var i = 1; i < self.__rows.length; i++ ) {
		self.__tbody.insertBefore( self.__rows[ i ], self.__rows[ 0 ] );
	}

	self.applyStyles();
}

DataTable.prototype.sortBy = function DataTable$sortBy( cellNumber ) {
	var self          = this;
	self.__cellNumber = cellNumber;

	for ( var i = 0; i < self.__sortingTrigger.length; i++ ) {
		var el = self.__sortingTrigger[ i ];
		if ( i === self.__cellNumber ) {
			el.classList.remove( "sorting" );
			if ( el.className.indexOf( "sorting-asc" ) != -1 ) {
				el.classList.remove( "sorting-asc" );
				el.classList.add( "sorting-desc" );
			} else {
				el.classList.remove( "sorting-desc" );
				el.classList.add( "sorting-asc" );
			}
		} else {
			el.classList.remove( "sorting-asc" );
			el.classList.remove( "sorting-desc" );
			el.classList.add( "sorting" );
		}
	}

	if ( self.__lastCellNumber === self.__cellNumber ) {
		self.reverse();
	} else {
		self.__dataHandler = self.getDataHandler();
		self.quickSort( 0, self.__rows.length );
		self.reverse();
	}

	self.applyStyles();
	self.__lastCellNumber = self.__cellNumber;
};

DataTable.prototype.exchange = function DataTable$exchange( rowA, rowB ) {
	var self     = this;
	var tempNode = null;

	if ( rowA === rowB + 1 ) {
		self.__tbody.insertBefore( self.__rows[ rowA ], self.__rows[ rowB ] );
	} else
		if ( rowB === rowA + 1 ) {
			self.__tbody.insertBefore( self.__rows[ rowB ], self.__rows[ rowA ] );
		} else {
			tempNode = self.__tbody.replaceChild( self.__rows[ rowA ], self.__rows[ rowB ] );
			if ( !self.__rows[ rowA ] ) {
				self.__tbody.appendChild( tempNode );
			} else {
				self.__tbody.insertBefore( tempNode, self.__rows[ rowA ] );
			}
		}
};

DataTable.prototype.quickSort = function DataTable$quickSort( low, high ) {
	var self     = this;
	var getValue = self.__dataHandler;

	if ( high <= low + 1 ) {
		return;
	}

	if ( (high - low) === 2 ) {
		if ( getValue( high - 1 ) > getValue( low ) ) {
			self.exchange( high - 1, low );
		}
		return;
	}

	var i = low + 1;
	var j = high - 1;

	if ( getValue( low ) > getValue( i ) ) {
		self.exchange( i, low );
	}
	if ( getValue( j ) > getValue( low ) ) {
		self.exchange( low, j );
	}
	if ( getValue( low ) > getValue( i ) ) {
		self.exchange( i, low );
	}

	var pivot = getValue( low );

	while ( true ) {
		j--;
		while ( pivot > getValue( j ) ) {
			j--;
		}
		i++;
		while ( getValue( i ) > pivot ) {
			i++;
		}
		if ( j <= i ) {
			break;
		}
		self.exchange( i, j );
	}
	self.exchange( low, j );

	if ( (j - low) < (high - j) ) {
		self.quickSort( low, j );
		self.quickSort( j + 1, high );
	} else {
		self.quickSort( j + 1, high );
		self.quickSort( low, j );
	}
}
;

DataTable.prototype.getDataHandler = function DataTable$getDataHandler() {
	var self     = this;
	var dataType = self.__sortingTrigger[ self.__cellNumber ].dataset.type;

	switch ( dataType ) {
		case "numeric":
			return function ( row ) {
				if ( self.__rows[ row ].cells[ self.__cellNumber ].textContent ) {
					return parseFloat( /\d+/.exec( self.__rows[ row ].cells[ self.__cellNumber ].textContent ) );
				}
				return 0;
			};
		case "datetime":
			return function ( row ) {
				if ( self.__rows[ row ].cells[ self.__cellNumber ].textContent ) {
					return self.parseDate( self.__rows[ row ].cells[ self.__cellNumber ].textContent );
				}
				return "";
			};
		case "size":
			return function ( row ) {
				if ( self.__rows[ row ].cells[ self.__cellNumber ].textContent ) {
					return self.parseSize( self.__rows[ row ].cells[ self.__cellNumber ].textContent );
				}
				return "";
			};
		default:
			return function ( row ) {
				if ( self.__rows[ row ].cells[ self.__cellNumber ].textContent ) {
					return self.__rows[ row ].cells[ self.__cellNumber ].textContent.toLowerCase();
				}
				return "";
			};
	}
};

DataTable.prototype.parseDate = function DataTable$parseDate( date ) {
	var parts = date.match( /(\d+)/g );
	if ( parts.length === 3 ) {
		return new Date( parts[ 2 ], parts[ 1 ] - 1, parts[ 0 ] ).getTime();
	} else {
		return new Date( parts[ 2 ], parts[ 1 ] - 1, parts[ 0 ], parts[ 3 ], parts[ 4 ], parts[ 5 ] ).getTime();
	}
};

DataTable.prototype.parseSize = function DataTable$parseSize( size ) {
	var result = 0;
	var value  = /^\d{1,4}(?:\.\d{1,2})?/.exec( size );
	var type   = /[BKMGT]+/.exec( size );
	switch ( type ) {
		case "GB":
			result = parseFloat( value ) * Math.pow( 1024, 3 );
			break;
		case "MB":
			result = parseFloat( value ) * Math.pow( 1024, 2 );
			break;
		case "KB":
			result = parseFloat( value ) * 1024;
			break;
		default:
			result = parseFloat( value );
	}

	return result;
}

module.exports = DataTable;
},{}],4:[function(require,module,exports){
var SelectHandler = require( "./form-handler/md_select-handler" );

var FormHandler = function ( el ) {
	this.__element = el;
	this.__labelElement = el.getElementsByClassName( "md-input-label" )[ 0 ];
	this.__inputElement = document.getElementById( this.__labelElement.getAttribute( "for" ) );
}

FormHandler.prototype.init = function FormHandler$init() {
	var self = this;

	if ( self.__inputElement.tagName.toLowerCase() === "select" ) {
		var selectHandler = new SelectHandler( self.__element );
		selectHandler.init();
	} else {
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
},{"./form-handler/md_select-handler":1}],5:[function(require,module,exports){
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

module.exports = Parallax;
},{}]},{},[2]);

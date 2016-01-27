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
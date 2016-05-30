"use strict";

export default class DataTable {
	constructor( selector, filter ) {
		this._table     = document.getElementById( selector );
		this._filter    = document.getElementById( filter );
		this._tableBody = null;
		this._rows      = null;
	}

	init() {
		this._tableBody = this._table.tBodies[ 0 ];
		this._rows      = this._tableBody.getElementsByTagName( "tr" );

		const sortService = new SortService( this );
		sortService.init();

		const filterService = new FilterService( this );
		filterService.init();
	}

	applyStyles() {
		const visibleRows = this._tableBody.querySelectorAll( "tr:not(.hidden)" );
		for( let i = 0; i < visibleRows.length; i++ ) {
			if( i % 2 === 0 ) {
				if( visibleRows[ i ].className.indexOf( "even" ) !== -1 ) {
					visibleRows[ i ].classList.remove( "even" );
				}
				visibleRows[ i ].classList.add( "odd" );
			} else {
				if( visibleRows[ i ].className.indexOf( "odd" ) !== -1 ) {
					visibleRows[ i ].classList.remove( "odd" );
				}
				visibleRows[ i ].classList.add( "even" );
			}
		}
	}
}

class FilterService {
	constructor( dataTable ) {
		this._parent      = dataTable;
		this._table       = dataTable._table;
		this._tableBody   = dataTable._tableBody;
		this._rows        = dataTable._rows;
		this._filter      = dataTable._filter;
		this._searchTerms = null;
	}

	init() {
		const self = this;

		if( self._filter !== null ) {
			self._filter.addEventListener( "input", function filter() {
				var query         = self._filter.value.replace( /\s+$/, "" );
				self._searchTerms = query.split( " " );
				self.filter();
			} );
		}
	};

	filter() {
		[].forEach.call( this._rows, function filterRow( el ) {
			if( this.rowMatches( el ) ) {
				el.classList.remove( "hidden" );
			} else {
				el.classList.add( "hidden" );
			}
		} );
		this._parent.applyStyles();
	};

	rowMatches( row ) {
		const exposedElements = [];

		for( let i = 0; i < row.cells.length; i++ ) {
			if( row.cells[ i ].getAttribute( "data-table" ) === "include" ) {
				exposedElements.push( row.cells[ i ] );
			}
		}
		if( this._searchTerms === "" || this._searchTerms[ 0 ] === "" || exposedElements.length < 1 ) {
			return true;
		}
		let haystack = "";
		exposedElements.forEach( exposedElement => {
			haystack = haystack + exposedElement.textContent.toLowerCase() + " ";
		} );
		let result = true;
		this._searchTerms.forEach( searchTerm => {
			if( haystack.indexOf( searchTerm.toLowerCase() ) === -1 ) {
				result = false;
			}
		} );

		return result;
	};
}

class SortService {
	constructor(dataTable) {
		this._parent          = dataTable;
		this._table           = dataTable._table;
		this._tableBody       = dataTable._tableBody;
		this._rows            = dataTable._rows;
		this._sortableColumns = [];
		this._lastCellIndex   = null;
		this._dataHandler     = null;
	}

	init() {
		const self = this;

		[].forEach.call( self._table.querySelectorAll( "th.sortable" ), function addColumn( columnHeading ) {
			self._sortableColumns.push( {
				trigger  : columnHeading,
				index    : columnHeading.cellIndex,
				dataType : columnHeading.getAttribute( "data-type" )
			} );
		} );
		self._sortableColumns.forEach( column => {
			column.trigger.addEventListener( "click", self.sortByColumn.call( self, column ) );
		} );
		self._parent.applyStyles();
	};

	sortByColumn( column ) {
		const self = this;

		return e => {
			for( let i = 0; i < self._sortableColumns.length; i++ ) {
				var currentColumn = self._sortableColumns[ i ];
				if( currentColumn.index === column.index ) {
					if( currentColumn.trigger.className.indexOf( "asc" ) != -1 ) {
						currentColumn.trigger.classList.remove( "asc" );
						currentColumn.trigger.classList.add( "desc" );
					} else {
						currentColumn.trigger.classList.remove( "desc" );
						currentColumn.trigger.classList.add( "asc" );
					}
				} else {
					currentColumn.trigger.classList.remove( "asc" );
					currentColumn.trigger.classList.remove( "desc" );
				}
			}
			if( self._lastCellIndex === column.index ) {
				self.reverseTable();
			} else {
				self._dataHandler = self.getDataHandler( column.index, column.dataType );
				self.quickSort( 0, self._rows.length );
				self.reverseTable();
			}
			self._lastCellIndex = column.index;
			self._parent.applyStyles();
		};
	};

	reverseTable() {
		for( let i = 1; i < this._rows.length; i++ ) {
			this._tableBody.insertBefore( this._rows[ i ], this._rows[ 0 ] );
		}
	};

	applyStyles() {
		const visibleRows = this._tableBody.querySelectorAll( "tr:not(.hidden)" );
		for( let i = 0; i < visibleRows.length; i++ ) {
			if( i % 2 === 0 ) {
				if( visibleRows[ i ].className.indexOf( "even" ) !== -1 ) {
					visibleRows[ i ].classList.remove( "even" );
				}
				visibleRows[ i ].classList.add( "odd" );
			} else {
				if( visibleRows[ i ].className.indexOf( "odd" ) !== -1 ) {
					visibleRows[ i ].classList.remove( "odd" );
				}
				visibleRows[ i ].classList.add( "even" );
			}
		}
	};

	quickSort( low, high ) {
		const getValue = self._dataHandler;
		if( high <= low + 1 ) {
			return;
		}
		if( ( high - low ) === 2 ) {
			if( getValue( high - 1 ) > getValue( low ) ) {
				this.exchange( high - 1, low );
			}
			return;
		}
		let i = low + 1;
		let j = high - 1;
		if( getValue( low ) > getValue( i ) ) {
			this.exchange( i, low );
		}
		if( getValue( j ) > getValue( low ) ) {
			this.exchange( low, j );
		}
		if( getValue( low ) > getValue( i ) ) {
			this.exchange( i, low );
		}
		const pivot = getValue( low );
		while( true ) {
			j--;
			while( pivot > getValue( j ) ) {
				j--;
			}
			i++;
			while( getValue( i ) > pivot ) {
				i++;
			}
			if( j <= i ) {
				break;
			}
			this.exchange( i, j );
		}
		this.exchange( low, j );
		if( ( j - low ) < ( high - j ) ) {
			this.quickSort( low, j );
			this.quickSort( j + 1, high );
		} else {
			this.quickSort( j + 1, high );
			this.quickSort( low, j );
		}
	};

	exchange( rowA, rowB ) {
		let tempNode = null;
		if( rowA === rowB + 1 ) {
			this._tableBody.insertBefore( this._rows[ rowA ], this._rows[ rowB ] );
		} else if( rowB === rowA + 1 ) {
			this._tableBody.insertBefore( this._rows[ rowB ], this._rows[ rowA ] );
		} else {
			tempNode = this._tableBody.replaceChild( this._rows[ rowA ], this._rows[ rowB ] );
			if( !this._rows[ rowA ] ) {
				this._tableBody.appendChild( tempNode );
			} else {
				this._tableBody.insertBefore( tempNode, this._rows[ rowA ] );
			}
		}
	};

	getDataHandler( columnIndex, dataType ) {
		switch( dataType ) {
			case "numeric":
				return function parseNumericValue( rowIndex ) {
					const cell = this._rows[ rowIndex ].cells[ columnIndex ];
					if( cell.textContent ) {
						return parseFloat( /\d+/.exec( cell.textContent ) );
					}
					return 0;
				};
			case "datetime":
				return function parseDateValue( rowIndex ) {
					const cell = this._rows[ rowIndex ].cells[ columnIndex ];
					if( cell.textContent ) {
						return this.parseDate( cell.textContent );
					}
					return "";
				};
			case "size":
				return function parseSizeValue( rowIndex ) {
					const cell = this._rows[ rowIndex ].cells[ columnIndex ];
					if( cell.textContent ) {
						return this.parseSize( cell.textContent );
					}
					return "";
				};
			case "boolean":
				return function parseBooleanValue( rowIndex ) {
					const cell = this._rows[ rowIndex ].cells[ columnIndex ];
					return cell.getAttribute( "data-value" ) === "0";
				};
			default:
				return function parseTextValue( rowIndex ) {
					const cell = this._rows[ rowIndex ].cells[ columnIndex ];
					if( cell.textContent ) {
						return cell.textContent.toLowerCase();
					}
					return "";
				};
		}
	};

	static parseDate( date ) {
		const parts = date.match( /(\d+)/g );
		if( parts === null ) {
			return 0;
		} else if( parts.length === 3 ) {
			return new Date( parts[ 2 ], parts[ 1 ] - 1, parts[ 0 ] ).getTime();
		} else {
			return new Date( parts[ 2 ], parts[ 1 ] - 1, parts[ 0 ], parts[ 3 ], parts[ 4 ], parts[ 5 ] ).getTime();
		}
	};

	static parseSize( size ) {
		let result  = 0;
		const value = /^\d{1,4}(?:\.\d{1,2})?/.exec( size );
		const type  = /[BKMGT]+/.exec( size );
		switch( type ) {
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
	};
}

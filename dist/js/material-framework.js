(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sideNav = require("./modules/side-nav");

var _sideNav2 = _interopRequireDefault(_sideNav);

var _dataTable = require("./modules/data-table");

var _dataTable2 = _interopRequireDefault(_dataTable);

var _parallax = require("./modules/parallax");

var _parallax2 = _interopRequireDefault(_parallax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MaterialFramework = function () {
	function MaterialFramework() {
		_classCallCheck(this, MaterialFramework);
	}

	_createClass(MaterialFramework, [{
		key: "init",
		value: function init() {
			window.mf = this;
			return Promise.resolve();
		}
	}, {
		key: "sideNav",
		value: function sideNav(e) {
			console.log(e);
			var sideNav = new _sideNav2.default();
		}
	}]);

	return MaterialFramework;
}();

$(document).ready(function () {
	var mf = new MaterialFramework();
	mf.init().then(function () {
		console.log("Material framework loaded!");
	});
});

},{"./modules/data-table":2,"./modules/parallax":3,"./modules/side-nav":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataTable = function () {
	function DataTable(selector, filter) {
		_classCallCheck(this, DataTable);

		this._table = document.getElementById(selector);
		this._filter = document.getElementById(filter);
		this._tableBody = null;
		this._rows = null;
	}

	_createClass(DataTable, [{
		key: "init",
		value: function init() {
			this._tableBody = this._table.tBodies[0];
			this._rows = this._tableBody.getElementsByTagName("tr");

			var sortService = new SortService(this);
			sortService.init();

			var filterService = new FilterService(this);
			filterService.init();
		}
	}, {
		key: "applyStyles",
		value: function applyStyles() {
			var visibleRows = this._tableBody.querySelectorAll("tr:not(.hidden)");
			for (var i = 0; i < visibleRows.length; i++) {
				if (i % 2 === 0) {
					if (visibleRows[i].className.indexOf("even") !== -1) {
						visibleRows[i].classList.remove("even");
					}
					visibleRows[i].classList.add("odd");
				} else {
					if (visibleRows[i].className.indexOf("odd") !== -1) {
						visibleRows[i].classList.remove("odd");
					}
					visibleRows[i].classList.add("even");
				}
			}
		}
	}]);

	return DataTable;
}();

exports.default = DataTable;

var FilterService = function () {
	function FilterService(dataTable) {
		_classCallCheck(this, FilterService);

		this._parent = dataTable;
		this._table = dataTable._table;
		this._tableBody = dataTable._tableBody;
		this._rows = dataTable._rows;
		this._filter = dataTable._filter;
		this._searchTerms = null;
	}

	_createClass(FilterService, [{
		key: "init",
		value: function init() {
			var self = this;

			if (self._filter !== null) {
				self._filter.addEventListener("input", function filter() {
					var query = self._filter.value.replace(/\s+$/, "");
					self._searchTerms = query.split(" ");
					self.filter();
				});
			}
		}
	}, {
		key: "filter",
		value: function filter() {
			[].forEach.call(this._rows, function filterRow(el) {
				if (this.rowMatches(el)) {
					el.classList.remove("hidden");
				} else {
					el.classList.add("hidden");
				}
			});
			this._parent.applyStyles();
		}
	}, {
		key: "rowMatches",
		value: function rowMatches(row) {
			var exposedElements = [];

			for (var i = 0; i < row.cells.length; i++) {
				if (row.cells[i].getAttribute("data-table") === "include") {
					exposedElements.push(row.cells[i]);
				}
			}
			if (this._searchTerms === "" || this._searchTerms[0] === "" || exposedElements.length < 1) {
				return true;
			}
			var haystack = "";
			exposedElements.forEach(function (exposedElement) {
				haystack = haystack + exposedElement.textContent.toLowerCase() + " ";
			});
			var result = true;
			this._searchTerms.forEach(function (searchTerm) {
				if (haystack.indexOf(searchTerm.toLowerCase()) === -1) {
					result = false;
				}
			});

			return result;
		}
	}]);

	return FilterService;
}();

var SortService = function () {
	function SortService(dataTable) {
		_classCallCheck(this, SortService);

		this._parent = dataTable;
		this._table = dataTable._table;
		this._tableBody = dataTable._tableBody;
		this._rows = dataTable._rows;
		this._sortableColumns = [];
		this._lastCellIndex = null;
		this._dataHandler = null;
	}

	_createClass(SortService, [{
		key: "init",
		value: function init() {
			var self = this;

			[].forEach.call(self._table.querySelectorAll("th.sortable"), function addColumn(columnHeading) {
				self._sortableColumns.push({
					trigger: columnHeading,
					index: columnHeading.cellIndex,
					dataType: columnHeading.getAttribute("data-type")
				});
			});
			self._sortableColumns.forEach(function (column) {
				column.trigger.addEventListener("click", self.sortByColumn.call(self, column));
			});
			self._parent.applyStyles();
		}
	}, {
		key: "sortByColumn",
		value: function sortByColumn(column) {
			var self = this;

			return function (e) {
				for (var i = 0; i < self._sortableColumns.length; i++) {
					var currentColumn = self._sortableColumns[i];
					if (currentColumn.index === column.index) {
						if (currentColumn.trigger.className.indexOf("asc") != -1) {
							currentColumn.trigger.classList.remove("asc");
							currentColumn.trigger.classList.add("desc");
						} else {
							currentColumn.trigger.classList.remove("desc");
							currentColumn.trigger.classList.add("asc");
						}
					} else {
						currentColumn.trigger.classList.remove("asc");
						currentColumn.trigger.classList.remove("desc");
					}
				}
				if (self._lastCellIndex === column.index) {
					self.reverseTable();
				} else {
					self._dataHandler = self.getDataHandler(column.index, column.dataType);
					self.quickSort(0, self._rows.length);
					self.reverseTable();
				}
				self._lastCellIndex = column.index;
				self._parent.applyStyles();
			};
		}
	}, {
		key: "reverseTable",
		value: function reverseTable() {
			for (var i = 1; i < this._rows.length; i++) {
				this._tableBody.insertBefore(this._rows[i], this._rows[0]);
			}
		}
	}, {
		key: "applyStyles",
		value: function applyStyles() {
			var visibleRows = this._tableBody.querySelectorAll("tr:not(.hidden)");
			for (var i = 0; i < visibleRows.length; i++) {
				if (i % 2 === 0) {
					if (visibleRows[i].className.indexOf("even") !== -1) {
						visibleRows[i].classList.remove("even");
					}
					visibleRows[i].classList.add("odd");
				} else {
					if (visibleRows[i].className.indexOf("odd") !== -1) {
						visibleRows[i].classList.remove("odd");
					}
					visibleRows[i].classList.add("even");
				}
			}
		}
	}, {
		key: "quickSort",
		value: function quickSort(low, high) {
			var getValue = self._dataHandler;
			if (high <= low + 1) {
				return;
			}
			if (high - low === 2) {
				if (getValue(high - 1) > getValue(low)) {
					this.exchange(high - 1, low);
				}
				return;
			}
			var i = low + 1;
			var j = high - 1;
			if (getValue(low) > getValue(i)) {
				this.exchange(i, low);
			}
			if (getValue(j) > getValue(low)) {
				this.exchange(low, j);
			}
			if (getValue(low) > getValue(i)) {
				this.exchange(i, low);
			}
			var pivot = getValue(low);
			while (true) {
				j--;
				while (pivot > getValue(j)) {
					j--;
				}
				i++;
				while (getValue(i) > pivot) {
					i++;
				}
				if (j <= i) {
					break;
				}
				this.exchange(i, j);
			}
			this.exchange(low, j);
			if (j - low < high - j) {
				this.quickSort(low, j);
				this.quickSort(j + 1, high);
			} else {
				this.quickSort(j + 1, high);
				this.quickSort(low, j);
			}
		}
	}, {
		key: "exchange",
		value: function exchange(rowA, rowB) {
			var tempNode = null;
			if (rowA === rowB + 1) {
				this._tableBody.insertBefore(this._rows[rowA], this._rows[rowB]);
			} else if (rowB === rowA + 1) {
				this._tableBody.insertBefore(this._rows[rowB], this._rows[rowA]);
			} else {
				tempNode = this._tableBody.replaceChild(this._rows[rowA], this._rows[rowB]);
				if (!this._rows[rowA]) {
					this._tableBody.appendChild(tempNode);
				} else {
					this._tableBody.insertBefore(tempNode, this._rows[rowA]);
				}
			}
		}
	}, {
		key: "getDataHandler",
		value: function getDataHandler(columnIndex, dataType) {
			switch (dataType) {
				case "numeric":
					return function parseNumericValue(rowIndex) {
						var cell = this._rows[rowIndex].cells[columnIndex];
						if (cell.textContent) {
							return parseFloat(/\d+/.exec(cell.textContent));
						}
						return 0;
					};
				case "datetime":
					return function parseDateValue(rowIndex) {
						var cell = this._rows[rowIndex].cells[columnIndex];
						if (cell.textContent) {
							return this.parseDate(cell.textContent);
						}
						return "";
					};
				case "size":
					return function parseSizeValue(rowIndex) {
						var cell = this._rows[rowIndex].cells[columnIndex];
						if (cell.textContent) {
							return this.parseSize(cell.textContent);
						}
						return "";
					};
				case "boolean":
					return function parseBooleanValue(rowIndex) {
						var cell = this._rows[rowIndex].cells[columnIndex];
						return cell.getAttribute("data-value") === "0";
					};
				default:
					return function parseTextValue(rowIndex) {
						var cell = this._rows[rowIndex].cells[columnIndex];
						if (cell.textContent) {
							return cell.textContent.toLowerCase();
						}
						return "";
					};
			}
		}
	}], [{
		key: "parseDate",
		value: function parseDate(date) {
			var parts = date.match(/(\d+)/g);
			if (parts === null) {
				return 0;
			} else if (parts.length === 3) {
				return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
			} else {
				return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]).getTime();
			}
		}
	}, {
		key: "parseSize",
		value: function parseSize(size) {
			var result = 0;
			var value = /^\d{1,4}(?:\.\d{1,2})?/.exec(size);
			var type = /[BKMGT]+/.exec(size);
			switch (type) {
				case "GB":
					result = parseFloat(value) * Math.pow(1024, 3);
					break;
				case "MB":
					result = parseFloat(value) * Math.pow(1024, 2);
					break;
				case "KB":
					result = parseFloat(value) * 1024;
					break;
				default:
					result = parseFloat(value);
			}

			return result;
		}
	}]);

	return SortService;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parallax = function () {
	function Parallax() {
		_classCallCheck(this, Parallax);
	}

	_createClass(Parallax, [{
		key: "init",
		value: function init() {}
	}]);

	return Parallax;
}();

exports.default = Parallax;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SideNav = function () {
	function SideNav() {
		_classCallCheck(this, SideNav);
	}

	_createClass(SideNav, [{
		key: "init",
		value: function init() {}
	}]);

	return SideNav;
}();

exports.default = SideNav;

},{}]},{},[1]);

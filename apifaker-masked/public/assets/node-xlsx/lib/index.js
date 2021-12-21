"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.build = exports.parseMetadata = exports.parse = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _xlsx = _interopRequireDefault(require("xlsx-style"));

var _bufferFrom = _interopRequireDefault(require("buffer-from"));

var _helpers = require("./helpers");

var _workbook = _interopRequireDefault(require("./workbook"));

var parse = function parse(mixed, options) {
  if (options === void 0) {
    options = {};
  }

  var workSheet = _xlsx.default[(0, _helpers.isString)(mixed) ? 'readFile' : 'read'](mixed, options);

  return Object.keys(workSheet.Sheets).map(function (name) {
    var sheet = workSheet.Sheets[name];
    return {
      name,
      data: _xlsx.default.utils.sheet_to_json(sheet, {
        header: 1,
        raw: options.raw !== false,
        range: options.range ? options.range[name] : null
      })
    };
  });
};

exports.parse = parse;

var parseMetadata = function parseMetadata(mixed, options) {
  if (options === void 0) {
    options = {};
  }

  var workSheet = _xlsx.default[(0, _helpers.isString)(mixed) ? 'readFile' : 'read'](mixed, options);

  return Object.keys(workSheet.Sheets).map(function (name) {
    var sheet = workSheet.Sheets[name];
    return {
      name,
      data: sheet["!ref"] ? _xlsx.default.utils.decode_range(sheet["!ref"]) : null
    };
  });
};

exports.parseMetadata = parseMetadata;

var build = function build(worksheets, options) {
  if (options === void 0) {
    options = {};
  }

  var defaults = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };
  var workBook = new _workbook.default();
  worksheets.forEach(function (worksheet) {
    var sheetName = worksheet.name || 'Sheet';
    var sheetOptions = worksheet.options || {};
    var sheetData = (0, _helpers.buildSheetFromMatrix)(worksheet.data || [], (0, _extends2.default)({}, options, sheetOptions));
    workBook.SheetNames.push(sheetName);
    workBook.Sheets[sheetName] = sheetData;
  });

  var excelData = _xlsx.default.write(workBook, (0, _extends2.default)({}, defaults, options));

  return excelData instanceof Buffer ? excelData : (0, _bufferFrom.default)(excelData, 'binary');
};

exports.build = build;
var _default = {
  parse,
  parseMetadata,
  build
};
exports.default = _default;
//# sourceMappingURL=index.js.map
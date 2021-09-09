"use strict";
var reverse = function (arr) { return arr.reverse(); };
var first = function (arr) { return arr[0]; };
var toUpper = function (s) { return s.toUpperCase(); };
var compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (value) {
        return args.reverse().reduce(function (pre, cur) {
            return cur(pre);
        }, value);
    };
};
var lastUpper = compose(compose(toUpper, first), reverse);
console.log(lastUpper(["first", "second", "three"]));
//# sourceMappingURL=05-compose.js.map
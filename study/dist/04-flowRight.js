(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var reverse = function (arr) { return arr.reverse(); };
    var first = function (arr) { return arr[0]; };
    var toUpper = function (s) { return s.toUpperCase(); };
    var flowRight = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var flowRightFn = function (value) {
            len--;
            if (len > -1) {
                return flowRightFn(args[len](value));
            }
            return value;
        };
        return flowRightFn;
    };
    var lastUpper = flowRight(toUpper, first, reverse);
    console.log(lastUpper(["first", "second", "three"]));
});
//# sourceMappingURL=04-flowRight.js.map
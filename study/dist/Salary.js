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
    var makeSalary = function (base) {
        return function (plus) {
            console.log("\u672C\u6708\u5DE5\u8D44" + (plus + base) + ".00\u5143");
        };
    };
    var e = undefined;
    var h = Symbol();
});
//# sourceMappingURL=Salary.js.map
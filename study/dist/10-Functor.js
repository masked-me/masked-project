"use strict";
var Container = /** @class */ (function () {
    function Container(value) {
        this._value = value;
    }
    Container.of = function (value) {
        return new Container(value);
    };
    Container.prototype.map = function (fn) {
        return Container.of(fn(this._value));
    };
    return Container;
}());
var r = Container.of(5).map(function (x) { return x + 2; });
console.log(r);
//# sourceMappingURL=10-Functor.js.map
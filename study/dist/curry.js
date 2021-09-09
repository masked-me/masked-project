"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var base = /** @class */ (function () {
    function base(name) {
        this.name = name + 3;
    }
    base.prototype.eat = function (name) {
        console.log(name + 1);
    };
    base.prototype.run = function (name) {
        console.log(name);
    };
    return base;
}());
var bismatePost = /** @class */ (function (_super) {
    __extends(bismatePost, _super);
    function bismatePost(post, bis, base, name) {
        var _this = _super.call(this, name) || this;
        _this.post = post;
        _this.base = base;
        _this.bis = bis;
        return _this;
    }
    bismatePost.prototype.eat = function () {
        console.log(this.name + 2);
    };
    bismatePost.prototype.run = function () { };
    return bismatePost;
}(base));
var bismate = new bismatePost({ s: "s" }, "2", 3, 4);
bismate.eat();
//# sourceMappingURL=curry.js.map
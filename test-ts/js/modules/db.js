"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDb = void 0;
var MysqlDb = /** @class */ (function () {
    function MysqlDb() {
    }
    MysqlDb.prototype.add = function (info) {
        console.log(info);
        return true;
    };
    MysqlDb.prototype.updata = function (info, id) {
        console.log(info);
        console.log(id);
        return true;
    };
    return MysqlDb;
}());
exports.MysqlDb = MysqlDb;

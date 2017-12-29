"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsw_logger_1 = require("jsw-logger");
var Promise = require("promise");
var BaseModel = /** @class */ (function () {
    function BaseModel(options) {
        if (options === void 0) { options = {}; }
        //this.logger = JSWLogger.getInstance(options.log || {});
        this.logger = jsw_logger_1.JSWLogger.instance;
    }
    BaseModel.prototype.fillModel = function (doc) {
        // Do nothing
    };
    BaseModel.prototype.insert = function () {
        return Promise.resolve({ docs: [], indexes: {} });
    };
    BaseModel.prototype.update = function (selector, modifier) {
        return Promise.resolve({ docs: [], indexes: {} });
    };
    BaseModel.prototype.find = function () {
        return Promise.resolve({ docs: [], indexes: {} });
    };
    return BaseModel;
}());
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map
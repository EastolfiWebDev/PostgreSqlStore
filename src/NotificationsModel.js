"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Promise = require("promise");
var BaseModel_1 = require("./BaseModel");
var NotificationsModel = /** @class */ (function (_super) {
    __extends(NotificationsModel, _super);
    function NotificationsModel(client, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.INSERT_QUERY = " INSERT INTO " + NotificationsModel.COLLECTION_NAME + " (_id, type, active, message, timestamp) VALUES (?, ?, ?, ?, ?); ";
        _this.UPDATE_QUERY = " UPDATE " + NotificationsModel.COLLECTION_NAME + " SET %_UPDATE_% WHERE 1=1 %_SELECTOR_%; ";
        _this.client = client;
        return _this;
    }
    NotificationsModel.prototype.fillModel = function (doc) {
        this._id = doc._id || null;
        this.type = doc.type || "warning";
        this.active = doc.active ? "Y" : "N";
        this.message = doc.message || null;
        this.timestamp = "" + doc.timestamp || null;
    };
    NotificationsModel.prototype._toMongoDoc = function (doc) {
        var parsed = _.cloneDeep(doc);
        if (parsed != null) {
            // The timestamp is a number in MongoPortable
            parsed.timestamp = +parsed.timestamp;
            // Active is a boolean in MongoPortable
            parsed.active = parsed.active === "Y" ? true : false;
        }
        return parsed;
    };
    NotificationsModel.prototype._toPostgreDoc = function (doc) {
        var parsed = _.cloneDeep(doc);
        if (parsed != null) {
            // The timestamp is a number in MongoPortable
            parsed.timestamp = "" + parsed.timestamp || null;
            // Active is a boolean in MongoPortable
            parsed.active = parsed.active ? "Y" : "N";
        }
        return parsed;
    };
    NotificationsModel.prototype.insert = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.query(_this.INSERT_QUERY, [_this._id, _this.type, _this.active, _this.message, _this.timestamp])
                .then(function (data) {
                var docs = [];
                var indexes = {};
                for (var i in data) {
                    var doc = _this._toMongoDoc(data[i]);
                    if (doc != null) {
                        docs.push(doc);
                        indexes[doc._id] = i;
                    }
                }
                resolve({ docs: docs, indexes: indexes });
            }).catch(function (error) {
                reject(new Error(error));
            });
        });
    };
    NotificationsModel.prototype.update = function (selector, modifier) {
        return new Promise(function (resolve, reject) {
            var updateDoc = this._toPostgreDoc(modifier);
            var selectorDoc = this._toPostgreDoc(selector);
            var queryUpdate = [];
            var querySelector = [];
            var updateValues = [];
            var selectorValues = [];
            try {
                for (var _a = __values(Object.keys(updateDoc)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    queryUpdate.push(key + " = ?");
                    updateValues.push(updateDoc[key]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _d = __values(Object.keys(selectorDoc)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    querySelector.push(key + " = ?");
                    selectorValues.push(selectorDoc[key]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var query = this.UPDATE_QUERY
                .replace("%_UPDATE_%", queryUpdate.join(","))
                .replace("%_SELECTOR_%", querySelector.join(","));
            this.client.query(query, __spread(updateValues, selectorValues))
                .then(function (data) {
                var docs = [];
                var indexes = {};
                for (var i in data) {
                    var doc = this._toMongoDoc(data[i]);
                    if (doc != null) {
                        docs.push(doc);
                        indexes[doc._id] = i;
                    }
                }
                resolve({ docs: docs, indexes: indexes });
            })
                .catch(function (error) {
                reject(new Error(error));
            });
            var e_1, _c, e_2, _f;
        });
    };
    NotificationsModel.prototype.find = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.db.any("SELECT * FROM " + NotificationsModel.COLLECTION_NAME)
                .then(function (data) {
                var docs = [];
                var indexes = {};
                for (var i = 0; i < data.length; i++) {
                    var doc = this._toMongoDoc(data[i]);
                    if (doc != null) {
                        docs.push(doc);
                        indexes[doc._id] = i;
                    }
                }
                resolve({ docs: docs, indexes: indexes });
            })
                .catch(function (error) {
                reject(new Error(error));
            });
        });
    };
    NotificationsModel.COLLECTION_NAME = "notifications";
    return NotificationsModel;
}(BaseModel_1.BaseModel));
exports.NotificationsModel = NotificationsModel;
//# sourceMappingURL=NotificationsModel.js.map
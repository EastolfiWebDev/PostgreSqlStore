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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var PgPromise = require("pg-promise");
var Promise = require("promise");
var jsw_logger_1 = require("jsw-logger");
var mongo_portable_1 = require("mongo-portable");
var ModelFactory_1 = require("./ModelFactory");
var PostgreSqlStore = /** @class */ (function (_super) {
    __extends(PostgreSqlStore, _super);
    function PostgreSqlStore(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = _.assign({}, {}, options);
        _this.logger = jsw_logger_1.JSWLogger.getInstance(_this.options.log || {});
        if (_.isNil(_this.options.connection)) {
            _this.logger.throw("Missing connection options");
        }
        else {
            var connectionString = _this._buildConnectionString(_this.options.connection);
            if (_.isNil(connectionString)) {
                _this.logger.throw("Invalid connection string");
            }
            else {
                _this.client = PgPromise()(connectionString);
                ModelFactory_1.ModelFactory.setClient(_this.client);
            }
        }
        return _this;
    }
    PostgreSqlStore.prototype._buildConnectionString = function (params) {
        if (_.isString(params)) {
            return params;
        }
        else {
            if (_.isNumber(params) || _.isArray(params) || _.isFunction(params) || _.isBoolean(params)) {
                this.logger.throw("Invalid connection params");
                return null;
            }
            var host = params.host, database = params.database, port = params.port, user = params.user, password = params.password;
            if (_.isNil(host)) {
                this.logger.throw("'host' param required");
                return null;
            }
            if (_.isNil(database)) {
                this.logger.throw("'database' param required");
                return null;
            }
            if (_.isNil(port)) {
                this.logger.throw("'port' param required");
                return null;
            }
            if (_.isNil(user)) {
                this.logger.throw("'user' param required");
                return null;
            }
            if (_.isNil(password)) {
                this.logger.throw("'password' param required");
                return null;
            }
            return user + ":" + password + "@" + host + ":" + port + "/" + database;
        }
    };
    PostgreSqlStore.prototype._handleError = function (error, reject) {
        this.logger.throw(error);
        if (reject)
            reject(error);
    };
    PostgreSqlStore.prototype.insert = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var model = ModelFactory_1.ModelFactory.createModel(event.collection.name, event.doc);
            model.insert().then(function (result) {
                var docs = result.docs, indexes = result.indexes;
                event.collection.docs = __spread(event.collection.docs, docs);
                event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
                resolve();
            }).catch(function (error) {
                _this._handleError(new Error(error), reject);
            });
        });
    };
    PostgreSqlStore.prototype.update = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var model = ModelFactory_1.ModelFactory.createModel(event.collection.name, event.doc);
            model.update(event.modifier, event.selector).then(function (result) {
                var docs = result.docs, indexes = result.indexes;
                try {
                    for (var _a = __values(Object.keys(indexes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var key = _b.value;
                        // key == _id
                        var updatedDoc = docs[indexes[key]];
                        var index = event.collection.doc_indexes[key];
                        event.collection.docs[index] = updatedDoc;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // event.collection.docs = [...event.collection.docs, ...docs];
                // event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
                resolve();
                var e_1, _c;
            }).catch(function (error) {
                _this._handleError(new Error(error), reject);
            });
        });
    };
    PostgreSqlStore.prototype.find = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var model = ModelFactory_1.ModelFactory.createModel(event.collection.name, event.doc);
            model.find().then(function (result) {
                var docs = result.docs, indexes = result.indexes;
                // event.collection.docs = [...event.collection.docs, ...docs];
                event.collection.docs = docs;
                // event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
                event.collection.doc_indexes = indexes;
                resolve();
            }).catch(function (error) {
                _this._handleError(new Error(error), reject);
            });
        });
    };
    PostgreSqlStore.prototype.findOne = function (event) {
        return this.find(event);
    };
    return PostgreSqlStore;
}(mongo_portable_1.BaseStore));
exports.PostgreSqlStore = PostgreSqlStore;
//# sourceMappingURL=PostgreSqlStore.js.map
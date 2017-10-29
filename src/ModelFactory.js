"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationsModel_1 = require("./NotificationsModel");
var client = null;
var ModelFactory = /** @class */ (function () {
    function ModelFactory() {
    }
    ModelFactory.setClient = function (pClient) {
        client = pClient;
    };
    ModelFactory.createModel = function (collectionName, doc, options) {
        if (options === void 0) { options = {}; }
        var model = null;
        if (collectionName === NotificationsModel_1.NotificationsModel.COLLECTION_NAME) {
            model = new NotificationsModel_1.NotificationsModel(client, options);
        }
        model.fillModel(doc);
        return model;
    };
    return ModelFactory;
}());
exports.ModelFactory = ModelFactory;
//# sourceMappingURL=ModelFactory.js.map
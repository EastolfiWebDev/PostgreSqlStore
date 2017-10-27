import { IBaseModel } from "./IBaseModel";
import { NotificationsModel } from "./NotificationsModel";

let client = null;

export class ModelFactory {
	constructor() {}
	
	static setClient(pClient) {
	    client = pClient;
	}
	
	static createModel(collectionName, doc: any, options = {}) {
		let model: IBaseModel = null;
		
		if (collectionName === NotificationsModel.COLLECTION_NAME) {
			model = new NotificationsModel(client, options);
		}
		
		model.fillModel(doc);
		
		return model;
	}
}
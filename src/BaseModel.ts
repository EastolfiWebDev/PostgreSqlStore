import { JSWLogger } from "jsw-logger";
import * as Promise from "promise";

import { IBaseModel } from "./IBaseModel";

export type Result = {
    docs: Array<any>;
    indexes: any;
}

export class BaseModel implements IBaseModel {
	logger: JSWLogger;
	
	constructor(options: any = {}) {
		//this.logger = JSWLogger.getInstance(options.log || {});
		this.logger = JSWLogger.instance;
	}
	
	fillModel(doc: any): void {
		// Do nothing
	}
	
	insert(): Promise<Result> {
	    return Promise.resolve({ docs: [], indexes: {} });
	}
	
	update(selector, modifier): Promise<Result> {
	    return Promise.resolve({ docs: [], indexes: {} });
	}
	
	find(): Promise<Result> {
	    return Promise.resolve({ docs: [], indexes: {} });
	}
}
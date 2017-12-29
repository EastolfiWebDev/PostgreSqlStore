import * as _ from "lodash";
import * as Promise from "promise";

import { BaseModel, Result } from "./BaseModel";

export class NotificationsModel extends BaseModel {
	static COLLECTION_NAME = "notifications";
	private INSERT_QUERY = ` INSERT INTO ${NotificationsModel.COLLECTION_NAME} (_id, type, active, message, timestamp) VALUES (?, ?, ?, ?, ?); `
	private UPDATE_QUERY = ` UPDATE ${NotificationsModel.COLLECTION_NAME} SET %_UPDATE_% WHERE 1=1 %_SELECTOR_%; `
	
	client: any;
	
	_id: string;
	type: string;
	active: string;	// Is a VARCHAR2(2 CHAR) in PostgreSQL
	message: string;
	timestamp: string;
	
	constructor(client: any, options: any = {}) {
		super(options);
		
		this.client = client;
	}
	
	fillModel(doc: any): void {
		if (doc) {
			this._id = doc._id || null;
			this.type = doc.type || "warning";
			this.active = doc.active ? "Y" : "N";
			this.message = doc.message || null;
			this.timestamp = `${doc.timestamp}` || null;
		}
	}
	
	private _toMongoDoc(doc: any) {
	    let parsed = _.cloneDeep(doc);
	    
	    if (parsed != null) {
			// The timestamp is a number in MongoPortable
			parsed.timestamp = +parsed.timestamp;
			// Active is a boolean in MongoPortable
			parsed.active = parsed.active === "Y" ? true : false;
		}
		
		return parsed;
	}
	
	private _toPostgreDoc(doc: any) {
	    let parsed = _.cloneDeep(doc);
	    
	    if (parsed != null) {
			// The timestamp is a number in MongoPortable
			parsed.timestamp = `${parsed.timestamp}` || null;
			// Active is a boolean in MongoPortable
			parsed.active = parsed.active ? "Y" : "N";
		}
		
		return parsed;
	}
	
	insert(): Promise<Result> {
		return new Promise((resolve, reject) => {
			this.client.query(this.INSERT_QUERY, [this._id, this.type, this.active, this.message, this.timestamp])
			.then(data => {
				let docs = [];
				let indexes = {};
				
				for (let i in data) {
					let doc = this._toMongoDoc(data[i]);
					
					if (doc != null) {
						docs.push(doc);
						indexes[doc._id] = i;
					}
				}
				
				resolve({ docs, indexes });
			}).catch(error => {
			    reject(new Error(error));
			});
		});
	}
	
	update(selector, modifier): Promise<Result> {
        return new Promise((resolve, reject) => {
            let updateDoc = this._toPostgreDoc(modifier);
            let selectorDoc = this._toPostgreDoc(selector);
    	    
    	    let queryUpdate = [];
    	    let querySelector = [];
    	    
    	    let updateValues = [];
    	    let selectorValues = [];
    	    
            for (let key of Object.keys(updateDoc)) {
                queryUpdate.push(`${key} = ?`);
                updateValues.push(updateDoc[key]);
            }
            
            for (let key of Object.keys(selectorDoc)) {
                querySelector.push(`${key} = ?`);
                selectorValues.push(selectorDoc[key]);
            }
            
            let query = this.UPDATE_QUERY
                .replace("%_UPDATE_%", queryUpdate.join(","))
                .replace("%_SELECTOR_%", querySelector.join(","));
            
            this.client.query(query, [...updateValues, ...selectorValues])
            .then(data => {
                let docs = [];
				let indexes = {};
				
				for (let i in data) {
					let doc = this._toMongoDoc(data[i]);
					
					if (doc != null) {
						docs.push(doc);
						indexes[doc._id] = i;
					}
				}
				
				resolve({ docs, indexes });
            })
            .catch(error => {
                reject(new Error(error));
            });
    	});
	}
	
	find(): Promise<Result> {
	    return new Promise((resolve, reject) => {
			this.client.any(`SELECT * FROM ${NotificationsModel.COLLECTION_NAME}`)
			.then(data => {
				let docs = [];
				let indexes = {};
				
				for (var i = 0; i < data.length; i++) {
					let doc = this._toMongoDoc(data[i]);
					
					if (doc != null) {
						docs.push(doc);
						indexes[doc._id] = i;
					}
				}
				
				resolve({ docs, indexes });
			})
			.catch(error => {
				reject(new Error(error));
			});
		});
	}
}
import * as _ from "lodash";
import * as PgPromise from "pg-promise";
import * as Promise from "promise";
import { JSWLogger } from "jsw-logger";
import { BaseStore } from "mongo-portable";

import { ModelFactory } from "./ModelFactory";
import { Result } from "./BaseModel";

export class PostgreSqlStore extends BaseStore {
	logger: JSWLogger;
	client: any;
	options: any;
	
	constructor(options: any = {}) {
	    super();
	    
	    this.options = _.assign({}, {}, options);
	    
		this.logger = JSWLogger.getInstance(this.options.log || {});
		
		if (_.isNil(this.options.connection)) {
			this.logger.throw("Missing connection options");
		} else {
			let connectionString = this._buildConnectionString(this.options.connection);
			
			if (_.isNil(connectionString)) {
				this.logger.throw("Invalid connection string");
			} else {
				this.client = PgPromise(/*options*/)(connectionString);
				
				ModelFactory.setClient(this.client);
			}
		}
	}
	
	private _buildConnectionString(params: any): string {
		if (_.isString(params)) {
			return <string>params;
		} else {
			if (_.isNumber(params) || _.isArray(params) || _.isFunction(params) || _.isBoolean(params)) {
				this.logger.throw("Invalid connection params");
				
				return null;
			}
			
			let { host, database, port, user, password } = params;
			
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
			
			return `${user}:${password}@${host}:${port}/${database}`;
		}
	}
	
	private _handleError(error: Error, reject?: Function) {
		this.logger.throw(error);
		
		if (reject) reject(error);
	}
	
	insert(event): boolean | Promise<boolean> {
		return new Promise((resolve, reject) => {
			let model = ModelFactory.createModel(event.collection.name, event.doc);
			
			model.insert().then((result: Result) => {
			    let { docs, indexes } = result;
			    
				event.collection.docs = [...event.collection.docs, ...docs];
				event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
				
				resolve(/*docs, indexes*/);
			}).catch(error => {
				this._handleError(new Error(error), reject);
			});
		});
	}
	
	update(event): boolean | Promise<boolean> {
	    return new Promise((resolve, reject) => {
			let model = ModelFactory.createModel(event.collection.name, event.doc);
			
			model.update(event.modifier, event.selector).then((result: Result)  => {
			    let { docs, indexes } = result;
			    
			    for (let key of Object.keys(indexes)) {
			        // key == _id
			        let updatedDoc = docs[indexes[key]];
			        let index = event.collection.doc_indexes[key];
			        
			        event.collection.docs[index] = updatedDoc;
			    }
				// event.collection.docs = [...event.collection.docs, ...docs];
				// event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
				
				resolve(/*docs, indexes*/);
			}).catch(error => {
				this._handleError(new Error(error), reject);
			});
		});
	}
	
	find(event): object | Promise<object> {
		return new Promise((resolve, reject) => {
			let model = ModelFactory.createModel(event.collection.name, event.doc);
			
			model.find().then((result: Result)  => {
			    let { docs, indexes } = result;
			    
                // event.collection.docs = [...event.collection.docs, ...docs];
			    event.collection.docs = docs;
				// event.collection.doc_indexes = Object.assign({}, event.collection.doc_indexes, indexes);
				event.collection.doc_indexes = indexes;
				
				resolve();
			}).catch(error => {
				this._handleError(new Error(error), reject);
			});
		});
	}
	
	findOne(event): object | Promise<object> {
	    return this.find(event);
	}
	
// 	remove(event) {
	
// 	}
}
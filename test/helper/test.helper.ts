// import "mocha";
import * as _ from "lodash";
import { expect } from "chai";
import { JSWLogger } from "jsw-logger";

let StoreLib = null;
let defOptions = {
    log: {
    	hideAllLogs: true
	}
};

export class TestHelper {
    static setupHelper(lib: any, options: any = {}) {
		StoreLib = lib;
		defOptions = _.assign({}, defOptions, options);
	}
	
	static assertThrown(fnc: Function, expected: boolean) {
		let thrown = false;
		
		try {
			fnc();
		} catch (error) {
			thrown = true;
		}
		
		expect(thrown).to.be.equal(expected);
	}
	
	static assertDependencies(deps: Array<any>) {
		for (let dep of deps) {
			expect(dep).to.exist;
		}
	}
	
	static initLogger(showLogs: boolean = false, throwExceptions: boolean = true) {
		JSWLogger.__dropInstance();
		JSWLogger.getInstance({ hideAllLogs: !showLogs, throwError: throwExceptions });
	}
	
	static createStore(options?) {
        return new StoreLib(options || defOptions);
    }
}
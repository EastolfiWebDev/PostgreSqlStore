import "mocha";
import { expect } from "chai";
import { MongoPortable } from "mongo-portable";

import { TestHelper } from "../helper/test.helper";
import { PostgreSqlStore } from "../../index";

TestHelper.initLogger();

var db = null;
describe("PostgreSqlStore", function() {
	before(function() {
		TestHelper.setupHelper(PostgreSqlStore);
	});
	
    // after(function() {
    //     TestHelper.clearDataDir();
    // });
    
    describe("#Constructor", function() {
        // before(function() {
        //     TestHelper.clearDataDir();
        // });
        
        it("should have the dependencies ready", function() {
            expect(MongoPortable).to.exist;
            expect(PostgreSqlStore).to.exist;
        });
        
        it("should not be able to instantiate a new store without connection options", function() {
            TestHelper.assertThrown(() => {
                new PostgreSqlStore();
            }, true);
            
            TestHelper.assertThrown(() => {
                new PostgreSqlStore({ connection: null });
            }, true);
        });
        
        it("should not be able to instantiate a new store with invalid connection options", function() {
            // Number is invalid
            TestHelper.assertThrown(() => {
                new PostgreSqlStore({ connection: 1 });
            }, true);
            
            // Boolean is invalid
            TestHelper.assertThrown(() => {
                new PostgreSqlStore({ connection: true });
            }, true);
            
            // Array is invalid
            TestHelper.assertThrown(() => {
                new PostgreSqlStore({ connection: [""] });
            }, true);
            
            // Function is invalid
            TestHelper.assertThrown(() => {
                new PostgreSqlStore({ connection: function () { return ""; } });
            }, true);
            
        });
        
        describe("Instantiating a new store", function() {
            it("should be able to instantiate with a connection string", function() {
                // Store with default values
                let store = TestHelper.createStore({ connection: "postgres://test_user:1234@postgre.test.com:5432/db_tests" });
                
                expect(store).to.exist;
                expect(store.options).to.exist;
            });
            
            it("should be able to instantiate with a connection object", function() {
                // Store with default values
                let store = TestHelper.createStore({
                    connection: {
                        host: "postgre.test.com",
                        database: "db_tests",
                        user: "test_user",
                        password: "1234",
                        port: "5432",
                    }
                });
                
                expect(store).to.exist;
                expect(store.options).to.exist;
            });
        });
    });
	
// 	describe("#Utils", function() {
// 		describe("- getCollectionPath", function() {
// 			it("should fail if no 'ddbb_name' is provided", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.getCollectionPath(null, "collection");
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
// 			it("should fail if no 'coll_name' is provided", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.getCollectionPath("database", null);
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
// 			it("should work", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
// 				let path = null;
				
// 				try {
// 					path = store.getCollectionPath("database", "collection");
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.false;
// 				expect(path).to.exist;
// 			});
// 		});
// 	});
    
    // describe("#Collections", function() {
    //     before(function() {
    //         db = TestHelper.init();
    //     });
        
    //     after(function() {
    //         db = TestHelper.clear(db);
    //     });
        
    //     it("should not have collections at first", function() {
    //         var collections = db.collections();
            
    //         expect(collections).to.exist;
            
    //         expect(collections).to.be.instanceof(Array);
    //         expect(collections).to.have.length(0);
    //     });
        
    //     describe("#Create", function() {
    //         it("should be able to create a collection", function() {
    //             var coll = db.collection(TestHelper.COLL_NAME);
            
    //             expect(coll).to.exist;
                
    //             expect(coll.name).to.be.equal(TestHelper.COLL_NAME);
    //             expect(coll.docs).to.be.instanceof(Array);
    //             expect(coll.docs).to.have.length(0);
                
    //             TestHelper.assertFile(TestHelper.buildCollectionPath(), true, true);
    //         });
    //     });
        
    //     describe.skip("#Update", function() {
    //         it("should have the dependencies ready", function() {
    //             expect(MongoPortable).to.exist;
    //         });
    //     });
        
    //     describe.skip("#Delete", function() {
    //         it("should have the dependencies ready", function() {
    //             expect(MongoPortable).to.exist;
    //         });
    //     });
    // });
    
    // describe("#Documents", function() {
    //     before(function() {
    //         db = TestHelper.init();
    //     });
        
    //     after(function() {
    //         db = TestHelper.clear(db);
    //     });
        
    //     describe("#Create", function() {
    //         it("should be able to create a document", function() {
    //             var coll = db.collection(TestHelper.COLL_NAME);
                
    //             coll.insert(TestHelper.createDocument());
                
    //             TestHelper.assertFile(TestHelper.buildCollectionPath(), true, false);
    //         });
    //     });
        
    //     describe("#Read", function() {
    //         before(function() {
    //             TestHelper.appendDocument();
    //         });
            
    //         it("should be able to read a document", function() {
    //             var coll = db.collection(TestHelper.COLL_NAME);
                
    //             var docs = coll.find({ name: "John" }).fetch();
                
    //             expect(docs).to.exist;
                
    //             expect(docs).to.be.instanceof(Array);
    //             expect(docs).to.have.length(2);
                
    //             var doc = coll.findOne({ lastname: "Wayne" });
                
    //             expect(doc).to.exist;
                
    //             expect(doc.name).to.be.equal("John");
    //         });
    //     });
        
    //     describe("#Update", function() {
    //         it("should be able to update a document", function() {
    //             var coll = db.collection(TestHelper.COLL_NAME);
                
    //             coll.update({
    //                 lastname: "Wayne"
    //             }, {
    //                 name: "Bruce"
    //             });
                
    //             // Disconnecting the DDBB to check persistance
    //             db = TestHelper.clear(db);
    //             db = TestHelper.init(false);
                
    //             coll = db.collection(TestHelper.COLL_NAME);
                
    //             var docs = coll.find({ name: "John" }).fetch();
                
    //             expect(docs).to.exist;
                
    //             expect(docs).to.be.instanceof(Array);
    //             expect(docs).to.have.length(1);
    //             expect(docs[0].lastname).to.be.equal("Abruzzi");
    //         });
    //     });
        
    //     describe("#Delete", function() {
    //         it("should be able to delete a document", function() {
    //             var coll = db.collection(TestHelper.COLL_NAME);
                
    //             coll.delete({
    //                 lastname: "Wayne"
    //             });
                
    //             // Disconnecting the DDBB to check persistance
    //             db = TestHelper.clear(db);
    //             db = TestHelper.init(false);
                
    //             coll = db.collection(TestHelper.COLL_NAME);
                
    //             var docs = coll.find().fetch();
                
    //             expect(docs).to.exist;
                
    //             expect(docs).to.be.instanceof(Array);
    //             expect(docs).to.have.length(1);
    //             expect(docs[0].name).to.be.equal("John");
    //             expect(docs[0].lastname).to.be.equal("Abruzzi");
    //         });
    //     });
    // });
	
// 	describe("#Backups", function() {
//         describe("- backup", function() {
//             it("should not be implemented", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.backup(null);
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
//         });
        
//         describe("- backups", function() {
//             it("should not be implemented", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.backups(null);
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
//         });
        
//         describe("- removeBackup", function() {
//             it("should not be implemented", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.removeBackup(null);
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
//         });
        
//         describe("- restore", function() {
//             it("should not be implemented", function() {
// 				let store = new PostgreSqlStore();
// 				let thrown = false;
				
// 				try {
// 					store.restore(null);
// 				} catch (error) {
// 					expect(error).to.exist;
// 					thrown = true;
// 				}
				
// 				expect(thrown).to.be.true;
// 			});
//         });
//     });
    
    // describe("#Others", function() {
    //     describe("- ensureIndex", function() {
    //         it("should not be implemented", function() {
    //             let store = new PostgreSqlStore();
				// let thrown = false;
				
				// try {
				// 	store.ensureIndex(null);
				// } catch (error) {
				// 	expect(error).to.exist;
				// 	thrown = true;
				// }
				
				// expect(thrown).to.be.true;
    //         });
    //     });
    // });
});
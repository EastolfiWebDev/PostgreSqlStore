export interface IBaseModel {
	fillModel(doc: any): void;
	
	insert(): Promise<object>;
	
	update(selector, modifier): Promise<object>;
	
	find(): Promise<object>;
}
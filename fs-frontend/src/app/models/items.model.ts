/* This file contains the models for the inventory module */
/* InventoryItemModel
	* @interface: InventoryItemModel
	* @remarks: A model for the inventory item
	* 			  partno: a string that represents the part number
	* 			  name: a string that represents the name
	* 			  description: a string that represents the description
	* 			  quantity: a number that represents the quantity
	* 			  price: a number that represents the price
	* 			  _id: a string that represents the id
*/
export interface InventoryItemModel{
	partno: string;
	name: string;
	description: string;
	quantity: number;
	price: number;
	_id?: string;
}
export const emptyItem: InventoryItemModel = {
    partno:'',
    name:'',
    description:'',
    quantity:0,
    price:0
}
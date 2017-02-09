define(['backbone','models/interfaceItem'],function(Backbone,InterfaceItem){
	'use strict';
	var InterfaceItems = Backbone.Collection.extend({
		model: InterfaceItem,
		/*save interface items in sequential order, this generates the next order number for new items*/
		currentOrder: function(){
			return this.length? this.last().get('order')+1 : 1;
		},
		//interface items are sorted by their original insertion order
		comparator:'order'
	});
	return new InterfaceItems();


});
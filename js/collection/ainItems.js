define(['backbone','models/ainItem'],function(Backbone,AinItem){
	'use strict';
	var AinItems = Backbone.Collection.extend({
		model:AinItem
	});      
	var items = [
                {number: 1},
                {number: 2},
                {number: 3},
                {number: 4},
                {number: 5},
                {number: 6}
        ];

var ainItems = new AinItems();
ainItems.reset(items);

return ainItems;


});
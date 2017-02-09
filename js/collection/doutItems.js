define(['backbone','models/doutItem'],function(Backbone,DoutItem){
	'use strict';
	var DoutItems = Backbone.Collection.extend({
		model:DoutItem
	});
	var items = [
                {number: 0},
                {number: 1},
                {number: 2},
                {number: 3},
                {number: 4},
                {number: 5},
                {number: 6},
                {number: 7},
                {number: 8},
                {number: 9},
                {number: 10},
                {number: 11},
                {number: 12},
                {number: 13},
                {number: 14},
                {number: 15},
                {number: 16},
                {number: 17},
                {number: 18},
                {number: 19},
                {number: 20},
                {number: 21},
                {number: 22},
                {number: 23},
                {number: 24},
                {number: 25},
                {number: 26},
                {number: 27},
                {number: 28},
                {number: 29},
                {number: 30},
                {number: 31}
        ];
    var doutItems = new DoutItems();
    doutItems.reset(items);
    return doutItems;  
});



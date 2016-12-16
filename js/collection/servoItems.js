define(['backbone','models/servoItem'],function(Backbone,ServoItem){
	'use strict';
	var ServoItems = Backbone.Collection.extend({
		model:ServoItem
	});      
	var items = [
                {channelNumber: 0},
                {channelNumber: 1},
                {channelNumber: 2},
                {channelNumber: 3}
        ];

var servoItems = new ServoItems();
servoItems.reset(items);

return servoItems;
});
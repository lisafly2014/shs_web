define(['backbone','models/pwmItem'],function(Backbone,PwmItem){
	'use strict';
	var PwmItems = Backbone.Collection.extend({
		model:PwmItem
	});      
	var items = [
                {channelNumber: 0},
                {channelNumber: 1},
                {channelNumber: 2},
                {channelNumber: 3}
        ];

var pwmItems = new PwmItems();
pwmItems.reset(items);

return pwmItems;
});
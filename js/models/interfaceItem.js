define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:{
			type:'interface',
			name:''
		}
	});

});
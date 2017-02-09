define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:function(){
			return{
				type:'DIN',
				number:'',
				enabled: undefined,
				defaultPullValue: 0,
				statusValue: 0
			}

		},
		setDefaultPullValue: function(newDefaultPullValue){
			this.set('defaultPullValue',newDefaultPullValue);
		},
		getDefaultPullValue: function(){
			return parseInt(this.get('defaultPullValue'));
		},
		setEnabledStatus: function(param){
			this.set('enabled',param);
		},
		getEnabledStatus: function(){
			return this.get('enabled');
		},
		setStatusValue: function(newStatusValue){
			this.set('statusValue', newStatusValue);

		},
		getStatusValue: function(){
			return this.get('statusValue');
		},
		getNumber: function(){
			return this.get('number');
		}
	});

});
define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:function(){
			return{
				type:'Dout',
				enabled: undefined,
				currentPinValue: 0,
				number:'',
				pullValue: 0,
				driveValue:0,
				defaultPinValue:0
			}

		},
		setDoutEnabledStatus: function(param){
			this.set('enabled', param);
		},
		getDoutEnabledStatus: function(){
			return Boolean(this.get('enabled'));
		},
		setCurrentPinValue: function(newPinValue){
			this.set('currentPinValue', newPinValue);

		},
		getCurrentPinValue: function(){
			return this.get('currentPinValue');
		},
		getNumber: function(){
			return this.get('number');
		},
		getPullValue:function(){
			return this.get('pullValue');
		},
		setPullValue:function(newPullValue){
			this.set('pullValue',newPullValue);
		},
		getDriveValue: function(){
			return this.get('driveValue');
		},
		setDriveValue: function(newDriveValue){
			this.set('driveValue',newDriveValue);
		},
		getDefaultPinValue:function(){
			return this.get('defaultPinValue');
		},
		setDefaultPinValue:function(newDefaultPinValue){
			this.set('defaultPinValue',newDefaultPinValue);
		}

	});

});
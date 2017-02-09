define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:function(){
			return{
				type:'Servo',
				channelNumber: 0,
				enabled: false,
				servoIndex:0,
				driveValue: 0,
				defaultPercentage: 0,
				currentPercentage: 0
			}

		},
		setChannelNumber: function(newChannelNumber){
			 this.set('channelNumber',newChannelNumber);

		},
		getChannelNumber: function(){
			return this.get('channelNumber');
		},

		setEnabledStatus: function(param){
			this.set('enabled',param);
		},
		getEnabledStatus: function(){
			return this.get('enabled');
		},
		setServoIndex:function(newServoIndex){
			this.set('servoIndex',newServoIndex);
		},
		getServoIndex: function(){
			return this.get('servoIndex');
		},
		setDriveValue: function(newDriveValue){
			this.set('driveValue',newDriveValue);
		},
		getDriveValue: function(){
			return this.get('driveValue');
		},
		setDefaultPercentage: function(newDefaultPercentage){
			this.set('defaultPercentage',newDefaultPercentage);
		},
		getDefaultPercentage: function(){
			return this.get('defaultPercentage');
		},
		setCurrentPercentage: function(newPercentage){
			this.set('currentPercentage',newPercentage);
		},
		getCurrentPercentage: function(){
			return this.get('currentPercentage');
		}
	});

});
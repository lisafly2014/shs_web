define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:function(){
			return{
				type:'PWM',
				pwmIndex:0,
				enabled: false,
				channelNumber:0,
				driveValue: 0,
				defaultDutyCycle: 0,
				currentDutyCycle: 0
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

		getPwmIndex: function(){
			return this.get('pwmIndex');
		},
		setPwmIndex:function(newPwmIndex){
			this.set('pwmIndex',newPwmIndex);

		},
		setDriveValue: function(newDriveValue){
			this.set('driveValue',newDriveValue);
		},
		getDriveValue: function(){
			return this.get('driveValue');
		},
		setDefaultDutyCycle: function(newDefaultDutyCycle){
			this.set('defaultDutyCycle',newDefaultDutyCycle);
		},
		getDefaultDutyCycle: function(){
			return this.get('defaultDutyCycle');

		},
		setCurrentDutyCycle: function(newDutyCycle){
			this.set('currentDutyCycle',newDutyCycle);
		},
		getCurrentDutyCycle: function(){
			return this.get('currentDutyCycle');
		}

	});

});
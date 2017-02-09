define(['backbone'],function(Backbone){
	'use strict';
	return Backbone.Model.extend({
		defaults:function(){
			return{
				type:'AIN',
				number:'',
				enabled: undefined,
				rangeValue:0,
				rateValue:0,
				statusValue: 0
			}

		},
		setRangeValue: function(newRangeValue){
			this.set('rangeValue',newRangeValue);
		},
		getRangeValue: function(){
			return this.get('rangeValue');
		},
		setRateValue: function(newRateValue){
			this.set('rateValue',newRateValue);
		},
		getRateValue: function(){
			return this.get('rateValue');

		},
		setEnabledStatus: function(param){
			this.set('enabled',param);
		},
		getEnabledStatus: function(){
			return Boolean(this.get('enabled'));
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
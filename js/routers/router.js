define([
	'backbone',
	'views/shsView',
	'views/interfaceView',
	'views/dinView',
	'views/dinSettingView',
	'views/doutView',
	'views/doutSettingView',
	'views/ainView',
	'views/ainSettingView',
	'views/pwmView',
	'views/pwmSettingView',
	'views/servoView',
	'views/servoSettingView'
	],
	function(
		Backbone,
		ShsView,
		InterfaceView,
		DinView,
		DinSettingView,
		DoutView,
		DoutSettingView,
		AinView,
		AinSettingView,
		PwmView,
		PwmSettingView,
		ServoView,
		ServoSettingView
		){
	'use strict';

	var Router = Backbone.Router.extend({
		routes:{
			"":'appInit',
			'app':'goShsView',
			'interface':'goInterfaceView',
			"din":"goDinView",
			"dinSetting":"goDinSettingView",
			"dout":"goDoutView",
			"doutSetting":"goDoutSettingView",
			"ain":"goAinView",
			"ainSetting":"goAinSettingView",
			"pwm":"goPwmView",
			"pwmSetting":"goPwmSettingView",
			"servo":"goServoView",
			"servoSetting":"goServoSettingView"
		},
		initialize: function(){
			this.$el=$('body');	
		},

		execute: function(callback,args,name){//clean up views when pages change
			this.view && this.view.remove();
			callback.apply(this);
		},
		appInit: function(){
			console.log("Prepare for entering shs app");
		},
		goShsView: function(){
			this.view = new ShsView();
			this.$el.html(this.view.$el);

		}, 

		goInterfaceView: function(){
			this.view = new InterfaceView();
			this.$el.html(this.view.$el);
		},
		goDinView:function(){
			this.view =new DinView();
			this.$el.html(this.view.$el);
		},

		goDinSettingView:function(){
			this.view = new DinSettingView();
			this.$el.html(this.view.$el);
		},

		goDoutView: function(){
			this.view = new DoutView();
			this.$el.html(this.view.$el);
		},

		goDoutSettingView:function(){
			this.view =new DoutSettingView();
			this.$el.html(this.view.$el);
		},

		goAinView: function(){
			this.view = new AinView();
			this.$el.html(this.view.$el);
		},

		goAinSettingView: function(){
			this.view = new AinSettingView();
			this.$el.html(this.view.$el);
		},

		goPwmView: function(){
			this.view = new PwmView();
			this.$el.html(this.view.$el);
		},

		goPwmSettingView: function(){
			this.view = new PwmSettingView();
			this.$el.html(this.view.$el);
		},

		goServoView: function(){
			this.view = new ServoView();
			this.$el.html(this.view.$el);
		},

		goServoSettingView: function(){
			this.view = new ServoSettingView();
			this.$el.html(this.view.$el);
		}
	});
	return Router;

});
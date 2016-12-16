define(['backbone','models/bleServer','routers/router'],function(Backbone,Server,Router){
	'use strict';
	localStorage.setItem('isDinInitial',true);
	localStorage.setItem('activeDinPin',0);
	localStorage.setItem('isDoutInitial',true);
	localStorage.setItem('activeDoutPin',0);
	localStorage.setItem('isAinInitial',true);
	localStorage.setItem('activeAinPin',0);
	localStorage.setItem('isPwmInitial',true);
	localStorage.setItem('activePwmChannel',0);
	localStorage.setItem('isServoInitial',true);
	localStorage.setItem('activeServoChannel',0);
	localStorage.setItem('deviceLocked',true);
	window.ble = Server;
	var app =window.app= new Router();

	Backbone.history.start();

});


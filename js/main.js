require.config({
	baseUrl:'js/lib',
	paths:{
		main:'..',
		views:'../views',
		models:'../models',
		collection: '../collection',
		routers:"../routers"
	}
});

require(['main/app']);
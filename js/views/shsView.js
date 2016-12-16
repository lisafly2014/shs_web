define(['backbone'],function(Backbone){
	var ShsView = Backbone.View.extend({

		initialize: function() {
			this.model = window.ble;
			this.listenTo(this.model,'change:isConnected change:gotConfiguration',this.render);
			this.render();

		},
		template: _.template($('#shs_main').html(),''),

		events:{
			"click #find_hardware": "onClickFindHardware",
			"click #show_interface":"showInterfaceView",
			"click #disconnect_hardware": "onClickDisconnect",
		},

		onClickFindHardware: function(){
			this.model.connectHardware();
		},
		showInterfaceView: function(){
			url ="interface";
			window.app.navigate(url,{
				trigger:true,
				replace:false
			});

		},
		onClickDisconnect: function(){
			this.model.disconnectHardware();
		},
		render: function () {
			this.$el.html(this.template(),this.model.getDeviceName());
			return this;
			
		}

	});

return ShsView;
	
});
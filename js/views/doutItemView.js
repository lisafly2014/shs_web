define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#dout_item').html()),
		
		initialize: function(){
			this.listenTo(this.model,'change:enabled change:currentPinValue',this.render);
			this.render();
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		events:{
			"click img": "doutPinclicked"
		},
		doutPinclicked: function(){
			let number= this.model.get("number");
			if(this.model.getDoutEnabledStatus() === true){
				if(this.model.getCurrentPinValue() === 1){
					this.model.setCurrentPinValue(0);
					window.ble.updateOutputPinStatus(number);

				}else{
					this.model.setCurrentPinValue(1);
					window.ble.updateOutputPinStatus(number);
				}
			}
			console.log(''+ number);

		}
	});
});
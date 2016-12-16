define(['backbone'],function(Backbone){
   return Backbone.View.extend({
		tagName: 'option',
		template: _.template($('#doutSetting_pin_item').html()),
		
		initialize: function(){
			this.render();
		},
		
		events:{
			"doutSetting_pin_changed": "doutSettingPinchangedHandler"
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.getNumber());

			return this;
		},
		doutSettingPinchangedHandler:function(){
			console.log('doutSettingPinchangedHandler');
			this.model.trigger('selected',this.model);
			this.render();
		}


	});
});
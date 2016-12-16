define(['backbone'],function(Backbone){
   return Backbone.View.extend({
		tagName: 'option',
		template: _.template($('#ainSetting_pin_item').html()),
		
		initialize: function(){
			this.render();
		},
		
		events:{
			"ainSetting_pin_changed": "ainSettingPinchangedHandler" 
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.getNumber() - 1);

			return this;
		},
		ainSettingPinchangedHandler:function(){
			console.log('ainSettingPinchangedHandler');
			this.model.trigger('selected',this.model);
			this.render();
		}


	});
});
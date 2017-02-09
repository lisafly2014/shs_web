define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'option',
		template: _.template($('#dinSetting_din_item').html()),
		
		initialize: function(){
			this.render();
		},
		
		events:{
			"dinSetting_din_changed": "dinSettingPinchangedHandler"
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.getNumber());

			return this;
		},
		dinSettingPinchangedHandler:function(){
			console.log('dinSettingPinchangedHandler');
			this.model.trigger('selected',this.model);
			
			this.render();
		}
	});
});
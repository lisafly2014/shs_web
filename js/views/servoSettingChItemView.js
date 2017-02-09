define(['backbone'],function(Backbone){
   return Backbone.View.extend({
		tagName: 'option',
		template: _.template($('#servoSetting_channel_item').html()),
		
		initialize: function(){
			this.render();
		},
		events:{
			"servoSetting_channel_changed": "servoSettingChannelChangedHandler"
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.getChannelNumber());

			return this;
		},
		servoSettingChannelChangedHandler:function(){
			console.log('servoSettingChannelChangedHandler');
			this.model.trigger('selected',this.model);
			this.render();
		}
	});
});
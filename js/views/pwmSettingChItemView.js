define(['backbone'],function(Backbone){
   return Backbone.View.extend({
		tagName: 'option',
		template: _.template($('#pwmSetting_channel_item').html()),
		
		initialize: function(){
			this.render();
		},
		
		events:{
			"pwmSetting_channel_changed": "pwmSettingChannelChangedHandler"
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.attr('value', this.model.getChannelNumber());

			return this;
		},
		pwmSettingChannelChangedHandler:function(){
			console.log('pwmSettingChannelChangedHandler');
			this.model.trigger('selected',this.model);
			this.render();
		}


	});
});
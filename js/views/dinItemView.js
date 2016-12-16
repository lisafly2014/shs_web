define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#din_item').html()),
		
		initialize: function(){
			this.listenTo(this.model,'change:enabled change:statusValue',this.render);
			this.render();
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}

	});
});
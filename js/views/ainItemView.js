define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'div',
		className:'ainStyle',
		template: _.template($('#ain_item').html()),
		
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
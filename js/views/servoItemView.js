define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'div',
		className:'servoStyle',
		template: _.template($('#servo_item').html()),
		
		initialize: function(){
			this.listenTo(this.model,'change:enabled',this.render);
			this.render();
		},
		events:{
			'input #servoSeekBar':'changeCurrentPercentage'
		},
		changeCurrentPercentage:function(){
			if(this.model.getEnabledStatus() === true){
				this.bg(this.$('#servoSeekBar').val());
				this.$('#percentageValue').html(this.$('#servoSeekBar').val() +'%');
				this.model.setCurrentPercentage(this.$('#servoSeekBar').val());
				window.ble.updateServoPercentage(this.model.getChannelNumber());
			}
		},
		bg:function(n){
			this.$('#servoSeekBar').css({
				'background-image':
				'-webkit-linear-gradient(left ,#0000ff 0%,#0000ff '+n+'%,#ffffff '+n+'%, #ffffff 100%)'
	  		});
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			if(this.model.getEnabledStatus() === true){
				this.$('#servoSeekBar').prop('disabled',false);
			}else{
				this.$('#servoSeekBar').prop('disabled',true);
			}
			this.bg(this.$('#servoSeekBar').val());
			return this;
		}
	});
});
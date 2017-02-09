define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'div',
		className:'pwmStyle',
		template: _.template($('#pwm_item').html()),
		
		initialize: function(){
			this.listenTo(this.model,'change:enabled',this.render);
			this.render();
		},
		events:{
			'input #pwmSeekBar':'changeCurrentDutyCycle'
		},
		changeCurrentDutyCycle:function(){
			if(this.model.getEnabledStatus() === true){
				this.bg(this.$('#pwmSeekBar').val());
				this.$('#pwmValue').html(this.$('#pwmSeekBar').val() +'%');
				this.model.setCurrentDutyCycle(this.$('#pwmSeekBar').val());
				window.ble.updatePwmDutyCycle(this.model.getChannelNumber());
			}
		},
		bg:function(n){
			this.$('#pwmSeekBar').css({
				'background-image':
				'-webkit-linear-gradient(left ,#0000ff 0%,#0000ff '+n+'%,#ffffff '+n+'%, #ffffff 100%)'
	  		});
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			if(this.model.getEnabledStatus() === true){
				this.$('#pwmSeekBar').prop('disabled',false);
			}else{
				this.$('#pwmSeekBar').prop('disabled',true);
			}
			this.bg(this.$('#pwmSeekBar').val());
			return this;
		}
	});
});

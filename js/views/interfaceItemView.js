define(['backbone'],function(Backbone){
	return Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#interface_item').html()),
		
		initialize: function(){
			this.render();
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		events:{
			"click #item": "clicked"
		},
		clicked: function(){
			var name= this.model.get("name");
            switch(name){
            	case 'Digital Input':
            	{ 
            		 // url ="din";
		            window.app.navigate("din",{
		                trigger:true,
		                replace:false
		            });
		            break;	
            	}
            	case 'Digital Output':
            	{
            		// url ="dout";
		            window.app.navigate("dout",{
		                trigger:true,
		                replace:false
		            });
            		break;
            	}
            	case 'Analog Input':
            	{
          			// url ="ain";
		            window.app.navigate("ain",{
		                trigger:true,
		                replace:false
		            });
            		break;
            	}
            	case 'PWM':
            	{
            		// url ="pwm";
		            window.app.navigate("pwm",{
		                trigger:true,
		                replace:false
		            });
            		break;
            	}
            	case 'Servo':
            	{
            		// url ="servo";
		            window.app.navigate("servo",{
		                trigger:true,
		                replace:false
		            });
            		break;
            	}
            	case 'SPI':
            	{
            		alert(name);
            		break;
            	}
            	case 'I2C':
            	{
            		alert(name);
            		break;
            	}
            	case 'UART':
            	{
            		alert(name);
            		break;
            	}
            	case 'RCS':
            	{
            		alert(name);
            		break;
            	}
            	case 'QUAD':
            	{
            		alert(name);
            		break;
            	}
            }
    
		}

	});
});
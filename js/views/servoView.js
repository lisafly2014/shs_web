define(['backbone','collection/servoItems','views/servoItemView'],function(Backbone,ServoItems,ServoItemView){
    return Backbone.View.extend({
        template: _.template( $('#shs_servo').html() ),
        initialize: function() {
            this.render();
        },
        events:{
            'click #servoBack2Interface': 'back2InterfaceView',
            'click #servoSetting': 'goServoSettingView'

        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAllServos();
            return this;
        },
        addOneServo: function(servoItem){
             let itemView = new ServoItemView({model: servoItem});
             this.$('#servo_content').append(itemView.render().el);    
        },
        addAllServos: function(){
            this.$('#servo_content').empty();
            ServoItems.each(this.addOneServo,this);

        },
        back2InterfaceView:function(){
            url ="interface";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        },
        goServoSettingView: function(){
            url="servoSetting";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }



    });
});
define(['backbone','collection/pwmItems','views/pwmItemView'],function(Backbone,PwmItems,PwmItemView){
    return Backbone.View.extend({
        template: _.template( $('#shs_pwm').html() ),
        initialize: function() {
            this.render();
        },
        events:{
            'click #pwmBack2Interface': 'back2InterfaceView',
            'click #pwmSetting': 'goPwmSettingView'  
        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAllPwms();
            return this;
        },
        addOnePwm: function(pwmItem){
             let itemView = new PwmItemView({model: pwmItem});
             this.$('#pwm_content').append(itemView.render().el);    
        },
        addAllPwms: function(){
            this.$('#pwm_content').empty();
            PwmItems.each(this.addOnePwm,this);

        },
        back2InterfaceView:function(){
            url ="interface";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        },
        goPwmSettingView: function(){
            url="pwmSetting";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }
    });
});
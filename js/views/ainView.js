define(['backbone','collection/ainItems','views/ainItemView'],function(Backbone,AinItems,AinItemView){
    return Backbone.View.extend({
        template: _.template( $('#shs_ain').html() ),
        initialize: function() {
            this.render();
        },
        events:{
            'click #ainBack2Interface': 'back2InterfaceView',
            'click #ainSetting': 'goAinSettingView'

        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAllAins();
            return this;
        },
        addOneAin: function(ainItem){
             let itemView = new AinItemView({model: ainItem});
             this.$('#ain_content').append(itemView.render().el);    
        },
        addAllAins: function(){
            this.$('#ain_content').empty();
            AinItems.each(this.addOneAin,this);

        },
        back2InterfaceView:function(){
            url ="interface";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        },
        goAinSettingView: function(){
            url="ainSetting";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }
    });
});
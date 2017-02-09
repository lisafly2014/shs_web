define(['backbone','collection/doutItems','views/doutItemView'],function(Backbone,DoutItems,DoutItemView){
    return Backbone.View.extend({
        template: _.template( $('#shs_dout').html() ),
        collection:DoutItems,
        initialize: function() {
            this.render();
        },
        events:{
            'click #doutBack2Interface':'back2InterfaceView',
            'click #doutSetting': 'goDoutSettingView'
        },
        addOne: function(doutItem){
             let itemView = new DoutItemView({model: doutItem});
              this.$('ul').append(itemView.render().el);
        },
        addAll: function(){
            this.collection.forEach(this.addOne,this);

        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAll();
            return this;
        },
        back2InterfaceView:function(){
            url ="interface";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        },
        goDoutSettingView: function(){
            url="doutSetting";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }
    });
});
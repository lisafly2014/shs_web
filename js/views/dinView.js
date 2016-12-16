define(['backbone','collection/dinItems','views/dinItemView'],function(Backbone,DinItems,DinItemView){
    return Backbone.View.extend({
        template: _.template( $('#shs_din').html() ),
        collection: DinItems,
        initialize: function() {
            this.render();
        },
        addOne: function(dinItem){
             let itemView = new DinItemView({model: dinItem});
              this.$('ul').append(itemView.render().el);
        },
        addAll: function(){
            this.collection.forEach(this.addOne,this);

        },
        events:{
            'click #dinBack2Interface': 'back2InterfaceView',
            'click #dinSetting': 'goDinSettingView'

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
        goDinSettingView: function(){
            url="dinSetting";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }



    });
});
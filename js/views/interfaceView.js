 define(['backbone', 'collection/interfaceItems','views/interfaceItemView'],function(Backbone,InterfaceItems,ItemView){
    var list =[
                {name: 'Digital Input'},
                {name:'Digital Output'},
                {name:'Analog Input'},
                {name:'PWM'},
                {name:'Servo'},
                {name:'SPI'},
                {name:'I2C'},
                {name:'UART'},
                {name:'RCS'},
                {name:'QUAD'}
                ];

    return Backbone.View.extend({
        template: _.template( $('#shs_interface').html() ),
        initialize: function() {
            this.listenTo(InterfaceItems,'add', this.addInterfaceItem);
            this.render();
            InterfaceItems.add(list);

        },
        addInterfaceItem: function(item){
            var itemView = new ItemView({model: item});
                this.$('ul').append(itemView.el);
        },
        events:{
            'click #goShsView':"goToShsView",
        },
        render: function() {
            this.$el.html( this.template( ) );
            return this;
        },
        goToShsView:function(){
            url ="app";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }
    });
});
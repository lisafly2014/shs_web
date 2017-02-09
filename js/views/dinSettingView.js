define([
        'backbone',
        'models/utility',
        'collection/dinItems',
        'views/dinSettingDinItemView'
        ],
    function(
        Backbone,
        Utility,
        DinItems,
        DinSettingDinItemView
        ){ 
     let highlightPin = 0; 
     let currentDefaultValue = 0;
     let isLocked;
    return Backbone.View.extend({
        template: _.template( $('#shs_din_setting').html() ),
        initialize: function() {
            this.listenTo(DinItems,'selected',this.newDinSelected);
            if(localStorage.getItem('isDinInitial') == true){
                localStorage.setItem('activeDinPin',0);
                highlightPin = 0;
            }else{
                highlightPin = localStorage.getItem('activeDinPin');
            }
            currentDefaultValue = DinItems.at(highlightPin).getDefaultPullValue();
            console.log('currentDefaultValue: '+ currentDefaultValue);

            isLocked = localStorage.getItem('deviceLocked');

            this.render();
        },
        events:{
            'click #settingBack2Din': "settingBack2DinView",
            'change #dinSetting_din':'changeDinNumber',
            'change #dinSetting_pull':'changePullValue',
            'click #dinSetting_switch':'toggleSwitch',
            'click #dinSetting_saveButton':'saveButton',
            'click #dinSetting_tickImg':'toggleLock'

        },
        newDinSelected:function(dinModel){
            console.log('newDinSelected');
            if(dinModel.getEnabledStatus() ===true){
                this.$('#dinSetting_switch').prop('checked',true);
                currentDefaultValue = dinModel.getDefaultPullValue();
                this.$('#dinSetting_pull').val(currentDefaultValue);
                this.$('#dinSetting_pull').prop('disabled',false);
            }else{
                 this.$('#dinSetting_switch').prop('checked',false);
                 currentDefaultValue = 0;
                 this.$('#dinSetting_pull').val(currentDefaultValue);     
                 this.$('#dinSetting_pull').prop('disabled',true);
            }
        },
        toggleSwitch:function(){
            let status = this.$('#dinSetting_switch').prop('checked');
            if(status === true){
                console.log('switch is enabled');
                this.$('#dinSetting_pull').prop('disabled',false);
            }else{
                 console.log('switch is diabled');
            }
            
        },
        changeDinNumber: function(){
            console.log('changeDinNumber');
            if(localStorage.getItem('isDinInitial') ===true){
                localStorage.setItem('isDinInitial',false);
            }
            highlightPin = this.$('#dinSetting_din').val();
            console.log('hightlightPin:'+highlightPin);
            localStorage.setItem('activeDinPin',highlightPin);
            this.$('option:selected').trigger('dinSetting_din_changed');
        },
        changePullValue: function(){
            currentDefaultValue =this.$('#dinSetting_pull').val();
            // console.log('newDefaultPullValue: '+ currentDefaultValue);
        },
        saveButton: function(){
            let din = DinItems.at(highlightPin);
            let status = this.$('#dinSetting_switch').prop('checked');
            
           let dinID  =parseInt(Utility.FUNCTION_ID_DIN_0) + parseInt(highlightPin);

            if(din.getEnabledStatus() ===true){
                if(status === true){
                 if(din.getDefaultPullValue() ===currentDefaultValue){
                    alert('Configuration has not changed.');
                 }else{
                    console.log('update pin Configuration');
                    let dinComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,dinID,currentDefaultValue]);
                    
                    window.ble.updateConfiguration(dinComValue);

                 }
                }else{
                    console.log('delete pin configuration');
                    this.$('#dinSetting_pull').val(0);
                    this.$('#dinSetting_pull').prop('disabled',true);
                    let dinComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_DELETE,dinID]);
                    window.ble.updateConfiguration(dinComValue);

                }
            }else{
                if(status ===true){ //add pin
                    console.log('add new pin');
                    let dinComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,dinID,currentDefaultValue]);
                    window.ble.updateConfiguration(dinComValue);
                }else{
                  console.log('Not Configured') 
                  alert('Not Configured'); 
                }
            }
        },
        toggleLock:function(){
            isLocked = !isLocked;
            if(isLocked ===true){
                console.log('After clicking save,lock device configuration');
                this.$('#dinSetting_tickImg').attr('src','img/ticked.png');

            }else{
                console.log('After clicking save,do not lock device configuration');
                this.$('#dinSetting_tickImg').attr('src','img/unticked.png');
            }
            localStorage.setItem('deviceLocked',isLocked);
        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAllPins();
            
            this.$('#dinSetting_din').val(highlightPin);
            let din = DinItems.at(highlightPin);

            currentDefaultValue = din.getDefaultPullValue();
            console.log('another currentDefaultValue '+ currentDefaultValue +', type: '+typeof(currentDefaultValue));
            this.$('#dinSetting_pull').val(currentDefaultValue);

            if(din.getEnabledStatus() ===true){
                this.$('#dinSetting_switch').prop('checked',true);
            }else{
                this.$('#dinSetting_switch').prop('checked',false);
                this.$('#dinSetting_pull').prop('disabled',true);
            }

            return this;
        },
        addOnePin: function(dinItem){
             let itemView = new DinSettingDinItemView({model: dinItem});
             this.$('#dinSetting_din').append(itemView.render().el);    
        },
        addAllPins: function(){
            this.$('#dinSetting_din').empty();
            DinItems.each(this.addOnePin,this);

        },
        settingBack2DinView:function(){
            url ="din";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }

    });
});
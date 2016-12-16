define(['backbone',
        'models/utility',
        'collection/ainItems',
        'views/ainSettingPinItemView'
    ],function(
        Backbone,
        Utility,
        AinItems,
        AinSettingPinItemView
    ){
        let highlightAinPin = 0;
        let currentRangeValue = 0;
        let currentRateValue = 0;
        let isLocked;
        return Backbone.View.extend({
            template: _.template( $('#shs_ain_setting').html() ),
            initialize: function() {
                    this.listenTo(AinItems,'selected',this.newAinPinSelected);
                    if(localStorage.getItem('isAinInitial') == true){
                        localStorage.setItem('activeAinPin',0);
                        highlightAinPin = 0;
                    }else{
                        highlightAinPin = localStorage.getItem('activeAinPin');
                    }
                    
                isLocked = localStorage.getItem('deviceLocked');
                this.render();
            },
            events:{
                'click #settingBack2Ain': 'settingBack2AinView',
                'change #ainSetting_pin':'changeAinNumber',
                'change #ainSetting_range':'changeRangeValue',
                'change #ainSetting_rate':'changeRateValue',
                'click #ainSetting_switch':'toggleSwitch',
                'click #ainSetting_saveButton':'saveButton',
                'click #ainSetting_tickImg':'toggleLock'

            },
            newAinPinSelected:function(ainModel){
                console.log('newAinPinSelected');
                if(ainModel.getEnabledStatus() ===true){
                    this.$('#ainSetting_switch').prop('checked',true);
                    currentRangeValue = ainModel.getRangeValue();
                    this.$('#ainSetting_range').val(currentRangeValue);
                    this.$('#ainSetting_range').prop('disabled',false);

                    currentRateValue = ainModel.getRateValue();
                    this.$('#ainSetting_rate').val(currentRateValue);
                    this.$('#ainSetting_rate').prop('disabled',false);
                }else{
                     this.$('#ainSetting_switch').prop('checked',false);
                     currentRangeValue =0;
                     this.$('#ainSetting_range').val(currentRangeValue);
                    this.$('#ainSetting_range').prop('disabled',true);

                     currentRateValue =0;
                     this.$('#ainSetting_rate').val(currentRateValue);
                    this.$('#ainSetting_rate').prop('disabled',true);
                }

            },
            changeAinNumber:function(){
                console.log('changeAinNumber');
                if(localStorage.getItem('isAinInitial') ===true){
                    localStorage.setItem('isAinInitial',false);
                }
                highlightAinPin = this.$('#ainSetting_pin').val();
                console.log('hightlightAinPin:'+ highlightAinPin);
                localStorage.setItem('activeAinPin',highlightAinPin);
                this.$('option:selected').trigger('ainSetting_pin_changed');
            },
            changeRangeValue:function(){
                currentRangeValue =this.$('#ainSetting_range').val();
                console.log('currentRangeValue: '+ currentRangeValue);

            },
            changeRateValue:function(){
                currentRateValue =this.$('#ainSetting_rate').val();
                console.log('currentRateValue: '+ currentRateValue);

            },
            toggleSwitch: function(){
                let status = this.$('#ainSetting_switch').prop('checked');
                if(status === true){
                    console.log('switch is enabled');
                    this.$('#ainSetting_range').prop('disabled',false);
                    this.$('#ainSetting_rate').prop('disabled',false);
                }else{
                     console.log('switch is diabled');
                }

            },
            saveButton:function(){
                let ain = AinItems.at(highlightAinPin);
                let status = this.$('#ainSetting_switch').prop('checked');
                
                let ainID  =parseInt(Utility.FUNCTION_ID_AIN_0) + parseInt(highlightAinPin);

                if(ain.getEnabledStatus() ===true){
                    if(status === true){
                     if((ain.getRangeValue() === currentRangeValue) &(ain.getRateValue() === currentRateValue)){
                        alert('Configuration has not changed.');
                     }else{
                        console.log('update ain pin Configuration');
                        let ainComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,ainID,
                            (currentRangeValue | currentRateValue <<2)]);
                        
                        window.ble.updateConfiguration(ainComValue);

                     }
                    }else{
                        console.log('delete ain pin configuration');
                        this.$('#ainSetting_range').val(0);
                        this.$('#ainSetting_range').prop('disabled',true);

                        this.$('#ainSetting_rate').val(0);
                        this.$('#ainSetting_rate').prop('disabled',true);

                        let ainComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_DELETE,ainID]);
                        window.ble.updateConfiguration(ainComValue);

                    }
                }else{
                    if(status ===true){ //add pin
                        console.log('add new ain pin');
                        let ainComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,ainID,
                            (currentRangeValue | currentRateValue <<2)]);
                        window.ble.updateConfiguration(ainComValue);
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
                    this.$('#ainSetting_tickImg').attr('src','img/ticked.png');

                }else{
                    console.log('After clicking save,do not lock device configuration');
                    this.$('#ainSetting_tickImg').attr('src','img/unticked.png');
                }
                localStorage.setItem('deviceLocked',isLocked);

            },
            render: function() {
                this.$el.html(this.template( ));
                this.addAllPins();

                this.$('#ainSetting_pin').val(highlightAinPin);
                let ain = AinItems.at(highlightAinPin);

                currentRangeValue = ain.getRangeValue();
                this.$('#ainSetting_range').val(currentRangeValue);

                currentRateValue = ain.getRateValue();
                this.$('#ainSetting_rate').val(currentRateValue);

                if(ain.getEnabledStatus() ===true){
                    this.$('#ainSetting_switch').prop('checked',true);
                }else{
                    this.$('#ainSetting_switch').prop('checked',false);
                    this.$('#ainSetting_range').prop('disabled',true);
                    this.$('#ainSetting_rate').prop('disabled',true);
                }

                return this;
            },
            addOnePin: function(ainItem){
                 let itemView = new AinSettingPinItemView({model: ainItem});
                 this.$('#ainSetting_pin').append(itemView.render().el);    
            },
            addAllPins: function(){
                this.$('#ainSetting_pin').empty();
                AinItems.each(this.addOnePin,this);

            },
            settingBack2AinView:function(){
                url ="ain";
                window.app.navigate(url,{
                    trigger:true,
                    replace:false
                });
            }

        

    });
});
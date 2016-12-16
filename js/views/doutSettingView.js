define(['backbone',
        'models/utility',
        'collection/doutItems',
        'views/doutSettingPinItemView'
        ],function(
        Backbone,
        Utility,
        DoutItems,
        DoutSettingPinItemView
        ){
            let highlightDoutPin = 0;
            let currentPullValue = 0;
            let currentDriveValue = 0;
            let currentDefaultPinValue =0;
            let isLocked;

            return Backbone.View.extend({
                template: _.template( $('#shs_dout_setting').html() ),
                initialize: function() {
                    this.listenTo(DoutItems,'selected',this.newDoutPinSelected);
                    if(localStorage.getItem('isDoutInitial') == true){
                        localStorage.setItem('activeDoutPin',0);
                        highlightDoutPin = 0;
                    }else{
                        highlightDoutPin = localStorage.getItem('activeDoutPin');
                    }
                    
                    isLocked = localStorage.getItem('deviceLocked');
                    this.render();
                },
                events:{
                    'click #settingBack2Dout':"settingBack2DoutView",
                    'change #doutSetting_pin':'changeDoutNumber',

                    'change #doutSetting_pull':'changePullValue',
                    'change #doutSetting_drive':'changeDriveValue',
                    'change #doutSetting_default':'changeDefaultValue',
                    'click #doutSetting_switch':'toggleSwitch',
                    'click #doutSetting_saveButton':'saveButton',
                    'click #doutSetting_tickImg':'toggleLock'

                },
                changeDoutNumber: function(){
                    console.log('changeDoutNumber');
                    if(localStorage.getItem('isDoutInitial') ===true){
                        localStorage.setItem('isDoutInitial',false);
                    }
                    highlightDoutPin = this.$('#doutSetting_pin').val();
                    console.log('hightlightPin:'+ highlightDoutPin);
                    localStorage.setItem('activeDoutPin',highlightDoutPin);
                    this.$('option:selected').trigger('doutSetting_pin_changed');
                },
                newDoutPinSelected:function(doutModel){
                    console.log('newDoutPinSelected');
                    if(doutModel.getDoutEnabledStatus() ===true){
                        this.$('#doutSetting_switch').prop('checked',true);
                        currentPullValue = doutModel.getPullValue();
                        this.$('#doutSetting_pull').val(currentPullValue);
                        this.$('#doutSetting_pull').prop('disabled',false);

                        currentDriveValue = doutModel.getDriveValue();
                        this.$('#doutSetting_drive').val(currentDriveValue);
                        this.$('#doutSetting_drive').prop('disabled',false);

                        currentDefaultPinValue = doutModel.getDefaultPinValue();
                        this.$('#doutSetting_default').val(currentDefaultPinValue);
                        this.$('#doutSetting_default').prop('disabled',false);
                    }else{
                         this.$('#doutSetting_switch').prop('checked',false);
                         currentPullValue =0;
                         this.$('#doutSetting_pull').val(currentPullValue);
                         this.$('#doutSetting_pull').prop('disabled',true);

                         currentDriveValue =0;
                         this.$('#doutSetting_drive').val(currentDriveValue);
                         this.$('#doutSetting_drive').prop('disabled',true);

                         newDefaulPintValue = 0;
                         this.$('#doutSetting_default').val(currentDefaultPinValue);
                         this.$('#doutSetting_default').prop('disabled',true);
                    }
                },
                toggleSwitch:function(){
                    let status = this.$('#doutSetting_switch').prop('checked');
                    if(status === true){
                        console.log('switch is enabled');
                        this.$('#doutSetting_pull').prop('disabled',false);
                        this.$('#doutSetting_drive').prop('disabled',false);
                        this.$('#doutSetting_default').prop('disabled',false);
                    }else{
                         console.log('switch is diabled');
                    } 
                },
                changePullValue:function(){
                   currentPullValue =this.$('#doutSetting_pull').val();
                   console.log('currentPullValue: '+ currentPullValue);
                },
                changeDriveValue:function(){
                    currentDriveValue =this.$('#doutSetting_drive').val();
                    console.log('currentDriveValue: '+ currentDriveValue);
                },
                changeDefaultValue:function(){
                    currentDefaultPinValue = this.$('#doutSetting_default').val();
                    console.log('currentDefaultPinValue: '+ currentDefaultPinValue);
                },

                saveButton: function(){
                    let dout = DoutItems.at(highlightDoutPin);
                    let status = this.$('#doutSetting_switch').prop('checked');
                    
                    let doutID  =parseInt(Utility.FUNCTION_ID_DOUT_0) + parseInt(highlightDoutPin);

                    if(dout.getDoutEnabledStatus() ===true){
                        if(status === true){
                         if(
                            (dout.getPullValue() === currentPullValue) &
                            (dout.getDriveValue() ===currentDriveValue)&
                            (dout.getDefaultPinValue() === currentDefaultPinValue)
                            ){
                            alert('Configuration has not changed.');
                         }else{
                            console.log('update output pin Configuration');
                            let doutComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,doutID,
                                (currentPullValue | currentDriveValue <<2),currentDefaultPinValue]);
                            
                            window.ble.updateConfiguration(doutComValue);

                         }
                        }else{
                            console.log('delete dout pin configuration');
                            this.$('#doutSetting_pull').val(0);
                            this.$('#doutSetting_pull').prop('disabled',true);

                            this.$('#doutSetting_drive').val(0);
                            this.$('#doutSetting_drive').prop('disabled',true);

                            this.$('#doutSetting_default').val(0);
                            this.$('#doutSetting_default').prop('disabled',true);

                            let doutComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_DELETE,doutID]);
                            window.ble.updateConfiguration(doutComValue);

                        }
                    }else{
                        if(status ===true){ //add pin
                            console.log('add new dout pin');
                            let doutComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,doutID,
                                (currentPullValue | currentDriveValue <<2),currentDefaultPinValue]);
                            window.ble.updateConfiguration(doutComValue);
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
                        this.$('#doutSetting_tickImg').attr('src','img/ticked.png');

                    }else{
                        console.log('After clicking save,do not lock device configuration');
                        this.$('#doutSetting_tickImg').attr('src','img/unticked.png');
                    }
                    localStorage.setItem('deviceLocked',isLocked);
                },
                render: function() {
                    this.$el.html( this.template( ) );
                    this.addAllPins();

                    this.$('#doutSetting_pin').val(highlightDoutPin);
                    let dout = DoutItems.at(highlightDoutPin);

                    currentPullValue = dout.getPullValue();
                    this.$('#doutSetting_pull').val(currentPullValue);

                    currentDriveValue = dout.getDriveValue();
                    this.$('#doutSetting_drive').val(currentDriveValue);

                    currentDefaultPinValue = dout.getDefaultPinValue();
                    this.$('#doutSetting_default').val(currentDefaultPinValue);

                    if(dout.getDoutEnabledStatus() ===true){
                        this.$('#doutSetting_switch').prop('checked',true);
                    }else{
                        this.$('#doutSetting_switch').prop('checked',false);
                        this.$('#doutSetting_pull').prop('disabled',true);
                        this.$('#doutSetting_drive').prop('disabled',true);
                        this.$('#doutSetting_default').prop('disabled',true);
                    }

                    return this;
                },

                addOnePin: function(doutItem){
                     let itemView = new DoutSettingPinItemView({model: doutItem});
                     this.$('#doutSetting_pin').append(itemView.render().el);    
                },
                addAllPins: function(){
                    this.$('#doutSetting_pin').empty();
                    DoutItems.each(this.addOnePin,this);

                },
                settingBack2DoutView:function(){
                    url ="dout";
                    window.app.navigate(url,{
                        trigger:true,
                        replace:false
                    });
                }

        

    });
});
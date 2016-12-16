define(['backbone',
    'models/utility',
    'collection/servoItems',
    'views/servoSettingChItemView'
    ],function(
    Backbone,
    Utility,
    ServoItems,
    ServoSettingChItemView
    ){
    let currentChannel = 0;
    let currentServoIndex = 0;
    let currentDriveValue = 0;
    let curentDefaultPercentage = 0;
    let isLocked;
    
    return Backbone.View.extend({
        template: _.template( $('#shs_servo_setting').html() ),
        initialize: function() {
            this.listenTo(ServoItems,'selected',this.newServoChannelSelected);
            if(localStorage.getItem('isServoInitial') == true){
                localStorage.setItem('activeServoChannel',0);
                currentChannel = 0;
            }else{
                currentChannel = localStorage.getItem('activeServoChannel');
            }
            
            isLocked = localStorage.getItem('deviceLocked');

            this.render();
        },
        events:{
            'click #settingBack2Servo':"settingBack2ServoView",

            'change #servoSetting_channel':'changeChannelNumber',
            'click #servoSetting_switch':'toggleSwitch',
            'change #servoSetting_pinIndex':'changePinIndex',
            'change #servoSetting_drive':'changeDriveValue',
            'input #servoDefaultPercentage':'changeDefaultPercentage',
            'click #servoSetting_saveButton':'saveButton',
            'click #servoSetting_tickImg':'toggleLock'

        },
        changeChannelNumber: function(){
            console.log('changeChannelNumber');
            if(localStorage.getItem('isServoInitial') ===true){
                localStorage.setItem('isServoInitial',false);
            }
            currentChannel = this.$('#servoSetting_channel').val();
            console.log('currentChannel:'+ currentChannel);
            localStorage.setItem('activeServoChannel',currentChannel);
            this.$('option:selected').trigger('servoSetting_channel_changed');

        },
        newServoChannelSelected:function(servoModel){
            console.log('newServoChannelSelected');
            if(servoModel.getEnabledStatus() ===true){
                this.$('#servoSetting_switch').prop('checked',true);
                currentServoIndex = servoModel.getServoIndex();
                this.$('#servoSetting_pinIndex').val(currentServoIndex);
                this.$('#servoSetting_pinIndex').prop('disabled',false);

                currentDriveValue = servoModel.getDriveValue();
                this.$('#servoSetting_drive').val(currentDriveValue);
                this.$('#servoSetting_drive').prop('disabled',false);

                curentDefaultPercentage = servoModel.getDefaultPercentage();
                this.$('#servoDefaultPercentage').val(curentDefaultPercentage);
                this.$('#servoDefaultPercentage').prop('disabled',false);
                this.bg(curentDefaultPercentage);
                this.$('#servoDefaultPercentageValue').html(curentDefaultPercentage +'%');


            }else{
                 this.$('#servoSetting_switch').prop('checked',false);
                 currentServoIndex =0;
                 this.$('#servoSetting_pinIndex').val(currentServoIndex);
                 this.$('#servoSetting_pinIndex').prop('disabled',true);

                 currentDriveValue =0;
                 this.$('#servoSetting_drive').val(currentDriveValue);
                 this.$('#servoSetting_drive').prop('disabled',true);

                 curentDefaultPercentage = 0
                 this.$('#servoDefaultPercentage').val(curentDefaultPercentage);
                 this.$('#servoDefaultPercentage').prop('disabled',true);
                 this.bg(curentDefaultPercentage);
                 this.$('#servoDefaultPercentageValue').html(curentDefaultPercentage +'%');
            }

        },
        toggleSwitch:function(){
            let status = this.$('#servoSetting_switch').prop('checked');
            if(status === true){
                console.log('switch is enabled');
                this.$('#servoSetting_pinIndex').prop('disabled',false);
                this.$('#servoSetting_drive').prop('disabled',false);
                this.$('#servoDefaultPercentage').prop('disabled',false);
            }else{
                 console.log('switch is diabled');
            } 

        },
        changePinIndex:function(){
            currentServoIndex =this.$('#servoSetting_pinIndex').val();
        },
        changeDriveValue:function(){
            currentDriveValue =this.$('#servoSetting_drive').val();
        },
        changeDefaultPercentage:function(){
            curentDefaultPercentage = this.$('#servoDefaultPercentage').val();
            this.bg(curentDefaultPercentage);
            this.$('#servoDefaultPercentageValue').html(curentDefaultPercentage +'%');
        },
        saveButton:function(){
            let servo = ServoItems.at(currentChannel);
            let status = this.$('#servoSetting_switch').prop('checked');
            
            let servoID  =parseInt(Utility.FUNCTION_ID_SERVO_0) + parseInt(currentChannel);
            // console.log('servoId: '+servoID);

            if(servo.getEnabledStatus() === true){
            if(status === true){
             if((servo.getServoIndex() === currentServoIndex) &
                (servo.getDriveValue() ===currentDriveValue)&
                (servo.getDefaultPercentage === curentDefaultPercentage)){
                alert('Configuration has not changed.');
             }else{
                console.log('update servo channel Configuration');
                let servoComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,servoID,
                    currentServoIndex,currentDriveValue,curentDefaultPercentage]);
                
                window.ble.updateConfiguration(servoComValue);
             }
            }else{
                console.log('delete servo channel configuration');
                this.$('#servoSetting_pinIndex').val(0);
                this.$('#servoSetting_pinIndex').prop('disabled',true);

                this.$('#servoSetting_drive').val(0);
                this.$('#servoSetting_drive').prop('disabled',true);

                this.$('#servoDefaultPercentage').val(0);
                this.bg(0);
                this.$('#servoDefaultPercentage').prop('disabled',true);

                let servoComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_DELETE,servoID]);
                window.ble.updateConfiguration(servoComValue);

            }
        }else{
            if(status ===true){ //add channel
                console.log('add new servo channel');
                let servoComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,servoID,
                    currentServoIndex,currentDriveValue,curentDefaultPercentage]);
                window.ble.updateConfiguration(servoComValue);
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
                this.$('#servoSetting_tickImg').attr('src','img/ticked.png');

            }else{
                console.log('After clicking save,do not lock device configuration');
                this.$('#servoSetting_tickImg').attr('src','img/unticked.png');
            }
            localStorage.setItem('deviceLocked',isLocked);
        },
        addOneChannel: function(servoItem){
             let itemView = new ServoSettingChItemView({model: servoItem});
             this.$('#servoSetting_channel').append(itemView.render().el);    
        },
        addAllChannels: function(){
            this.$('#servoSetting_channel').empty();
            ServoItems.each(this.addOneChannel,this);

        },
        render: function() {
            this.$el.html( this.template( ) );
            this.addAllChannels();

            this.$('#servoSetting_channel').val(currentChannel);
            let servo = ServoItems.at(currentChannel);

            currentServoIndex = servo.getServoIndex();
            this.$('#servoSetting_pinIndex').val(currentServoIndex);

            currentDriveValue = servo.getDriveValue();
            this.$('#servoSetting_drive').val(currentDriveValue);

            curentDefaultPercentage = servo.getDefaultPercentage();
            this.$('#servoDefaultPercentage').val(curentDefaultPercentage);
            this.bg(curentDefaultPercentage);
            this.$('#servoDefaultPercentageValue').html(curentDefaultPercentage +'%');
            if(curentDefaultPercentage === 0){
                this.$('servoDefaultPercentageValue').value ='0%';

            }else{
              this.$('servoDefaultPercentageValue').value = curentDefaultPercentage +'%';  
            }

            if(servo.getEnabledStatus() ===true){
                this.$('#servoSetting_switch').prop('checked',true);
            }else{
                this.$('#servoSetting_switch').prop('checked',false);
                this.$('#servoSetting_pinIndex').prop('disabled',true);
                this.$('#servoSetting_drive').prop('disabled',true);
            }
            return this;
        },
        bg:function(n){
            this.$('#servoDefaultPercentage').css({
                'background-image':
                '-webkit-linear-gradient(left ,#0000ff 0%,#0000ff '+n+'%,#ffffff '+n+'%, #ffffff 100%)'
            });
        },
        settingBack2ServoView:function(){
            url ="servo";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }

        

    });
});
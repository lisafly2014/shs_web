define([
    'backbone',
    'models/utility',
    'collection/pwmItems',
    'views/pwmSettingChItemView'
    ],function(
    Backbone,
    Utility,
    PwmItems,
    PwmSettingChItemView
    ){
    let currentChannel = 0;
    let currentPwmIndex = 0;
    let currentDriveValue = 0;
    let curentDefaultDutyCycle = 0;
    let isLocked;
    return Backbone.View.extend({
        template: _.template( $('#shs_pwm_setting').html() ),
        initialize: function() {
            this.listenTo(PwmItems,'selected',this.newPwmChannelSelected);
            if(localStorage.getItem('isPwmInitial') == true){
                localStorage.setItem('activePwmChannel',0);
                currentChannel = 0;
            }else{
                currentChannel = localStorage.getItem('activePwmChannel');
            }
            
            isLocked = localStorage.getItem('deviceLocked');

            this.render();
        },
        events:{
            'click #settingBack2Pwm':"settingBack2PwmView",

            'change #pwmSetting_channel':'changeChannelNumber',
            'click #pwmSetting_switch':'toggleSwitch',
            'change #pwmSetting_pinIndex':'changePinIndex',
            'change #pwmSetting_drive':'changeDriveValue',
            'input #pwmDefaultDutyCycle':'changeDefaultDutyCycle',

            'click #pwmSetting_saveButton':'saveButton',
            'click #pwmSetting_tickImg':'toggleLock'
        },
        changeChannelNumber: function(){
            console.log('changeChannelNumber');
            if(localStorage.getItem('isPwmInitial') ===true){
                localStorage.setItem('isPwmInitial',false);
            }
            currentChannel = this.$('#pwmSetting_channel').val();
            console.log('currentChannel:'+ currentChannel);
            localStorage.setItem('activePwmChannel',currentChannel);
            this.$('option:selected').trigger('pwmSetting_channel_changed');

        },
        newPwmChannelSelected:function(pwmModel){
            console.log('newPwmChannelSelected');
            if(pwmModel.getEnabledStatus() ===true){
                this.$('#pwmSetting_switch').prop('checked',true);
                currentPwmIndex = pwmModel.getPwmIndex();
                this.$('#pwmSetting_pinIndex').val(currentPwmIndex);
                this.$('#pwmSetting_pinIndex').prop('disabled',false);

                currentDriveValue = pwmModel.getDriveValue();
                this.$('#pwmSetting_drive').val(currentDriveValue);
                this.$('#pwmSetting_drive').prop('disabled',false);

                curentDefaultDutyCycle = pwmModel.getDefaultDutyCycle();
                this.$('#pwmDefaultDutyCycle').val(curentDefaultDutyCycle);
                this.$('#pwmDefaultDutyCycle').prop('disabled',false);
                this.bg(curentDefaultDutyCycle);
                this.$('#pwmDefaultDutyCylceValue').html(curentDefaultDutyCycle +'%');
            }else{
                 this.$('#pwmSetting_switch').prop('checked',false);
                 currentPwmIndex =0;
                 this.$('#pwmSetting_pinIndex').val(currentPwmIndex);
                 this.$('#pwmSetting_pinIndex').prop('disabled',true);

                 currentDriveValue =0;
                 this.$('#pwmSetting_drive').val(currentDriveValue);
                 this.$('#pwmSetting_drive').prop('disabled',true);

                 curentDefaultDutyCycle = 0
                 this.$('#pwmDefaultDutyCycle').val(curentDefaultDutyCycle);
                 this.$('#pwmDefaultDutyCycle').prop('disabled',true);
                 this.bg(curentDefaultDutyCycle);
                 this.$('#pwmDefaultDutyCylceValue').html(curentDefaultDutyCycle +'%');
            }
        },
        toggleSwitch:function(){
            let status = this.$('#pwmSetting_switch').prop('checked');
            if(status === true){
                console.log('switch is enabled');
                this.$('#pwmSetting_pinIndex').prop('disabled',false);
                this.$('#pwmSetting_drive').prop('disabled',false);
                this.$('#pwmDefaultDutyCycle').prop('disabled',false);
            }else{
                 console.log('switch is diabled');
            } 

        },
         changePinIndex:function(){
            currentPwmIndex =this.$('#pwmSetting_pinIndex').val();
            console.log('currentPwmIndex: '+ currentPwmIndex);

        },
        changeDriveValue:function(){
            currentDriveValue =this.$('#pwmSetting_drive').val();
            console.log('currentDriveValue: '+ currentDriveValue);

        },
        changeDefaultDutyCycle:function(){
            curentDefaultDutyCycle = this.$('#pwmDefaultDutyCycle').val();
            this.bg(curentDefaultDutyCycle);
            this.$('#pwmDefaultDutyCylceValue').html(curentDefaultDutyCycle +'%');
        },
        saveButton:function(){
            let pwm = PwmItems.at(currentChannel);
            let status = this.$('#pwmSetting_switch').prop('checked');
            
            let pwmID  =parseInt(Utility.FUNCTION_ID_PWM_0) + parseInt(currentChannel);
            console.log('pwmId: '+pwmID);

            if(pwm.getEnabledStatus() === true){
                if(status === true){
                 if((pwm.getPwmIndex() === currentPwmIndex) &
                    (pwm.getDriveValue() ===currentDriveValue)&
                    (pwm.getDefaultDutyCycle === curentDefaultDutyCycle)){
                    alert('Configuration has not changed.');
                 }else{
                    console.log('update pwm channel Configuration');
                    let pwmComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,pwmID,
                        currentPwmIndex,currentDriveValue,curentDefaultDutyCycle]);
                    
                    window.ble.updateConfiguration(pwmComValue);

                 }
                }else{
                    console.log('delete pwm channel configuration');
                    this.$('#pwmSetting_pinIndex').val(0);
                    this.$('#pwmSetting_pinIndex').prop('disabled',true);

                    this.$('#pwmSetting_drive').val(0);
                    this.$('#pwmSetting_drive').prop('disabled',true);

                    this.$('#pwmDefaultDutyCycle').val(0);
                    this.bg(0);
                    this.$('#pwmDefaultDutyCycle').prop('disabled',true);

                    let pwmComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_DELETE,pwmID]);
                    window.ble.updateConfiguration(pwmComValue);

                }
            }else{
                if(status ===true){ //add channel
                    console.log('add new pwm channel');
                    let pwmComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_ADD,pwmID,
                        currentPwmIndex,currentDriveValue,curentDefaultDutyCycle]);
                    window.ble.updateConfiguration(pwmComValue);
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
                this.$('#pwmSetting_tickImg').attr('src','img/ticked.png');

            }else{
                console.log('After clicking save,do not lock device configuration');
                this.$('#pwmSetting_tickImg').attr('src','img/unticked.png');
            }
            localStorage.setItem('deviceLocked',isLocked);
        },
        addOneChannel: function(pwmItem){
             let itemView = new PwmSettingChItemView({model: pwmItem});
             this.$('#pwmSetting_channel').append(itemView.render().el);    
        },
        addAllChannels: function(){
            this.$('#pwmSetting_channel').empty();
            PwmItems.each(this.addOneChannel,this);

        },
        bg:function(n){
            this.$('#pwmDefaultDutyCycle').css({
                'background-image':
                '-webkit-linear-gradient(left ,#0000ff 0%,#0000ff '+n+'%,#ffffff '+n+'%, #ffffff 100%)'
            });
        },
        render: function() {
            this.$el.html( this.template());
            this.addAllChannels();

            this.$('#pwmSetting_channel').val(currentChannel);
            let pwm = PwmItems.at(currentChannel);

            currentPwmIndex = pwm.getPwmIndex();
            this.$('#pwmSetting_pinIndex').val(currentPwmIndex);

            currentDriveValue = pwm.getDriveValue();
            this.$('#pwmSetting_drive').val(currentDriveValue);

            curentDefaultDutyCycle = pwm.getDefaultDutyCycle();
            this.$('#pwmDefaultDutyCycle').val(curentDefaultDutyCycle);
            this.bg(curentDefaultDutyCycle);
            this.$('#pwmDefaultDutyCylceValue').html(curentDefaultDutyCycle +'%');

            if(curentDefaultDutyCycle === 0){
                console.log('hi');
                this.$('pwmDefaultDutyCylceValue').value ='0%';

            }else{
              this.$('pwmDefaultDutyCylceValue').value = curentDefaultDutyCycle +'%';  
            }

            if(pwm.getEnabledStatus() ===true){
                this.$('#pwmSetting_switch').prop('checked',true);
            }else{
                this.$('#pwmSetting_switch').prop('checked',false);
                this.$('#pwmSetting_pinIndex').prop('disabled',true);
                this.$('#pwmSetting_drive').prop('disabled',true);
            }
            this.bg(this.$('#pwmDefaultDutyCycle').val());
            return this;
        },
        bg:function(n){
            this.$('#pwmDefaultDutyCycle').css({
                'background-image':
                '-webkit-linear-gradient(left ,#0000ff 0%,#0000ff '+n+'%,#ffffff '+n+'%, #ffffff 100%)'
            });
        },
        settingBack2PwmView:function(){
            url ="pwm";
            window.app.navigate(url,{
                trigger:true,
                replace:false
            });
        }

        

    });
});
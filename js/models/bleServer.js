define(['models/utility',
		'backbone',
		'backbone.localStorage',
		'collection/dinItems',
		'collection/doutItems',
		'collection/ainItems',
		'collection/pwmItems',
		'collection/servoItems'
	],function(
		Utility,
		Backbone,
		Storage,
		DinItems,
		DoutItems,
		AinItems,
		PwmItems,
		ServoItems
	){
	"use strict";

	var shsServer;
	var functionID;
	var updatedConfig;
	var array=[];
	let sequence;

	function handleShsResponse(event){
			let value = event.target.value;

			if(value.getUint8(0) === Utility.MANAGE_ID_INTERFACE_GET){
				if((value.getUint8(1)>=Utility.FUNCTION_ID_DIN_0) & (value.getUint8(1)<=Utility.FUNCTION_ID_DIN_31)){
						let dinPin = value.getUint8(1) - Utility.FUNCTION_ID_DIN_0;
						let din = DinItems.at(dinPin);
						DinItems.at(dinPin).setEnabledStatus(true);
						DinItems.at(dinPin).setDefaultPullValue(value.getUint8(2));

					}else if((value.getUint8(1)>=Utility.FUNCTION_ID_DOUT_0) & (value.getUint8(1)<=Utility.FUNCTION_ID_DOUT_31)){
						let doutPin = value.getUint8(1) - Utility.FUNCTION_ID_DOUT_0;
						let pullValue = value.getUint8(2) & 0x03;
						let driveValue = (value.getUint8(2) & 0x1C) >>2;
						let dout = DoutItems.at(doutPin);
						dout.setDoutEnabledStatus(true);
						dout.setPullValue(pullValue);
						dout.setDriveValue(driveValue);
						dout.setDefaultPinValue(value.getUint8(3));
						

					}else if((value.getUint8(1)>=Utility.FUNCTION_ID_AIN_0) & (value.getUint8(1)<=Utility.FUNCTION_ID_AIN_5)){
						let ainPin = value.getUint8(1) - Utility.FUNCTION_ID_AIN_0;
						let rangeValue = value.getUint8(2) & 0x03;
						let rateValue = (value.getUint8(2)& 0x0C) >>2;
						let ain = AinItems.at(ainPin);

						ain.setEnabledStatus(true);
						ain.setRangeValue(rangeValue);
						ain.setRateValue(rateValue);
						// console.log(JSON.stringify(AinItems.at(ainPin)));
					}
					else if((value.getUint8(1)>=Utility.FUNCTION_ID_PWM_0) & (value.getUint8(1)<=Utility.FUNCTION_ID_PWM_3)){
						let pwmIndex = value.getUint8(1) - Utility.FUNCTION_ID_PWM_0;
						let pwm = PwmItems.at(pwmIndex);
						pwm.setEnabledStatus(true);
						pwm.setPwmIndex(value.getUint8(2));
						pwm.setDriveValue(value.getUint8(3));
						pwm.setDefaultDutyCycle(value.getUint8(4));
						// console.log(JSON.stringify(pwm));

					}else if((value.getUint8(1)>=Utility.FUNCTION_ID_SERVO_0) & (value.getUint8(1)<=Utility.FUNCTION_ID_SERVO_3)){
						let servoIndex = value.getUint8(1) - Utility.FUNCTION_ID_SERVO_0;
						let servo = ServoItems.at(servoIndex);
						servo.setEnabledStatus(true);
						servo.setServoIndex(value.getUint8(2));
						servo.setDriveValue(value.getUint8(3));
						servo.setDefaultPercentage(value.getUint8(4));
						// console.log(JSON.stringify(ServoItems.at(servoIndex)));
					}
			}else if(value.getUint8(0)=== Utility.MANAGE_ID_DEVICE_RESPONSE){
				if(value.getUint8(1) === Utility.MANAGE_ID_DEVICE_GET_INTERFACES){
					console.log("Get device configuration done.");
					if(value.getUint8(2)===Utility.RESPONSE_SUCCESS){
						shsServer.setConfigurationStatus(true);
						readPinStatus();
					}else{
						this.onError("Error when getting device interfaces.");
					}	
				 }
				 else if(value.getUint8(1) ===Utility.MANAGE_ID_INTERFACE_ADD){
					if(value.getUint8(2)=== Utility.RESPONSE_SUCCESS){
						if((functionID >=Utility.FUNCTION_ID_DIN_0) &(functionID <= Utility.FUNCTION_ID_DIN_31)){
							console.log('Update input pin configuration');
							let dinIndex= functionID -Utility.FUNCTION_ID_DIN_0;
							let din = DinItems.at(dinIndex);
							if(din.getEnabledStatus() ===false){
								din.setEnabledStatus(true);
								din.setStatusValue(0);
							}
							din.setDefaultPullValue(updatedConfig[0]);

						}else if((functionID >= Utility.FUNCTION_ID_DOUT_0) &(functionID <= Utility.FUNCTION_ID_DOUT_31)){
							console.log('Update output pin configuration');
							let doutIndex = functionID - Utility.FUNCTION_ID_DOUT_0;
							let pullValue = updatedConfig[0] & 0x03;
							let driveValue = (updatedConfig[0] & 0x1C) >>2;
							let dout = DoutItems.at(doutIndex);
							if(dout.getDoutEnabledStatus() ===false){
								dout.setDoutEnabledStatus(true);
								dout.setCurrentPinValue(updatedConfig[1]);
							}
							dout.setPullValue(pullValue);
							dout.setDriveValue(driveValue);
							dout.setDefaultPinValue(updatedConfig[1]);
							
						}else if((functionID >= Utility.FUNCTION_ID_AIN_0) &(functionID <= Utility.FUNCTION_ID_AIN_5)){
							console.log('Update analog input pin configuration');
							let ainIndex = functionID - Utility.FUNCTION_ID_AIN_0;
							let rangeValue = updatedConfig[0] & 0x03;
							let rateValue = (updatedConfig[0]& 0x0C) >>2;
							let ain = AinItems.at(ainIndex);
							if(ain.getEnabledStatus() === false){
								ain.setEnabledStatus(true);
								ain.setStatusValue(updatedConfig[0]);
							}
							ain.setRangeValue(rangeValue);
							ain.setRateValue(rateValue);

						}else if((functionID >=Utility.FUNCTION_ID_PWM_0) &(functionID <= Utility.FUNCTION_ID_PWM_3)){
							console.log('Update pwm configuration');

							let pwmIndex = functionID - Utility.FUNCTION_ID_PWM_0;
							let pwm = PwmItems.at(pwmIndex);
							if(pwm.getEnabledStatus() ===false){
								pwm.setEnabledStatus(true);
								pwm.setCurrentPercentage(updatedConfig[2]); 
							}
							
							pwm.setPwmIndex(updatedConfig[0]);
							pwm.setDriveValue(updatedConfig[1]);
							pwm.setDefaultDutyCycle(updatedConfig[2]);
							// console.log(JSON.stringify(pwm));

						}else if((functionID >=Utility.FUNCTION_ID_SERVO_0) &(functionID <= Utility.FUNCTION_ID_SERVO_3)){
							console.log('Update servo configuration');
							let servoIndex = functionID - Utility.FUNCTION_ID_SERVO_0;
							let servo = ServoItems.at(servoIndex);
							if(servo.getEnabledStatus() === false){
								servo.setEnabledStatus(true);
								servo.setCurrentPercentage(updatedConfig[2]);
							}
							
							servo.setServoIndex(updatedConfig[0]);
							servo.setDriveValue(updatedConfig[1]);
							servo.setDefaultPercentage(updatedConfig[2]);
							// console.log(JSON.stringify(servo));	
						}
					}else if(value.getUint8(2) === Utility.RESPONSE_WRONG_LENGTH){
						alert("Command length wrong during update pin");

					}else if(value.getUint8(2)===Utility.RESPONSE_LOCKED){
						alert("Device locked during update pin");

					}else if(value.getUint8(2)===Utility.RESPONSE_CLASH){
						alert("Pin clash during update pin");

					}
				}else if(value.getUint8(1) === Utility.MANAGE_ID_INTERFACE_DELETE){
					if(value.getUint8(2) === Utility.RESPONSE_SUCCESS){
						if((functionID >= Utility.FUNCTION_ID_DIN_0) &(functionID <= Utility.FUNCTION_ID_DIN_31)){
							console.log('Delete input pin configuration');
							let dinIndex = functionID -Utility.FUNCTION_ID_DIN_0;
							let din = DinItems.at(dinIndex);
							din.setEnabledStatus(false);
							din.setDefaultPullValue(0);

							dinItem.setStatusValue(0);

						}else if((functionID >= Utility.FUNCTION_ID_DOUT_0) &(functionID <= Utility.FUNCTION_ID_DOUT_31)){
							console.log('Delete output pin configuration');
							let doutIndex = functionID - Utility.FUNCTION_ID_DOUT_0;
							let dout = DoutItems.at(doutIndex);
							dout.setDoutEnabledStatus(false); 
							dout.setPullValue(0);
							dout.setDriveValue(0);
							dout.setDefaultPinValue(0);

							dout.setCurrentPinValue(0);

						}else if((functionID >= Utility.FUNCTION_ID_AIN_0) &(functionID <= Utility.FUNCTION_ID_AIN_5)){
							console.log('Delete analog input pin configuration');
							let ainIndex = functionID - Utility.FUNCTION_ID_AIN_0;
							let ain = AinItems.at(ainIndex);
 
							ain.setEnabledStatus(false);
							ain.setRangeValue(0); 
							ain.setRateValue(0);

							ain.setStatusValue(0);

						}else if((functionID >= Utility.FUNCTION_ID_PWM_0) &(functionID <= Utility.FUNCTION_ID_PWM_3)){
							console.log('Delete pwm configuration');
							let pwmIndex = functionID - Utility.FUNCTION_ID_PWM_0;
							let pwm = PwmItems.at(pwmIndex);

							pwm.setEnabledStatus(false);    
							pwm.setPwmIndex(0);  		    
							pwm.setDriveValue(0); 		    
							pwm.setDefaultDutyCycle(0); 
							
							pwm.setCurrentPercentage(0);    

						}else if((functionID >= Utility.FUNCTION_ID_SERVO_0) &(functionID <= Utility.FUNCTION_ID_SERVO_3)){
							console.log('Delete servo configuration');
							let servoIndex = functionID - Utility.FUNCTION_ID_SERVO_0;
							let servo = ServoItems.at(servoIndex);
							servo.setEnabledStatus(false); 
							servo.setServoIndex(0); 
							servo.setDriveValue(0); 
							servo.setDefaultPercentage(0);

							servo.setCurrentPercentage(0);
						}

					}else if(value.getUint8(2) === Utility.RESPONSE_WRONG_LENGTH){
						alert("Command length wrong during delete pin");

					}else if(value.getUint8(2) === Utility.RESPONSE_LOCKED){
						alert("Device locked during delete pin");

					}else if(value.getUint8(2) === Utility.RESPONSE_CLASH){
						alert("Pin clash during delete pin");

					}
				}else if(value.getUint8(1) === Utility.MANAGE_ID_DEVICE_UNLOCKED){
					if(value.getUint8(2) === Utility.RESPONSE_SUCCESS){
						console.log('Unlock device successfully');
					}else{
						alert('Unlock device fail');
					}
				}else if(value.getUint8(1) === Utility.MANAGE_ID_DEVICE_LOCK){
					if(value.getUint8(2) === Utility.RESPONSE_SUCCESS){
						console.log('Lock device successfully');
					}else{
						alert('Lock device fail');
					}
				}else if(value.getUint8(1) === Utility.MANAGE_ID_DEVICE_STORE_CONFIG){
					if(value.getUint8(2) === Utility.RESPONSE_SUCCESS){
						console.log('Store device configuration successfully');
					}else{
						alert('Store device configuration fail');
					}
				}
			}else if((value.getUint8(0) >= Utility.FUNCTION_ID_DIN_0)&(value.getUint8(0) <= Utility.FUNCTION_ID_DIN_31)){
				let dinIndex = value.getUint8(0) - Utility.FUNCTION_ID_DIN_0;
				let dinItem = DinItems.at(dinIndex);
				if(dinItem.getEnabledStatus() === true){
					dinItem.setStatusValue(value.getUint8(1));
				}
				console.log(JSON.stringify(dinItem));
				
			}else if((value.getUint8(0) >= Utility.FUNCTION_ID_DOUT_0)&(value.getUint8(0) <= Utility.FUNCTION_ID_DOUT_31)){
				let doutIndex = value.getUint8(0) - Utility.FUNCTION_ID_DOUT_0;
				let doutItem = DoutItems.at(doutIndex);
				if(doutItem.getDoutEnabledStatus() === true){
					doutItem.setCurrentPinValue(value.getUint8(1));
				}
			    // console.log(JSON.stringify(doutItem));
				// console.log(doutIndex + ', ' + shsServer.doutConfiguration[doutIndex][0]+', '+doutItem.getDoutPinValue());
			}else if((value.getUint8(0) >= Utility.FUNCTION_ID_AIN_0)&(value.getUint8(0) <= Utility.FUNCTION_ID_AIN_5)){
				let sampleMSB = value.getUint8(1) & 0xFF;
				let sampleLSB = value.getUint8(2) & 0xFF;
				let ainValue = (sampleMSB <<8) + sampleLSB;
				let ainPin = value.getUint8(0) - Utility.FUNCTION_ID_AIN_0 ;
				let ain = AinItems.at(ainPin);
				if(ain.getEnabledStatus() === true){
					ain.setStatusValue(ainValue);
				}
				// console.log(JSON.stringify(AinItems.at(ainPin)));

			}else if((value.getUint8(0) >= Utility.FUNCTION_ID_PWM_0)&(value.getUint8(0) <= Utility.FUNCTION_ID_PWM_3)){
				let pwmIndex = value.getUint8(0) - Utility.FUNCTION_ID_PWM_0;
				let pwm = PwmItems.at(pwmIndex);
				if(pwm.getEnabledStatus() === true){
					pwm.setCurrentDutyCycle(value.getUint8(1));
				}
				 // console.log(JSON.stringify(PwmItems.at(pwmIndex)));

			}else if((value.getUint8(0) >= Utility.FUNCTION_ID_SERVO_0)&(value.getUint8(0) <= Utility.FUNCTION_ID_SERVO_3)){
				let servoIndex = value.getUint8(0) - Utility.FUNCTION_ID_SERVO_0;
				let servo = ServoItems.at(servoIndex);
				if(servo.getEnabledStatus() === true){
					servo.setCurrentPercentage(value.getUint8(1));
				}
				 // console.log(JSON.stringify(ServoItems.at(servoIndex)));
			}
		}

		function onDisconnected(){
			shsServer.setConnectionStatus(false);
			console.log('Remote Bluetooth Device disconnected. ');
			alert('Remote Bluetooth Device disconnected');
			showShsView();
		}

		function showShsView(){
			window.app.navigate('app',{
				trigger:true,
				replace:false
			});
		}

		 function readPinStatus(){
			console.log("readPinStatus");

			for(let inputPinIndex = 0;inputPinIndex < Utility.DIN_PIN_NUM; inputPinIndex++){
				if(DinItems.at(inputPinIndex).getEnabledStatus() === true){
					let dinComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_READ,Utility.FUNCTION_ID_DIN_0+inputPinIndex]);
					array.push( dinComValue);
				}
			}

			for(let outputPinIndex = 0;outputPinIndex < Utility.DOUT_PIN_NUM; outputPinIndex ++){
				if(DoutItems.at(outputPinIndex).getDoutEnabledStatus()===true){
					let doutComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_READ,Utility.FUNCTION_ID_DOUT_0+outputPinIndex]);
					array.push(doutComValue);
				}
			}

			for(let analogPinIndex = 0; analogPinIndex < Utility.AIN_PIN_NUM; analogPinIndex++){
				if(AinItems.at(analogPinIndex).getEnabledStatus() === true){
					let ainComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_READ,Utility.FUNCTION_ID_AIN_0+analogPinIndex]);
					array.push(ainComValue);
					}
				}
			

			for(let pwmIndex = 0; pwmIndex < Utility.PWM_CHANNELS; pwmIndex++){
				if(PwmItems.at(pwmIndex).getEnabledStatus() === true){
					let pwmComValue = new Uint8Array([Utility.MANAGE_ID_INTERFACE_READ,Utility.FUNCTION_ID_PWM_0+pwmIndex]);
					array.push(pwmComValue);
				}
			}

			for(let servoIndex = 0; servoIndex < Utility.SERVO_CHANNELS; servoIndex++){
				if(ServoItems.at(servoIndex).getEnabledStatus() === true){
					let servoComValue =new Uint8Array([Utility.MANAGE_ID_INTERFACE_READ,(Utility.FUNCTION_ID_SERVO_0 + servoIndex)]);
					array.push(servoComValue);
				}
			}

			array.forEach(function(comValue){
				sequence = sequence.then(() =>{
					return shsServer.shsSetSendCharacteristic.writeValue(comValue);
				})
				.then(() =>{
					// console.log("read command sent successfully");
				})
				.catch(error =>{ 
					console.log('> Debug: \n' + error);
			 	});
			});
			array =[];

		}

	var Server= Backbone.Model.extend({
		default:function(){
			return{
				isConnected:false,
				gotConfiguration: false
			}
		},
		getDeviceName: function(){
			return this.deviceName;
		},
		connected:function(){
			if(this.get('isConnected') ===true){
				return true;
			}else{
				return false;
			}
		},
		setConnectionStatus:function(status){
			this.set('isConnected',status);

		},
		finishConfiguration:function(){
			if(this.get('gotConfiguration') ===true){
				return true;
			}else{
				return false;
			}
		},
		setConfigurationStatus: function(status){
			this.set('gotConfiguration',status);
		},
		initialize: function(){
			this.deviceName ='';
			
			this.bind("error",function(model,error){
				//we have received an error, log it, alert it.
				alert(error);
			});
		},
		initInterfaceConfiguration: function(){
			sequence = Promise.resolve();
			for(let i = 0;i < Utility.DIN_PIN_NUM;i++){
				let din = DinItems.at(i);
				din.setEnabledStatus(false); //enabled status
				din.setDefaultPullValue(0);  //pull value

				din.setStatusValue(0); //current status value
			}

			for(let j = 0;j < Utility.DOUT_PIN_NUM;j++){
				let dout = DoutItems.at(j);
				dout.setDoutEnabledStatus(false); //enabled status
				dout.setPullValue(0); // pull value
				dout.setDriveValue(0);// drive value
				dout.setDefaultPinValue(0);//default pin value

				dout.setCurrentPinValue(0);//default value
			}
			for(let k = 0;k < Utility.AIN_PIN_NUM;k++){
				let ain = AinItems.at(k);
				ain.setEnabledStatus(false);
				ain.setRangeValue(0); //range value
				ain.setRateValue(0);//rate value

				ain.setStatusValue(0); //current status value
			}
			for(let p = 0; p < Utility.PWM_CHANNELS;p++){
				let pwm = PwmItems.at(p);
				pwm.setEnabledStatus(false);//enabled status
				pwm.setPwmIndex(0);  //pwm index
				pwm.setDriveValue(0); //pwm drive
				pwm.setDefaultDutyCycle(0);//pwm default dutyCycle

				pwm.setCurrentDutyCycle(0); //curent duty cycle
			}
			for(let q=0; q < Utility.SERVO_CHANNELS;q ++){
				let servo = ServoItems.at(q);
				servo.setEnabledStatus(false); //enabled status
				servo.setServoIndex(0);  //servo index
				servo.setDriveValue(0); //servo drive
				servo.setDefaultPercentage(0);//servo default perecentage

				servo.setCurrentPercentage(0); //servo curent percentage
			}

		},
		connectHardware: function(){
			this.initInterfaceConfiguration();
			if(!navigator.bluetooth){
				console.log('Web Bluetooth API is not available.\n' +
					'Please make sure the Web Bluetooth flag is enabled.');
					return;
			}
			console.log('Requesting Bluetooth Device...');
			navigator.bluetooth.requestDevice({
	  		filters: [{
		    	services: [Utility.SHS_SERVICE_UUID]
		  		}]
			})
			.then(
				device => {
					this.bleDevice= device;
					this.bleDevice.addEventListener('gattserverdisconnected',onDisconnected);
					this.deviceName =device.name;
					console.log('> Name:             ' + device.name);
				    console.log('> Allowed Services: ' + device.uuids.join('\n' + ' '.repeat(20)));
				    console.log('Connecting to GATT Server...');
					
					return device.gatt.connect();
				})
			.then(server => { 
				   this.bleServer = server;
				  // Note that we could also get all services that match a specific UUID by
				  // passing it to getPrimaryServices().
				  	console.log('Getting Services...');
				  	return server.getPrimaryService(Utility.SHS_SERVICE_UUID); 
				  })
			 .then(service => {
				console.log('Got shsService');
			    this.bleService =service;
			 	return this.bleService.getCharacteristic(Utility.SHS_GET_RECEIVE_UUID);
			 })
			 .then(characteristic =>{
			 	console.log('Got shs receive characteristic');
				this.shsGetReceiveCharacteristc = characteristic;
				return characteristic.startNotifications();
			 })
			.then(() =>{
			 	console.log('Notification enabled');
			 	this.shsGetReceiveCharacteristc.addEventListener('characteristicvaluechanged', handleShsResponse);
			 })                                             
			.then(() =>{
				  return this.bleService.getCharacteristic(Utility.SHS_SET_SEND_UUID);
			})
			.then( sendCharacteristic =>{
					console.log('Got shs send characteristic');
					this.setConnectionStatus(true);
					this.shsSetSendCharacteristic = sendCharacteristic;
					let writeCom = new Uint8Array([Utility.MANAGE_ID_DEVICE_GET_INTERFACES]); 
					return sendCharacteristic.writeValue(writeCom);
				})
			.then(() =>{
					console.log("write successfully");
				})
			.catch(error =>{ 
					console.log('> Debug: \n' + error);
				 });
		},
		updateOutputPinStatus:function(pinIndex){
			let dout = DoutItems.at(pinIndex);
			if(dout.getDoutEnabledStatus()=== true){
				let value = new Uint8Array([Utility.FUNCTION_ID_DOUT_0 + pinIndex,dout.getCurrentPinValue()]);
				// console.log(value.join());
				return this.shsSetSendCharacteristic.writeValue(value)
				.then(()=>{
					// console.log("dout current pin update successfully");
				})
				.catch(error => { 
					console.log('> connect ' + error);
				 });
			}
		},
		updatePwmDutyCycle:function(pwmChannel){
			let pwm = PwmItems.at(pwmChannel);
			if(pwm.getEnabledStatus() === true){
				let value = new Uint8Array([Utility.FUNCTION_ID_PWM_0 + pwmChannel,pwm.getCurrentDutyCycle()]);
				array.push(value);
				// console.log(value.join());
				array.forEach(function(slideItem){
					sequence = sequence.then(() =>{
					return shsServer.shsSetSendCharacteristic.writeValue(slideItem);
					})
					.then(()=>{
						// console.log("pwm current duty cycle update successfully");
						array =[];
					})
					.catch(error => { 
						console.log('> connect ' + error);
					 });
			 	});
			}
		},
		updateServoPercentage: function(servoChannel){
			let servo = ServoItems.at(servoChannel);
			if(servo.getEnabledStatus() === true){
				let value = new Uint8Array([Utility.FUNCTION_ID_SERVO_0 + servoChannel,servo.getCurrentPercentage()]);
				array.push(value);
				array.forEach(function(slideItem){
					sequence = sequence.then(() =>{
					return shsServer.shsSetSendCharacteristic.writeValue(slideItem);
					})
					.then(()=>{
						// console.log("servo current percentage update successfully");
						array =[];
					})
					.catch(error => { 
						console.log('> connect ' + error);
					 });
			 	});
			}
		},
		updateConfiguration: function(updateCommand){
			console.log('updateConfiguration');
			let configCommand = [];
			if(updateCommand[0] === Utility.MANAGE_ID_INTERFACE_ADD){
				updatedConfig = updateCommand.slice(2,updateCommand.length);
			}
			functionID = updateCommand[1];
			// console.log('functionID:'+ functionID);
			configCommand.push(new Uint8Array([Utility.MANAGE_ID_DEVICE_UNLOCKED]));
			configCommand.push(updateCommand);
			configCommand.push(new Uint8Array([Utility.MANAGE_ID_DEVICE_STORE_CONFIG]));
			let isLocked = localStorage.getItem('deviceLocked');
			// console.log('lock: '+ typeof(isLocked)+',value: '+isLocked);
			if(localStorage.getItem('deviceLocked')==='true'){
				configCommand.push(new Uint8Array([Utility.MANAGE_ID_DEVICE_LOCK]));
			}
			let sequence = Promise.resolve();
			//let count = parseInt(0);
			configCommand.forEach(function(comItem){
				sequence = sequence.then(() =>{
					return shsServer.shsSetSendCharacteristic.writeValue(comItem);
				})
				.then(() =>{
					// count ++;
					// console.log("update command successfully,count: " + count);
				})
				.catch(error =>{ 
					console.log('> Debug: \n' + error);
			 	});
			});
			
		},
		
		onError: function(errMessage){
			alert(errMessage);
		},
		getDeviceConfiguration: function(){
			console.log("getDeviceConfiguration");
			let command =new Uint8Array([Utility.MANAGE_ID_DEVICE_GET_INTERFACES]);
			return this.shsSetSendCharacteristic.writeValue(command)
			.then(()=>{
				console.log("write successfully");
			})
			.catch(error => { 
				console.log('> connect ' + error);
			 });
		},
		disconnectHardware: function(){
			if(!this.bleDevice){
				console.log("No Bluetooth Device connected...");
				return;
			}
			console.log("Disconnecting from Bluttooth Device...");
			if(this.bleDevice.gatt.connected){
				this.bleDevice.gatt.disconnect();
				this.setConnectionStatus(false);
				console.log('>Bluetooth Device connected: '+ this.bleDevice.gatt.connected);
			}else{
				console.log('> Bluetooth Device is already disconnected');
			}
		}

	});

	shsServer = new Server();


return  shsServer;

});
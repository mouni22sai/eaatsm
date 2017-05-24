var adb = require('adbkit');
var Promise = require('bluebird');
var client = adb.createClient();
var cmd = require('node-cmd');
var shell = require('shelljs');
let $ = require('jquery');
var ndevices;
var i;
var deviceid;
var btsrnum;
var inpsrnum;

$(document).ready(function(){
	client.listDevices(function(err,devices){
      $('#num').text(devices.length.toString());
	});
	client.trackDevices(function(err,tracker){
      tracker.on('add',function(device){
      	console.log(device);
         $('#devices').append('<li id='+device.id.toString()+'>'+device.id.toString()+'<input class="inp'+device.id.toString()+'" value="">'+'<button class="btn '+device.id.toString()+'">Build</button'+'</li>');
         client.listDevices(function(err,devices){
           $('#num').text(devices.length.toString());
         });
         $('.btn').click(function(){
            btnsrnum = $(this).attr('class').split(' ')[1];
            console.log(btnsrnum);
            shell.cd($('.inp'+btnsrnum.toString()).val().toString());
            cmd.get('adb devices',function(err,data){
              if(err){
                throw err;
              }else{
              	console.log(data.toString());
              	cmd.get('adb -s '+btnsrnum.toString()+' reboot bootloader',function(err,data){
                  if(err){
                    throw err;
                  }else{
										$('#devices').append('<li>Done Entering into fastboot mode......</li>');
									 cmd.get('sudo $(which fastboot) flash boot boot.img',function(err,data){
										 if(err){
											 throw err;
										 }else{
											$('#devices').append('<li>Done flashing boot.img.......</li>');
											cmd.get('sudo $(which fastboot) flash modem NON-HLOS.bin',function(err,data){
												if(err){
														throw err;
												}else{
													$('#devices').append('<li>Done flashing NON-HLOS.bin</li>');
													cmd.get('sudo $(which fastboot) flash userdata userdata.img',function(err,data){
															if(err){
																throw err;
															}else{
																$('#devices').append('<li>Done flashing userdata.img.......</li>');
																cmd.get('sudo $(which fastboot) flash system system.img',function(err,data){
																	if(err){
																		throw err;
																	}else{
																		$('#devices').append('<li>Done flashing system.img.......</li>');
																		cmd.get('sudo $(which fastboot) flash persist persist.img',function(err,data){
																			if(err){
																				throw err;
																			}else{
																				$('#devices').append('<li>Done flashing persist.img.......</li>');
																				cmd.get('sudo $(which fastboot) reboot',function(err,data){
																					if(err){
																									throw err;
																					}else{
																						console.log('Build Completed ');
																						$('#devices').append('<li>Build completed for'+btnsrnum.toString()+'</li>');
																					}
																				});
																			}
																		});
																	}
																});
															}
													});
												}
											});
										 }
									 });
                  }
              	});
              }
            });
         });
      });
      tracker.on('remove',function(device){
      	$('#'+device.id.toString()).remove();
         client.listDevices(function(err,devices){
           $('#num').text(devices.length.toString());
         });
      });
	});

});

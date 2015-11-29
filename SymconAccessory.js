'use strict';

var rpc = require("node-json-rpc");
var async = require("async");

function SymconAccessory(log, rpcClientOptions, hapService, hapCharacteristic, instanceId, displayName, instance, instanceConfig, services) {
	this.log = log;
	this.rpcClientOptions = rpcClientOptions;
	this.hapService = hapService;
	this.hapCharacteristic = hapCharacteristic;
	this.instanceId = instanceId;
	this.name = displayName;
	this.uuid_base = instanceId.toString();
	this.instance = instance;
	this.instanceConfig = instanceConfig;
	this.services = services;
}

module.exports = SymconAccessory;


SymconAccessory.prototype = {
	
	getHapService : function(serviceType, instanceId, instanceConfig) {
		
		var service;
		
		this.writeLogEntry("loading service " + instanceId + "...");
				
		switch (serviceType) {
			case "Fan":
				service = new this.hapService.Fan(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig, 
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.RotationDirection, 'RotationDirection', 'Enum', 0, 2, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.RotationSpeed, 'RotationSpeed', 'Percent', 0, -1, true);
				
				break;
			case "GarageDoorOpener":
				service = new this.hapService.GarageDoorOpener(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentDoorState, 'CurrentDoorState', 'Enum', 0, 5, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetDoorState, 'TargetDoorState', 'Enum', 0, 2, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.ObstructionDetected, 'ObstructionDetected', 'Boolean', false, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockCurrentState, 'LockCurrentState', 'Enum', 0, 4, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockTargetState, 'LockTargetState', 'Enum', 0, 2, true);
				
				break;
			case "HumiditySensor":
				service = new this.hapService.HumiditySensor(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentRelativeHumidity, 'CurrentRelativeHumidity', 'Percent', 0, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusActive, 'StatusActive', 'Boolean', true, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusFault, 'StatusFault', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusLowBattery, 'StatusLowBattery', 'Enum', 0, 2, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusTampered, 'StatusTampered', 'Enum', 0, 2, true);
				break;
			case "LightBulb":
				service = new this.hapService.Lightbulb(instanceConfig["InstanceName"], instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.Brightness, 'Brightness', 'Percent', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.Hue, 'Hue', 'Float', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.Saturation, 'Saturation', 'Percent', 0, -1, true);
				
				break;
			case "LightSensor":
				service = new this.hapService.LightSensor(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentAmbientLightLevel, 'CurrentAmbientLightLevel', 'Float', 0, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusActive, 'StatusActive', 'Boolean', true, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusFault, 'StatusFault', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusLowBattery, 'StatusLowBattery', 'Enum', 0, 2, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusTampered, 'StatusTampered', 'Enum', 0, 2, true);
				break;
			case "LockMechanism":
				service = new this.hapService.LockMechanism(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockCurrentState, 'LockCurrentState', 'Enum', 0, 4, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockTargetState, 'LockTargetState', 'Enum', 0, 2, false);
				
				break;
			case "Outlet":
				service = new this.hapService.Outlet(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.OutletInUse, 'OutletInUse', 'Boolean', false, -1, false);
					
				break;
			case "Switch":
				service = new this.hapService.Switch(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				
				break;
			case "TemperatureSensor":
				service = new this.hapService.TemperatureSensor(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentTemperature, 'CurrentTemperature', 'Float', 0, -1, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusActive, 'StatusActive', 'Boolean', true, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusFault, 'StatusFault', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusLowBattery, 'StatusLowBattery', 'Enum', 0, 2, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.StatusTampered, 'StatusTampered', 'Enum', 0, 2, true);
				
				break;
			case "Thermostat":
				service = new this.hapService.Thermostat(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentHeatingCoolingState, 'CurrentHeatingCoolingState', 'Enum', 0, 3, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetHeatingCoolingState, 'TargetHeatingCoolingState', 'Enum', 0, 4, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentTemperature, 'CurrentTemperature', 'Float', 0, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetTemperature, 'TargetTemperature', 'Float', 0, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TemperatureDisplayUnits, 'TemperatureDisplayUnits', 'Enum', 0, 2, false);
						
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentRelativeHumidity, 'CurrentRelativeHumidity', 'Percent', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetRelativeHumidity, 'TargetRelativeHumidity', 'Percent', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CoolingThresholdTemperature, 'CoolingThresholdTemperature', 'Float', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.HeatingThresholdTemperature, 'HeatingThresholdTemperature', 'Float', 0, -1, true);
				
				break;
			case "WindowCovering":
				service = new this.hapService.WindowCovering(this.name, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentPosition, 'CurrentPosition', 'Percent', 0, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetPosition, 'TargetPosition', 'Percent', 0, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.PositionState, 'PositionState', 'Enum', 2, 3, false);
				
				// optional
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.HoldPosition, 'HoldPosition', 'Boolean', false, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetHorizontalTiltAngle, 'TargetHorizontalTiltAngle', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.TargetVerticalTiltAngle, 'TargetVerticalTiltAngle', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentHorizontalTiltAngle, 'CurrentHorizontalTiltAngle', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.CurrentVerticalTiltAngle, 'CurrentVerticalTiltAngle', 'Integer', 0, -1, true);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.ObstructionDetected, 'ObstructionDetected', 'Boolean', false, -1, true);
				
				break;
		}
		/*
			NOT IMPLEMENTED:
			- Window
			- MotionSensor
			- ContactSensor
			- AirQualitySensor
			- BatteryService 
			- BridgingState 
			- CarbonDioxideSensor 
			- CarbonMonoxideSensor 
			- Door
			- LeakSensor 
			- LockManagement 
			- OccupancySensor
			- SecuritySystem 
			- SmokeSensor 
			- StatefulProgrammableSwitch 
			- StatelessProgrammableSwitch
		*/
		
		return service;
	},

	getServices : function() {
		
		var informationService = new this.hapService.AccessoryInformation();
		
		informationService
			.setCharacteristic(this.hapCharacteristic.Name, this.displayName)
			.setCharacteristic(this.hapCharacteristic.Manufacturer, "Symcon")
			.setCharacteristic(this.hapCharacteristic.Model, this.instance.ModuleInfo.ModuleName)
			.setCharacteristic(this.hapCharacteristic.SerialNumber, "ID" + this.instanceId);
			
		var accessoryServices = [];		
		accessoryServices.push(informationService);
		
		Object.keys(this.services).forEach(function(serviceType) {
			this.writeLogEntry("loading " + serviceType + " services...");
			
			Object.keys(this.services[serviceType]).forEach(function(instanceId) {
				var service = this.getHapService(serviceType, parseInt(instanceId), this.services[serviceType][instanceId]);
				accessoryServices.push(service);
			}, this);
		}, this);
		
		this.writeLogEntry("services loaded");
		
		return accessoryServices;
	},
	
	bindSpecificCharacteristic: function(serviceType, service, instanceId, instanceConfig, 
		hapCharacteristic, hapCharacteristicName, valueType, defaultValue, enumValueCount, isOptional) {
		
		// check if instance is configured with the (optional) characteristic
		if (isOptional && (instanceConfig[hapCharacteristicName + "VariableId"] == null || instanceConfig[hapCharacteristicName + "VariableId"] <= 0))
			return;
			
		this.writeLogEntry("bind '" + hapCharacteristicName + "' characteristic");
		service.getCharacteristic(hapCharacteristic)
		.on('set', function(value, callback, context) {
			this.setValue(serviceType, instanceId, hapCharacteristicName, valueType, value, callback, context);
		}.bind(this))
		.on('get', function(callback, context) {
			this.getValue(serviceType, instanceId, hapCharacteristicName, valueType, defaultValue, enumValueCount, callback, context);
		}.bind(this));
	},
		
	setValue : function(serviceType, instanceId, characteristic, valueType, value, callback, context) {
		var params = [instanceId, characteristic, valueType, value];
		this.callRpcMethod("HKS" + serviceType + "_SetValue", params, callback);
	},
	
	getValue : function(serviceType, instanceId, characteristic, valueType, defaultValue, enumValueCount, callback, context) {
		var params = [instanceId, characteristic, valueType, defaultValue, enumValueCount];
		this.callRpcMethod("HKS" + serviceType + "_GetValue", params, callback);
	},
	
	callRpcMethod : function(method, params, callback) {
		this.writeLogEntry("Calling JSON-RPC method " + method + " with params " + JSON.stringify(params));

		var that = this;
		var client = new rpc.Client(this.rpcClientOptions);
		client.call(
			{"jsonrpc" : "2.0", "method" : method, "params" : params, "id" : 0},
			function (err, res) {
				if (err) {
					that.writeLogEntry("[" + method + "] Error: " + JSON.stringify(err));
					if (callback) callback(res);
					return;
				} else if (res.error) {
					that.writeLogEntry("[" + method + "] Error: " + JSON.stringify(res.error));
					if (callback) callback(res);
					return;
				}
				
				that.writeLogEntry("Called JSON-RPC method '" + method + "' with response: " + JSON.stringify(res.result));
				if (callback) {
					that.writeLogEntry('callback...');
					callback(res.result);
				}
			}
		);
	},
	
	writeLogEntry: function(message) {
		this.log(this.instanceId + ': ' + message);
	}
};
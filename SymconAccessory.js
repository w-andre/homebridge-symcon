'use strict';

var rpc = require("node-json-rpc");
var async = require("async");

function SymconAccessory(log, rpcClientOptions, hapService, hapCharacteristic, instanceId, displayName, hierarchyPath, instance, instanceConfig, services) {
	this.log = log;
	this.rpcClientOptions = rpcClientOptions;
	this.hapService = hapService;
	this.hapCharacteristic = hapCharacteristic;
	this.instanceId = instanceId;
	this.name = displayName;
	this.hierarchyPath = hierarchyPath;
	this.uuid_base = instanceId.toString();
	this.instance = instance;
	this.instanceConfig = instanceConfig;
	this.services = services;
}

module.exports = SymconAccessory;


SymconAccessory.prototype = {
	
	getHapService : function(serviceType, instanceId, instanceConfig) {
		var service;
		
		var serviceName = instanceConfig["InstanceName"].length < 65 
			? instanceConfig["InstanceName"] 
			: instanceConfig["InstanceName"].substring(0, 64);
			
		this.writeLogEntry("loading service '" + serviceName + "' (" + instanceId + ")...");
				
		switch (serviceType) {
			case "Fan":
				service = new this.hapService.Fan(serviceName, instanceId);
				
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
				service = new this.hapService.GarageDoorOpener(serviceName, instanceId);
				
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
				service = new this.hapService.HumiditySensor(serviceName, instanceId);
				
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
				service = new this.hapService.Lightbulb(serviceName, instanceId);
				
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
				service = new this.hapService.LightSensor(serviceName, instanceId);
				
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
				service = new this.hapService.LockMechanism(serviceName, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockCurrentState, 'LockCurrentState', 'Enum', 0, 4, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.LockTargetState, 'LockTargetState', 'Enum', 0, 2, false);
				
				break;
			case "Outlet":
				service = new this.hapService.Outlet(serviceName, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.OutletInUse, 'OutletInUse', 'Boolean', false, -1, false);
					
				break;
			case "Switch":
				service = new this.hapService.Switch(serviceName, instanceId);
				
				// required
				this.bindSpecificCharacteristic(serviceType, service, instanceId, instanceConfig,
					this.hapCharacteristic.On, 'On', 'Boolean', false, -1, false);
				
				break;
			case "TemperatureSensor":
				service = new this.hapService.TemperatureSensor(serviceName, instanceId);
				
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
				service = new this.hapService.Thermostat(serviceName, instanceId);
				
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
				service = new this.hapService.WindowCovering(serviceName, instanceId);
				
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
	
	identify: function(callback) {
		this.writeLogEntry("Identify requested!");
		this.writeLogEntry("Hierarchy path: " + this.hierarchyPath);
	},

	getServices : function() {
		
		var informationService = new this.hapService.AccessoryInformation();
		
		informationService
			.setCharacteristic(this.hapCharacteristic.Name, this.name.length < 65 ? this.name : this.name.substring(0, 64))
			.setCharacteristic(this.hapCharacteristic.Manufacturer, "Symcon")
			.setCharacteristic(this.hapCharacteristic.Model, this.hierarchyPath.length < 65 ? this.hierarchyPath : this.hierarchyPath.substring(0, 64))
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
		this.callRpcMethod("HKS" + serviceType + "_SetValue", params, valueType, callback);
	},
	
	getValue : function(serviceType, instanceId, characteristic, valueType, defaultValue, enumValueCount, callback, context) {
		var params = [instanceId, characteristic, valueType, defaultValue, enumValueCount];
		this.callRpcMethod("HKS" + serviceType + "_GetValue", params, valueType, callback);
	},
	
	callRpcMethod : function(method, params, valueType, callback) {
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
				
				var result;
				switch (valueType) {
					case 'Integer':
					case 'Enum':
					case 'Percent':
						result = parseInt(res.result);
						break;
					case 'Float':
						result = parseFloat(res.result);
						break;
					default:
						result = res.result;
						break;
				}
				
				that.writeLogEntry("Called JSON-RPC method '" + method + "' with response: " + JSON.stringify(result));
				if (callback) {
					that.writeLogEntry('callback...');
					callback(err, result);
				}
			}
		);
	},
	
	writeLogEntry: function(message) {
		this.log(this.instanceId + ': ' + message);
	}
};
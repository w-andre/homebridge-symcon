'use strict';

var rpc = require("node-json-rpc");
var async = require("async");
var SymconAccessory = require("./SymconAccessory.js");

var Hap; // HAP-NodeJS reference

function registry(homebridge) {
	Hap = homebridge.hap;
	homebridge.registerPlatform("homebridge-symcon", "Symcon", SymconPlatform);
}

module.exports = registry;


function SymconPlatform(log, options) {
	this.log = log;
	this.options = options;
	this.client = new rpc.Client(options.rpcClientOptions);
	this.hap = Hap;
}


SymconPlatform.prototype = {
	
	callRpcMethod : function(method, params, callback) {
		var that = this;
		this.client.call(
			{"jsonrpc" : "2.0", "method" : method, "params" : params, "id" : 0},
			function (err, res) {
				if (err) {
					that.log("[method: " + method + ", params: " + JSON.stringify(params) + "] Error: " + JSON.stringify(err));
					if (callback) callback(res);
					return;
				} else if (res.error) {
					that.log("[method: " + method + ", params: " + JSON.stringify(params) + "] Error: " + JSON.stringify(res.error));
					if (callback) callback(res);
					return;
				} else {
					//that.log("Result: " + JSON.stringify(res));
				}
				if (callback) callback(err, res);
			}
		);
	},
	
	accessories : function (callback) {
		this.log("Fetching Symcon instances...");

		var that = this;
		var foundAccessories = [];
		
		async.waterfall(
			[
				// get all HomeKitAccessory instances
				function (waterfallCallback) { that.callRpcMethod("IPS_GetInstanceListByModuleID", ["{E75002FE-58B7-4711-9DE6-BE1D3F089A32}"], waterfallCallback); },
				function (res, waterfallCallback) {
					async.eachSeries(
						res.result,
						function (instanceId, eachCallback) {
							async.series(
								[
									function (parallelCallback) { that.callRpcMethod("IPS_GetName", [instanceId], parallelCallback); },
									function (parallelCallback) { that.callRpcMethod("IPS_GetInstance", [instanceId], parallelCallback); },
									function (parallelCallback) { that.callRpcMethod("IPS_GetConfiguration", [instanceId], parallelCallback); },
									function (parallelCallback) { that.callRpcMethod("HKA_GetServicesWithConfiguration", [instanceId], parallelCallback); }
								],
								function (err, results) {
									var displayName = results[0].result;
									var instance = typeof results[1].result === 'object' 
										? results[1].result
										: JSON.parse(results[1].result);
										
									var instanceConfig = typeof results[2].result === 'object' 
										? results[2].result
										: JSON.parse(results[2].result);
										
									var services = typeof results[3].result === 'object' 
										? results[3].result
										: JSON.parse(results[3].result);
									
									var accessory = new SymconAccessory(
										that.log, 
										that.options.rpcClientOptions, 
										that.hap.Service, 
										that.hap.Characteristic, 
										instanceId, 
										displayName, 
										instance, 
										instanceConfig,
										services);
									
									foundAccessories.push(accessory);
									
									eachCallback();
								}
							);
						},
						function (err) {
							waterfallCallback(null);
						}
					);
				}
			],
			function (err, result) {
				that.log(foundAccessories.length + " instances found");
				callback(foundAccessories);
			}
		);
	}
}
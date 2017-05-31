/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "5b26512a2b39ecb6fefa"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\n__webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"../../common/js/Utilities.js\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n__webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"../../common/js/commen-title.js\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n$(function () {\n\tvar sync = parent.window.syncActions && parent.window.syncActions.isSync;\n\n\tvar resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';\n\tvar video = document.querySelector('#video1');\n\tvideo.width = 19.2 * base;\n\tvideo.height = 10.8 * base;\n\twindow.addEventListener(resizeEvt, function () {\n\t\tvideo.width = 19.2 * base;\n\t\tvideo.height = 10.8 * base;\n\t}, false);\n\n\tvar sources = configData.source;\n\tvar mp4 = sources[0].video;\n\tvar autoPlay = sources[0].autoplay;\n\tvideo.src = mp4;\n\n\tvar play = false;\n\tvar btnClick = true;\n\tvar getQueryString = function getQueryString(name) {\n\t\tvar reg = new RegExp(\"(^|&)\" + name + \"=([^&]*)(&|$)\");\n\t\tvar r = window.location.search.substr(1).match(reg);\n\t\tif (r != null) return unescape(r[2]);return null;\n\t};\n\n\tif (sync) {\n\t\tvar currentPage = parent.window.communicationWithAc.currentPage;\n\t\tvar userType = parent.window.userType;\n\t\tif (autoPlay === 'yes') {\n\t\t\tif (currentPage === configData.page) {\n\t\t\t\t$(video).attr('autoplay', 'autoplay');\n\t\t\t\tplay = true;\n\t\t\t}\n\t\t} else {\n\t\t\tif (userType === 'tea') {\n\t\t\t\t$('.btn-play').show();\n\t\t\t}\n\t\t}\n\n\t\tvar TG = configData.TG;\n\t\tif (userType === 'tea' && TG && (TG[0].title.length > 0 || TG[0].content.length > 0)) {\n\t\t\t$('.tg').show();\n\t\t}\n\t} else {\n\t\tvar role = getQueryString('role');\n\t\tvar _TG = configData.TG;\n\t\tif (role && role === '1' && _TG && (_TG[0].title.length > 0 || _TG[0].content.length > 0)) {\n\t\t\t$('.tg').show();\n\t\t}\n\t\tif (autoPlay === 'yes') {\n\t\t\t$(video).attr('autoplay', 'autoplay');\n\t\t\tplay = true;\n\t\t} else {\n\t\t\t$('.btn-play').show();\n\t\t}\n\t}\n\n\t$('.btn-play').on('click', function (e) {\n\t\tif (btnClick) {\n\t\t\tbtnClick = false;\n\n\t\t\tif (!sync) {\n\t\t\t\t$(this).trigger('syncBtnClick');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tSDK.bindSyncEvt({\n\t\t\t\tindex: $(e.currentTarget).data('syncactions'),\n\t\t\t\teventType: 'click',\n\t\t\t\tmethod: 'event',\n\t\t\t\tsyncName: 'syncBtnClick'\n\t\t\t});\n\t\t}\n\t});\n\n\t$('.btn-play').on('syncBtnClick', function () {\n\t\tvar btnImg = $(this).find('img');\n\t\tif (play) {\n\t\t\tvideo.pause();\n\t\t\tbtnImg.attr('src', 'image/pause.png');\n\t\t\tplay = false;\n\t\t} else {\n\t\t\tvideo.play();\n\t\t\tbtnImg.attr('src', 'image/play.png');\n\t\t\tplay = true;\n\t\t}\n\t\tSDK.setEventLock();\n\t\tbtnClick = true;\n\t});\n\n\tvar btnMouseOver = true;\n\t$('.btn-play').on('mouseenter', function (e) {\n\t\tif (btnMouseOver) {\n\t\t\tbtnMouseOver = false;\n\t\t\tif (!sync) {\n\t\t\t\t$(this).trigger('syncBtnOver');\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tSDK.bindSyncEvt({\n\t\t\t\tindex: $(e.currentTarget).data('syncactions'),\n\t\t\t\teventType: 'mouseover',\n\t\t\t\tmethod: 'event',\n\t\t\t\tsyncName: 'syncBtnOver'\n\t\t\t});\n\t\t}\n\t});\n\t$('.btn-play').on('syncBtnOver', function (e) {\n\t\t$(this).addClass('bigger');\n\n\t\tSDK.setEventLock();\n\t\tbtnMouseOver = true;\n\t});\n\n\tvar btnMouseOut = true;\n\t$('.btn-play').on('mouseleave', function (e) {\n\t\tif (btnMouseOut) {\n\t\t\tbtnMouseOut = false;\n\t\t\tif (!sync) {\n\t\t\t\t$(this).trigger('syncBtnOut');\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tSDK.bindSyncEvt({\n\t\t\t\tindex: $(e.currentTarget).data('syncactions'),\n\t\t\t\teventType: 'mouseout',\n\t\t\t\tmethod: 'event',\n\t\t\t\tsyncName: 'syncBtnOut'\n\t\t\t});\n\t\t}\n\t});\n\n\t$('.btn-play').on('syncBtnOut', function (e) {\n\t\t$(this).removeClass('bigger');\n\n\t\tSDK.setEventLock();\n\t\tbtnMouseOut = true;\n\t});\n\n\tvideo.onended = function () {\n\t\tif ($('.btn-play').length > 0) {\n\t\t\t$('.btn-play img').attr('src', 'image/pause.png');\n\t\t\tplay = false;\n\t\t}\n\t};\n\n\tvar tg = configData.TG;\n\tvar tgContentStr = '';\n\tif (tg) {\n\t\ttg.map(function (item, index) {\n\t\t\ttgContentStr += '\\n\\t\\t\\t<li>\\n\\t\\t\\t    <div class=\"tg-list-tit clearfix\">\\n\\t\\t\\t    <span class=\"fl tg-list-num\">' + (index + 1) + '</span>\\n\\t\\t\\t    <h3 class=\"fl\">' + item.title + '</h3>\\n\\t\\t\\t    </div>\\n\\t\\t\\t    <p class=\"tg-list-des\">' + item.content + '</p>      \\n\\t\\t    </li>\\n\\t\\t\\t';\n\t\t});\n\t\t$(tgContentStr).appendTo('.tg-content ul');\n\t}\n\n\tvar tgMoved = false;\n\t$('.tg').on('click', function () {\n\t\tif (!tgMoved) {\n\t\t\ttgMoved = true;\n\t\t\t$('.tg-content,.tg').addClass('active');\n\t\t} else {\n\t\t\ttgMoved = false;\n\t\t\t$('.tg-content,.tg').removeClass('active');\n\t\t}\n\t});\n});//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdmlkZW8tcGxheS9qcy9pbmRleC5qcz85NTVkIl0sIm5hbWVzIjpbIiQiLCJzeW5jIiwicGFyZW50Iiwid2luZG93Iiwic3luY0FjdGlvbnMiLCJpc1N5bmMiLCJyZXNpemVFdnQiLCJ2aWRlbyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIndpZHRoIiwiYmFzZSIsImhlaWdodCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzb3VyY2VzIiwiY29uZmlnRGF0YSIsInNvdXJjZSIsIm1wNCIsImF1dG9QbGF5IiwiYXV0b3BsYXkiLCJzcmMiLCJwbGF5IiwiYnRuQ2xpY2siLCJnZXRRdWVyeVN0cmluZyIsIm5hbWUiLCJyZWciLCJSZWdFeHAiLCJyIiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJtYXRjaCIsInVuZXNjYXBlIiwiY3VycmVudFBhZ2UiLCJjb21tdW5pY2F0aW9uV2l0aEFjIiwidXNlclR5cGUiLCJwYWdlIiwiYXR0ciIsInNob3ciLCJURyIsInRpdGxlIiwibGVuZ3RoIiwiY29udGVudCIsInJvbGUiLCJvbiIsImUiLCJ0cmlnZ2VyIiwiU0RLIiwiYmluZFN5bmNFdnQiLCJpbmRleCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhIiwiZXZlbnRUeXBlIiwibWV0aG9kIiwic3luY05hbWUiLCJidG5JbWciLCJmaW5kIiwicGF1c2UiLCJzZXRFdmVudExvY2siLCJidG5Nb3VzZU92ZXIiLCJhZGRDbGFzcyIsImJ0bk1vdXNlT3V0IiwicmVtb3ZlQ2xhc3MiLCJvbmVuZGVkIiwidGciLCJ0Z0NvbnRlbnRTdHIiLCJtYXAiLCJpdGVtIiwiYXBwZW5kVG8iLCJ0Z01vdmVkIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7QUFDQTs7QUFFQUEsRUFBRSxZQUFVO0FBQ1gsS0FBSUMsT0FBT0MsT0FBT0MsTUFBUCxDQUFjQyxXQUFkLElBQTZCRixPQUFPQyxNQUFQLENBQWNDLFdBQWQsQ0FBMEJDLE1BQWxFOztBQUdBLEtBQUlDLFlBQVksdUJBQXVCSCxNQUF2QixHQUFnQyxtQkFBaEMsR0FBc0QsUUFBdEU7QUFDQSxLQUFNSSxRQUFRQyxTQUFTQyxhQUFULENBQXVCLFNBQXZCLENBQWQ7QUFDQUYsT0FBTUcsS0FBTixHQUFjLE9BQUtDLElBQW5CO0FBQ0dKLE9BQU1LLE1BQU4sR0FBZSxPQUFLRCxJQUFwQjtBQUNBUixRQUFPVSxnQkFBUCxDQUF3QlAsU0FBeEIsRUFBa0MsWUFBVTtBQUMzQ0MsUUFBTUcsS0FBTixHQUFjLE9BQUtDLElBQW5CO0FBQ0FKLFFBQU1LLE1BQU4sR0FBZSxPQUFLRCxJQUFwQjtBQUNBLEVBSEQsRUFHRSxLQUhGOztBQVFBLEtBQU1HLFVBQVVDLFdBQVdDLE1BQTNCO0FBQ0gsS0FBTUMsTUFBTUgsUUFBUSxDQUFSLEVBQVdQLEtBQXZCO0FBQ0EsS0FBTVcsV0FBV0osUUFBUSxDQUFSLEVBQVdLLFFBQTVCO0FBQ0FaLE9BQU1hLEdBQU4sR0FBWUgsR0FBWjs7QUFLQSxLQUFJSSxPQUFPLEtBQVg7QUFDQSxLQUFJQyxXQUFXLElBQWY7QUFDQSxLQUFJQyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQVNDLElBQVQsRUFBYztBQUNqQyxNQUFJQyxNQUFNLElBQUlDLE1BQUosQ0FBVyxVQUFTRixJQUFULEdBQWUsZUFBMUIsQ0FBVjtBQUNNLE1BQUlHLElBQUl4QixPQUFPeUIsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJDLE1BQXZCLENBQThCLENBQTlCLEVBQWlDQyxLQUFqQyxDQUF1Q04sR0FBdkMsQ0FBUjtBQUNBLE1BQUdFLEtBQUcsSUFBTixFQUFXLE9BQVFLLFNBQVNMLEVBQUUsQ0FBRixDQUFULENBQVIsQ0FBd0IsT0FBTyxJQUFQO0FBQzFDLEVBSkQ7O0FBTUEsS0FBRzFCLElBQUgsRUFBUTtBQUNQLE1BQUlnQyxjQUFjL0IsT0FBT0MsTUFBUCxDQUFjK0IsbUJBQWQsQ0FBa0NELFdBQXBEO0FBQ0EsTUFBSUUsV0FBV2pDLE9BQU9DLE1BQVAsQ0FBY2dDLFFBQTdCO0FBQ0EsTUFBR2pCLGFBQWEsS0FBaEIsRUFBc0I7QUFDckIsT0FBR2UsZ0JBQWdCbEIsV0FBV3FCLElBQTlCLEVBQW1DO0FBQ2xDcEMsTUFBRU8sS0FBRixFQUFTOEIsSUFBVCxDQUFjLFVBQWQsRUFBeUIsVUFBekI7QUFDQWhCLFdBQU8sSUFBUDtBQUNBO0FBQ0QsR0FMRCxNQUtLO0FBQ0osT0FBR2MsYUFBYSxLQUFoQixFQUFzQjtBQUNyQm5DLE1BQUUsV0FBRixFQUFlc0MsSUFBZjtBQUNBO0FBQ0Q7O0FBRUQsTUFBSUMsS0FBS3hCLFdBQVd3QixFQUFwQjtBQUNBLE1BQUdKLGFBQWEsS0FBYixJQUFzQkksRUFBdEIsS0FBNkJBLEdBQUcsQ0FBSCxFQUFNQyxLQUFOLENBQVlDLE1BQVosR0FBcUIsQ0FBckIsSUFBMEJGLEdBQUcsQ0FBSCxFQUFNRyxPQUFOLENBQWNELE1BQWQsR0FBdUIsQ0FBOUUsQ0FBSCxFQUFvRjtBQUNuRnpDLEtBQUUsS0FBRixFQUFTc0MsSUFBVDtBQUNBO0FBQ0QsRUFsQkQsTUFrQks7QUFFSixNQUFJSyxPQUFPcEIsZUFBZSxNQUFmLENBQVg7QUFDQSxNQUFJZ0IsTUFBS3hCLFdBQVd3QixFQUFwQjtBQUNBLE1BQUlJLFFBQVFBLFNBQVMsR0FBakIsSUFBd0JKLEdBQXhCLEtBQStCQSxJQUFHLENBQUgsRUFBTUMsS0FBTixDQUFZQyxNQUFaLEdBQXFCLENBQXJCLElBQTBCRixJQUFHLENBQUgsRUFBTUcsT0FBTixDQUFjRCxNQUFkLEdBQXVCLENBQWhGLENBQUosRUFBdUY7QUFDdEZ6QyxLQUFFLEtBQUYsRUFBU3NDLElBQVQ7QUFDQTtBQUNELE1BQUdwQixhQUFhLEtBQWhCLEVBQXNCO0FBQ3JCbEIsS0FBRU8sS0FBRixFQUFTOEIsSUFBVCxDQUFjLFVBQWQsRUFBeUIsVUFBekI7QUFDQWhCLFVBQU8sSUFBUDtBQUNBLEdBSEQsTUFHSztBQUNKckIsS0FBRSxXQUFGLEVBQWVzQyxJQUFmO0FBQ0E7QUFDRDs7QUFFRHRDLEdBQUUsV0FBRixFQUFlNEMsRUFBZixDQUFrQixPQUFsQixFQUEwQixVQUFTQyxDQUFULEVBQVc7QUFDcEMsTUFBR3ZCLFFBQUgsRUFBYTtBQUNaQSxjQUFXLEtBQVg7O0FBRUEsT0FBRyxDQUFDckIsSUFBSixFQUFVO0FBQ0dELE1BQUUsSUFBRixFQUFROEMsT0FBUixDQUFnQixjQUFoQjtBQUNBO0FBQ0g7O0FBRVZDLE9BQUlDLFdBQUosQ0FBZ0I7QUFDSEMsV0FBT2pELEVBQUU2QyxFQUFFSyxhQUFKLEVBQW1CQyxJQUFuQixDQUF3QixhQUF4QixDQURKO0FBRUhDLGVBQVcsT0FGUjtBQUdIQyxZQUFRLE9BSEw7QUFJSEMsY0FBVTtBQUpQLElBQWhCO0FBTUE7QUFDRCxFQWhCRDs7QUFrQkF0RCxHQUFFLFdBQUYsRUFBZTRDLEVBQWYsQ0FBa0IsY0FBbEIsRUFBaUMsWUFBVTtBQUMxQyxNQUFJVyxTQUFTdkQsRUFBRSxJQUFGLEVBQVF3RCxJQUFSLENBQWEsS0FBYixDQUFiO0FBQ0EsTUFBR25DLElBQUgsRUFBUTtBQUNQZCxTQUFNa0QsS0FBTjtBQUNBRixVQUFPbEIsSUFBUCxDQUFZLEtBQVosRUFBa0IsaUJBQWxCO0FBQ0FoQixVQUFPLEtBQVA7QUFDQSxHQUpELE1BSUs7QUFDSmQsU0FBTWMsSUFBTjtBQUNBa0MsVUFBT2xCLElBQVAsQ0FBWSxLQUFaLEVBQWtCLGdCQUFsQjtBQUNBaEIsVUFBTyxJQUFQO0FBQ0E7QUFDRDBCLE1BQUlXLFlBQUo7QUFDQXBDLGFBQVcsSUFBWDtBQUNBLEVBYkQ7O0FBZ0JBLEtBQUlxQyxlQUFlLElBQW5CO0FBQ0EzRCxHQUFFLFdBQUYsRUFBZTRDLEVBQWYsQ0FBa0IsWUFBbEIsRUFBZ0MsVUFBU0MsQ0FBVCxFQUFZO0FBQzNDLE1BQUljLFlBQUosRUFBa0I7QUFDakJBLGtCQUFlLEtBQWY7QUFDQSxPQUFJLENBQUMxRCxJQUFMLEVBQVc7QUFDVkQsTUFBRSxJQUFGLEVBQVE4QyxPQUFSLENBQWdCLGFBQWhCO0FBQ0E7QUFDQTtBQUNEQyxPQUFJQyxXQUFKLENBQWdCO0FBQ2ZDLFdBQU9qRCxFQUFFNkMsRUFBRUssYUFBSixFQUFtQkMsSUFBbkIsQ0FBd0IsYUFBeEIsQ0FEUTtBQUVmQyxlQUFXLFdBRkk7QUFHZkMsWUFBUSxPQUhPO0FBSWZDLGNBQVU7QUFKSyxJQUFoQjtBQU1BO0FBQ0QsRUFkRDtBQWVBdEQsR0FBRSxXQUFGLEVBQWU0QyxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLFVBQVNDLENBQVQsRUFBWTtBQUM1QzdDLElBQUUsSUFBRixFQUFRNEQsUUFBUixDQUFpQixRQUFqQjs7QUFFQ2IsTUFBSVcsWUFBSjtBQUNBQyxpQkFBZSxJQUFmO0FBRUQsRUFORDs7QUFRQSxLQUFJRSxjQUFjLElBQWxCO0FBQ0E3RCxHQUFFLFdBQUYsRUFBZTRDLEVBQWYsQ0FBa0IsWUFBbEIsRUFBZ0MsVUFBU0MsQ0FBVCxFQUFZO0FBQzNDLE1BQUlnQixXQUFKLEVBQWlCO0FBQ2hCQSxpQkFBYyxLQUFkO0FBQ0EsT0FBSSxDQUFDNUQsSUFBTCxFQUFXO0FBQ1ZELE1BQUUsSUFBRixFQUFROEMsT0FBUixDQUFnQixZQUFoQjtBQUNBO0FBQ0E7QUFDREMsT0FBSUMsV0FBSixDQUFnQjtBQUNmQyxXQUFPakQsRUFBRTZDLEVBQUVLLGFBQUosRUFBbUJDLElBQW5CLENBQXdCLGFBQXhCLENBRFE7QUFFZkMsZUFBVyxVQUZJO0FBR2ZDLFlBQVEsT0FITztBQUlmQyxjQUFVO0FBSkssSUFBaEI7QUFNQTtBQUNELEVBZEQ7O0FBZ0JBdEQsR0FBRSxXQUFGLEVBQWU0QyxFQUFmLENBQWtCLFlBQWxCLEVBQWdDLFVBQVNDLENBQVQsRUFBWTtBQUMzQzdDLElBQUUsSUFBRixFQUFROEQsV0FBUixDQUFvQixRQUFwQjs7QUFFQ2YsTUFBSVcsWUFBSjtBQUNBRyxnQkFBYyxJQUFkO0FBRUQsRUFORDs7QUFRQXRELE9BQU13RCxPQUFOLEdBQWdCLFlBQVU7QUFDekIsTUFBRy9ELEVBQUUsV0FBRixFQUFleUMsTUFBZixHQUF3QixDQUEzQixFQUE2QjtBQUM1QnpDLEtBQUUsZUFBRixFQUFtQnFDLElBQW5CLENBQXdCLEtBQXhCLEVBQThCLGlCQUE5QjtBQUNBaEIsVUFBTyxLQUFQO0FBQ0E7QUFDRCxFQUxEOztBQVFBLEtBQU0yQyxLQUFLakQsV0FBV3dCLEVBQXRCO0FBQ0EsS0FBSTBCLGVBQWUsRUFBbkI7QUFDQSxLQUFHRCxFQUFILEVBQU07QUFDTEEsS0FBR0UsR0FBSCxDQUFPLFVBQVNDLElBQVQsRUFBY2xCLEtBQWQsRUFBb0I7QUFDMUJnQiw0SEFHbUNoQixRQUFNLENBSHpDLDJDQUlxQmtCLEtBQUszQixLQUoxQixrRUFNNkIyQixLQUFLekIsT0FObEM7QUFTQSxHQVZEO0FBV0ExQyxJQUFFaUUsWUFBRixFQUFnQkcsUUFBaEIsQ0FBeUIsZ0JBQXpCO0FBQ0E7O0FBRUQsS0FBSUMsVUFBVSxLQUFkO0FBQ0FyRSxHQUFFLEtBQUYsRUFBUzRDLEVBQVQsQ0FBWSxPQUFaLEVBQW9CLFlBQVU7QUFDN0IsTUFBRyxDQUFDeUIsT0FBSixFQUFZO0FBQ1hBLGFBQVUsSUFBVjtBQUNBckUsS0FBRSxpQkFBRixFQUFxQjRELFFBQXJCLENBQThCLFFBQTlCO0FBQ0EsR0FIRCxNQUdLO0FBQ0pTLGFBQVUsS0FBVjtBQUNBckUsS0FBRSxpQkFBRixFQUFxQjhELFdBQXJCLENBQWlDLFFBQWpDO0FBQ0E7QUFDRCxFQVJEO0FBVUEsQ0F4TEQiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgJy4uLy4uL2NvbW1vbi9qcy9VdGlsaXRpZXMuanMnO1xyXG5pbXBvcnQgJy4uLy4uL2NvbW1vbi9qcy9jb21tZW4tdGl0bGUuanMnO1xyXG5cclxuJChmdW5jdGlvbigpe1xyXG5cdHZhciBzeW5jID0gcGFyZW50LndpbmRvdy5zeW5jQWN0aW9ucyAmJiBwYXJlbnQud2luZG93LnN5bmNBY3Rpb25zLmlzU3luY1xyXG5cdFxyXG5cdC8vIHZpZGVvIHJlc2l6ZVxyXG5cdGxldCByZXNpemVFdnQgPSAnb3JpZW50YXRpb25jaGFuZ2UnIGluIHdpbmRvdyA/ICdvcmllbnRhdGlvbmNoYW5nZScgOiAncmVzaXplJ1xyXG5cdGNvbnN0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3ZpZGVvMScpXHJcblx0dmlkZW8ud2lkdGggPSAxOS4yKmJhc2VcclxuICAgIHZpZGVvLmhlaWdodCA9IDEwLjgqYmFzZVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIocmVzaXplRXZ0LGZ1bmN0aW9uKCl7XHJcbiAgICBcdHZpZGVvLndpZHRoID0gMTkuMipiYXNlXHJcbiAgICBcdHZpZGVvLmhlaWdodCA9IDEwLjgqYmFzZVxyXG4gICAgfSxmYWxzZSlcclxuXHJcbiAgICAvLyBjb250ZW50IGluaXRcclxuICAgIC8vIGNvbnN0IHN1YlRpdGxlID0gY29uZmlnRGF0YS5vbmUuc3ViVGl0bGVcclxuICAgICBcclxuICAgIGNvbnN0IHNvdXJjZXMgPSBjb25maWdEYXRhLnNvdXJjZVxyXG5cdGNvbnN0IG1wNCA9IHNvdXJjZXNbMF0udmlkZW9cclxuXHRjb25zdCBhdXRvUGxheSA9IHNvdXJjZXNbMF0uYXV0b3BsYXlcclxuXHR2aWRlby5zcmMgPSBtcDRcclxuXHQvLyAkKCcuc3ViLXRpdGxlIHNwYW4nKS50ZXh0KHN1YlRpdGxlKVxyXG5cdFxyXG5cclxuXHQvLyBwbGF5IG9yIHBhdXNlXHJcblx0bGV0IHBsYXkgPSBmYWxzZVxyXG5cdGxldCBidG5DbGljayA9IHRydWVcclxuXHRsZXQgZ2V0UXVlcnlTdHJpbmcgPSBmdW5jdGlvbihuYW1lKXtcclxuXHRcdCBsZXQgcmVnID0gbmV3IFJlZ0V4cChcIihefCYpXCIrIG5hbWUgK1wiPShbXiZdKikoJnwkKVwiKTtcclxuICAgICAgICAgbGV0IHIgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgICBpZihyIT1udWxsKXJldHVybiAgdW5lc2NhcGUoclsyXSk7IHJldHVybiBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRpZihzeW5jKXtcclxuXHRcdGxldCBjdXJyZW50UGFnZSA9IHBhcmVudC53aW5kb3cuY29tbXVuaWNhdGlvbldpdGhBYy5jdXJyZW50UGFnZVxyXG5cdFx0bGV0IHVzZXJUeXBlID0gcGFyZW50LndpbmRvdy51c2VyVHlwZSBcclxuXHRcdGlmKGF1dG9QbGF5ID09PSAneWVzJyl7XHJcblx0XHRcdGlmKGN1cnJlbnRQYWdlID09PSBjb25maWdEYXRhLnBhZ2Upe1xyXG5cdFx0XHRcdCQodmlkZW8pLmF0dHIoJ2F1dG9wbGF5JywnYXV0b3BsYXknKVxyXG5cdFx0XHRcdHBsYXkgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZih1c2VyVHlwZSA9PT0gJ3RlYScpe1xyXG5cdFx0XHRcdCQoJy5idG4tcGxheScpLnNob3coKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL3VwZGF0ZSB2My4wXHJcblx0XHRsZXQgVEcgPSBjb25maWdEYXRhLlRHXHJcblx0XHRpZih1c2VyVHlwZSA9PT0gJ3RlYScgJiYgVEcgJiYgKFRHWzBdLnRpdGxlLmxlbmd0aCA+IDAgfHwgVEdbMF0uY29udGVudC5sZW5ndGggPiAwKSl7XHJcblx0XHRcdCQoJy50ZycpLnNob3coKVxyXG5cdFx0fVxyXG5cdH1lbHNle1xyXG5cdFx0Ly8gdXBkYXRlIHYzLjBcclxuXHRcdGxldCByb2xlID0gZ2V0UXVlcnlTdHJpbmcoJ3JvbGUnKVxyXG5cdFx0bGV0IFRHID0gY29uZmlnRGF0YS5UR1xyXG5cdFx0aWYoIHJvbGUgJiYgcm9sZSA9PT0gJzEnICYmIFRHICYmIChUR1swXS50aXRsZS5sZW5ndGggPiAwIHx8IFRHWzBdLmNvbnRlbnQubGVuZ3RoID4gMCkpe1xyXG5cdFx0XHQkKCcudGcnKS5zaG93KClcclxuXHRcdH1cclxuXHRcdGlmKGF1dG9QbGF5ID09PSAneWVzJyl7XHJcblx0XHRcdCQodmlkZW8pLmF0dHIoJ2F1dG9wbGF5JywnYXV0b3BsYXknKVxyXG5cdFx0XHRwbGF5ID0gdHJ1ZVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5idG4tcGxheScpLnNob3coKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JCgnLmJ0bi1wbGF5Jykub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuXHRcdGlmKGJ0bkNsaWNrKSB7XHJcblx0XHRcdGJ0bkNsaWNrID0gZmFsc2U7XHJcblxyXG5cdFx0XHRpZighc3luYykge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzeW5jQnRuQ2xpY2snKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0U0RLLmJpbmRTeW5jRXZ0KHtcclxuICAgICAgICAgICAgICAgIGluZGV4OiAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnc3luY2FjdGlvbnMnKSxcclxuICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogJ2NsaWNrJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2V2ZW50JyxcclxuICAgICAgICAgICAgICAgIHN5bmNOYW1lOiAnc3luY0J0bkNsaWNrJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHQkKCcuYnRuLXBsYXknKS5vbignc3luY0J0bkNsaWNrJyxmdW5jdGlvbigpe1xyXG5cdFx0bGV0IGJ0bkltZyA9ICQodGhpcykuZmluZCgnaW1nJylcclxuXHRcdGlmKHBsYXkpe1xyXG5cdFx0XHR2aWRlby5wYXVzZSgpXHJcblx0XHRcdGJ0bkltZy5hdHRyKCdzcmMnLCdpbWFnZS9wYXVzZS5wbmcnKVxyXG5cdFx0XHRwbGF5ID0gZmFsc2VcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR2aWRlby5wbGF5KClcclxuXHRcdFx0YnRuSW1nLmF0dHIoJ3NyYycsJ2ltYWdlL3BsYXkucG5nJylcclxuXHRcdFx0cGxheSA9IHRydWVcclxuXHRcdH1cclxuXHRcdFNESy5zZXRFdmVudExvY2soKTtcclxuXHRcdGJ0bkNsaWNrID0gdHJ1ZTsgXHJcblx0fSlcclxuXHJcblx0Ly8gYnRuIG1vdXNlb3ZlclxyXG5cdGxldCBidG5Nb3VzZU92ZXIgPSB0cnVlXHJcblx0JCgnLmJ0bi1wbGF5Jykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAoYnRuTW91c2VPdmVyKSB7XHJcblx0XHRcdGJ0bk1vdXNlT3ZlciA9IGZhbHNlXHJcblx0XHRcdGlmICghc3luYykge1xyXG5cdFx0XHRcdCQodGhpcykudHJpZ2dlcignc3luY0J0bk92ZXInKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHRcdFNESy5iaW5kU3luY0V2dCh7XHJcblx0XHRcdFx0aW5kZXg6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdzeW5jYWN0aW9ucycpLFxyXG5cdFx0XHRcdGV2ZW50VHlwZTogJ21vdXNlb3ZlcicsXHJcblx0XHRcdFx0bWV0aG9kOiAnZXZlbnQnLFxyXG5cdFx0XHRcdHN5bmNOYW1lOiAnc3luY0J0bk92ZXInXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fSlcclxuXHQkKCcuYnRuLXBsYXknKS5vbignc3luY0J0bk92ZXInLCBmdW5jdGlvbihlKSB7XHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdiaWdnZXInKVxyXG5cdFx0Ly8gJCh0aGlzKS51bmJpbmQodHJhbnNpdGlvbkVuZCkuYmluZCh0cmFuc2l0aW9uRW5kLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFNESy5zZXRFdmVudExvY2soKVxyXG5cdFx0XHRidG5Nb3VzZU92ZXIgPSB0cnVlXHJcblx0XHQvLyB9KVx0XHRcclxuXHR9KVxyXG5cclxuXHRsZXQgYnRuTW91c2VPdXQgPSB0cnVlXHJcblx0JCgnLmJ0bi1wbGF5Jykub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAoYnRuTW91c2VPdXQpIHtcclxuXHRcdFx0YnRuTW91c2VPdXQgPSBmYWxzZVxyXG5cdFx0XHRpZiAoIXN5bmMpIHtcclxuXHRcdFx0XHQkKHRoaXMpLnRyaWdnZXIoJ3N5bmNCdG5PdXQnKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHRcdFNESy5iaW5kU3luY0V2dCh7XHJcblx0XHRcdFx0aW5kZXg6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdzeW5jYWN0aW9ucycpLFxyXG5cdFx0XHRcdGV2ZW50VHlwZTogJ21vdXNlb3V0JyxcclxuXHRcdFx0XHRtZXRob2Q6ICdldmVudCcsXHJcblx0XHRcdFx0c3luY05hbWU6ICdzeW5jQnRuT3V0J1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdCQoJy5idG4tcGxheScpLm9uKCdzeW5jQnRuT3V0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYmlnZ2VyJylcclxuXHRcdC8vICQodGhpcykudW5iaW5kKHRyYW5zaXRpb25FbmQpLmJpbmQodHJhbnNpdGlvbkVuZCxmdW5jdGlvbigpe1xyXG5cdFx0XHRTREsuc2V0RXZlbnRMb2NrKClcclxuXHRcdFx0YnRuTW91c2VPdXQgPSB0cnVlXHJcblx0XHQvLyB9KVxyXG5cdH0pXHJcblxyXG5cdHZpZGVvLm9uZW5kZWQgPSBmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCgnLmJ0bi1wbGF5JykubGVuZ3RoID4gMCl7XHJcblx0XHRcdCQoJy5idG4tcGxheSBpbWcnKS5hdHRyKCdzcmMnLCdpbWFnZS9wYXVzZS5wbmcnKVxyXG5cdFx0XHRwbGF5ID0gZmFsc2VcclxuXHRcdH1cclxuXHR9XHRcclxuXHJcblx0Ly8gdXBkYXRlIHYzLjBcclxuXHRjb25zdCB0ZyA9IGNvbmZpZ0RhdGEuVEdcclxuXHRsZXQgdGdDb250ZW50U3RyID0gJydcclxuXHRpZih0Zyl7XHJcblx0XHR0Zy5tYXAoZnVuY3Rpb24oaXRlbSxpbmRleCl7XHJcblx0XHRcdHRnQ29udGVudFN0ciArPSBgXHJcblx0XHRcdDxsaT5cclxuXHRcdFx0ICAgIDxkaXYgY2xhc3M9XCJ0Zy1saXN0LXRpdCBjbGVhcmZpeFwiPlxyXG5cdFx0XHQgICAgPHNwYW4gY2xhc3M9XCJmbCB0Zy1saXN0LW51bVwiPiR7aW5kZXgrMX08L3NwYW4+XHJcblx0XHRcdCAgICA8aDMgY2xhc3M9XCJmbFwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHQgICAgPC9kaXY+XHJcblx0XHRcdCAgICA8cCBjbGFzcz1cInRnLWxpc3QtZGVzXCI+JHtpdGVtLmNvbnRlbnR9PC9wPiAgICAgIFxyXG5cdFx0ICAgIDwvbGk+XHJcblx0XHRcdGBcclxuXHRcdH0pXHJcblx0XHQkKHRnQ29udGVudFN0cikuYXBwZW5kVG8oJy50Zy1jb250ZW50IHVsJylcclxuXHR9XHJcblxyXG5cdGxldCB0Z01vdmVkID0gZmFsc2VcclxuXHQkKCcudGcnKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcblx0XHRpZighdGdNb3ZlZCl7XHJcblx0XHRcdHRnTW92ZWQgPSB0cnVlXHJcblx0XHRcdCQoJy50Zy1jb250ZW50LC50ZycpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRnTW92ZWQgPSBmYWxzZVxyXG5cdFx0XHQkKCcudGctY29udGVudCwudGcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdH1cclxuXHR9KVxyXG5cclxufSlcclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy92aWRlby1wbGF5L2pzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);
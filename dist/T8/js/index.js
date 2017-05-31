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
/******/ 	var hotCurrentHash = "bfb10729eb8edcb86c29"; // eslint-disable-line no-unused-vars
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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\n__webpack_require__(2);\n\n__webpack_require__(4);\n\n$(function () {\n  var isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;\n\n  console.info(\"当前显示环境处在\" + (isSync ? \"\" : \" 非\") + \"同步状态！！！\");\n\n  if (configData.defaultValue.bgImage) {\n    $(\".container\").css({\n      'backgroundImage': 'url(' + configData.defaultValue.bgImage + ')'\n    });\n  }\n  if (configData.bg) {\n    $(\".container\").css({\n      'backgroundImage': 'url(' + configData.bg + ')'\n    });\n  }\n  if (configData.defaultValue.bgColor) {\n    $(\".container\").css({\n      'backgroundColor': configData.defaultValue.bgColor\n    });\n  }\n  if (configData.bgColor) {\n    $(\".container\").css({\n      'backgroundColor': configData.bgColor\n    });\n  }\n  var isTitle = $('.title').is(':hidden');\n  if (isTitle) {\n    $('.content-wrap').css('height', 'calc(100% - .76rem)');\n  }\n\n  var wrapper = $('.content-wrap');\n  var source = configData.source;\n\n  var cardImg = '\\n                <div class=\"item card-img\" data-id=\"{{i}}\" data-type=\"{{type}}\" data-audio =\"{{audio}}\"  data-text=\"{{text}}\" data-img=\"{{img}}\" data-syncactions=\"card-img-{{i}}\">\\n                  <img src=\"{{img}}\"/>\\n                </div>\\n              ';\n  var cardWord = '\\n                <div class=\"item card-text {{bigText}}\" data-id=\"{{i}}\"  data-type=\"{{type}}\" data-audio =\"{{audio}}\" data-text=\"{{text}}\"   data-syncactions=\"card-text-{{i}}\">\\n                  <span class=\"text\">{{text}}</span>\\n                  <div class=\"audio-wrap\"  data-syncactions=\"audio-wrap-{{i}}\">\\n                    <img src=\"./image/btn-audio.png\"/>\\n                    <audio src=\"{{audio}}\"></audio>\\n                  </div>\\n                </div>\\n              ';\n  var line3 = '<li class=\"line-wrap\">{{cards}}</li>',\n      line1,\n      line2;\n  line1 = line2 = line3;\n\n  var dismantleImgAndText = function dismantleImgAndText(obj) {\n    var _item = [];\n    _item.push({\n      id: obj.id,\n      type: \"img\",\n      img: obj.img,\n      text: \"\",\n      audio: obj.audio\n    });\n    _item.push({\n      id: obj.id,\n      type: \"text\",\n      img: \"\",\n      text: obj.text,\n      audio: obj.audio\n    });\n    return _item;\n  };\n  var resultData = [];\n  source.items.forEach(function (obj) {\n    resultData = resultData.concat(dismantleImgAndText(obj));\n  });\n\n  var _i = 0;\n  resultData = resultData.sort(function () {\n    return Math.pow(-1, _i++);\n  });\n\n  var render = function render(data) {\n    var _str = \"\";\n    data.forEach(function (o) {\n      var bigText = \"\";\n\n      if (o.type == 'img') {\n        _str += cardImg.replace(/{{i}}/g, o.id).replace(/{{type}}/g, o.type).replace(/{{img}}/g, o.img).replace(/{{audio}}/g, o.audio).replace(/{{text}}/g, o.text);\n      } else {\n        if (o.text.length <= 7) {\n          bigText = \"bigText\";\n        }\n        _str += cardWord.replace(/{{i}}/g, o.id).replace(/{{bigText}}/g, bigText).replace(/{{type}}/g, o.type).replace(/{{text}}/g, o.text).replace(/{{audio}}/g, o.audio);\n      }\n    });\n    return _str;\n  };\n  var strLine1 = '',\n      strLine2 = \"\",\n      strLine3 = \"\";\n  switch (source.items.length) {\n    case 2:\n    case 3:\n      strLine1 = line1.replace(/{{cards}}/, \"\");\n      strLine2 = line2.replace(/{{cards}}/, render(resultData));\n      strLine3 = line3.replace(/{{cards}}/, \"\");\n      $(\".content-wrap\").css({\n        height: \"calc(100% - 4.32rem)\"\n      });\n      break;\n    case 4:\n      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 4)));\n      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(4)));\n      strLine3 = line3.replace(/{{cards}}/, \"\");\n      $(\".content-wrap\").css({\n        height: \"calc(100% - 3.32rem)\"\n      });\n      break;\n    case 5:\n      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 4)));\n      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(4, 8)));\n      strLine3 = line3.replace(/{{cards}}/, render(resultData.slice(8)));\n      break;\n    case 6:\n      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 6)));\n      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(6)));\n      strLine3 = line3.replace(/{{cards}}/, \"\");\n      $(\".content-wrap\").css({\n        height: \"calc(100% - 4.32rem)\"\n      });\n      break;\n    case 7:\n    case 8:\n    case 9:\n      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 6)));\n      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(6, 12)));\n      strLine3 = line3.replace(/{{cards}}/, render(resultData.slice(12)));\n      break;\n  }\n  wrapper.html(\"\");\n  wrapper.append(strLine1);\n  wrapper.append(strLine2);\n  wrapper.append(strLine3);\n\n  $('.audio-wrap').each(function (index, el) {\n    if ($(el).find('audio').attr('src') == '') {\n      $(el).hide();\n    }\n  });\n\n  var mask = '\\n        <div class=\"mask mask-answer\">\\n          <div class=\"wrap-card-answer\">\\n          <div class=\"card-answer\">\\n            <div class=\"card-img\">\\n              <img src=\"{{img}}\"/>\\n            </div>\\n            <span class=\"text\">{{text}}</span>\\n          </div>\\n          <div class=\"audio-wrap\"  data-syncactions=\"audio-wrap-{{i}}\">\\n            <img src=\"./image/volumeBtn.gif\"/>\\n            <audio src=\"{{audio}}\"></audio>\\n          </div>\\n          </div>\\n        </div>\\n        ';\n\n  var audioWrapClickTimer = true,\n      audioWrapMouseenterTimer = true,\n      audioWrapMouseleaveTimer = true;\n\n  $(\".item\").on(\"click\", \".audio-wrap\", function (e) {\n    if (audioWrapClickTimer) {\n      audioWrapClickTimer = false;\n\n      if (!isSync) {\n        $(this).trigger('syncAudioWrapClick');\n        return;\n      }\n      if (window.frameElement.getAttribute('user_type') == 'tea') {\n        SDK.bindSyncEvt({\n          index: $(e.currentTarget).data('syncactions'),\n          method: 'event',\n          syncName: 'syncAudioWrapClick',\n          funcType: 'audio'\n        });\n      } else {\n        $(this).trigger('syncAudioWrapClick');\n        return;\n      }\n    }\n  });\n  $(\".item\").on(\"syncAudioWrapClick\", \".audio-wrap\", function () {\n    var $audio = null;\n    $audio = $(this).find(\"audio\").get(0);\n    var $img = $(this).find(\"img\");\n    $audio ? $audio.play() : \"\";\n    if ($img.length != 0) {\n      $img.attr(\"src\", $(this).find(\"img\").attr(\"src\").replace(\".png\", \".gif\"));\n\n      $audio.onended = function () {\n        $img.attr(\"src\", $(this).find(\"img\").attr(\"src\").replace(\".gif\", \".png\"));\n      }.bind(this);\n    }\n\n    $(this).find(\"audio\").get(0).play();\n    SDK.setEventLock();\n    audioWrapClickTimer = true;\n\n    return false;\n  });\n\n  $(\".item\").on(\"mouseenter\", \".audio-wrap\", function (e) {\n    if (audioWrapMouseenterTimer) {\n      audioWrapMouseenterTimer = false;\n\n      if (!isSync) {\n        $(this).trigger('syncAudioWrapMouseenter');\n        return;\n      }\n\n      SDK.bindSyncEvt({\n        index: $(e.currentTarget).data('syncactions'),\n        method: 'event',\n        syncName: 'syncAudioWrapMouseenter'\n      });\n    }\n  });\n  $(\".item\").on(\"syncAudioWrapMouseenter\", \".audio-wrap\", function () {\n\n    $(this).css(\"transform\", \"translate(-50%,-50%) scale(1.1)\");\n    SDK.setEventLock();\n    audioWrapMouseenterTimer = true;\n\n    return false;\n  });\n\n  $(\".item\").on(\"mouseleave\", \".audio-wrap\", function (e) {\n    if (audioWrapMouseleaveTimer) {\n      audioWrapMouseleaveTimer = false;\n\n      if (!isSync) {\n        $(this).trigger('syncAudioWrapMouseleave');\n        return;\n      }\n\n      SDK.bindSyncEvt({\n        index: $(e.currentTarget).data('syncactions'),\n        method: 'event',\n        syncName: 'syncAudioWrapMouseleave'\n      });\n    }\n  });\n  $(\".item\").on(\"syncAudioWrapMouseleave\", \".audio-wrap\", function () {\n\n    $(this).css(\"transform\", \"translate(-50%,-50%) scale(1)\");\n    SDK.setEventLock();\n    audioWrapMouseleaveTimer = true;\n\n    return false;\n  });\n\n  var itemClick = true;\n  wrapper.on('click', '.item', function (e) {\n    e.stopPropagation();\n    if (itemClick) {\n      itemClick = false;\n\n      if (!isSync) {\n        $(this).trigger('syncItemClick');\n        return;\n      }\n      SDK.bindSyncEvt({\n        sendUser: '',\n        receiveUser: '',\n        index: $(e.currentTarget).data('syncactions'),\n        eventType: 'click',\n        method: 'event',\n        syncName: 'syncItemClick'\n      });\n    }\n  });\n\n  var firstCard = null,\n      secondCard = null,\n      _mask = null;\n\n  wrapper.on(\"syncItemClick\", \".item\", function () {\n    var _this = $(this),\n        type = _this.data(\"type\"),\n        id = _this.data(\"id\"),\n        img = type == \"img\" ? _this.data('img') : \"\",\n        audio = _this.data('audio'),\n        text = type == \"text\" ? _this.data('text') : \"\";\n\n    if (_this.hasClass(\"active\")) {\n      SDK.setEventLock();\n      itemClick = true;\n      return;\n    }\n\n    if (firstCard) {\n\n      if (_this.data(\"id\") == firstCard.data(\"id\")) {\n        _this.addClass('active');\n        $(this).queue(function () {\n          _mask = mask.replace(/{{img}}/g, img == \"\" ? firstCard.data(\"img\") : img).replace(/{{audio}}/g, audio).replace(/{{text}}/g, text == \"\" ? firstCard.data(\"text\") : text);\n          _mask = $(_mask).appendTo(wrapper);\n\n          if (audio) {\n            if (isSync) {\n              var frame_user_id = $(window.frameElement).attr('user_id');\n              var current_user_id = SDK.getClassConf().user.id;\n              if (frame_user_id == current_user_id) {\n                _mask.find(\"audio\").get(0).play();\n              }\n            } else {\n              _mask.find(\"audio\").get(0).play();\n            }\n          } else {\n            _mask.find('.audio-wrap').hide();\n          }\n\n          $(this).dequeue();\n        }).delay(2500).queue(function () {\n          $(\".mask-answer\").fadeOut(300);\n          $(this).dequeue();\n        }).delay(100).queue(function () {\n          firstCard.css(\"visibility\", \"hidden\");\n          _this.css(\"visibility\", \"hidden\");\n          $(this).dequeue();\n        }).delay(100).queue(function () {\n          firstCard = null;\n          _mask.remove();\n          $(this).dequeue();\n\n          SDK.setEventLock();\n          itemClick = true;\n        });\n      } else {\n\n        firstCard.removeClass(\"active\");\n        _this.addClass(\"error shake\");\n        firstCard.addClass(\"error shake\");\n        $(this).delay(500).queue(function () {\n          firstCard.removeClass(\"shake\");\n          _this.removeClass(\"shake\");\n          $(this).dequeue();\n        }).delay(0).queue(function () {\n          firstCard.removeClass(\"error\");\n          _this.removeClass(\"error\");\n          $(this).dequeue();\n        }).delay(100).queue(function () {\n          firstCard = null;\n          $(this).dequeue();\n\n          SDK.setEventLock();\n          itemClick = true;\n        });\n      }\n    } else {\n      _this.addClass('active');\n      firstCard = _this;\n\n      SDK.setEventLock();\n      itemClick = true;\n    }\n  });\n});//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvVDgvanMvaW5kZXguanM/YmE2ZCJdLCJuYW1lcyI6WyIkIiwiaXNTeW5jIiwicGFyZW50Iiwid2luZG93IiwiaDVTeW5jQWN0aW9ucyIsImNvbnNvbGUiLCJpbmZvIiwiY29uZmlnRGF0YSIsImRlZmF1bHRWYWx1ZSIsImJnSW1hZ2UiLCJjc3MiLCJiZyIsImJnQ29sb3IiLCJpc1RpdGxlIiwiaXMiLCJ3cmFwcGVyIiwic291cmNlIiwiY2FyZEltZyIsImNhcmRXb3JkIiwibGluZTMiLCJsaW5lMSIsImxpbmUyIiwiZGlzbWFudGxlSW1nQW5kVGV4dCIsIm9iaiIsIl9pdGVtIiwicHVzaCIsImlkIiwidHlwZSIsImltZyIsInRleHQiLCJhdWRpbyIsInJlc3VsdERhdGEiLCJpdGVtcyIsImZvckVhY2giLCJjb25jYXQiLCJfaSIsInNvcnQiLCJNYXRoIiwicG93IiwicmVuZGVyIiwiZGF0YSIsIl9zdHIiLCJvIiwiYmlnVGV4dCIsInJlcGxhY2UiLCJsZW5ndGgiLCJzdHJMaW5lMSIsInN0ckxpbmUyIiwic3RyTGluZTMiLCJoZWlnaHQiLCJzbGljZSIsImh0bWwiLCJhcHBlbmQiLCJlYWNoIiwiaW5kZXgiLCJlbCIsImZpbmQiLCJhdHRyIiwiaGlkZSIsIm1hc2siLCJhdWRpb1dyYXBDbGlja1RpbWVyIiwiYXVkaW9XcmFwTW91c2VlbnRlclRpbWVyIiwiYXVkaW9XcmFwTW91c2VsZWF2ZVRpbWVyIiwib24iLCJlIiwidHJpZ2dlciIsImZyYW1lRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsIlNESyIsImJpbmRTeW5jRXZ0IiwiY3VycmVudFRhcmdldCIsIm1ldGhvZCIsInN5bmNOYW1lIiwiZnVuY1R5cGUiLCIkYXVkaW8iLCJnZXQiLCIkaW1nIiwicGxheSIsIm9uZW5kZWQiLCJiaW5kIiwic2V0RXZlbnRMb2NrIiwiaXRlbUNsaWNrIiwic3RvcFByb3BhZ2F0aW9uIiwic2VuZFVzZXIiLCJyZWNlaXZlVXNlciIsImV2ZW50VHlwZSIsImZpcnN0Q2FyZCIsInNlY29uZENhcmQiLCJfbWFzayIsIl90aGlzIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInF1ZXVlIiwiYXBwZW5kVG8iLCJmcmFtZV91c2VyX2lkIiwiY3VycmVudF91c2VyX2lkIiwiZ2V0Q2xhc3NDb25mIiwidXNlciIsImRlcXVldWUiLCJkZWxheSIsImZhZGVPdXQiLCJyZW1vdmUiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7O0FBQ0E7O0FBRUFBLEVBQUUsWUFBTTtBQUNOLE1BQU1DLFNBQVNDLE9BQU9DLE1BQVAsQ0FBY0MsYUFBZCxJQUErQkYsT0FBT0MsTUFBUCxDQUFjQyxhQUFkLENBQTRCSCxNQUExRTs7QUFFQUksVUFBUUMsSUFBUixDQUFhLGNBQWNMLFNBQVMsRUFBVCxHQUFjLElBQTVCLElBQW9DLFNBQWpEOztBQUVBLE1BQUlNLFdBQVdDLFlBQVgsQ0FBd0JDLE9BQTVCLEVBQXFDO0FBQ25DVCxNQUFFLFlBQUYsRUFBZ0JVLEdBQWhCLENBQW9CO0FBQ2xCLHlCQUFtQixTQUFTSCxXQUFXQyxZQUFYLENBQXdCQyxPQUFqQyxHQUEyQztBQUQ1QyxLQUFwQjtBQUdEO0FBQ0QsTUFBSUYsV0FBV0ksRUFBZixFQUFtQjtBQUNqQlgsTUFBRSxZQUFGLEVBQWdCVSxHQUFoQixDQUFvQjtBQUNsQix5QkFBbUIsU0FBU0gsV0FBV0ksRUFBcEIsR0FBeUI7QUFEMUIsS0FBcEI7QUFHRDtBQUNELE1BQUlKLFdBQVdDLFlBQVgsQ0FBd0JJLE9BQTVCLEVBQXFDO0FBQ25DWixNQUFFLFlBQUYsRUFBZ0JVLEdBQWhCLENBQW9CO0FBQ2xCLHlCQUFtQkgsV0FBV0MsWUFBWCxDQUF3Qkk7QUFEekIsS0FBcEI7QUFHRDtBQUNELE1BQUlMLFdBQVdLLE9BQWYsRUFBd0I7QUFDdEJaLE1BQUUsWUFBRixFQUFnQlUsR0FBaEIsQ0FBb0I7QUFDbEIseUJBQW1CSCxXQUFXSztBQURaLEtBQXBCO0FBR0Q7QUFDRCxNQUFJQyxVQUFVYixFQUFFLFFBQUYs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QUNMUSxZQUFNRSxRQUFOLENBQWUsUUFBZjtBQUNBTCxrQkFBWUcsS0FBWjs7QUFFQXJCLFVBQUlZLFlBQUo7QUFDQUMsa0JBQVksSUFBWjtBQUNEO0FBQ0YsR0F2RkQ7QUF3RkQsQ0F4YkQiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgJy4uLy4uL2NvbW1vbi9qcy9jb21tb24uanMnO1xyXG5pbXBvcnQgJy4vc3luYy5qcyc7XHJcblxyXG4kKCgpID0+IHtcclxuICBjb25zdCBpc1N5bmMgPSBwYXJlbnQud2luZG93Lmg1U3luY0FjdGlvbnMgJiYgcGFyZW50LndpbmRvdy5oNVN5bmNBY3Rpb25zLmlzU3luYztcclxuXHJcbiAgY29uc29sZS5pbmZvKFwi5b2T5YmN5pi+56S6546v5aKD5aSE5ZyoXCIgKyAoaXNTeW5jID8gXCJcIiA6IFwiIOmdnlwiKSArIFwi5ZCM5q2l54q25oCB77yB77yB77yBXCIpO1xyXG5cclxuICBpZiAoY29uZmlnRGF0YS5kZWZhdWx0VmFsdWUuYmdJbWFnZSkge1xyXG4gICAgJChcIi5jb250YWluZXJcIikuY3NzKHtcclxuICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIGNvbmZpZ0RhdGEuZGVmYXVsdFZhbHVlLmJnSW1hZ2UgKyAnKSdcclxuICAgIH0pO1xyXG4gIH1cclxuICBpZiAoY29uZmlnRGF0YS5iZykge1xyXG4gICAgJChcIi5jb250YWluZXJcIikuY3NzKHtcclxuICAgICAgJ2JhY2tncm91bmRJbWFnZSc6ICd1cmwoJyArIGNvbmZpZ0RhdGEuYmcgKyAnKSdcclxuICAgIH0pO1xyXG4gIH1cclxuICBpZiAoY29uZmlnRGF0YS5kZWZhdWx0VmFsdWUuYmdDb2xvcikge1xyXG4gICAgJChcIi5jb250YWluZXJcIikuY3NzKHtcclxuICAgICAgJ2JhY2tncm91bmRDb2xvcic6IGNvbmZpZ0RhdGEuZGVmYXVsdFZhbHVlLmJnQ29sb3JcclxuICAgIH0pO1xyXG4gIH1cclxuICBpZiAoY29uZmlnRGF0YS5iZ0NvbG9yKSB7XHJcbiAgICAkKFwiLmNvbnRhaW5lclwiKS5jc3Moe1xyXG4gICAgICAnYmFja2dyb3VuZENvbG9yJzogY29uZmlnRGF0YS5iZ0NvbG9yXHJcbiAgICB9KTtcclxuICB9XHJcbiAgbGV0IGlzVGl0bGUgPSAkKCcudGl0bGUnKS5pcygnOmhpZGRlbicpO1xyXG4gIGlmIChpc1RpdGxlKSB7XHJcbiAgICAkKCcuY29udGVudC13cmFwJykuY3NzKCdoZWlnaHQnLCAnY2FsYygxMDAlIC0gLjc2cmVtKScpO1xyXG4gIH1cclxuXHJcbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xyXG4gIGxldCB3cmFwcGVyID0gJCgnLmNvbnRlbnQtd3JhcCcpO1xyXG4gIGxldCBzb3VyY2UgPSBjb25maWdEYXRhLnNvdXJjZTtcclxuXHJcbiAgdmFyIGNhcmRJbWcgPSBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbSBjYXJkLWltZ1wiIGRhdGEtaWQ9XCJ7e2l9fVwiIGRhdGEtdHlwZT1cInt7dHlwZX19XCIgZGF0YS1hdWRpbyA9XCJ7e2F1ZGlvfX1cIiAgZGF0YS10ZXh0PVwie3t0ZXh0fX1cIiBkYXRhLWltZz1cInt7aW1nfX1cIiBkYXRhLXN5bmNhY3Rpb25zPVwiY2FyZC1pbWcte3tpfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJ7e2ltZ319XCIvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgYDtcclxuICB2YXIgY2FyZFdvcmQgPSBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbSBjYXJkLXRleHQge3tiaWdUZXh0fX1cIiBkYXRhLWlkPVwie3tpfX1cIiAgZGF0YS10eXBlPVwie3t0eXBlfX1cIiBkYXRhLWF1ZGlvID1cInt7YXVkaW99fVwiIGRhdGEtdGV4dD1cInt7dGV4dH19XCIgICBkYXRhLXN5bmNhY3Rpb25zPVwiY2FyZC10ZXh0LXt7aX19XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dFwiPnt7dGV4dH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXVkaW8td3JhcFwiICBkYXRhLXN5bmNhY3Rpb25zPVwiYXVkaW8td3JhcC17e2l9fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZS9idG4tYXVkaW8ucG5nXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhdWRpbyBzcmM9XCJ7e2F1ZGlvfX1cIj48L2F1ZGlvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIGA7XHJcbiAgdmFyIGxpbmUzID0gYDxsaSBjbGFzcz1cImxpbmUtd3JhcFwiPnt7Y2FyZHN9fTwvbGk+YCxcclxuICAgIGxpbmUxLCBsaW5lMjtcclxuICBsaW5lMSA9IGxpbmUyID0gbGluZTM7XHJcblxyXG4gIHZhciBkaXNtYW50bGVJbWdBbmRUZXh0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBsZXQgX2l0ZW0gPSBbXTtcclxuICAgIF9pdGVtLnB1c2goe1xyXG4gICAgICBpZDogb2JqLmlkLFxyXG4gICAgICB0eXBlOiBcImltZ1wiLFxyXG4gICAgICBpbWc6IG9iai5pbWcsXHJcbiAgICAgIHRleHQ6IFwiXCIsXHJcbiAgICAgIGF1ZGlvOiBvYmouYXVkaW9cclxuICAgIH0pO1xyXG4gICAgX2l0ZW0ucHVzaCh7XHJcbiAgICAgIGlkOiBvYmouaWQsXHJcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICBpbWc6IFwiXCIsXHJcbiAgICAgIHRleHQ6IG9iai50ZXh0LFxyXG4gICAgICBhdWRpbzogb2JqLmF1ZGlvXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfaXRlbTtcclxuICB9XHJcbiAgdmFyIHJlc3VsdERhdGEgPSBbXTtcclxuICBzb3VyY2UuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcclxuICAgIHJlc3VsdERhdGEgPSByZXN1bHREYXRhLmNvbmNhdChkaXNtYW50bGVJbWdBbmRUZXh0KG9iaikpO1xyXG4gIH0pO1xyXG4gIC8vY29uc29sZS5sb2coXCLmi4bliIblkI7mlbDnu4TlhoXlrrnlpoLkuIvvvJpcIik7XHJcblxyXG4gIC8vIHJlc3VsdERhdGEuZm9yRWFjaChjb25zb2xlLmxvZyk7XHJcblxyXG4gIC8vY29uc29sZS5sb2coXCLmjInmiZPkubHnrpfms5XmiZPkubHlpoLkuIvvvJpcIik7XHJcbiAgdmFyIF9pID0gMDtcclxuICByZXN1bHREYXRhID0gcmVzdWx0RGF0YS5zb3J0KGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIE1hdGgucG93KC0xLCBfaSsrKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVzdWx0RGF0YS5mb3JFYWNoKGNvbnNvbGUubG9nKTtcclxuXHJcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHZhciBfc3RyID0gXCJcIjtcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihvKSB7XHJcbiAgICAgIGxldCBiaWdUZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgIGlmIChvLnR5cGUgPT0gJ2ltZycpIHtcclxuICAgICAgICBfc3RyICs9IGNhcmRJbWcucmVwbGFjZSgve3tpfX0vZywgby5pZCkucmVwbGFjZSgve3t0eXBlfX0vZywgby50eXBlKS5yZXBsYWNlKC97e2ltZ319L2csIG8uaW1nKS5yZXBsYWNlKC97e2F1ZGlvfX0vZywgby5hdWRpbykucmVwbGFjZSgve3t0ZXh0fX0vZywgby50ZXh0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoby50ZXh0Lmxlbmd0aCA8PSA3KSB7XHJcbiAgICAgICAgICBiaWdUZXh0ID0gXCJiaWdUZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9zdHIgKz0gY2FyZFdvcmQucmVwbGFjZSgve3tpfX0vZywgby5pZCkucmVwbGFjZSgve3tiaWdUZXh0fX0vZywgYmlnVGV4dCkucmVwbGFjZSgve3t0eXBlfX0vZywgby50eXBlKS5yZXBsYWNlKC97e3RleHR9fS9nLCBvLnRleHQpLnJlcGxhY2UoL3t7YXVkaW99fS9nLCBvLmF1ZGlvKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gX3N0cjtcclxuICB9XHJcbiAgdmFyIHN0ckxpbmUxID0gJycsXHJcbiAgICBzdHJMaW5lMiA9IFwiXCIsXHJcbiAgICBzdHJMaW5lMyA9IFwiXCI7XHJcbiAgc3dpdGNoIChzb3VyY2UuaXRlbXMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIHN0ckxpbmUxID0gbGluZTEucmVwbGFjZSgve3tjYXJkc319LywgXCJcIik7XHJcbiAgICAgIHN0ckxpbmUyID0gbGluZTIucmVwbGFjZSgve3tjYXJkc319LywgcmVuZGVyKHJlc3VsdERhdGEpKTtcclxuICAgICAgc3RyTGluZTMgPSBsaW5lMy5yZXBsYWNlKC97e2NhcmRzfX0vLCBcIlwiKTtcclxuICAgICAgJChcIi5jb250ZW50LXdyYXBcIikuY3NzKHtcclxuICAgICAgICBoZWlnaHQ6IFwiY2FsYygxMDAlIC0gNC4zMnJlbSlcIlxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHN0ckxpbmUxID0gbGluZTEucmVwbGFjZSgve3tjYXJkc319LywgcmVuZGVyKHJlc3VsdERhdGEuc2xpY2UoMCwgNCkpKTtcclxuICAgICAgc3RyTGluZTIgPSBsaW5lMi5yZXBsYWNlKC97e2NhcmRzfX0vLCByZW5kZXIocmVzdWx0RGF0YS5zbGljZSg0KSkpO1xyXG4gICAgICBzdHJMaW5lMyA9IGxpbmUzLnJlcGxhY2UoL3t7Y2FyZHN9fS8sIFwiXCIpO1xyXG4gICAgICAkKFwiLmNvbnRlbnQtd3JhcFwiKS5jc3Moe1xyXG4gICAgICAgIGhlaWdodDogXCJjYWxjKDEwMCUgLSAzLjMycmVtKVwiXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNTpcclxuICAgICAgc3RyTGluZTEgPSBsaW5lMS5yZXBsYWNlKC97e2NhcmRzfX0vLCByZW5kZXIocmVzdWx0RGF0YS5zbGljZSgwLCA0KSkpO1xyXG4gICAgICBzdHJMaW5lMiA9IGxpbmUyLnJlcGxhY2UoL3t7Y2FyZHN9fS8sIHJlbmRlcihyZXN1bHREYXRhLnNsaWNlKDQsIDgpKSk7XHJcbiAgICAgIHN0ckxpbmUzID0gbGluZTMucmVwbGFjZSgve3tjYXJkc319LywgcmVuZGVyKHJlc3VsdERhdGEuc2xpY2UoOCkpKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDY6XHJcbiAgICAgIHN0ckxpbmUxID0gbGluZTEucmVwbGFjZSgve3tjYXJkc319LywgcmVuZGVyKHJlc3VsdERhdGEuc2xpY2UoMCwgNikpKTtcclxuICAgICAgc3RyTGluZTIgPSBsaW5lMi5yZXBsYWNlKC97e2NhcmRzfX0vLCByZW5kZXIocmVzdWx0RGF0YS5zbGljZSg2KSkpO1xyXG4gICAgICBzdHJMaW5lMyA9IGxpbmUzLnJlcGxhY2UoL3t7Y2FyZHN9fS8sIFwiXCIpO1xyXG4gICAgICAkKFwiLmNvbnRlbnQtd3JhcFwiKS5jc3Moe1xyXG4gICAgICAgIGhlaWdodDogXCJjYWxjKDEwMCUgLSA0LjMycmVtKVwiXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNzpcclxuICAgIGNhc2UgODpcclxuICAgIGNhc2UgOTpcclxuICAgICAgc3RyTGluZTEgPSBsaW5lMS5yZXBsYWNlKC97e2NhcmRzfX0vLCByZW5kZXIocmVzdWx0RGF0YS5zbGljZSgwLCA2KSkpO1xyXG4gICAgICBzdHJMaW5lMiA9IGxpbmUyLnJlcGxhY2UoL3t7Y2FyZHN9fS8sIHJlbmRlcihyZXN1bHREYXRhLnNsaWNlKDYsIDEyKSkpO1xyXG4gICAgICBzdHJMaW5lMyA9IGxpbmUzLnJlcGxhY2UoL3t7Y2FyZHN9fS8sIHJlbmRlcihyZXN1bHREYXRhLnNsaWNlKDEyKSkpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgd3JhcHBlci5odG1sKFwiXCIpO1xyXG4gIHdyYXBwZXIuYXBwZW5kKHN0ckxpbmUxKTtcclxuICB3cmFwcGVyLmFwcGVuZChzdHJMaW5lMik7XHJcbiAgd3JhcHBlci5hcHBlbmQoc3RyTGluZTMpO1xyXG5cclxuICAvL3Jlc2V0IGJ5IHBhbnkgZm9yIGF1ZGlvYnRuXHJcbiAgJCgnLmF1ZGlvLXdyYXAnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xyXG4gICAgIGlmICgkKGVsKS5maW5kKCdhdWRpbycpLmF0dHIoJ3NyYycpID09ICcnKSB7XHJcbiAgICAgICQoZWwpLmhpZGUoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmFyIG1hc2sgPSBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hc2sgbWFzay1hbnN3ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwLWNhcmQtYW5zd2VyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1hbnN3ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaW1nXCI+XHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9XCJ7e2ltZ319XCIvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0XCI+e3t0ZXh0fX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhdWRpby13cmFwXCIgIGRhdGEtc3luY2FjdGlvbnM9XCJhdWRpby13cmFwLXt7aX19XCI+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZS92b2x1bWVCdG4uZ2lmXCIvPlxyXG4gICAgICAgICAgICA8YXVkaW8gc3JjPVwie3thdWRpb319XCI+PC9hdWRpbz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgdmFyIGF1ZGlvV3JhcENsaWNrVGltZXIgPSB0cnVlLFxyXG4gICAgLy8gaXRlbU1vdXNlZW50ZXJUaW1lciA9IHRydWUsXHJcbiAgICAvLyBpdGVtTW91c2VsZWF2ZVRpbWVyID0gdHJ1ZSxcclxuICAgIGF1ZGlvV3JhcE1vdXNlZW50ZXJUaW1lciA9IHRydWUsXHJcbiAgICBhdWRpb1dyYXBNb3VzZWxlYXZlVGltZXIgPSB0cnVlO1xyXG5cclxuICAkKFwiLml0ZW1cIikub24oXCJjbGlja1wiLCBcIi5hdWRpby13cmFwXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmIChhdWRpb1dyYXBDbGlja1RpbWVyKSB7XHJcbiAgICAgIGF1ZGlvV3JhcENsaWNrVGltZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghaXNTeW5jKSB7XHJcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzeW5jQXVkaW9XcmFwQ2xpY2snKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYod2luZG93LmZyYW1lRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3VzZXJfdHlwZScpID09ICd0ZWEnKXtcclxuICAgICAgICBTREsuYmluZFN5bmNFdnQoe1xyXG4gICAgICAgICAgaW5kZXg6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdzeW5jYWN0aW9ucycpLFxyXG4gICAgICAgICAgbWV0aG9kOiAnZXZlbnQnLFxyXG4gICAgICAgICAgc3luY05hbWU6ICdzeW5jQXVkaW9XcmFwQ2xpY2snLFxyXG4gICAgICAgICAgZnVuY1R5cGU6ICdhdWRpbydcclxuICAgICAgICB9KTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzeW5jQXVkaW9XcmFwQ2xpY2snKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gICQoXCIuaXRlbVwiKS5vbihcInN5bmNBdWRpb1dyYXBDbGlja1wiLCBcIi5hdWRpby13cmFwXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRhdWRpbyA9IG51bGw7XHJcbiAgICAkYXVkaW8gPSAkKHRoaXMpLmZpbmQoXCJhdWRpb1wiKS5nZXQoMCk7XHJcbiAgICB2YXIgJGltZyA9ICQodGhpcykuZmluZChcImltZ1wiKTtcclxuICAgICRhdWRpbyA/ICRhdWRpby5wbGF5KCkgOiBcIlwiO1xyXG4gICAgaWYgKCRpbWcubGVuZ3RoICE9IDApIHtcclxuICAgICAgJGltZy5hdHRyKFwic3JjXCIsICQodGhpcykuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIpLnJlcGxhY2UoXCIucG5nXCIsIFwiLmdpZlwiKSk7XHJcbiAgICAgIC8v5pKt5pS+5a6M5q+VaW1n54q25oCBXHJcbiAgICAgICRhdWRpby5vbmVuZGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJGltZy5hdHRyKFwic3JjXCIsICQodGhpcykuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIpLnJlcGxhY2UoXCIuZ2lmXCIsIFwiLnBuZ1wiKSk7XHJcbiAgICAgIH0uYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMpLmZpbmQoXCJhdWRpb1wiKS5nZXQoMCkucGxheSgpO1xyXG4gICAgU0RLLnNldEV2ZW50TG9jaygpO1xyXG4gICAgYXVkaW9XcmFwQ2xpY2tUaW1lciA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pXHJcblxyXG5cclxuICAkKFwiLml0ZW1cIikub24oXCJtb3VzZWVudGVyXCIsIFwiLmF1ZGlvLXdyYXBcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKGF1ZGlvV3JhcE1vdXNlZW50ZXJUaW1lcikge1xyXG4gICAgICBhdWRpb1dyYXBNb3VzZWVudGVyVGltZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghaXNTeW5jKSB7XHJcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzeW5jQXVkaW9XcmFwTW91c2VlbnRlcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgU0RLLmJpbmRTeW5jRXZ0KHtcclxuICAgICAgICBpbmRleDogJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3N5bmNhY3Rpb25zJyksXHJcbiAgICAgICAgbWV0aG9kOiAnZXZlbnQnLFxyXG4gICAgICAgIHN5bmNOYW1lOiAnc3luY0F1ZGlvV3JhcE1vdXNlZW50ZXInXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgJChcIi5pdGVtXCIpLm9uKFwic3luY0F1ZGlvV3JhcE1vdXNlZW50ZXJcIiwgXCIuYXVkaW8td3JhcFwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKHRoaXMpLmNzcyhcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtNTAlLC01MCUpIHNjYWxlKDEuMSlcIik7XHJcbiAgICBTREsuc2V0RXZlbnRMb2NrKCk7XHJcbiAgICBhdWRpb1dyYXBNb3VzZWVudGVyVGltZXIgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9KVxyXG5cclxuICAkKFwiLml0ZW1cIikub24oXCJtb3VzZWxlYXZlXCIsIFwiLmF1ZGlvLXdyYXBcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKGF1ZGlvV3JhcE1vdXNlbGVhdmVUaW1lcikge1xyXG4gICAgICBhdWRpb1dyYXBNb3VzZWxlYXZlVGltZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghaXNTeW5jKSB7XHJcbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzeW5jQXVkaW9XcmFwTW91c2VsZWF2ZScpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgU0RLLmJpbmRTeW5jRXZ0KHtcclxuICAgICAgICBpbmRleDogJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3N5bmNhY3Rpb25zJyksXHJcbiAgICAgICAgbWV0aG9kOiAnZXZlbnQnLFxyXG4gICAgICAgIHN5bmNOYW1lOiAnc3luY0F1ZGlvV3JhcE1vdXNlbGVhdmUnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgJChcIi5pdGVtXCIpLm9uKFwic3luY0F1ZGlvV3JhcE1vdXNlbGVhdmVcIiwgXCIuYXVkaW8td3JhcFwiLCBmdW5jdGlvbigpIHtcclxuXHJcblxyXG4gICAgJCh0aGlzKS5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoLTUwJSwtNTAlKSBzY2FsZSgxKVwiKTtcclxuICAgIFNESy5zZXRFdmVudExvY2soKTtcclxuICAgIGF1ZGlvV3JhcE1vdXNlbGVhdmVUaW1lciA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pXHJcblxyXG5cclxuXHJcbiAgLy8gLm9uKFwibW91c2VlbnRlclwiLGZ1bmN0aW9uKGUpe1xyXG4gIC8vICAgaWYgKGl0ZW1Nb3VzZWVudGVyVGltZXIpIHtcclxuICAvLyAgICAgICBpdGVtTW91c2VlbnRlclRpbWVyID0gZmFsc2U7XHJcblxyXG4gIC8vICAgICAgIGlmICghaXNTeW5jKSB7XHJcbiAgLy8gICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ3N5bmNJdGVtTW91c2VlbnRlcicpO1xyXG4gIC8vICAgICAgICAgcmV0dXJuO1xyXG4gIC8vICAgICAgIH1cclxuXHJcbiAgLy8gICAgICAgU0RLLmJpbmRTeW5jRXZ0KHtcclxuICAvLyAgICAgICAgIGluZGV4OiAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnc3luY2FjdGlvbnMnKSxcclxuICAvLyAgICAgICAgIG1ldGhvZDogJ2V2ZW50JyxcclxuICAvLyAgICAgICAgIHN5bmNOYW1lOiAnc3luY0l0ZW1Nb3VzZWVudGVyJ1xyXG4gIC8vICAgICAgIH0pO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gfSkub24oXCJzeW5jSXRlbU1vdXNlZW50ZXJcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuICAvLyAgICQodGhpcykuY3NzKFwib3BhY2l0eVwiLFwiLjlcIik7XHJcbiAgLy8gICBTREsuc2V0RXZlbnRMb2NrKCk7XHJcbiAgLy8gICBpdGVtTW91c2VlbnRlclRpbWVyID0gdHJ1ZTtcclxuXHJcbiAgLy8gICByZXR1cm4gZmFsc2U7XHJcbiAgLy8gfSlcclxuICAvLyAub24oXCJtb3VzZWxlYXZlXCIsZnVuY3Rpb24oZSl7XHJcbiAgLy8gICBpZiAoaXRlbU1vdXNlbGVhdmVUaW1lcikge1xyXG4gIC8vICAgICAgIGl0ZW1Nb3VzZWxlYXZlVGltZXIgPSBmYWxzZTtcclxuXHJcbiAgLy8gICAgICAgaWYgKCFpc1N5bmMpIHtcclxuICAvLyAgICAgICAgICQodGhpcykudHJpZ2dlcignc3luY0l0ZW1Nb3VzZWxlYXZlJyk7XHJcbiAgLy8gICAgICAgICByZXR1cm47XHJcbiAgLy8gICAgICAgfVxyXG5cclxuICAvLyAgICAgICBTREsuYmluZFN5bmNFdnQoe1xyXG4gIC8vICAgICAgICAgaW5kZXg6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdzeW5jYWN0aW9ucycpLFxyXG4gIC8vICAgICAgICAgbWV0aG9kOiAnZXZlbnQnLFxyXG4gIC8vICAgICAgICAgc3luY05hbWU6ICdzeW5jSXRlbU1vdXNlbGVhdmUnXHJcbiAgLy8gICAgICAgfSk7XHJcbiAgLy8gICAgIH1cclxuICAvLyB9KS5vbihcInN5bmNJdGVtTW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpIHtcclxuXHJcblxyXG4gIC8vICAgJCh0aGlzKS5jc3MoXCJvcGFjaXR5XCIsXCIxXCIpO1xyXG4gIC8vICAgU0RLLnNldEV2ZW50TG9jaygpO1xyXG4gIC8vICAgaXRlbU1vdXNlbGVhdmVUaW1lciA9IHRydWU7XHJcblxyXG4gIC8vICAgcmV0dXJuIGZhbHNlO1xyXG4gIC8vIH0pO1xyXG5cclxuXHJcblxyXG4gIHZhciBpdGVtQ2xpY2sgPSB0cnVlO1xyXG4gIHdyYXBwZXIub24oJ2NsaWNrJywgJy5pdGVtJywgZnVuY3Rpb24oZSkge1xyXG4gICAgLy9jb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT09PT0954K55Ye75ZWmPT09PT09PT0nKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGlmIChpdGVtQ2xpY2spIHtcclxuICAgICAgaXRlbUNsaWNrID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoIWlzU3luYykge1xyXG4gICAgICAgICQodGhpcykudHJpZ2dlcignc3luY0l0ZW1DbGljaycpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBTREsuYmluZFN5bmNFdnQoe1xyXG4gICAgICAgIHNlbmRVc2VyOiAnJyxcclxuICAgICAgICByZWNlaXZlVXNlcjogJycsXHJcbiAgICAgICAgaW5kZXg6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdzeW5jYWN0aW9ucycpLFxyXG4gICAgICAgIGV2ZW50VHlwZTogJ2NsaWNrJyxcclxuICAgICAgICBtZXRob2Q6ICdldmVudCcsXHJcbiAgICAgICAgc3luY05hbWU6ICdzeW5jSXRlbUNsaWNrJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIHZhciBmaXJzdENhcmQgPSBudWxsLFxyXG4gICAgc2Vjb25kQ2FyZCA9IG51bGwsXHJcbiAgICBfbWFzayA9IG51bGw7XHJcbiAgXHJcbiAgd3JhcHBlci5vbihcInN5bmNJdGVtQ2xpY2tcIiwgXCIuaXRlbVwiLCBmdW5jdGlvbigpIHtcclxuICAgIC8vY29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PT09PT09PeWQjOatpeeCueWHu+WVpj09PT09PT09JylcclxuICAgIHZhciBfdGhpcyA9ICQodGhpcyksXHJcbiAgICAgIHR5cGUgPSBfdGhpcy5kYXRhKFwidHlwZVwiKSxcclxuICAgICAgaWQgPSBfdGhpcy5kYXRhKFwiaWRcIiksXHJcbiAgICAgIGltZyA9IHR5cGUgPT0gXCJpbWdcIiA/IF90aGlzLmRhdGEoJ2ltZycpIDogXCJcIixcclxuICAgICAgYXVkaW8gPSBfdGhpcy5kYXRhKCdhdWRpbycpLFxyXG4gICAgICB0ZXh0ID0gdHlwZSA9PSBcInRleHRcIiA/IF90aGlzLmRhdGEoJ3RleHQnKSA6IFwiXCI7XHJcblxyXG4gICAgaWYgKF90aGlzLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgIFNESy5zZXRFdmVudExvY2soKTtcclxuICAgICAgaXRlbUNsaWNrID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmaXJzdENhcmQpIHtcclxuXHJcbiAgICAgIGlmIChfdGhpcy5kYXRhKFwiaWRcIikgPT0gZmlyc3RDYXJkLmRhdGEoXCJpZFwiKSkge1xyXG4gICAgICAgIF90aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMpLnF1ZXVlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgX21hc2sgPSBtYXNrLnJlcGxhY2UoL3t7aW1nfX0vZywgaW1nID09IFwiXCIgPyBmaXJzdENhcmQuZGF0YShcImltZ1wiKSA6IGltZylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7YXVkaW99fS9nLCBhdWRpbylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7dGV4dH19L2csIHRleHQgPT0gXCJcIiA/IGZpcnN0Q2FyZC5kYXRhKFwidGV4dFwiKSA6IHRleHQpO1xyXG4gICAgICAgICAgX21hc2sgPSAkKF9tYXNrKS5hcHBlbmRUbyh3cmFwcGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAoYXVkaW8pIHsgLy9yZXNldCBieSBwYW55XHJcbiAgICAgICAgICAgIGlmKGlzU3luYyl7XHJcbiAgICAgICAgICAgICAgdmFyIGZyYW1lX3VzZXJfaWQgPSAkKHdpbmRvdy5mcmFtZUVsZW1lbnQpLmF0dHIoJ3VzZXJfaWQnKTtcclxuICAgICAgICAgICAgICB2YXIgY3VycmVudF91c2VyX2lkID0gU0RLLmdldENsYXNzQ29uZigpLnVzZXIuaWQ7XHJcbiAgICAgICAgICAgICAgaWYgKGZyYW1lX3VzZXJfaWQgPT0gY3VycmVudF91c2VyX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiPT09PT09PeW9k+WJjeS4jeaYr2NhY2hlLWZyYW1lPT09PT09PT3lrabnlJ/oh6rlt7HnmoRmcmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIF9tYXNrLmZpbmQoXCJhdWRpb1wiKS5nZXQoMCkucGxheSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgX21hc2suZmluZChcImF1ZGlvXCIpLmdldCgwKS5wbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF9tYXNrLmZpbmQoJy5hdWRpby13cmFwJykuaGlkZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQodGhpcykuZGVxdWV1ZSgpO1xyXG4gICAgICAgIH0pLmRlbGF5KDI1MDApLnF1ZXVlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJChcIi5tYXNrLWFuc3dlclwiKS5mYWRlT3V0KDMwMCk7XHJcbiAgICAgICAgICAkKHRoaXMpLmRlcXVldWUoKTtcclxuICAgICAgICB9KS5kZWxheSgxMDApLnF1ZXVlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgZmlyc3RDYXJkLmNzcyhcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICBfdGhpcy5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgJCh0aGlzKS5kZXF1ZXVlKCk7XHJcbiAgICAgICAgfSkuZGVsYXkoMTAwKS5xdWV1ZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGZpcnN0Q2FyZCA9IG51bGw7XHJcbiAgICAgICAgICBfbWFzay5yZW1vdmUoKTtcclxuICAgICAgICAgICQodGhpcykuZGVxdWV1ZSgpO1xyXG4gICAgICAgICAgLy/miYDmnInnmoTpmJ/liJfmiafooYzlrozljrvop6PplIFcclxuICAgICAgICAgIFNESy5zZXRFdmVudExvY2soKTtcclxuICAgICAgICAgIGl0ZW1DbGljayA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gYWxlcnQoXCJtYXRjaFwiKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gYWxlcnQoXCJub21hdGNoXCIpO1xyXG5cclxuICAgICAgICBmaXJzdENhcmQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgX3RoaXMuYWRkQ2xhc3MoXCJlcnJvciBzaGFrZVwiKTtcclxuICAgICAgICBmaXJzdENhcmQuYWRkQ2xhc3MoXCJlcnJvciBzaGFrZVwiKTtcclxuICAgICAgICAkKHRoaXMpLmRlbGF5KDUwMCkucXVldWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBmaXJzdENhcmQucmVtb3ZlQ2xhc3MoXCJzaGFrZVwiKTtcclxuICAgICAgICAgIF90aGlzLnJlbW92ZUNsYXNzKFwic2hha2VcIik7XHJcbiAgICAgICAgICAkKHRoaXMpLmRlcXVldWUoKTtcclxuICAgICAgICB9KS5kZWxheSgwKS5xdWV1ZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGZpcnN0Q2FyZC5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xyXG4gICAgICAgICAgX3RoaXMucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuICAgICAgICAgICQodGhpcykuZGVxdWV1ZSgpO1xyXG4gICAgICAgIH0pLmRlbGF5KDEwMCkucXVldWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBmaXJzdENhcmQgPSBudWxsO1xyXG4gICAgICAgICAgJCh0aGlzKS5kZXF1ZXVlKCk7XHJcbiAgICAgICAgICAvL+aJgOacieeahOmYn+WIl+aJp+ihjOWujOWOu+ino+mUgVxyXG4gICAgICAgICAgU0RLLnNldEV2ZW50TG9jaygpO1xyXG4gICAgICAgICAgaXRlbUNsaWNrID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgX3RoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICBmaXJzdENhcmQgPSBfdGhpcztcclxuICAgICAgLy/miYDmnInnmoTpmJ/liJfmiafooYzlrozljrvop6PplIFcclxuICAgICAgU0RLLnNldEV2ZW50TG9jaygpO1xyXG4gICAgICBpdGVtQ2xpY2sgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVDgvanMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\n__webpack_require__(3);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2pzL2NvbW1vbi5qcz8wOWEzIl0sIm5hbWVzIjpbInJlcXVpcmUiXSwibWFwcGluZ3MiOiJBQUFBOztBQU9BLG1CQUFBQSxDQUFRLENBQVIiLCJmaWxlIjoiMi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXHJcbi8vIOajgOa1i2pxdWVyeeWvueixoVxyXG4vLyBpZiAod2luZG93LmpRdWVyeSkge1xyXG4vLyAgIHdpbmRvdy4kID0gd2luZG93LmpRdWVyeTtcclxuLy8gfSBlbHNlIHtcclxuLy8gICB3aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuLy8gfVxyXG5yZXF1aXJlKCcuL3RpdGxlLmpzJyk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24vanMvY29tbW9uLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	eval("'use strict';\n\n$(function () {\n\tvar data = {\n\t\tbg: configData.bg,\n\t\tdesc: configData.desc,\n\t\ttitle: configData.source.title,\n\t\ttgs: configData.tg,\n\t\ttgMoved: false,\n\t\tsync: parent.window.h5SyncActions && parent.window.h5SyncActions.isSync,\n\t\tgetQueryString: function getQueryString(key) {\n\t\t\tvar hrefParam = this.parseURL(\"http://www.example.com\");\n\t\t\tif (top.frames[0] && top.frames[0].frameElement) {\n\t\t\t\threfParam = this.parseURL(top.frames[0].frameElement.src);\n\t\t\t}\n\t\t\treturn hrefParam.params[key];\n\t\t},\n\t\tparseURL: function parseURL(url) {\n\t\t\tvar a = document.createElement('a');\n\t\t\ta.href = url;\n\t\t\treturn {\n\t\t\t\tsource: url,\n\t\t\t\tprotocol: a.protocol.replace(':', ''),\n\t\t\t\thost: a.hostname,\n\t\t\t\tport: a.port,\n\t\t\t\tquery: a.search,\n\t\t\t\tparams: function () {\n\t\t\t\t\tvar ret = {},\n\t\t\t\t\t    seg = a.search.replace(/^\\?/, '').split('&'),\n\t\t\t\t\t    len = seg.length,\n\t\t\t\t\t    i = 0,\n\t\t\t\t\t    s;\n\t\t\t\t\tfor (; i < len; i++) {\n\t\t\t\t\t\tif (!seg[i]) {\n\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\t\t\t\t\t\ts = seg[i].split('=');\n\t\t\t\t\t\tret[s[0]] = s[1];\n\t\t\t\t\t}\n\t\t\t\t\treturn ret;\n\t\t\t\t}(),\n\t\t\t\tfile: (a.pathname.match(/\\/([^\\/?#]+)$/i) || [, ''])[1],\n\t\t\t\thash: a.hash.replace('#', ''),\n\t\t\t\tpath: a.pathname.replace(/^([^\\/])/, '/$1'),\n\t\t\t\trelative: (a.href.match(/tps?:\\/\\/[^\\/]+(.+)/) || [, ''])[1],\n\t\t\t\tsegments: a.pathname.replace(/^\\//, '').split('/')\n\t\t\t};\n\t\t},\n\t\tuserType: function userType() {\n\t\t\tvar userType = '';\n\t\t\tif (this.sync) {\n\t\t\t\tuserType = window.frameElement.getAttribute('user_type');\n\t\t\t} else {\n\t\t\t\tuserType = this.getQueryString('role') === '1' ? 'tea' : 'stu';\n\t\t\t}\n\t\t\treturn userType;\n\t\t},\n\t\tsetBg: function setBg() {\n\t\t\tif (this.bg) {\n\t\t\t\t$('.container').css('background-image', 'url(' + this.bg + ')');\n\t\t\t}\n\t\t},\n\t\tsetDesc: function setDesc() {\n\t\t\tif (this.desc) {\n\t\t\t\t$('.desc').text(this.desc).show();\n\t\t\t}\n\t\t},\n\t\tsetTitle: function setTitle() {\n\t\t\tvar length = this.title.length;\n\t\t\tif (length > 0) {\n\t\t\t\tif (length <= 28) {\n\t\t\t\t\t$('.title h3').css('font-size', '0.72rem');\n\t\t\t\t} else if (length <= 42) {\n\t\t\t\t\t$('.title h3').css('font-size', '0.48rem');\n\t\t\t\t} else {\n\t\t\t\t\t$('.title h3').css('font-size', '0.36rem');\n\t\t\t\t}\n\t\t\t\t$('.title h3').text(this.title);\n\t\t\t\t$('.title').show();\n\t\t\t}\n\t\t},\n\t\tcreateTg: function createTg() {\n\t\t\tvar str = '';\n\t\t\tvar tgTemp = '';\n\t\t\tthis.tgs.forEach(function (item, index) {\n\t\t\t\tstr += '\\n        \\t\\t<li>\\n\\t\\t\\t\\t    <div class=\"tg-list-tit clearfix\">\\n\\t\\t\\t\\t    <span class=\"fl tg-list-num\">' + (index + 1) + '</span>\\n\\t\\t\\t\\t    <h3 class=\"fl\">' + item.title + '</h3>\\n\\t\\t\\t\\t    </div>\\n\\t\\t\\t\\t    <p class=\"tg-list-des\">' + item.content + '</p>\\n\\t\\t\\t    </li>\\n        \\t\\t';\n\t\t\t});\n\t\t\ttgTemp = '<img src=\"image/tg.png\" alt=\"\" class=\"tg\" style=\"display: none\">\\n            <div class=\"tg-content\">\\n                <ul>' + str + '</ul>\\n            </div>\\n            ';\n\t\t\t$(tgTemp).appendTo('#tg');\n\t\t},\n\t\tshowTg: function showTg() {\n\t\t\tif (this.tgs && this.tgs.length > 0 && (this.tgs[0].title.length > 0 || this.tgs[0].content.length > 0)) {\n\t\t\t\tthis.createTg();\n\t\t\t\t$('.tg').show();\n\t\t\t}\n\t\t},\n\t\tshowStu: function showStu() {\n\t\t\t$('.tea').remove();\n\t\t\t$('.stu').removeClass('hide');\n\t\t},\n\t\tshowTea: function showTea() {\n\t\t\t$('.stu').remove();\n\t\t\t$('.tea').removeClass('hide');\n\t\t\tthis.showTg();\n\t\t},\n\t\tshowMainPage: function showMainPage() {\n\t\t\tvar userType = this.userType();\n\t\t\tswitch (userType) {\n\t\t\t\tcase 'stu':\n\t\t\t\t\tthis.showStu();\n\t\t\t\t\tbreak;\n\t\t\t\tdefault:\n\t\t\t\t\tthis.showTea();\n\t\t\t}\n\t\t},\n\t\tbindEvents: function bindEvents() {\n\t\t\t$('#tg').on('click', '.tg', function () {\n\t\t\t\tif (!this.tgMoved) {\n\t\t\t\t\tthis.tgMoved = true;\n\t\t\t\t\t$('.tg-content,.tg').addClass('active');\n\t\t\t\t} else {\n\t\t\t\t\tthis.tgMoved = false;\n\t\t\t\t\t$('.tg-content,.tg').removeClass('active');\n\t\t\t\t}\n\t\t\t});\n\t\t},\n\t\tinit: function init() {\n\t\t\tthis.setBg();\n\t\t\tthis.setDesc();\n\t\t\tthis.setTitle();\n\t\t\tthis.showMainPage();\n\t\t\tthis.bindEvents();\n\t\t}\n\t};\n\tdata.init();\n});//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2pzL3RpdGxlLmpzP2JhNzMiXSwibmFtZXMiOlsiJCIsImRhdGEiLCJiZyIsImNvbmZpZ0RhdGEiLCJkZXNjIiwidGl0bGUiLCJzb3VyY2UiLCJ0Z3MiLCJ0ZyIsInRnTW92ZWQiLCJzeW5jIiwicGFyZW50Iiwid2luZG93IiwiaDVTeW5jQWN0aW9ucyIsImlzU3luYyIsImdldFF1ZXJ5U3RyaW5nIiwia2V5IiwiaHJlZlBhcmFtIiwicGFyc2VVUkwiLCJ0b3AiLCJmcmFtZXMiLCJmcmFtZUVsZW1lbnQiLCJzcmMiLCJwYXJhbXMiLCJ1cmwiLCJhIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInByb3RvY29sIiwicmVwbGFjZSIsImhvc3QiLCJob3N0bmFtZSIsInBvcnQiLCJxdWVyeSIsInNlYXJjaCIsInJldCIsInNlZyIsInNwbGl0IiwibGVuIiwibGVuZ3RoIiwiaSIsInMiLCJmaWxlIiwicGF0aG5hbWUiLCJtYXRjaCIsImhhc2giLCJwYXRoIiwicmVsYXRpdmUiLCJzZWdtZW50cyIsInVzZXJUeXBlIiwiZ2V0QXR0cmlidXRlIiwic2V0QmciLCJjc3MiLCJzZXREZXNjIiwidGV4dCIsInNob3ciLCJzZXRUaXRsZSIsImNyZWF0ZVRnIiwic3RyIiwidGdUZW1wIiwiZm9yRWFjaCIsIml0ZW0iLCJpbmRleCIsImNvbnRlbnQiLCJhcHBlbmRUbyIsInNob3dUZyIsInNob3dTdHUiLCJyZW1vdmUiLCJyZW1vdmVDbGFzcyIsInNob3dUZWEiLCJzaG93TWFpblBhZ2UiLCJiaW5kRXZlbnRzIiwib24iLCJhZGRDbGFzcyIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLEVBQUUsWUFBVTtBQUNYLEtBQU1DLE9BQU87QUFDWkMsTUFBR0MsV0FBV0QsRUFERjtBQUVaRSxRQUFLRCxXQUFXQyxJQUZKO0FBR1pDLFNBQU1GLFdBQVdHLE1BQVgsQ0FBa0JELEtBSFo7QUFJWkUsT0FBSUosV0FBV0ss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QUFpQyxRQUFqQztBQUNBO0FBQ0QsSUFSRDtBQVNBLEdBbElXO0FBbUlaTSxRQUFLLGdCQUFVO0FBQ2QsUUFBS3ZCLEtBQUw7QUFDQSxRQUFLRSxPQUFMO0FBQ0EsUUFBS0csUUFBTDtBQUNBLFFBQUtjLFlBQUw7QUFDQSxRQUFLQyxVQUFMO0FBQ0E7QUF6SVcsRUFBYjtBQTJJQXZFLE1BQUswRSxJQUFMO0FBQ0EsQ0E3SUQiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKXtcclxuXHRjb25zdCBkYXRhID0ge1xyXG5cdFx0Ymc6Y29uZmlnRGF0YS5iZyxcclxuXHRcdGRlc2M6Y29uZmlnRGF0YS5kZXNjLFxyXG5cdFx0dGl0bGU6Y29uZmlnRGF0YS5zb3VyY2UudGl0bGUsXHJcblx0XHR0Z3M6Y29uZmlnRGF0YS50ZyxcclxuXHRcdHRnTW92ZWQ6ZmFsc2UsXHJcblx0XHRzeW5jOnBhcmVudC53aW5kb3cuaDVTeW5jQWN0aW9ucyAmJiBwYXJlbnQud2luZG93Lmg1U3luY0FjdGlvbnMuaXNTeW5jLFxyXG5cdFx0Z2V0UXVlcnlTdHJpbmc6ZnVuY3Rpb24oa2V5KXtcclxuXHRcdFx0dmFyIGhyZWZQYXJhbT10aGlzLnBhcnNlVVJMKFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbVwiKTtcclxuICAgICAgICAgXHRpZih0b3AuZnJhbWVzWzBdJiZ0b3AuZnJhbWVzWzBdLmZyYW1lRWxlbWVudCl7XHJcblx0XHRcdCAgICBocmVmUGFyYW0gPSB0aGlzLnBhcnNlVVJMKHRvcC5mcmFtZXNbMF0uZnJhbWVFbGVtZW50LnNyYylcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaHJlZlBhcmFtLnBhcmFtc1trZXldXHJcblx0XHR9LFxyXG5cdFx0cGFyc2VVUkw6IGZ1bmN0aW9uKHVybCkge1xyXG5cdFx0ICAgdmFyIGEgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcblx0XHQgICBhLmhyZWYgPSB1cmxcclxuXHRcdCAgIHJldHVybiB7XHJcblx0XHQgICAgICAgc291cmNlOiB1cmwsXHJcblx0XHQgICAgICAgcHJvdG9jb2w6IGEucHJvdG9jb2wucmVwbGFjZSgnOicsJycpLFxyXG5cdFx0ICAgICAgIGhvc3Q6IGEuaG9zdG5hbWUsXHJcblx0XHQgICAgICAgcG9ydDogYS5wb3J0LFxyXG5cdFx0ICAgICAgIHF1ZXJ5OiBhLnNlYXJjaCxcclxuXHRcdCAgICAgICBwYXJhbXM6IChmdW5jdGlvbigpe1xyXG5cdFx0ICAgICAgICAgICB2YXIgcmV0ID0ge30sXHJcblx0XHQgICAgICAgICAgICAgc2VnID0gYS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sJycpLnNwbGl0KCcmJyksXHJcblx0XHQgICAgICAgICAgICAgbGVuID0gc2VnLmxlbmd0aCwgaSA9IDAsIHNcclxuXHRcdCAgICAgICAgICAgZm9yICg7aTxsZW47aSsrKSB7XHJcblx0XHQgICAgICAgICAgICAgICBpZiAoIXNlZ1tpXSkgeyBjb250aW51ZTsgfVxyXG5cdFx0ICAgICAgICAgICAgICAgcyA9IHNlZ1tpXS5zcGxpdCgnPScpXHJcblx0XHQgICAgICAgICAgICAgICByZXRbc1swXV0gPSBzWzFdXHJcblx0XHQgICAgICAgICAgIH1cclxuXHRcdCAgICAgICAgICAgcmV0dXJuIHJldFxyXG5cdFx0ICAgICAgIH0pKCksXHJcblx0XHQgICAgICAgZmlsZTogKGEucGF0aG5hbWUubWF0Y2goL1xcLyhbXlxcLz8jXSspJC9pKSB8fCBbLCcnXSlbMV0sXHJcblx0XHQgICAgICAgaGFzaDogYS5oYXNoLnJlcGxhY2UoJyMnLCcnKSxcclxuXHRcdCAgICAgICBwYXRoOiBhLnBhdGhuYW1lLnJlcGxhY2UoL14oW15cXC9dKS8sJy8kMScpLFxyXG5cdFx0ICAgICAgIHJlbGF0aXZlOiAoYS5ocmVmLm1hdGNoKC90cHM/OlxcL1xcL1teXFwvXSsoLispLykgfHwgWywnJ10pWzFdLFxyXG5cdFx0ICAgICAgIHNlZ21lbnRzOiBhLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKS5zcGxpdCgnLycpXHJcblx0XHQgICB9XHJcblx0XHR9LFxyXG5cdFx0dXNlclR5cGU6ZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHVzZXJUeXBlID0gJydcclxuXHRcdFx0aWYodGhpcy5zeW5jKXtcclxuXHRcdFx0XHR1c2VyVHlwZSA9IHdpbmRvdy5mcmFtZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCd1c2VyX3R5cGUnKVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR1c2VyVHlwZSA9IHRoaXMuZ2V0UXVlcnlTdHJpbmcoJ3JvbGUnKSA9PT0gJzEnID8gJ3RlYSc6J3N0dSdcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdXNlclR5cGVcclxuXHRcdH0sXHJcblx0XHRzZXRCZzpmdW5jdGlvbigpe1xyXG5cdFx0XHRpZih0aGlzLmJnKXtcclxuXHRcdFx0XHQkKCcuY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywndXJsKCcrIHRoaXMuYmcgKycpJylcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHNldERlc2M6ZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYodGhpcy5kZXNjKXtcclxuXHRcdFx0XHQkKCcuZGVzYycpLnRleHQodGhpcy5kZXNjKS5zaG93KClcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHNldFRpdGxlOmZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCBsZW5ndGggPSB0aGlzLnRpdGxlLmxlbmd0aFxyXG5cdFx0XHRpZihsZW5ndGggPiAwKXtcclxuXHRcdFx0XHRpZiggbGVuZ3RoIDw9IDI4ICl7XHJcblx0XHRcdFx0XHQkKCcudGl0bGUgaDMnKS5jc3MoJ2ZvbnQtc2l6ZScsJzAuNzJyZW0nKVxyXG5cdFx0XHRcdH1lbHNlIGlmKGxlbmd0aCA8PSA0MiApe1xyXG5cdFx0XHRcdFx0JCgnLnRpdGxlIGgzJykuY3NzKCdmb250LXNpemUnLCcwLjQ4cmVtJylcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCQoJy50aXRsZSBoMycpLmNzcygnZm9udC1zaXplJywnMC4zNnJlbScpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoJy50aXRsZSBoMycpLnRleHQodGhpcy50aXRsZSlcclxuXHRcdFx0XHQkKCcudGl0bGUnKS5zaG93KClcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGNyZWF0ZVRnOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCBzdHIgPSAnJ1xyXG4gICAgICAgICAgICBsZXQgdGdUZW1wID0gJydcclxuICAgICAgICBcdHRoaXMudGdzLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpbmRleCl7XHJcbiAgICAgICAgXHRcdHN0ciArPSBgXHJcbiAgICAgICAgXHRcdDxsaT5cclxuXHRcdFx0XHQgICAgPGRpdiBjbGFzcz1cInRnLWxpc3QtdGl0IGNsZWFyZml4XCI+XHJcblx0XHRcdFx0ICAgIDxzcGFuIGNsYXNzPVwiZmwgdGctbGlzdC1udW1cIj4ke2luZGV4KzF9PC9zcGFuPlxyXG5cdFx0XHRcdCAgICA8aDMgY2xhc3M9XCJmbFwiPiR7aXRlbS50aXRsZX08L2gzPlxyXG5cdFx0XHRcdCAgICA8L2Rpdj5cclxuXHRcdFx0XHQgICAgPHAgY2xhc3M9XCJ0Zy1saXN0LWRlc1wiPiR7aXRlbS5jb250ZW50fTwvcD5cclxuXHRcdFx0ICAgIDwvbGk+XHJcbiAgICAgICAgXHRcdGBcclxuICAgICAgICBcdH0pXHJcbiAgICAgICAgXHR0Z1RlbXAgPSBgPGltZyBzcmM9XCJpbWFnZS90Zy5wbmdcIiBhbHQ9XCJcIiBjbGFzcz1cInRnXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0Zy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8dWw+JHtzdHJ9PC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgJCh0Z1RlbXApLmFwcGVuZFRvKCcjdGcnKVxyXG5cdFx0fSxcclxuXHRcdHNob3dUZzpmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiggdGhpcy50Z3MgJiYgdGhpcy50Z3MubGVuZ3RoID4gMCAmJiAodGhpcy50Z3NbMF0udGl0bGUubGVuZ3RoID4gMCB8fCB0aGlzLnRnc1swXS5jb250ZW50Lmxlbmd0aCA+IDApICl7XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVUZygpXHJcblx0XHRcdFx0JCgnLnRnJykuc2hvdygpXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzaG93U3R1OmZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJy50ZWEnKS5yZW1vdmUoKVxyXG5cdFx0XHQkKCcuc3R1JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxyXG5cdFx0fSxcclxuXHRcdHNob3dUZWE6ZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnLnN0dScpLnJlbW92ZSgpXHJcblx0XHRcdCQoJy50ZWEnKS5yZW1vdmVDbGFzcygnaGlkZScpXHJcblx0XHRcdHRoaXMuc2hvd1RnKClcclxuXHRcdH0sXHJcblx0XHRzaG93TWFpblBhZ2U6ZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IHVzZXJUeXBlID0gdGhpcy51c2VyVHlwZSgpXHJcblx0XHRcdHN3aXRjaCAodXNlclR5cGUpIHtcclxuXHRcdFx0XHRjYXNlICdzdHUnIDogXHJcblx0XHRcdFx0XHR0aGlzLnNob3dTdHUoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHR0aGlzLnNob3dUZWEoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGJpbmRFdmVudHM6ZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyN0ZycpLm9uKCdjbGljaycsJy50ZycsZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoIXRoaXMudGdNb3ZlZCl7XHJcblx0XHRcdFx0XHR0aGlzLnRnTW92ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHQkKCcudGctY29udGVudCwudGcnKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMudGdNb3ZlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHQkKCcudGctY29udGVudCwudGcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9LFxyXG5cdFx0aW5pdDpmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLnNldEJnKClcclxuXHRcdFx0dGhpcy5zZXREZXNjKClcclxuXHRcdFx0dGhpcy5zZXRUaXRsZSgpXHJcblx0XHRcdHRoaXMuc2hvd01haW5QYWdlKClcclxuXHRcdFx0dGhpcy5iaW5kRXZlbnRzKClcclxuXHRcdH1cclxuXHR9XHJcblx0ZGF0YS5pbml0KClcclxufSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tbW9uL2pzL3RpdGxlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	eval("\"use strict\";\n\nwindow.onload = function () {\n    var hostName = window.location.hostname;\n    if (parent.window.h5SyncActions && parent.window.h5SyncActions.isSync) {\n        var currentWindowId = $(window.frameElement).attr('id');\n        var iframeId = \"h5_course_self_frame\";\n        if (currentWindowId != \"h5_course_cache_frame\") {\n            $(window.frameElement).attr('load_status', '1');\n        }\n        if (currentWindowId == iframeId) {\n            parent.window.h5SyncActions.isPracticePage(true);\n            parent.window.h5SyncActions.isResultPage(false);\n        }\n    }\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvVDgvanMvc3luYy5qcz8xYzFiIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9ubG9hZCIsImhvc3ROYW1lIiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBhcmVudCIsImg1U3luY0FjdGlvbnMiLCJpc1N5bmMiLCJjdXJyZW50V2luZG93SWQiLCIkIiwiZnJhbWVFbGVtZW50IiwiYXR0ciIsImlmcmFtZUlkIiwiaXNQcmFjdGljZVBhZ2UiLCJpc1Jlc3VsdFBhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE1BQVAsR0FBZ0IsWUFBVztBQUN2QixRQUFJQyxXQUFXRixPQUFPRyxRQUFQLENBQWdCQyxRQUEvQjtBQUNBLFFBQUlDLE9BQU9MLE1BQVAsQ0FBY00sYUFBZCxJQUErQkQsT0FBT0wsTUFBUCxDQUFjTSxhQUFkLENBQTRCQyxNQUEvRCxFQUF1RTtBQUNuRSxZQUFJQyxrQkFBa0JDLEVBQUVULE9BQU9VLFlBQVQsRUFBdUJDLElBQXZCLENBQTRCLElBQTVCLENBQXRCO0FBQ0EsWUFBSUMsV0FBVyxzQkFBZjtBQUNBLFlBQUlKLG1CQUFtQix1QkFBdkIsRUFBZ0Q7QUFDNUNDLGNBQUVULE9BQU9VLFlBQVQsRUFBdUJDLElBQXZCLENBQTRCLGFBQTVCLEVBQTJDLEdBQTNDO0FBQ0g7QUFDRCxZQUFHSCxtQkFBbUJJLFFBQXRCLEVBQStCO0FBQzNCUCxtQkFBT0wsTUFBUCxDQUFjTSxhQUFkLENBQTRCTyxjQUE1QixDQUEyQyxJQUEzQztBQUNBUixtQkFBT0wsTUFBUCxDQUFjTSxhQUFkLENBQTRCUSxZQUE1QixDQUF5QyxLQUF6QztBQUNIO0FBQ0o7QUFDSixDQWJEIiwiZmlsZSI6IjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaG9zdE5hbWUgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICBpZiAocGFyZW50LndpbmRvdy5oNVN5bmNBY3Rpb25zICYmIHBhcmVudC53aW5kb3cuaDVTeW5jQWN0aW9ucy5pc1N5bmMpIHtcclxuICAgICAgICB2YXIgY3VycmVudFdpbmRvd0lkID0gJCh3aW5kb3cuZnJhbWVFbGVtZW50KS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIHZhciBpZnJhbWVJZCA9IFwiaDVfY291cnNlX3NlbGZfZnJhbWVcIjtcclxuICAgICAgICBpZiAoY3VycmVudFdpbmRvd0lkICE9IFwiaDVfY291cnNlX2NhY2hlX2ZyYW1lXCIpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cuZnJhbWVFbGVtZW50KS5hdHRyKCdsb2FkX3N0YXR1cycsICcxJyk7ICBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoY3VycmVudFdpbmRvd0lkID09IGlmcmFtZUlkKXtcclxuICAgICAgICAgICAgcGFyZW50LndpbmRvdy5oNVN5bmNBY3Rpb25zLmlzUHJhY3RpY2VQYWdlKHRydWUpO1xyXG4gICAgICAgICAgICBwYXJlbnQud2luZG93Lmg1U3luY0FjdGlvbnMuaXNSZXN1bHRQYWdlKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9UOC9qcy9zeW5jLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ })
/******/ ]);
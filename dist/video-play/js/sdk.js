(function() {
    var hostName = window.location.hostname;
    var sync = parent.window.syncActions && parent.window.syncActions.isSync;
    if (sync) {
        var parentWindow = parent.window;
		var communicationWithAc = parentWindow.communicationWithAc;

		/*
		 * 业务逻辑参数
		 */
		var countNum = 0;
		var classStatus = parentWindow.classStatus; //上课状态 0：各端练习 1：开始上课 2: 开始练习
		var userType = parentWindow.userType; //用户角色 tea: 教师 stu: 学生

		var sdk = {

			actEvent: function(message) {
				console.log('=====actEvent========%s=====', JSON.stringify(message));
				var specialData = message.specialData;
				var syncAction = specialData.syncAction;
				var index = syncAction.index;
				var eventType = syncAction.eventType;
				var syncName = syncAction.syncName;

				//事件触发目标元素target

				var targetEle = $("[data-syncactions=" + index + "]");

				if (specialData.method == 'event') {
					targetEle.trigger(syncName);
					return false;
				}

				if (specialData.method == 'drag') {
					var pos = {
						left: syncAction.left,
						top: syncAction.top,
						pageX: syncAction.pageX,
						pageY: syncAction.pageY
					}
					targetEle.trigger(syncName, pos);
					return false;
				}
			},

			setEventLock: function() {
				parentWindow.eventLock = true;
			},

			bindSyncEvt: function(obj) {
				var count = countNum++;
				var svcMsg = communicationWithAc.buildSvcMsgData({
					id: new Date().getTime(),
					sqe: count,
					specialData: {
						type: 'sync',
						method: obj.method ? obj.method : '',
						userType: userType,
						syncAction: {
							index: obj.index,
							eventType: obj.eventType,
							syncName: obj.syncName
						}
					}
				});

				if (obj.method == 'drag') {
					svcMsg.specialData.syncAction.left = obj.left;
					svcMsg.specialData.syncAction.top = obj.top;
					svcMsg.specialData.syncAction.pageX = obj.pageX;
					svcMsg.specialData.syncAction.pageY = obj.pageY;
				}

				if ((classStatus === 1 && userType === 'tea') || (classStatus === 2 && userType === 'stu')) {
					parentWindow.eventQueue.push(svcMsg);
					communicationWithAc.sendMSG('svcMes', svcMsg);
				} else {
					parentWindow.eventQueue.push(svcMsg);
				}
			}
		}
		window.SDK = sdk;
    } else {
    	window.SDK = {
	    	setEventLock: function() {}
	    };
    }
})();

(function () {

    var h5SyncActions = parent.window.h5SyncActions;

    if (h5SyncActions && h5SyncActions.isSync) {

        var sdk = {

            /**
             * 获取配置信息
             */
            getClassConf: function () {
                return h5SyncActions.classConf;
            },

            getUserType: function () {
                return this.getClassConf().user.type;
            },

            /**
             * 构建发送数据
             */
            buildSvcMsgData: function (obj, type) {
                var classConf = this.getClassConf();
                var classStatus = classConf.h5Course.classStatus;
                var svcDefaultMessage = {
                    user: classConf.user,
                    course: classConf.course,
                    classStatus: classStatus
                };

                switch (type) {
                    case 'syncEvt':
                        var syncAction = {
                            index: obj.index,
                            syncName: obj.syncName
                        };

                        if (obj.method == 'drag') {
                            syncAction = {
                                index: obj.index,
                                syncName: obj.syncName,
                                left: obj.left,
                                top: obj.top,
                                pageX: obj.pageX,
                                pageY: obj.pageY
                            };
                        }

                        return h5SyncActions.buildSvcMsgData(Object.assign(svcDefaultMessage, {
                            WBDataType: 'sync',
                            method: obj.method ? obj.method : '',
                            syncAction: syncAction
                        }), {
                            type: 'sync'
                        });
                        break;
                    case 'syncResultEvt':
                        return h5SyncActions.buildSvcMsgData(Object.assign(svcDefaultMessage, {
                            WBDataType: 'resultSync',
                            syncAction: {
                                index: obj.index,
                                resultData: obj.resultData,
                                syncName: obj.syncName
                            }
                        }), {
                            type: 'resultSync'
                        });
                        break;
                    default:
                        return h5SyncActions.buildSvcMsgData(Object.assign(svcDefaultMessage, {}));
                }
            },

            actEvent: function (message) {
                console.log('sdk-----actEvent------------>%s', JSON.stringify(message));
                var method = message.data[0].value.method;
                var syncAction = message.data[0].value.syncAction;
                var index = syncAction.index;
                var syncName = syncAction.syncName;

                //事件触发目标元素target

                var targetEle = $("[data-syncactions=" + index + "]");

                if (method == 'event') {
                    targetEle.trigger(syncName);
                    return false;
                }

                if (method == 'drag') {
                    var pos = {
                        left: syncAction.left,
                        top: syncAction.top,
                        pageX: syncAction.pageX,
                        pageY: syncAction.pageY
                    };
                    targetEle.trigger(syncName, pos);
                    return false;
                }
            },

            //新添加结果时间触发
            actResultEvent: function (message) {
                console.log('sdk-----actResultEvent------------>%s', JSON.stringify(message));
                var syncAction = message.data[0].value.syncAction;
                var index = syncAction.index;
                var syncName = syncAction.syncName;
                var syncResultData = syncAction.resultData;

                //事件触发目标元素target
                var targetEle = $("[data-syncresult=" + index + "]");
                targetEle.trigger(syncName, {
                    user: message.data[0].value.user,
                    resultData: syncResultData
                });
            },

            setEventLock: function () {
                h5SyncActions.setEventUnlocked();
            },

            bindSyncEvt: function (obj) {
                console.log('SDK bindSyncEvt------------------->%s', JSON.stringify(obj));
                var message = this.buildSvcMsgData(obj, 'syncEvt');
                var classStatus = message.data[0].value.classStatus;
                if (classStatus === 1 || classStatus === 2) {
                    h5SyncActions.addEventQueue(message);
                    h5SyncActions.addSendMessage(message);
                } else {
                    h5SyncActions.addEventQueue(message);
                }
            },

            //新添加结果同步数据封装
            bindSyncResultEvt: function (obj) {
                console.log('bindSyncResultEvt');
                var message = this.buildSvcMsgData(obj, 'syncResultEvt');
                console.log('sdk bindSyncResultEvt------------->$s', JSON.stringify(message));
                var classStatus = message.data[0].value.classStatus;
                if (classStatus === 2) {
                    h5SyncActions.addEventQueue(message);
                    h5SyncActions.addSendMessage(message);
                }
            }

        };
        window.SDK = sdk;
    } else {
        window.SDK = {
            getUserType: function () {
                return "tea";
            },
            setEventLock: function () {
            }
        };
    }
})();
"use strict"
import '../../common/js/common.js'
import './sync.js'

$(function() {
    const page = {
        audioEle: document.querySelector('audio'),
        title: configData.source.title,
        themePic: configData.source.themePic,
        audio: configData.source.audio,
        optionsArr: configData.source.options,
        right: configData.source.right,
        setThemePic: function() {
            if (this.themePic) {
                $('.theme-pic img').attr('src', this.themePic)
                if (!this.title) {
                    $('.theme-pic').css('top', '2.08rem').show()
                } else {
                    $('.theme-pic').show()
                }
            }
        },
        setAudio: function() {
            if (this.audio) {
                if (this.title && !this.themePic) {
                    $('.btn-audio').css('top', '4.06rem')
                } else if (!this.title && !this.themePic) {
                    $('.btn-audio').css('top', '3.28rem')
                } else if (!this.title && this.themePic) {
                    $('.btn-audio').css('top', '4.98rem')
                }
                $('audio').attr('src', this.audio)
                $('.btn-audio').show()
            }
        },
        completeStu: function() {
            let str = ''
            let listNum = ''
            this.optionsArr.forEach(function(obj, i) {
                listNum = i === 0 ? 'A' : (i === 1 ? 'B' : (i === 2) ? 'C' : 'D')
                str += `<li data-syncactions="stu-option-${i}">
	                <span class="list-num">${listNum}</span>
	                <div class="option shadow ${obj.length > 26?'f30':''}">
	               		<p>${obj}</p>
	                </div>
	                <div class="icon-judgement hide"></div>
	            </li>`
            })
            $(str).appendTo('.stu-btn-options')
        },
        completeTea: function() {
            let str = ''
            let listNum = ''
            this.optionsArr.forEach(function(obj, i) {
                listNum = i === 0 ? 'A' : (i === 1 ? 'B' : (i === 2) ? 'C' : 'D')
                str += `<li data-syncactions="tea-option-${i}">
	                <span class="list-num">${listNum}</span>
	                <div class="option shadow ${obj.length > 26?'f30':''}">
	               		<p>${obj}</p>
	                </div>
	                <div class="icon-judgement hide"></div>
	                <div class="stu-names hide"></div>
	            </li>`
            })
            $(str).appendTo('.tea-btn-options')
        },
        getAnswerId: function() {
            let right = this.right
            let answerId
            this.optionsArr.forEach(function(ele, i) {
                if (ele === right) {
                    answerId = i
                }
            })
            return answerId
        },
        nameForShort: function(nameArr) {
            let names = nameArr.map(function(item) {
                let name = item.length > 7 ? (item.substring(0, 7) + '...') : item
                return name
            })
            return names
        },
        init: function() {
            this.setThemePic()
            this.setAudio()
            this.completeStu()
            this.completeTea()
        }
    }
    page.init()

    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync
    const audioEle = document.querySelector('audio')
    let play = false
    let audioPlay = function() {
        audioEle.currentTime = 0
        audioEle.play()
        play = true
        $('.btn-audio img').attr('src', './image/btn-audio.gif')
    }
    let audioPause = function() {
        audioEle.pause()
        play = false
        $('.btn-audio img').attr('src', './image/btn-audio.png')
    }

    let audioClick = true
    $('.btn-audio').on('click touchstart', function(e) {
        if (audioClick) {
            audioClick = false
            if (!isSync) {
                $(this).trigger('syncAudioClick')
                return
            }
            if(window.frameElement.getAttribute('user_type') == 'tea'){
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'syncAudioClick',
                    funcType:'audio'
                }) 
            }else{
                $(this).trigger('syncAudioClick')
            }
        }

    })

    $('.btn-audio').on('syncAudioClick', function(e, message) {
        if (play) {
            audioPause()
        } else {
            audioPlay()
            audioEle.onended = function() {
                play = false
                $('.btn-audio img').attr('src', './image/btn-audio.png')
            }
        }
        SDK.setEventLock()
        audioClick = true
    })

    // 学生答题同步
    let stuAnswer = true;

    $('.stu-btn-options').on('click', 'li', function(e) {
        if (stuAnswer) {
            stuAnswer = false
            if (!isSync) {
                $(this).trigger('syncStuAnswer')
                return
            }
            SDK.bindSyncEvt({
                sendUser: '',
                receiveUser: '',
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                syncName: 'syncStuAnswer'
            })
        }
    })

    $('.stu-btn-options').on('syncStuAnswer', 'li', function(e, message) {
        //todo 没有结果直接解锁和恢复点击

        const _this = $(this)

        if (_this.hasClass('not-allowed')) {
            SDK.setEventLock()
            stuAnswer = true
            return
        }

        const optionId = _this.index()
        const choose = _this.find('.option p').text()
        $('.wrong,.right').hide()

        if (choose === page.right) {
            _this.find('.icon-judgement').addClass('right').show();
            $('.stu-btn-options li').addClass('not-allowed');


            if (isSync) {
                //todo 计算结果
                SDK.bindSyncResultEvt({
                    sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
                    index: $('#container').data('syncresult'),
                    resultData: {
                        optionId: optionId
                    },
                    syncName: 'bTeaShowResult'
                });
            }

            // stuAnswer = true;

        } else {
            let optionWrong = _this.find('.option')
            optionWrong.css('animation', 'shakeUp 0.3s both ease-in')
            optionWrong.off().on('animationend  webkitAnimationEnd', function() {
                $(this).css('animation', 'none');

                if (isSync) {
                    SDK.bindSyncResultEvt({
                        sendUser: message.data[0].value.sendUser,
                        receiveUser: message.data[0].value.receiveUser,
                        sendUserInfo: message.data[0].value.sendUserInfo,
                        index: $('#container').data('syncresult'),
                        resultData: {
                            optionId: optionId
                        },
                        syncName: 'bTeaShowResult'
                    })
                }

                stuAnswer = true;
            });


        }
    })

    // 教师端答题
    $('.tea-btn-options').on('click', 'li', function() {
        const _this = $(this)
        if (_this.hasClass('not-allowed')) {
            return
        }
        const choose = _this.find('.option p').text()
        $('.wrong,.right').hide()

        if (choose === page.right) {
            _this.find('.icon-judgement').addClass('right').show()
            $('.btn-options li').addClass('not-allowed')
        } else {
            let optionWrong = _this.find('.option')
            optionWrong.css('animation', 'shakeUp 0.3s both ease-in')
            optionWrong.off().on('animationend  webkitAnimationEnd', function() {
                $(this).css('animation', 'none')
            })
        }
    })


    // 教师端展示答题情况
    let statics = {};


    $('#container').on('bTeaShowResult', function(e, message) {
        let optionStatics = {
            0: [],
            1: [],
            2: [],
            3: []
        }

        // 更新数据
        var sendUserInfo = message.data[0].value.sendUserInfo;
        var resultData = message.data[0].value.syncAction.resultData;

        if (sendUserInfo.type == 'stu') {
            statics[sendUserInfo.id] = {
                name: sendUserInfo.name,
                optionId: resultData.optionId
            }
        } else {

        }
        for (let key in statics) {
            //{790110079:{"name":"jiusi","optionId":0}}
            let id = statics[key].optionId;
            if($.inArray(statics[key].name, optionStatics[id]) == -1) {
                optionStatics[id].push(statics[key].name);
            }
        }

        //{"0":["jiusi"],"1":[],"2":[],"3":[]}

        // 渲染答案
        for (let item in optionStatics) {
            if (optionStatics[item].length > 0) {
                if (item == page.getAnswerId()) {
                    $('.tea-btn-options .stu-names').eq(item).css({
                        'display': 'block',
                        'color': '#66b400'
                    })
                    $('.icon-judgement').eq(item).addClass('right')
                } else {
                    $('.tea-btn-options .stu-names').eq(item).css({
                        'display': 'block',
                        'color': '#ff5257'
                    })
                    $('.icon-judgement').eq(item).addClass('wrong')
                }
            }else{
                $('.tea-btn-options .stu-names').eq(item).hide()
                $('.icon-judgement').eq(item).removeClass('right wrong')
            }

            let sName = ''
            //todo 4 未来从 sdk 中的 classconf中获取
            if (optionStatics[item].length === 4) {
                sName = 'All'
            } else {
                sName = optionStatics[item].join(' ')
            }
            $('.tea-btn-options .stu-names').eq(item).text(sName)
        }
        //todo 最终逻辑中解锁
        SDK.setEventLock()
    })

})
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
                    sendUser: '',
                    receiveUser: '',
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
    let stuAnswer = true

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

        const _this = $(this)

        if (_this.hasClass('not-allowed')) {
            SDK.setEventLock();
            stuAnswer = true;
            return;
        }

        const optionId = _this.index()
        const choose = _this.find('.option p').text()
        $('.wrong,.right').hide()

        if (choose === page.right) {
            _this.find('.icon-judgement').addClass('right').show()
            $('.stu-btn-options li').addClass('not-allowed')

            if (isSync) {
                //todo 计算结果
                SDK.bindSyncResultEvt({
                    sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
                    index: $('#container').data('syncresult'),
                    resultData: {
                        isRight: true
                    },
                    syncName: 'teaShowResult'
                })
            }

            // stuAnswer = true

        } else {
            let optionWrong = _this.find('.option')
            optionWrong.css('animation', 'shakeUp 0.3s both ease-in')
            optionWrong.off().on('animationend  webkitAnimationEnd', function() {
                $(this).css('animation', 'none')

                if (isSync) {
                    SDK.bindSyncResultEvt({
                        sendUser: message.data[0].value.sendUser,
                        receiveUser: message.data[0].value.receiveUser,
                        sendUserInfo: message.data[0].value.sendUserInfo,
                        index: $('#container').data('syncresult'),
                        resultData: {
                            isRight: false
                        },
                        syncName: 'teaShowResult'
                    })
                }
                stuAnswer = true
            })


        }
    })
})



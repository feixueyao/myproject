"use strict";
import '../../common/js/common.js';
import './sync.js';

$(() => {
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const frame_user_type = $(window.frameElement).attr('user_type');
    //console.log('c-page=====所在iframe的用户类型====111111111111111111111111======>%s',frame_user_type)

    let wrapper = $('.content-wrap');
    let data = configData.source;

    console.info("当前显示环境处在" + (isSync ? "" : " 非") + "同步状态！！！");

    if (configData.defaultValue.bgImage) {
        $(".container").css({
            'backgroundImage': 'url(' + configData.defaultValue.bgImage + ')'
        });
    }
    if (configData.bg) {
        $(".container").css({
            'backgroundImage': 'url(' + configData.bg + ')'
        });
    }
    if (configData.defaultValue.bgColor) {
        $(".container").css({
            'backgroundColor': configData.defaultValue.bgColor
        });
    }
    if (configData.bgColor) {
        $(".container").css({
            'backgroundColor': configData.bgColor
        });
    }
    let isTitle = $('.title').is(':hidden');
    if (isTitle) {
        $('.content-wrap').css('height', 'calc(100% - .76rem)');
    }
    
    if (isSync && frame_user_type == 'tea') {
        //console.log("tea");
        let tplFrame = `
      <div class="frame-wrap">

        <div class="layout-middle question">

          <div class="layout-middle-bg">
          {{imgTpl}}
          {{audioTpl}}
          {{wordTpl}}
          </div>
        </div>
        <ul class="layout-footer answers">
          {{list-item}}
        </ul>
      </div>
    `;


        let imgTpl = `
    <div class="question-img">
      <img class="" src="{{questionImg}}" alt="">
    </div>
    `;
        let audioTpl = `
      <div class="audio-wrap"  data-syncactions="audio-wrap-1">
        <img src="./image/btn-audio.png"/>
        <audio src="{{audio}}"></audio>
      </div>
    `;
        let wordTpl = `
    <div class="con-text">{{word}}</div>
    `;
        let stuTplItem = `
        <li class="layout-item answer" data-id={{id}} data-syncactions="{{id}}" data-answer={{isRight}}>
          <div class="layout-middle-border">
            <img src="{{img}}" alt=""/>
            <div class="mask-tip tea {{isright}}"><div class="layout-bottom"></div></div>
          </div>
        </li>
    `;
        let str = '';
        let c = "";
        let itemStr = data.items.map(function (item, index) {
            return stuTplItem.replace(/{{id}}/g, item.id)
                .replace(/{{isRight}}/g, item.isRight)
                .replace(/{{img}}/g, item.img)
                .replace(/{{isright}}/g, item.isRight ? "right" : "error");
        });
        str += tplFrame.replace(/{{audioTpl}}/g, data.audio != "" ? audioTpl.replace(/{{audio}}/g, data.audio).replace(/{{id}}/g,data.id) : "")
            .replace(/{{wordTpl}}/g, data.word != "" ? wordTpl.replace(/{{word}}/g, data.word) : "")
            .replace(/{{imgTpl}}/g, data.questionImg != "" ? imgTpl.replace(/{{questionImg}}/g, data.questionImg) : "")
            .replace(/{{list-item}}/g, itemStr.join(""));

        wrapper.html(str);
    } else {
        //console.log("stu");
        let tplFrame = `
      <div class="frame-wrap">
        <div class="layout-middle question">
          <div class="layout-middle-bg">
          {{imgTpl}}
          {{audioTpl}}
          {{wordTpl}}
          </div>
        </div>
        <ul class="layout-footer answers">
          {{list-item}}
        </ul>
      </div>
    `;


        let imgTpl = `
    <div class="question-img">
      <img class="" src="{{questionImg}}" alt="">
    </div>
    `;
        let audioTpl = `
      <div class="audio-wrap"  data-syncactions="audio-wrap-1">
        <img src="./image/btn-audio.png"/>
        <audio src="{{audio}}"></audio>
      </div>
    `;
        let wordTpl = `
    <div class="con-text">{{word}}</div>
    `;
        let stuTplItem = `
        <li class="layout-item answer" data-id={{id}} data-syncactions="{{id}}" data-answer={{isRight}}>
          <div class="layout-middle-border">
            <img src="{{img}}" alt=""/>
            <div class="mask-tip stu {{isright}}"></div>
          </div>
        </li>
    `;
        let str = '';
        let c = "";
        let itemStr = data.items.map(function (item, index) {
            return stuTplItem.replace(/{{id}}/g, item.id)
                .replace(/{{isRight}}/g, item.isRight)
                .replace(/{{img}}/g, item.img)
                .replace(/{{isright}}/g, item.isRight ? "right" : "error");
        });
        str += tplFrame.replace(/{{audioTpl}}/g, data.audio != "" ? audioTpl.replace(/{{audio}}/g, data.audio) : "")
            .replace(/{{wordTpl}}/g, data.word != "" ? wordTpl.replace(/{{word}}/g, data.word) : "")
            .replace(/{{imgTpl}}/g, data.questionImg != "" ? imgTpl.replace(/{{questionImg}}/g, data.questionImg) : "")
            .replace(/{{list-item}}/g, itemStr.join(""));

        wrapper.html(str);
    }

    //当只有text时 字体区域放大
    if (configData.source.questionImg == '' && configData.source.audio == '') {
        $('.con-text').css({
            'line-height':'1rem',
            'border-radius': '.8rem',
            'word-wrap': 'break-word',
            'max-width': '13rem',
            'padding': '.2rem .5rem'
        })
        if(configData.source.word.length > 15){
            $('.con-text').css('font-size','.72rem')
        }else if(configData.source.word.length > 12){
            $('.con-text').css('font-size','.9rem')
        }else{
            $('.con-text').css('font-size','1rem')
        }
    }

    //=============================================================================================================//
    var answerClickTimer = true;
    let flag = true;
    wrapper.on("click", ".answer", function (e) {
        if (flag == false) {
            SDK.setEventLock();
            answerClickTimer = true;
            return;
        }
        if (answerClickTimer) {
            answerClickTimer = false;

            if (!isSync) {
                $(this).trigger('syncAnswerClick');
                return;
            }

            SDK.bindSyncEvt({
                sendUser: '',
                receiveUser: '',
                index: $(e.currentTarget).data('syncactions'),
                method: 'event',
                syncName: 'syncAnswerClick'
            });
        }
    });

    wrapper.on("syncAnswerClick", ".answer", function (e, message) {
        var _itemID = $(this).data('id');
        //console.log($(this).data("answer"));
        var result = false;
        if ($(this).data("answer") == true) {
            $(this).addClass("done");
            result = true;
            flag = false;
        } else {
            $(this).addClass("shake");
        }
        if (isSync) {
            SDK.bindSyncResultEvt({
                sendUser: message.data[0].value.sendUser,
                receiveUser: message.data[0].value.receiveUser,
                sendUserInfo: message.data[0].value.sendUserInfo,
                index: $('#container').data('syncresult'),
                resultData: {itemID: _itemID},
                syncName: 'syncResultClick'
            });
        }
        SDK.setEventLock();
        answerClickTimer = true;
    }).on('animationend', '.answer', function () {//监听动画
        //console.log('c_page 自动触发动画方法-----shake css3');
        $(this).removeClass('shake');
        SDK.setEventLock();
        answerClickTimer = true;
    });

    var audioWrapClickTimer = true;
    wrapper.on("click", ".audio-wrap", function (e) {
        if (audioWrapClickTimer) {
            audioWrapClickTimer = false;
            if (!isSync) {
                $(this).trigger('syncAudioWrapClick');
                return;
            }
            if(window.frameElement.getAttribute('user_type') == 'tea'){
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data('syncactions'),
                    method: 'event',
                    syncName: 'syncAudioWrapClick',
                    funcType: 'audio'
                });
            }else{
                $(this).trigger('syncAudioWrapClick');
                return;
            }
        }
    });

    wrapper.on("syncAudioWrapClick", ".audio-wrap", function (e, message) {
        var ico = $(this).find("img");
        ico.attr("src", ico.attr("src").replace(".png", ".gif"));
        $(this).find("audio").get(0).play();
        setTimeout(function () {
            ico.attr("src", ico.attr("src").replace(".gif", ".png"));
        }, 1000);
        SDK.setEventLock();
        audioWrapClickTimer = true;
    });

    //教师端响应
    var stuObj = {};
    $('#container').on("syncResultClick", function (e, message) {
        //console.log('c-page------------------message:%s', JSON.stringify(message));
        var sendUserInfo = message.data[0].value.sendUserInfo;
        var resultData = message.data[0].value.syncAction.resultData;

        if (sendUserInfo.type == 'stu') {
            stuObj[sendUserInfo.id] = {name: sendUserInfo.name, itemID: resultData.itemID};
        }

        let options = {
            0:[],
            1:[],
            2:[],
            3:[]
        }

        for (let key in stuObj) {
            let id = stuObj[key].itemID;
            if($.inArray(stuObj[key].name, options[id]) == -1) {
                options[id].push(stuObj[key].name);
            }
        }

        //console.log('c-page===============================>options:%s',JSON.stringify(options))

        $(".layout-item").removeClass('done')
        $(".layout-bottom").html('');

        for(var item in options){
            //{"0":[],"1":["jiusan","jiusi"],"2":[],"3":[]}
            if(options[item].length>0){
                for(var i=0,length=options[item].length;i<length;i++){
                    //console.log('c-page===============================>options[item]:%s',options[item][i])
                    $(".layout-item[data-id=" + item + "]").addClass("done");
                    $('<li class="layout-squ user">' + options[item][i] + '</li>').appendTo($(".layout-item[data-id=" + item + "]").find('.layout-bottom'));
                }
            }
        }
        SDK.setEventLock();
        answerClickTimer = true;
    });
});

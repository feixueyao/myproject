"use strict";
import '../../common/js/common.js';
import './sync.js';

$(() => {
  const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

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

  //======================================================================================================//
  let wrapper = $('.content-wrap');
  let source = configData.source;

  var cardImg = `
                <div class="item card-img" data-id="{{i}}" data-type="{{type}}" data-audio ="{{audio}}"  data-text="{{text}}" data-img="{{img}}" data-syncactions="card-img-{{i}}">
                  <img src="{{img}}"/>
                </div>
              `;
  var cardWord = `
                <div class="item card-text {{bigText}}" data-id="{{i}}"  data-type="{{type}}" data-audio ="{{audio}}" data-text="{{text}}"   data-syncactions="card-text-{{i}}">
                  <span class="text">{{text}}</span>
                  <div class="audio-wrap"  data-syncactions="audio-wrap-{{i}}">
                    <img src="./image/btn-audio.png"/>
                    <audio src="{{audio}}"></audio>
                  </div>
                </div>
              `;
  var line3 = `<li class="line-wrap">{{cards}}</li>`,
    line1, line2;
  line1 = line2 = line3;

  var dismantleImgAndText = function(obj) {
    let _item = [];
    _item.push({
      id: obj.id,
      type: "img",
      img: obj.img,
      text: "",
      audio: obj.audio
    });
    _item.push({
      id: obj.id,
      type: "text",
      img: "",
      text: obj.text,
      audio: obj.audio
    });
    return _item;
  }
  var resultData = [];
  source.items.forEach(function(obj) {
    resultData = resultData.concat(dismantleImgAndText(obj));
  });
  //console.log("拆分后数组内容如下：");

  // resultData.forEach(console.log);

  //console.log("按打乱算法打乱如下：");
  var _i = 0;
  resultData = resultData.sort(function() {
    return Math.pow(-1, _i++);
  });

  // resultData.forEach(console.log);

  var render = function(data) {
    var _str = "";
    data.forEach(function(o) {
      let bigText = "";

      if (o.type == 'img') {
        _str += cardImg.replace(/{{i}}/g, o.id).replace(/{{type}}/g, o.type).replace(/{{img}}/g, o.img).replace(/{{audio}}/g, o.audio).replace(/{{text}}/g, o.text);
      } else {
        if (o.text.length <= 7) {
          bigText = "bigText";
        }
        _str += cardWord.replace(/{{i}}/g, o.id).replace(/{{bigText}}/g, bigText).replace(/{{type}}/g, o.type).replace(/{{text}}/g, o.text).replace(/{{audio}}/g, o.audio);
      }
    });
    return _str;
  }
  var strLine1 = '',
    strLine2 = "",
    strLine3 = "";
  switch (source.items.length) {
    case 2:
    case 3:
      strLine1 = line1.replace(/{{cards}}/, "");
      strLine2 = line2.replace(/{{cards}}/, render(resultData));
      strLine3 = line3.replace(/{{cards}}/, "");
      $(".content-wrap").css({
        height: "calc(100% - 4.32rem)"
      });
      break;
    case 4:
      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 4)));
      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(4)));
      strLine3 = line3.replace(/{{cards}}/, "");
      $(".content-wrap").css({
        height: "calc(100% - 3.32rem)"
      });
      break;
    case 5:
      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 4)));
      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(4, 8)));
      strLine3 = line3.replace(/{{cards}}/, render(resultData.slice(8)));
      break;
    case 6:
      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 6)));
      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(6)));
      strLine3 = line3.replace(/{{cards}}/, "");
      $(".content-wrap").css({
        height: "calc(100% - 4.32rem)"
      });
      break;
    case 7:
    case 8:
    case 9:
      strLine1 = line1.replace(/{{cards}}/, render(resultData.slice(0, 6)));
      strLine2 = line2.replace(/{{cards}}/, render(resultData.slice(6, 12)));
      strLine3 = line3.replace(/{{cards}}/, render(resultData.slice(12)));
      break;
  }
  wrapper.html("");
  wrapper.append(strLine1);
  wrapper.append(strLine2);
  wrapper.append(strLine3);

  //reset by pany for audiobtn
  $('.audio-wrap').each(function(index, el) {
     if ($(el).find('audio').attr('src') == '') {
      $(el).hide();
    }
  });

  var mask = `
        <div class="mask mask-answer">
          <div class="wrap-card-answer">
          <div class="card-answer">
            <div class="card-img">
              <img src="{{img}}"/>
            </div>
            <span class="text">{{text}}</span>
          </div>
          <div class="audio-wrap"  data-syncactions="audio-wrap-{{i}}">
            <img src="./image/volumeBtn.gif"/>
            <audio src="{{audio}}"></audio>
          </div>
          </div>
        </div>
        `;

  var audioWrapClickTimer = true,
    // itemMouseenterTimer = true,
    // itemMouseleaveTimer = true,
    audioWrapMouseenterTimer = true,
    audioWrapMouseleaveTimer = true;

  $(".item").on("click", ".audio-wrap", function(e) {
    if (audioWrapClickTimer) {
      audioWrapClickTimer = false;

      if (!isSync) {
        $(this).trigger('syncAudioWrapClick');
        return;
      }
      if(window.frameElement.getAttribute('user_type') == 'tea'){
        SDK.bindSyncEvt({
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
  })
  $(".item").on("syncAudioWrapClick", ".audio-wrap", function() {
    var $audio = null;
    $audio = $(this).find("audio").get(0);
    var $img = $(this).find("img");
    $audio ? $audio.play() : "";
    if ($img.length != 0) {
      $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
      //播放完毕img状态
      $audio.onended = function() {
        $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
      }.bind(this);
    }

    $(this).find("audio").get(0).play();
    SDK.setEventLock();
    audioWrapClickTimer = true;

    return false;
  })


  $(".item").on("mouseenter", ".audio-wrap", function(e) {
    if (audioWrapMouseenterTimer) {
      audioWrapMouseenterTimer = false;

      if (!isSync) {
        $(this).trigger('syncAudioWrapMouseenter');
        return;
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        method: 'event',
        syncName: 'syncAudioWrapMouseenter'
      });
    }
  })
  $(".item").on("syncAudioWrapMouseenter", ".audio-wrap", function() {

    $(this).css("transform", "translate(-50%,-50%) scale(1.1)");
    SDK.setEventLock();
    audioWrapMouseenterTimer = true;

    return false;
  })

  $(".item").on("mouseleave", ".audio-wrap", function(e) {
    if (audioWrapMouseleaveTimer) {
      audioWrapMouseleaveTimer = false;

      if (!isSync) {
        $(this).trigger('syncAudioWrapMouseleave');
        return;
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        method: 'event',
        syncName: 'syncAudioWrapMouseleave'
      });
    }
  })
  $(".item").on("syncAudioWrapMouseleave", ".audio-wrap", function() {


    $(this).css("transform", "translate(-50%,-50%) scale(1)");
    SDK.setEventLock();
    audioWrapMouseleaveTimer = true;

    return false;
  })



  // .on("mouseenter",function(e){
  //   if (itemMouseenterTimer) {
  //       itemMouseenterTimer = false;

  //       if (!isSync) {
  //         $(this).trigger('syncItemMouseenter');
  //         return;
  //       }

  //       SDK.bindSyncEvt({
  //         index: $(e.currentTarget).data('syncactions'),
  //         method: 'event',
  //         syncName: 'syncItemMouseenter'
  //       });
  //     }
  // }).on("syncItemMouseenter", function() {


  //   $(this).css("opacity",".9");
  //   SDK.setEventLock();
  //   itemMouseenterTimer = true;

  //   return false;
  // })
  // .on("mouseleave",function(e){
  //   if (itemMouseleaveTimer) {
  //       itemMouseleaveTimer = false;

  //       if (!isSync) {
  //         $(this).trigger('syncItemMouseleave');
  //         return;
  //       }

  //       SDK.bindSyncEvt({
  //         index: $(e.currentTarget).data('syncactions'),
  //         method: 'event',
  //         syncName: 'syncItemMouseleave'
  //       });
  //     }
  // }).on("syncItemMouseleave", function() {


  //   $(this).css("opacity","1");
  //   SDK.setEventLock();
  //   itemMouseleaveTimer = true;

  //   return false;
  // });



  var itemClick = true;
  wrapper.on('click', '.item', function(e) {
    //console.log('========================点击啦========')
    e.stopPropagation();
    if (itemClick) {
      itemClick = false;

      if (!isSync) {
        $(this).trigger('syncItemClick');
        return;
      }
      SDK.bindSyncEvt({
        sendUser: '',
        receiveUser: '',
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event',
        syncName: 'syncItemClick'
      });
    }
  });


  var firstCard = null,
    secondCard = null,
    _mask = null;
  
  wrapper.on("syncItemClick", ".item", function() {
    //console.log('========================同步点击啦========')
    var _this = $(this),
      type = _this.data("type"),
      id = _this.data("id"),
      img = type == "img" ? _this.data('img') : "",
      audio = _this.data('audio'),
      text = type == "text" ? _this.data('text') : "";

    if (_this.hasClass("active")) {
      SDK.setEventLock();
      itemClick = true;
      return;
    }

    if (firstCard) {

      if (_this.data("id") == firstCard.data("id")) {
        _this.addClass('active');
        $(this).queue(function() {
          _mask = mask.replace(/{{img}}/g, img == "" ? firstCard.data("img") : img)
            .replace(/{{audio}}/g, audio)
            .replace(/{{text}}/g, text == "" ? firstCard.data("text") : text);
          _mask = $(_mask).appendTo(wrapper);

          if (audio) { //reset by pany
            if(isSync){
              var frame_user_id = $(window.frameElement).attr('user_id');
              var current_user_id = SDK.getClassConf().user.id;
              if (frame_user_id == current_user_id) {
                //console.log("=======当前不是cache-frame========学生自己的frame");
                _mask.find("audio").get(0).play();
              }
            }else{
              _mask.find("audio").get(0).play();
            }
          } else {
            _mask.find('.audio-wrap').hide();
          }

          $(this).dequeue();
        }).delay(2500).queue(function() {
          $(".mask-answer").fadeOut(300);
          $(this).dequeue();
        }).delay(100).queue(function() {
          firstCard.css("visibility", "hidden");
          _this.css("visibility", "hidden");
          $(this).dequeue();
        }).delay(100).queue(function() {
          firstCard = null;
          _mask.remove();
          $(this).dequeue();
          //所有的队列执行完去解锁
          SDK.setEventLock();
          itemClick = true;
        });
        // alert("match");

      } else {
        // alert("nomatch");

        firstCard.removeClass("active");
        _this.addClass("error shake");
        firstCard.addClass("error shake");
        $(this).delay(500).queue(function() {
          firstCard.removeClass("shake");
          _this.removeClass("shake");
          $(this).dequeue();
        }).delay(0).queue(function() {
          firstCard.removeClass("error");
          _this.removeClass("error");
          $(this).dequeue();
        }).delay(100).queue(function() {
          firstCard = null;
          $(this).dequeue();
          //所有的队列执行完去解锁
          SDK.setEventLock();
          itemClick = true;
        });
      }
    } else {
      _this.addClass('active');
      firstCard = _this;
      //所有的队列执行完去解锁
      SDK.setEventLock();
      itemClick = true;
    }
  });
});
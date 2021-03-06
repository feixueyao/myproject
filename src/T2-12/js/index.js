"use strict"
import '../../common/js/common.js'
import './sync.js';
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;


//获取老师
function getTea(appointMemberList){
    for(let i=0,length=appointMemberList.length;i<length;i++){
        if(appointMemberList[i].role == 'tea'){
            return appointMemberList[i];
        }
    }
}

$(function(){
	let staticData = configData.source;
	let txt = staticData.txt,img = staticData.img, audio = staticData.audio,key = staticData.key;
	(function fnSpell(){
		var ele = '';
		let img_ele = '<div class="con-img"><img src='+ img +' alt=""></div>',
			audio_ele = '<div class="con-audio" data-syncactions="audio-1"><audio src='+ audio +'></audio><img src="image/volumeBtn_02.png" alt=""></div>',
			txt_ele = '<div class="con-text">'+ txt +'</div>';
		if(img){
			ele += img_ele;
		}
		if(audio){
			ele += audio_ele;
		}
		if(txt){
			ele += txt_ele;
		}
		$('.dis-area').append(ele);
		$('.ans-sele').data('key',key);

		//判断desc
		let descText = $('.desc').text();
		if(descText!=''){
			$('.desc').removeClass('desc-visi');
		}

	})()

	//问题区域控制
	let isTitle = $('.title').is(':hidden');
	if(isTitle){
		$('.dis-area').css('height','7.84rem');
	}

	//学生端答题
	var itemClick = true;
	$('.container').on('click touchstart','.ans-sele',function(e){

		e.stopPropagation();
        if (itemClick) {
            itemClick = false;

            if(!isSync) {
                $(this).trigger('syncItemClick');
                return;
            }
            if(window.frameElement.getAttribute('user_type') == 'stu'){
                SDK.bindSyncEvt({
                	sendUser: '',
                    receiveUser: '',
                    starSend: '',
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'syncItemClick'
                });
            }
		}
	});

	$('.ans-sele').on('syncItemClick',function(e,message){

		let right_ans = $(this).data('key');
		let now_ans = $(this).find('p').text();
        
		if(now_ans === right_ans){
			$(this).find('p').addClass('sele-p');
			$(this).find('.icon').show();
			if(isSync){
		        SDK.bindSyncResultEvt({
		        	sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
	                index: $('#container').data('syncresult'),
	                resultData:{isRight: true},
	                syncName: 'teaShowResult',
                    starSend: message.data[0].value.starSend
	            });
			} 
			SDK.setEventLock();
			itemClick = false;
		}else{
			$(this).addClass('shake');
			$(this).on('animationend',function(){//监听动画
		        $(this).removeClass('shake');
		        $(this).off('animationend');
		        SDK.setEventLock();
				itemClick = true;
		    });
		    if(isSync){
				SDK.bindSyncResultEvt({
					sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
	                index: $('#container').data('syncresult'),
	                resultData:{isRight: false},
	                syncName: 'teaShowResult'
	            });
		    } 
	    	SDK.setEventLock();
			itemClick = true;
		}

	})

	//声音控制
	var soundClick = true;
	$('.con-audio').on('click touchstart',function(e){

		e.stopPropagation();
        if (soundClick) {
            soundClick = false;

            if(!isSync) {
                $(this).trigger('syncSoundClick');
                return;
            }
            if(window.frameElement.getAttribute('user_type') == 'tea'){
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'syncSoundClick',
    				funcType: 'audio'
                });
            }else{
                $(this).trigger('syncSoundClick');
                return;
            }
		}
	})

	$('.con-audio').on('syncSoundClick',function(e,message){
		autoPlay('.con-audio');
		SDK.setEventLock();
		soundClick = true;
	})

	function autoPlay(ele){
		var $audio=null;
		$audio = $(ele).find("audio").get(0);
	    var $img = $(ele).find("img");
		$audio?$audio.play():"";
	    if($img.length!=0){
		    $img.attr("src", $('.con-audio img').attr("src").replace(".png", ".gif"));
		  	//播放完毕img状态
		  	$audio.onended = function() {
			    $img.attr("src", $('.con-audio img').attr("src").replace(".gif", ".png"));
			};
	    }
	}
})
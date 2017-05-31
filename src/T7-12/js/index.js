"use strict"
import '../../common/js/common.js'
import './sync.js';
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	let staticData = configData.source;
	let seleList = staticData.seleList.sort(irrArr);
	let q_ele = '',a_ele = '';
	function irrArr(a,b){//乱序
		return a.key%2==0?-1:1
	}
	//spell
	(function fnSpell(){
		for(let i=0,length=seleList.length;i<length;i++){
			q_ele += '<div class="sele-area" tag="off"><div class="sele-img sele-p"><p>'+ (i+1) +'</p></div></div>'
			if(seleList[i].audio==''){
				a_ele += '<div class="sele-area" data-syncactions=obj-'+i+' data_key='+seleList[i].key+'><div class="sele-img" data-syncactions=img-'+i+'><img src="'+seleList[i].img+'" alt=""></div></div>'
			}else{
				a_ele += '<div class="sele-area" data-syncactions=obj-'+i+' data_key='+seleList[i].key+'><div class="sele-img" data-syncactions=img-'+i+'><img src="'+seleList[i].img+'" alt=""></div><div class="sele-audio" data-syncactions=audio-'+i+'><img src="image/volumeBtn_02.png" alt=""><audio src="'+seleList[i].audio+'"></audio></div></div>'
			}
		}
		$('.dis-area').append(q_ele);
		$('.ans-area').append(a_ele);

		//判断desc
		let descText = $('.desc').text();
		if(descText!=''){
			$('.desc').removeClass('desc-visi');
		}
		
	})()

	//答题换位
	function nowPos(index){
		let _nowSele = $('.dis-area').find('.sele-area').eq(index);
		_nowSele.attr('tag','on').siblings().attr('tag','off');
		_nowSele.find('.sele-img').removeClass('sele-p').addClass('num-area-active');
		_nowSele.siblings('.sele-area').children('.sele-img').removeClass('num-area-active');
	}
	nowPos(0);//初始化位置

	//开始答题
	var itemClick = true;
	var flag = true;
	$('.ans-area .sele-area').on('click touchstart','.sele-img',function(e){
		e.stopPropagation();

		//game over 无法答题 不发包
		if(!flag){
			SDK.setEventLock();
			itemClick = true;
			return;
		}
		
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
	                index: $(e.currentTarget).data('syncactions'),
	                eventType: 'click',
	                method: 'event',
	                syncName: 'syncItemClick'
	            });
            }
		}
	});

	let _nowKey = 1;//初始化问题当前位置
	$('.ans-area .sele-area').on('syncItemClick','.sele-img',function(e,message){
		//判断是否最后一题
		if(_nowKey == seleList.length){
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
		}
		let selePar = $(this).parent('.sele-area');
		let _rightKey = selePar.attr('data_key');
		if(_rightKey == _nowKey){
			nowPos(_nowKey);
			//clone now childnode to ans-area
			selePar.addClass('visi-hide');//隐藏当前选项

			let ansChidrenEle = selePar.children();
			console.log(ansChidrenEle)
			//$(ansChidrenEle[1]).attr('data-syncactions','audio-clone-'+_nowKey);

			$('.dis-area').find('.sele-area').eq(_nowKey-1).html(ansChidrenEle);
			_nowKey+=1;
		}else{
			selePar.addClass('shake');
			selePar.on('animationend',function(){//监听动画
		        selePar.removeClass('shake'); 
		        selePar.off('animationend');
		    });
		}
		SDK.setEventLock();
		itemClick = true;
	})

	//声音控件
	var soundClick = true;
	$('.sele-area').on('click touchstart','.sele-audio',function(e){

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

	$('.sele-area').on('syncSoundClick','.sele-audio',function(e,message){
		var $audio=null;
		$audio = $(this).find("audio").get(0);
	    var $img = $(this).find("img");
	    debugger;
		$audio?$audio.play():"";
		flag = false;//播放声音的时候不能点击
	    if($img.length!=0){
		    $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
		  	//播放完毕img状态
		  	$audio.onended = function() {
			    $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
			    flag = true;//恢复点击
			}.bind(this);
	    }
	    SDK.setEventLock();
		soundClick = true;
	})

	//滑过状态
	var itemOverTimer = true;
	$('.ans-area').on('mouseenter','.sele-area', function(e) {
		e.stopPropagation();
		if (itemOverTimer) {
			itemOverTimer = false;

			if (!isSync) {
				$(this).trigger('syncItemOver');
				return;
			}
			if(window.frameElement.getAttribute('user_type') == 'stu'){
				SDK.bindSyncEvt({
					index: $(this).data('syncactions'),
					eventType: 'mouseover',
					method: 'event',
					syncName: 'syncItemOver'
				});
			}
		}
	});

	$('.ans-area').on('syncItemOver','.sele-area',function(e,message){
		$(this).addClass('sele-hover');
		SDK.setEventLock();
		itemOverTimer = true;
	})

	var itemOutTimer = true;
	$('.ans-area').on('mouseleave','.sele-area', function(e) {
		e.stopPropagation();
		if (itemOutTimer) {
			itemOutTimer = false;

			if (!isSync) {
				$(this).trigger('syncItemOut');
				return;
			}
			if(window.frameElement.getAttribute('user_type') == 'stu'){
				SDK.bindSyncEvt({
					index: $(this).data('syncactions'),
					eventType: 'mouseout',
					method: 'event',
					syncName: 'syncItemOut'
				});
			}
		}
	});

	$('.ans-area').on('syncItemOut','.sele-area',function(e,message){
		$(this).removeClass('sele-hover');
		SDK.setEventLock();
		itemOutTimer = true;
	})
})

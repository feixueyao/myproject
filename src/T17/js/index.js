"use strict"
import '../../common/js/common.js'
import '../../common/js/drag.js'
import './sync.js';
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	let staticData = configData.source;
	let seleList = staticData.seleList;

	//spell
	(function fnSpell(){
		let showImg = new Image();
		showImg.src = staticData.img;
		$('.dis-area').append(showImg);

		const pos = {l:9.85,t:.35};
		let ele='',x,y,l_val = 2.8,t_val = 2.64;
		for(let i=0,length=seleList.length;i<length;i++){
			x = pos.l+(i%3)*l_val;
			y = pos.t+(parseInt(i/3))*t_val;
			ele+='<div class="ansBot-area" style="left:'+x+'rem;top:'+y+'rem"></div><div class="ans-area" data-syncactions=item-'+i+' style="left:'+x+'rem;top:'+y+'rem"><img src="'+seleList[i].img+'" style="left:'+x+'rem;top:'+y+'rem" /><i></i></div>'
		}
		$('.stage').append(ele);

		//判断desc
		let descText = $('.desc').text();
		if(descText!=''){
			$('.desc').removeClass('desc-visi');
		} 

		//图片尺寸大小判断
		$(".ans-area img").on("load",function(){
		   contrImgSize.call(this);
		});
  
	  	function contrImgSize(){
	    	var _this = $(this),
	    	imgWidth = _this.get(0).naturalWidth,
	    	imgHeight = _this.get(0).naturalHeight,
	    	containerScale = imgWidth / imgHeight;   //容器的宽高比
	    	if( containerScale < 1 ){//瘦高型
	    		if(imgHeight>206){
	    			_this.css({
		        		height:'100%',
		        		width:'auto'
		      		});
		      		_this.data("size",{width:'auto',height:'100%'})//记录图片开始位置尺寸
	    		}else{
		      		_this.css({
		        		height:imgHeight/100+"rem",
		        		width:'auto'
		      		});
		      		_this.data("size",{width:'auto',height:imgHeight/100+"rem"})
	    		}
	    		_this.parent('.ans-area').data("size",{width:imgWidth,height:imgHeight})//记录图片本身尺寸，用于拖动后父容器重新调整大小
	    	}else{//胖矮型
	    		if(imgWidth>206){
	    			_this.css({
		        		width:'100%',
	        			height:'auto'
		      		});
		      		_this.data("size",{width:'100%',height:'auto'})
	    		}else{
		      		_this.css({
		        		width:imgWidth/100+"rem",
		        		height:'auto'
		      		});
		      		_this.data("size",{width:imgWidth/100+"rem",height:'auto'})
	    		}
	      		_this.parent('.ans-area').data("size",{width:imgWidth,height:imgHeight})
	    	}
	  	}
	})()

	//===============================
	//添加拖拽
	var dragBefore = true;
	var dragEnd = true;
	var dragProcess = true;
	var lock = true;

	$('.ans-area').drag({
		before: function(e) {
			//if(dragBefore) {
			//dragBefore = false;

			if (!isSync) {

				$(this).trigger('syncDragBefore', {
					left: $(this).data('startPos').left,
					top: $(this).data('startPos').top,
					pageX: '',
					pageY: '',
				});
				return;
			}

			SDK.bindSyncEvt({
				index: $(this).data('syncactions'),
				eventType: 'dragBefore',
				method: 'drag',
				left: $(this).data('startPos').left,
				top: $(this).data('startPos').top,
				pageX: '',
				pageY: '',
				syncName: 'syncDragBefore'
			});
			//}

		},
		process: function(e) {
			if (!isSync) {
				$(this).trigger('syncDragProcess', {
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
				});
				return;
			}


			if (lock) {
				lock = false;
				setTimeout(function() {
					SDK.bindSyncEvt({
						index: $(this).data('syncactions'),
						eventType: 'dragProcess',
						method: 'drag',
						left: $(this).attr('data-left'),
						top: $(this).attr('data-top'),
						pageX: '',
						pageY: '',
						syncName: 'syncDragProcess'
					});
					lock = true;
				}.bind(this), 300);
			}
		},
		end: function(e) {
			if (!isSync) {
				$(this).trigger('syncDragEnd', {
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
				});
				return;
			}

			setTimeout(function() {
				SDK.bindSyncEvt({
					index: $(this).data('syncactions'),
					eventType: 'dragEnd',
					method: 'drag',
					left: $(this).attr('data-left'),
					top: $(this).attr('data-top'),
					pageX: '',
					pageY: '',
					syncName: 'syncDragEnd'
				});
			}.bind(this), 300);
		}
	});
	//=======================================================
	var existNum = 0;
	$('.ans-area').on("syncDragBefore", function(e, pos) {
		//if($(this).attr('tag')!='true'){//定位层级控制
			$(this).css('z-index',existNum);
			existNum++;
		//}
		$(this).attr('tag','true');//是否可提交标记
		// $(this).data('startPos', {
		// 	left: pos.left,
		// 	top: pos.top
		// });
		SDK.setEventLock();
	});

	$('.ans-area').on("syncDragProcess", function(e, pos) {
		$(this).css({
			'left': pos.left,
			'top': pos.top
		});
		SDK.setEventLock();
		//lock = true;
	});

	$('.ans-area').on("syncDragEnd", function(e, pos) {

		var startPos = $(this).data('startPos');
		//console.log('========================$(this).data===%s', JSON.stringify(startPos));
		
		//console.log('=======================pos==================%s',JSON.stringify(pos))
		let criticlaValue = $('.dis-area').position().left + $('.dis-area').width() - ($(this).width() / 2),
			nowLeft = parseInt($(this).position().left);
			//console.log('================drag end==================')
		if(nowLeft<criticlaValue){
			//console.log('=================pipei success ===========')
			var _size = $(this).data('size');
			$(this).css({'width':_size.width/100+'rem','height':_size.height/100+'rem','border-radius':'0','line-height':'0'});
			$(this).find('img').css({'width':_size.width/100+'rem','height':_size.height/100+'rem'});
		}else{
			$(this).resetStart();
		}

		//检测是否可提交
		if($(".ans-area[tag=true]").length>0){
			$('.ans-btn').addClass('allowSub');
			SDK.setEventLock();
		}else{
			$('.ans-btn').removeClass('allowSub');
			SDK.setEventLock();
		}
		//SDK.setEventLock();

	});
	//======================================================================//

	//提交
	var btnClickTimer = true;
	$('.ans-btn').on("click", function(e) {
		if (btnClickTimer) {
			btnClickTimer = false;

			if (!isSync) {
				$(this).trigger('syncBtnClick');

				return;
			}

			SDK.bindSyncEvt({
				sendUser: '',
                receiveUser: '',
				index: $(this).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncBtnClick'
			});
		}
	});
	$('.ans-btn').on('syncBtnClick',function(e,message){
		if($(this).hasClass('allowSub')){
			//console.log('============提交啦,不能再玩喽=========')
			$(this).text('Done').removeClass('allowSub');
			$('.cover').show();
			if(isSync){
				SDK.bindSyncResultEvt({
					sendUser: message.data[0].value.sendUser,
                    receiveUser: message.data[0].value.receiveUser,
                    sendUserInfo: message.data[0].value.sendUserInfo,
	                index: $('#container').data('syncresult'),
	                syncName: 'syncResultClick'
	            });
		    }
		}
		SDK.setEventLock();
		btnClickTimer = true;
	})

	//老师端响应
	let stuNameEle = '',
		userList = [];

	if(isSync){
		//console.log('======================9999999999999=========')
		const _appointMemberList = SDK.getClassConf().appointMemberList;
		//console.log('c-page======================================>SDK.getClassConf():%s',JSON.stringify(_appointMemberList))
		if(_appointMemberList!=null && _appointMemberList.length>0){
			for(let i=0,length=_appointMemberList.length;i<length;i++){
				if(_appointMemberList[i].role == 'stu'){
					userList.push(_appointMemberList[i]);
				}
			}
			//console.log('c-page===================================>userList:%s',JSON.stringify(userList));
			for(let i=0,length=userList.length;i<length;i++){
				//{"name":"jiusan","role":"stu","uid":"790110078","userid":"0"},
				stuNameEle+= '<div class="stuNameList" id='+userList[i].uid+'>'+userList[i].name+'</div>';
			}
			$('.showName-area').html(stuNameEle);
		}
	}

	let userId = '';
	$('#container').on('syncResultClick',function(e,message){
		var sendUserInfo = message.data[0].value.sendUserInfo;
		if(sendUserInfo.type == 'stu'){
			userId = sendUserInfo.id;
		}
		$('.stuNameList[id='+userId+']').addClass('stuName-active');
		SDK.setEventLock();
		btnClickTimer = true;
	})
});


jQuery.fn.extend({ 
	resetStart: function(size){
		var thisObj=this;
		//sync
		var startPos = $(this).data('startPos');
		var $left = startPos.left;
		var $top = startPos.top;
		thisObj.css({
			'left':$left,
			'top':$top,
			'width': '2.06rem',
			'height': '2.06rem',
			'border-radius': '.8rem'
		});
		var _img = thisObj.find('img');
		var _originSize = _img.data('size');
		_img.css({
			'width': _originSize.width,
			'height': _originSize.height
		})
		$(this).attr('tag','false');
		
    }
});
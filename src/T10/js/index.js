"use strict"
import '../../common/js/common.js'
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	let staticData = configData.source;
	let seleList = staticData.seleList;

	//spell
	(function fnSpell(){

		//选项区域dom
		let bodyEle = '';
		for(let i in seleList){
			bodyEle += '<div class="bodyList" id='+i+'><img src="'+seleList[i].bodyImg+'" alt=""></div>';
		}
		$('.sele-area').append(bodyEle);

		//学生信息区域
		let userList = {
			stuID:['101','102','103','104'],
			stu_101:{name:'liming',avatar:'assets/images/ava-1.png'},
			stu_102:{name:'lilu',avatar:'assets/images/ava-2.png'},
			stu_103:{name:'lisa',avatar:'assets/images/ava-3.png'},
			stu_104:{name:'lusa',avatar:'assets/images/ava-4.png'}
		};
		let stuDataEle = '';
		for(let i in userList.stuID){
			stuDataEle+='<div class="avaList" stuID="'+userList.stuID[i]+'"><div class="avaCon"><div class="stuAva"><img src="'+userList['stu_'+userList.stuID[i]].avatar+'" alt=""></div><div class="stuName"><p>'+userList['stu_'+userList.stuID[i]].name+'</p></div></div><div class="stuHat"></div></div>'
		}
		$('.dis-area').append(stuDataEle)
		//判断desc
		let descText = $('.desc').text();
		if(descText!=''){
			$('.desc').removeClass('desc-visi');
		} 
	
	})()

	function preloadImg(imgList){
		let hatImgList = [];
		for(let imgItem of imgList){
			let img = new Image();
		    img.src = imgItem.hatImg;
			img.onload = function(){
		        hatImgList.push(img)
		    }
		}
		return hatImgList;
	}
	let _hatImgList = preloadImg(seleList);

	//click
	let _stuID = '101';
	let _index = '';
	$('.bodyList').on('click',function(){
		_index = $(this).attr('id');
		let _hatImg = _hatImgList[_index];
		$('.avaList[stuid='+_stuID+']').find('.stuHat').html(_hatImg);
		$('.btn').addClass('allowSub');
	})

	//提交
	var btnClickTimer = true;
	$('.btn').on("click", function(e) {
		if (btnClickTimer) {
			btnClickTimer = false;

			if (!isSync) {
				$(this).trigger('syncBtnClick');

				return;
			}

			SDK.bindSyncEvt({
				index: $(this).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncBtnClick'
			});
		}
	});
	$('.btn').on('syncBtnClick',function(){
		if($(this).hasClass('allowSub')){
			console.log('============提交啦,不能再玩喽=========')
			$(this).text('Done').removeClass('allowSub');
			//$('.cover').show();
			console.log(_index)
			if(isSync){
				SDK.bindSyncResultEvt({
	                index: $('#container').data('syncresult'),
	                resultData:{isRight:_index},
	                syncName: 'syncResultClick'
	            });
		    }
		}
		SDK.setEventLock();
		btnClickTimer = true;
	})
})

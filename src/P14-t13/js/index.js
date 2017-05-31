"use strict"
import '../../common/js/common.js'
import './drag.js'
$(function(){

	let lock = true;
	const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
	var currentWindowId = $(window.frameElement).attr('id');
    var cacheFrameId = "h5_course_cache_frame";
	let userList = {
		stuID:['111','222','333','444'],
			'111':{ name:"stu1" },
			'222':{ name:"stu2" },
			'333':{ name:"stu3" },
			'444':{ name:"stu4" }
	}
	if(isSync){

		const appointMemberList = SDK.getClassConf().appointMemberList
	    userList = {
	    	stuID:[]
	    }
	    appointMemberList.forEach(function(item,i){
	    	if(item.role === 'stu'){
	    		userList.stuID.push(item.uid)
	    		userList[item.uid] = {name:item.name}
	    	}
	    })
	}
	
	// 填充内容
	const page = {
		// students:stuNames,
		title:configData.source.title,
		themePic:configData.source.themePic,
		audio:configData.source.audio,
		time:parseInt(configData.source.time),
		bomb:configData.source.bomb,
		toFit:function(){
			this.title.length > 0?$('.sec-middle').css('height','5.4rem'):null
			this.themePic && this.audio?$('.content').removeClass('flex-box').addClass('img-audio-container'):null
		},
		setThemePic:function(){
			this.themePic?$('.theme-pic').attr('src',this.themePic).show():null
		},
		setAudio:function(){
			if(this.audio){
				$('#themeAudio').attr('src',this.audio)
				$('.btn-audio').show()
			}
		},
		setBombAudio:function(){
			$('#bombAudio').attr('src',this.bomb)
		},
		setAvatars:function(users){
			//old <div class="absence ${userList[item].onclass===1?'hide':''}"></div>
			let eles = ''
			users.stuID.forEach(function(item,i){
				eles += `<li class="shadow" data-user-id="stu_${item}">
                    <img src="image/avatars-1.jpg" alt="" class="avatar">
                    <p class="name">${userList[item].name?userList[item].name:''}</p>
                    <div class="absence"></div>
                </li>`
			})
			$(eles).appendTo('.avatars ul')
		},
		setTime:function(){
			$('.count-down').text(this.time+'s')
		},
		init:function(){
			this.toFit()
			this.setThemePic()
			this.setAudio()
			this.setAvatars(userList)
			this.setTime()
			this.setBombAudio()
		}
	}
	page.init();



// 中途人员变更
	const updateUserConnect = function(){
		let updatedUserList = SDK.getClassConf().userList
		if(updatedUserList != null){
			$('.avatars li[data-user-id]').each(function(item){
				let dataUserId = $(this).attr('data-user-id')
				if(updatedUserList[dataUserId] != null){
					// in
					$(this).find('.absence').addClass('hide')
				}else{
					// out
					$(this).find('.absence').removeClass('hide')
				}
			})
		}
		setTimeout(updateUserConnect,1000);
	} 
	if(isSync){
		if(currentWindowId != cacheFrameId){
	        updateUserConnect();
	    }
	}
	

	// 同步拖拽
	$('.tea .bomb').drag({
		before:function(e){
			if (!isSync) {
				$('.bomb').trigger('syncDragBefore', {
					left: $('.bomb').data('startPos').left,
					top: $('.bomb').data('startPos').top,
					pageX: '',
					pageY: '',
				})
				return
			}
			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'dragBefore',
				method: 'drag',
				left: $('.bomb').data('startPos').left,
				top: $('.bomb').data('startPos').top,
				pageX: '',
				pageY: '',
				syncName: 'syncDragBefore'
			})
		},
		process:function(e){
			if (!isSync) {
				$('.bomb').trigger('syncDragProcess', {
					left: $('.bomb').attr('data-left'),
					top: $('.bomb').attr('data-top'),
					pageX: '',
					pageY: '',
				})
				return
			}
			if (lock) {
				lock = false
				setTimeout(function() {
					SDK.bindSyncEvt({
						index: $('.bomb').data('syncactions'),
						eventType: 'dragProcess',
						method: 'drag',
						left: $('.bomb').attr('data-left'),
						top: $('.bomb').attr('data-top'),
						pageX: '',
						pageY: '',
						syncName: 'syncDragProcess'
					})
					lock = true
				}.bind(this), 300)
			}
		},
		end:function(){
			if (!isSync) {
				$('.bomb').trigger('syncDragEnd', {
					left: $('.bomb').attr('data-left'),
					top: $('.bomb').attr('data-top'),
					pageX: '',
					pageY: '',
				})
				return
			}
			setTimeout(function() {
				SDK.bindSyncEvt({
					index: $('.bomb').data('syncactions'),
					eventType: 'dragEnd',
					method: 'drag',
					left: $('.bomb').attr('data-left'),
					top: $('.bomb').attr('data-top'),
					pageX: '',
					pageY: '',
					syncName: 'syncDragEnd'
				})
			}, 300)
		}
	})

	$('.bomb').on("syncDragBefore", function(e, pos) {
		$(this).data('startPos', {
			left: pos.left,
			top: pos.top
		})
		SDK.setEventLock()
	})

	$('.bomb').on("syncDragProcess", function(e, pos) {
		$(this).css({
			'left':pos.left,
			'top': pos.top
		})
		SDK.setEventLock()
	})

	$('.bomb').on('syncDragEnd',function(e,pos){
		$(this).css({
			'left':pos.left,
			'top': pos.top
		})
		$(this).addClass('drop-down')
		SDK.setEventLock()
	})

	// 倒计时
	let btnClick = true
	let start = false
	let time = page.time
	let timer = null
	$('.btn').on('click',function(e){
		if(btnClick){
			btnClick = false
			if(!isSync){
				$('.count-down').trigger('syncCountDown')
				return
			}
			SDK.bindSyncEvt({
				index: $('.count-down').data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncCountDown'
			})
		}
	})

	$('.count-down').on('syncCountDown',function(e){
		if(!start){
			$('.btn').removeClass('start').addClass('stop')
			start = true
			//========= reset time
			time = page.time
			$('.count-down').text(time+'s')
			//========= reset time
			if(timer){
				clearInterval(timer)
			}
			timer = setInterval(function(){
				time--
				if(time <= 5){
					$('.bomb-img img').addClass('beat')
				}
				if(time <0){
					time = 0
					clearInterval(timer)
					start = false
					$('.btn').removeClass('stop').addClass('start')
					$('.bomb').removeClass('drop-down')
					$('.bomb-img img').removeClass('beat')
					$('.bomb-gif').attr('src','./image/bomb.gif').removeClass('hide')
					setTimeout(function(){
						$('.bomb-gif').attr('src','').addClass('hide')
						$('.count-down').text(page.time+'s')
						$('.bomb').css({
							'left':'5.08rem',
							'top':'3.05rem'
						})
					},500)
					if(page.bomb){
						document.querySelector('#bombAudio').play()
					}
				}
				$('.count-down').text(time+'s')
			},1000)

		}else{
			if(timer){
				clearInterval(timer)
			}
			time = page.time
			$('.count-down').text(time+'s')
			start = false
			$('.btn').removeClass('stop').addClass('start')
			$('.bomb').removeClass('drop-down')
			$('.bomb img').removeClass('beat')
		}
		SDK.setEventLock()
		btnClick = true
	})

	// 中途人员变更
	// $('.container').on('updateUser',function(e){
	// 	let updatedUserList = SDK.getClassConf().userList;
	// 	console.log('c_page===============updatedUserList==============%s',JSON.stringify(updatedUserList));
	// 	if(currentWindowId != cacheFrameId ){
	// 	    if(updatedUserList != null){
	// 			$('.avatars li[data-user-id]').each(function(item){
	// 				let dataUserId = $(this).attr('data-user-id')
	// 				if(updatedUserList[dataUserId] != null){
	// 					// in
	// 					$(this).find('.absence').addClass('hide')
	// 				}else{
	// 					// out
	// 					$(this).find('.absence').removeClass('hide')
	// 				}
	// 			})
	// 		}
	//     }
		
	// })

	// 音频播放
	const audioEle = document.querySelector('#themeAudio')
	let play = false
	let audioPlay = function(){
		// audioEle.currentTime = 0
		audioEle.play()
		play = true
		$('.btn-audio img').attr('src','./image/btn-audio.gif')
	}
	let audioPause = function(){
		audioEle.pause()
		play = false
		$('.btn-audio img').attr('src','./image/btn-audio.png')
	}

	let audioClick = true
	$('.btn-audio').on('click touchstart',function(e){
		if(audioClick){
			audioClick = false
			if(!isSync){
				$(this).trigger('syncAudioClick')
				return
			}
			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncAudioClick',
				funcType:'audio'
			})
		}
		
	})

	$('.btn-audio').on('syncAudioClick',function(){
		if(play){
			audioPause()
		}else{
			audioPlay()
			audioEle.onended = function(){
				play = false
				$('.btn-audio img').attr('src','./image/btn-audio.png')
			}
		}
		SDK.setEventLock()
		audioClick = true
	})

})
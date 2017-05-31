"use strict"
import '../../common/js/common.js'
import './sync.js'
$(function(){

const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync
const answer = configData.source.words.split('#').join('')
const page = {
	title: configData.source.title,
	themePic:configData.source.themePic,
	audio: configData.source.audio,
	words:configData.source.words.split('#'),
	tofit:function(){
		if(this.title.length>0){
			$('.stu-content').css('height','5.84rem')
			$('.tea-content').css('height','5.84rem')
		}
		if(this.themePic && this.audio){
			$('.content-l').addClass('img-audio-container')
		}
		if(!this.themePic && !this.audio){
			$('.content-l').hide()
		}
	},
	intermingleWords:function(){
		// 打乱句子顺序
		let wordsArr  = this.words
		if(wordsArr.length > 2){
			let temp = wordsArr[0]
			let mid = Math.round(wordsArr.length/2)
			wordsArr[0] = wordsArr[mid]
			wordsArr[mid] = temp
		}else{
			let temp =  wordsArr[0]
			wordsArr[0] = wordsArr[1]
			wordsArr[1] = temp
		}
		return wordsArr
	},
	setImg:function(){
		if(this.themePic){
			$('.theme-pic').attr('src',this.themePic).show()
		}
	},
	setAudio:function(){
		if(this.audio){
			$('audio').attr('src',this.audio)
			$('.btn-audio').show()
		}
	},
	setWords:function(){
		let str = ''
		let arr = this.intermingleWords()
		arr.forEach(function(ele,i){
			str += `<li class="w-${i}" data-syncactions="w-${i}">${ele}</li>`
		})
		$(str).appendTo('.words ul')
	},
	setBottomAnswer:function(){
		$('.answer span').text(configData.source.words.split('#').join(' '))
	},
	tStuNames:function(){
		let str = ''
		this.stuNames.forEach(function(ele){
			str += `<li class="flex-box">
              <div class="name">${ele}</div>
              <div class="result"></div>
            </li>`
            $(str).appendTo('.tea-answers ul')
		})
	},
	setContent:function(){
		this.tofit()
		this.setImg()
		this.setAudio()
		this.setWords()
		this.setBottomAnswer()
		// this.setStuNames()
	},
	bindEvents:function(){
		$('.sentence').on('mouseover','span',function(){
			if($('.sentence').hasClass('forbid')){
				return
			}
			$(this).css('color','#56a200')
		})

		$('.sentence').on('mouseout','span',function(){
			if($('.sentence').hasClass('forbid')){
				return
			}
			$(this).css('color','#000')
		})
	},
	init:function(){
		this.setContent()
		this.bindEvents()
	}
}
page.init()

// 音频播放同步
const audioEle = document.querySelector('audio')
let play = false
let audioPlay = function(){
	audioEle.currentTime = 0
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

$('.btn-audio').on('syncAudioClick',function(e){
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

// 答题同步

let result = ''
let wordsClick = true
$('.stu .words').on('click','li',function(e){
	if(wordsClick){
		wordsClick = false
		if(!isSync){
			$(this).trigger('syncWordsClick')
			return
		}
		SDK.bindSyncEvt({
			sendUser: '',
            receiveUser: '',
			index: $(e.currentTarget).data('syncactions'),
			eventType: 'click',
			method: 'event',
			syncName: 'syncWordsClick'
		})
	}
	
})

$('.stu .words').on('syncWordsClick','li',function(e){	
	let _this = $(this)

	if(_this.css('opacity') == 0){
		SDK.setEventLock()
		wordsClick = true
		return
	}
	let sClass = _this.attr('class')
	let syncactions = _this.data('syncactions')
	let txt = _this.text()

	let span = `<span class="${sClass}" data-syncactions="${syncactions}">${txt}</span>`
	$(span).appendTo('.sentence')
	_this.css('opacity',0)
	if($('.submit').length > 0){
		result = $('.stu .sentence').text()
		if(result.length === answer.length){
			$('.submit').addClass('active')
		}
	}
	SDK.setEventLock()
	wordsClick = true
})

// 取消答题 同步
let sentenceClick = true
$('.stu .sentence').on('click','span',function(e){
	if(sentenceClick){
		sentenceClick = false
		if(!isSync){
			$(this).trigger('syncSentenceClick')
			return
		}
		SDK.bindSyncEvt({
			sendUser: '',
            receiveUser: '',
			index: $(e.currentTarget).data('syncactions'),
			eventType: 'click',
			method: 'event',
			syncName: 'syncSentenceClick'
		})
	}
	
})

$('.stu .sentence').on('syncSentenceClick','span',function(e){
	if($('.sentence').hasClass('forbid') ){
		SDK.setEventLock()
		sentenceClick = true
		return
	}
	let _this = $(this)
	let sClass = _this.attr('class')
	_this.remove()
	$(`.words li.${sClass}`).css('opacity',1)
	result = $('.stu .sentence').text()
	result.length === answer.length?null:$('.submit').removeClass('active')
	SDK.setEventLock()
	sentenceClick = true
})

// 提交答案  同步
let submitClick = true
$('.container').on('click','.submit.active',function(e){
	if(submitClick){
		submitClick = false
		if (!isSync) {
	        $(this).trigger('syncSubmit')
	        return
	    }
	    SDK.bindSyncEvt({
	        sendUser: '',
	        receiveUser: '',
	        index: $(e.currentTarget).data('syncactions'),
	        eventType: 'click',
	        method: 'event',
	        syncName: 'syncSubmit'
	    })
	}
})
$('.container').on('syncSubmit','.submit.active',function(e,message){
	$('.answer').removeClass("hide")
	
	let isRight = result===answer?true:false
	if(isRight){
		$('.sentence span').css('color','#56a200')
		$('.content-r .icon').removeClass('hide').addClass('icon-right')
	}else{
		$('.sentence span').css('color','#ff4848')
		$('.content-r .icon').removeClass('hide').addClass('icon-wrong')
	}

	$('.sentence').addClass('forbid')

	$(this).text('done').removeClass('active')

	if(isSync){
		SDK.bindSyncResultEvt({
			sendUser: message.data[0].value.sendUser,
	        receiveUser: message.data[0].value.receiveUser,
	        sendUserInfo: message.data[0].value.sendUserInfo,
			index: $('#container').data('syncresult'),
			resultData:{isRight:isRight},
			syncName:'teaShowResult'
		})
	}
	// 答题结束
	// submitClick = true
	wordsClick = false	
	sentenceClick = false
})

})
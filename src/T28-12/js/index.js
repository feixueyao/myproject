"use strict"
import '../../common/js/common.js'
import './sync.js'
$(function() {
	let staticData = configData.source;
	// console.log(staticData);
	let optionsArr = staticData.options;
	var ansRightId; //答对的ID
	function spell() {
		let str1 = '',
			str2 = '',
			str3 = '',
			optionsNum = ['A', 'B', 'C', 'D'];
		str1 = '<div class="quesArea"><div class="textArea"><div class="btn upbtn" data-syncactions="up">上</div><div class="textContain"><div class="text">' + staticData.text + '</div></div><div class="btn downbtn" data-syncactions="down">下</div></div><div class="ques"><div class="textQues"><div class="ques-logo"><span>QUESTION</span></div><div class="QuesShow"><p>' + staticData.textQues + '</p></div></div><div class="optionsList"><ul>';
		//学生端
		for (var i = 0, length = staticData.options.length; i < length; i++) {
			str2 += '<li class="options" data-syncactions="options-' + i + '"><span class="answerIcon"></span><span class="optionsText">' + optionsNum[i] + '</span><div class="ans-line"><p class="answer">' + staticData.options[i] + '</p></div></li>';
		}
		str3 = str1 + str2 + '</ul></div></div></div>';
		$(".stu-stage").append(str3);
		//老师端
		// console.log('c-page:========================:$s:', str3);
		$(".tea-stage").append(str3)
		let textH = $(".text").height();
		let textContainH = $(".textContain").height();
		//判断短文是否溢出textContain容器,产生滚动条
		if (textH > textContainH) {
			//显示反转短文按钮
			$(".btn").css({
				"display": "block"
			});
		}
		// console.log('c-page:========================:$s:', textH);
		// console.log('c-page:========================:$s:', textContainH);
		// ================================
		// 检查是否有title
		if (!staticData.title) {
			$(".quesArea").css({
				"margin-top": "1.2rem"
			});
		} else if(configData.desc&&staticData.title) {
			$(".quesArea").css({
				"margin-top": "0"
			});
		}else if(!configData.desc){
			$(".quesArea").css({
				"margin-top": "0.1rem"
			}); 
			$(".title").css({
				"margin-top": "0.5rem"
			})
		}
		if (!configData.desc&&!staticData.title) {
			$(".quesArea").css({
				"margin-top": "1.6rem"
			}); 
		}
		//根据行数设置问题的字体大小
		let index = [];
		if ($(".answer")) {
			$(optionsArr).each(function(i, arr) {
				if (arr.length > 52) {
					index.push(i);
				}
			});
			$(".ans-line").each(function(i, arr) {
				if (index[i] == i) {
					$(this).css({
						"font-size": "0.24rem"
					});
				}
			});
		}

		let right = staticData.right;
		for (let i = 0, length = optionsArr.length; i < length; i++) {
			if (right == optionsArr[i]) {
				ansRightId = i;
			}
		}
		// console.log('c-page:========================:$s:', ansRightId);
	}
	spell(); //拼写模版

	const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

	//短文过长时出现的上下按钮可翻看全文
	let isScrollUp = true;
	let contentUp = 0;
	$(".stage-area .upbtn").on("click", function(e) {
		if (isScrollUp) {
			isScrollUp = false;
			if (!isSync) {
				$(this).trigger("syncgoUp");
				return;
			}
			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data("syncactions"),
				eventType: 'click',
				method: 'event',
				syncName: 'syncgoUp'
			});
		}
	});
	$(".stage-area .upbtn").on("syncgoUp", function(e) {
		let diffHeight = $('.text').height() / window.base - $('.textContain').height() / window.base;
		if (contentUp <= 0) {
			SDK.setEventLock();
			isScrollUp = true;
			return;
		}

		contentUp -= 0.8;
		contentUp = parseFloat(contentUp.toFixed(1));

		$('.text').css('top', -contentUp + 'rem').css({
			"transition": "all 0.3s"
		});
		$('.downbtn').css({
			"background-image": "url('image/down.png')"
		});
		if (contentUp == 0) {
			$('.upbtn').css({
				"background-image": "url('image/up_btn.png')"
			});
		}
		SDK.setEventLock();
		isScrollUp = true;
	});

	let isScrollDown = true;
	$(".stage-area .downbtn").on("click", function(e) {
		if (isScrollDown) {
			isScrollDown = false;
			if (!isSync) {
				$(this).trigger("syncgodown");
				return;
			}
			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data("syncactions"),
				eventType: 'click',
				method: 'event',
				syncName: 'syncgodown'
			});
		}
	});
	$(".stage-area .downbtn").on("syncgodown", function(e) {
		let diffHeight = $('.text').height() / window.base - $('.textContain').height() / window.base;
		if (contentUp >= diffHeight) {
			SDK.setEventLock();
			isScrollDown = true;
			return;
		}
		$('.upbtn').css({
			"background-image": "url('image/up.png')"
		});
		contentUp += 0.8;
		contentUp = parseFloat(contentUp.toFixed(1));

		$('.text').css('top', -contentUp + 'rem').css({
			"transition": "all 0.3s"
		});
		if (contentUp < diffHeight) {
			$('.downbtn').css({
				"background-image": "url('image/down.png')"
			});
		}
		if (contentUp >= diffHeight) {
			$('.downbtn').css({
				"background-image": "url('image/down_btn.png')"
			});
		}
		SDK.setEventLock();
		isScrollDown = true;
	});
	//学生端开始答题
	var isAnswer = true;
	$(".stu-stage .options").on("click", function(e) {
		if (isAnswer) {
			isAnswer = false;
			if ($(".answerIcon").hasClass("ansWrong")) {
				$(".answerIcon").removeClass("ansWrong");
			}
			// console.log('c-page:========================:$s:', "可以答题了");
			if (!isSync) {
				$(this).trigger("syncstartAns");
				return;
			}
			SDK.bindSyncEvt({
				sendUser: '',
				receiveUser: '',
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncstartAns'
			});
		}
	});

	var startAnswer = true;
	var optionsID; //存储学生选择的选项的id
	$('.stu-stage .options').on('syncstartAns', function(e, message) {
		// console.log('T28=======================startAns message', message)
		var answer = $(this).find(".answer").text();
		var _this = $(this);
		optionsID = _this.index();
		if ($(".answerIcon").hasClass("ansWrong")) {
			$(".answerIcon").removeClass("ansWrong");
		}
		// 答对后不可再选择
		if (_this.hasClass('not-click')) {
			SDK.setEventLock();
			isAnswer = false;
			return;
		}

		if (answer == staticData.right) {
			// console.log("================答对了========");
			_this.find(".answerIcon").addClass("ansRight");
			$(".options").addClass("not-click");
			if (isSync) {
				SDK.bindSyncResultEvt({
					sendUser: message.data[0].value.sendUser,
					receiveUser: message.data[0].value.receiveUser,
					sendUserInfo: message.data[0].value.sendUserInfo,
					index: $('#container').data('syncresult'),
					resultData: {
						isRight: true
					},
					syncName: 'teaShowResult',
					starSend: message.data[0].value.starSend
				});
			}
			isAnswer = false;
		} else {
			// console.log("=======答错了========");
			_this.find(".answerIcon").addClass("ansWrong");
			_this.find(".ans-line").css('animation', 'shakeUp 0.3s both ease-in');
			_this.find(".ans-line").on('animationend  webkitAnimationEnd', function() {
				_this.find(".ans-line").css('animation', 'none');
			});

			if (isSync) {
				// console.log('T28  answer wrong ====================message')
				SDK.bindSyncResultEvt({
					sendUser: message.data[0].value.sendUser,
					receiveUser: message.data[0].value.receiveUser,
					sendUserInfo: message.data[0].value.sendUserInfo,
					index: $('#container').data('syncresult'),
					resultData: {
						isRight: false
					},
					syncName: 'teaShowResult'
				});
				// console.log('T28 answer wrong =====================bindsyncresult')
			}
			isAnswer = true;
		}
	});

	//老师端响应学生答题结果

})
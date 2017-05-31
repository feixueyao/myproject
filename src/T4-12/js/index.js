"use strict"

import '../../common/js/common.js'
import './sync.js'
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){

	let options = configData.source.options,
		sound = configData.source.audio,
		title = configData.source.title,
		article = configData.source.article,
		desc = configData.desc,
		tg = configData.tg,
		texts = [];

	if ( !article ) {
		$('article').hide();
		$('.commom').addClass('no-article');
	}else {
		$('article').find('.article').html(article);
	}

	if ( !desc ) {
		$('.commom .desc').show().html('').css('opacity', 0);
	}

	if ( !title ) {
		$('.commom .title').hide();
		$('.commom').addClass('no-title');
	}

	if ( !sound ) {
		$('#sound').hide();
	}else {
		$('#sound audio').attr('src', sound);
	}

	/*
	// artice font-size 设置
	let scale = parseFloat($('.article').css('width'))/parseFloat($('.article').css('fontSize'));
	// console.log(scale, $('.article').width(), $('.article').css('fontSize'));

	$(window).on('resize', function () {
		$('.article').css('fontSize', $('.article').width()/scale);
		console.log('scale:' + scale);
		console.log('article size:' + $('.article').css('fontSize'));
	});
	*/

	for ( let i in options ) {
		texts.push(options[i].text);
	}

	// 答案乱序
	texts.splice(1, 0, texts.shift());
	texts.splice(1, 0, texts.pop());

	for ( let i=0; i<options.length; i++ ) {
		let pic = $(`<li class="item" data-syncactions="pic-${i}"><img src="${options[i].pic}"></li>`)
		let item = $(`<li data-syncactions="item-${i}"><span>${texts[i]}</span></li>`)
		// if ( item.find('span').html().length <= 5 ) {
		// 	item.find('span').css('fontSize', '.6rem')
		// }
		// if ( item.find('span').html().length > 5 && item.find('span').html().length <= 7 ) {
		// 	item.find('span').css('fontSize', '.48rem')
		// }
		// if ( item.find('span').html().length > 7 && item.find('span').html().length <= 17 ) {
		// 	item.find('span').css('fontSize', '.36rem')
		// }
		$('.problem-area .pic').append(pic);
		$('.problem-area .answers').append(item);
	}

	let [pics, items] = [$('.problem-area .pic li'), $('.problem-area .answers li')];
	let contentUp = 0;

	if ( $('.article').height() > $('.article-box').height() ) {
		$('.article-btn').show();
		$('.article-box').removeClass('no-scroll');
	}

	$('.btn-up').addClass('disabled');

	var btnUpClick = true;
	$('.btn-up').on('click touchstart',function(e){
		e.stopPropagation();
        if (btnUpClick) {
            btnUpClick = false;
            if(!isSync) {
                $(this).trigger('syncBtnUpClick');
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                syncName: 'syncBtnUpClick'
            });
		}
	})
	$('.btn-up').on('syncBtnUpClick', function (e) {

		let diffHeight = $('.article').height()/window.base - $('.article-box').height()/window.base;

		if ( contentUp >= 0 ) {
			SDK.setEventLock();
			btnUpClick = true;
			return;
		}
		contentUp += 0.8
		contentUp = parseFloat(contentUp.toFixed(1));

		$('.article').css('top', contentUp + 'rem');

		if ( contentUp == 0 ) {
			$(this).addClass('disabled');
		}

		if ( -contentUp < diffHeight ) {
			$('.btn-down').removeClass('disabled');
		}

		SDK.setEventLock();
		btnUpClick = true;

	});

	var btnDwonClick = true;
	$('.btn-down').on('click touchstart',function(e){
		e.stopPropagation();
        if (btnDwonClick) {
            btnDwonClick = false;
            if(!isSync) {
                $(this).trigger('syncBtnDownClick');
                return;
            }
            SDK.bindSyncEvt({
                index: $(e.currentTarget).data('syncactions'),
                eventType: 'click',
                method: 'event',
                syncName: 'syncBtnDownClick'
            });
		}
	})
	$('.btn-down').on('syncBtnDownClick', function () {

		let diffHeight = $('.article').height()/window.base - $('.article-box').height()/window.base;

		if ( -contentUp >= diffHeight ) {
			SDK.setEventLock();
			btnDwonClick = true;
			return;
		}

		contentUp -= 0.8
		contentUp = parseFloat(contentUp.toFixed(1));

		$('.article').css('top', contentUp + 'rem');

		if ( -contentUp >= diffHeight ) {
			$(this).addClass('disabled');
		}

		if ( contentUp < 0 ) {
			$('.btn-up').removeClass('disabled');
		}

		SDK.setEventLock();
		btnDwonClick = true;

	});

	let disable = false,
		picIndex,
		itemIndex,
		picLen = pics.length,
		itemLen = items.length,
		isPlaySound = true,
		lineBoxHeight = parseInt($('#lineBox').height());

	var soundClick = true;
	$('#sound').on('click touchstart',function(e){
		e.stopPropagation();
        if (soundClick) {
            soundClick = false;
            if(!isSync) {
                $(this).trigger('syncSoundClick');
                return;
            }
            if(window.frameElement.getAttribute('user_type') == 'tea') {
	            SDK.bindSyncEvt({
	                index: $(e.currentTarget).data('syncactions'),
	                eventType: 'click',
	                method: 'event',
	                syncName: 'syncSoundClick',
	                funcType: 'audio'
	            });
            } else {
            	$(this).trigger('syncSoundClick');
            	return;
            }
		}
	})

	$('#sound').on('syncSoundClick', function () {

		let img = $(this).find('img');
		let audio = $(this).find('audio')[0];

		if ( isPlaySound ) {
			audio.play();
			img.attr("src", img.attr("src").replace(".png", ".gif"));
		} else {
			audio.pause();
			img.attr("src", img.attr("src").replace(".gif", ".png"));
		}
		audio.onended = function() {
		    img.attr("src", img.attr("src").replace(".gif", ".png"));
		    isPlaySound = true;
		}.bind(this);

		isPlaySound = !isPlaySound;

		SDK.setEventLock();
		soundClick = true;

	});

	// 获取图片和单词未选中个数
	function getLen () {

			picLen = 0;
			itemLen = 0;

			pics.each(function (i, ele) {
				if ( !$(ele).hasClass('true') && !$(ele).hasClass('false') && !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
					picLen ++;
				}
			})
			items.each(function (i, ele) {
				if ( !$(ele).hasClass('true') && !$(ele).hasClass('false') && !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
					itemLen ++;
				}
			})
	}

	// 画线
	function drawLine () {

		let line = $('<div class="line"></div>');

	}

	// pics.each(function (i, ele) {

		var itemClick = true;
		$('.problem-area .pic li').on('click',function(e){
			// debugger;
			e.stopPropagation();
	        if (itemClick) {
	            itemClick = false;
	            if(!isSync) {
	                $(this).trigger('syncSoundClick');
	                return;
	            }
	            if(window.frameElement.getAttribute('user_type') == 'stu') {
		            SDK.bindSyncEvt({
		                index: $(e.currentTarget).data('syncactions'),
		                eventType: 'click',
		                method: 'event',
		                syncName: 'syncSoundClick'
		            });
	            }
			}
		})

		$('.problem-area .pic li').on('syncSoundClick', function (e, message) {

			let that = $(this);
			let boxLeft = $('.container').offset().left;

			if ( $(this).hasClass('finish') ) {
				itemClick = true;
				return;
			}

			getLen();

			picIndex = $(this).index();

			if ( picLen < itemLen ) {

				if ( $(this).hasClass('faild') ) {

					items.each(function (i, ele) {
						if ( !pics.eq(i).hasClass('finish') ) {
							pics.eq(i).removeClass('true');
						}
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
							$(ele).removeAttr('partner');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});
					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');
				}
				
				pics.each(function (i, ele) {
					if ( !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
						$(ele).removeClass('true');
					}
				})

				$(this).addClass('true');

			} else if ( picLen > itemLen ) {

				if ( $(this).hasClass('faild') ) {

					items.each(function (i, ele) {
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});
					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');
					items.eq(itemIndex).removeAttr('partner');
					items.eq(itemIndex).removeClass('true');
					
					SDK.setEventLock();
					itemClick = true;

					return
				}

				let line = $('<div class="line"><div></div></div>'),
					x = items.eq(itemIndex).offset().left + (items.eq(itemIndex).width()/2),
					y = $(this).offset().left + ($(this).width()/2),
					powH = $('#lineBox').height()/window.base,
					powW = (x - y)/window.base,
					deg;

				deg = Math.atan(powH/powW) * 180 / Math.PI
				deg = deg > 0 ? deg : 180 + deg;

				if ( Math.abs(Math.abs(deg) - 90) < 10 ) {
					deg = 90;
				}

				// console.log('c-page:=============deg: ' + deg)

				powH = Math.pow($('#lineBox').height()/window.base, 2),
				powW = Math.pow((x - y)/window.base, 2)

				if ( options[$(this).index()].text === texts[itemIndex] ) {
					console.log('finish');
					$(this).addClass('finish');
					items.eq(itemIndex).addClass('finish');
					line.addClass('true');

					$('#lineBox').append(line);

					line.attr('partner', $(this).attr('partner'));
					line.css({
						left: ($(this).offset().left + $(this).width()/2 - boxLeft)/window.base + 'rem',
						width: Math.sqrt(powH + powW) + 0.6 + 'rem',
						transformOrigin: 'left center',
						transform: 'rotate('+ deg +'deg)'
					});

				} else {
					// console.log('faild');
					$(this).attr('partner', itemIndex);
					$(this).removeClass('true').addClass('shake');
					$(this).on('animationend',function(){//监听动画
				        $(this).removeClass('shake');
				        $(this).off('animationend');
				        SDK.setEventLock();
						itemClick = true;
				    });
					items.eq(itemIndex).attr('partner', itemIndex);
					items.eq(itemIndex).addClass('shake').removeClass('true')
					items.eq(itemIndex).on('animationend',function(){//监听动画
				        items.eq(itemIndex).removeClass('shake');
				        items.eq(itemIndex).off('animationend');
				        SDK.setEventLock();
						itemClick = true;
				    });

					// line.addClass('false');

				}

			} else {

				if ( $(this).hasClass('faild') ) {
					items.each(function (i, ele) {
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
							$(ele).removeAttr('partner');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});
					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');
					// console.log('pic partner is: ' + $(this).attr('partner'), 'item partner is ' + items.eq(itemIndex).attr('partner'));
					
					SDK.setEventLock();
					itemClick = true;

					return
				}

				pics.each(function (i, ele) {
					if ( !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
						$(ele).removeClass('true');
					}
				})
				$(this).addClass('true');
			}

			SDK.setEventLock();
			itemClick = true;

			if ( $('.finish').length == pics.length + items.length ) {
				console.log('c-page:完成答题！====== 二期增加星星派送效果');
				if ( isSync ) {
					 //todo 计算结果
	                SDK.bindSyncResultEvt({
	                    sendUser: message.data[0].value.sendUser,
	                    receiveUser: message.data[0].value.receiveUser,
	                    sendUserInfo: message.data[0].value.sendUserInfo,
	                    index: $('#container').data('syncresult'),
	                    resultData: {
	                        isRight: true
	                    },
	                    starSend: message.data[0].value.starSend,
	                    syncName: 'teaShowResult'
	                })
				}

				SDK.setEventLock();
				itemClick = false;
				answerClick = false;
			}		

		});
	// });

		var answerClick = true;
		$('.problem-area .answers li').on('click touchstart',function(e){
			// debugger;
			e.stopPropagation();
	        if (answerClick) {
	            answerClick = false;
	            if(!isSync) {
	                $(this).trigger('syncSoundClick');
	                return;
	            }
	            if(window.frameElement.getAttribute('user_type') == 'stu') {
		            SDK.bindSyncEvt({
		                index: $(e.currentTarget).data('syncactions'),
		                eventType: 'click',
		                method: 'event',
		                syncName: 'syncSoundClick'
		            });
	            }
			}
		})

	// items.each(function (i, ele) {
		$('.problem-area .answers li').on('syncSoundClick', function (e, message) {

			let that = $(this);
			let boxLeft = $('.container').offset().left;
			
			if ( $(this).hasClass('finish') ) {
				answerClick = true;
				return;
			}

			getLen();

			itemIndex = $(this).index();

			if ( itemLen < picLen ) {

				if ( $(this).hasClass('faild') ) {
					
					pics.each(function (i, ele) {
						if ( !items.eq(i).hasClass('finish') ) {
							items.eq(i).removeClass('true');
						}
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
							$(ele).removeAttr('partner');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});
					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');
				}
				
				items.each(function (i, ele) {
					if ( !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
						$(ele).removeClass('true');
					}
				})
				$(this).addClass('true');

			} else if ( itemLen > picLen ) {	

				if ( $(this).hasClass('faild') ) {

					pics.each(function (i, ele) {
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});
					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');
					pics.eq(picIndex).removeAttr('partner');
					pics.eq(picIndex).removeClass('true');

					SDK.setEventLock();
					answerClick = true;

					return
				}

				let line = $('<div class="line"><div></div></div>'),
					x = pics.eq(picIndex).offset().left + (pics.eq(picIndex).width()/2),
					y = $(this).offset().left + ($(this).width()/2),
					powH = $('#lineBox').height()/window.base,
					powW = (x - y)/window.base,
					deg;

				deg = - Math.atan(powH/powW) * 180 / Math.PI;

				deg = deg > 0 ? deg : 180 + deg;

				if ( Math.abs(Math.abs(deg) - 90) < 10 ) {
					deg = 90;
				}

				// console.log('c-page:======== deg: ' + deg);

				powH = Math.pow($('#lineBox').height()/window.base, 2);
				powW = Math.pow((x - y)/window.base, 2);

				if ( $(this).find('span').html() === options[picIndex].text ) {
					// console.log('finish');
					$(this).addClass('finish');
					pics.eq(picIndex).addClass('finish');
					line.addClass('true');

					$('#lineBox').append(line);

					line.attr('partner', $(this).attr('partner'));
					line.css({
						left: (pics.eq(picIndex).offset().left + pics.eq(picIndex).width()/2 - boxLeft)/window.base + 'rem',
						width: Math.sqrt(powH + powW) + 0.6 + 'rem',
						transformOrigin: 'left center',
						transform: 'rotate('+ deg +'deg)'
					});

				} else {
					// console.log('faild');
					$(this).attr('partner', itemIndex);
					$(this).removeClass('true').addClass('shake');
					$(this).on('animationend',function(){//监听动画
				        $(this).removeClass('shake');
				        $(this).off('animationend');
				        SDK.setEventLock();
						answerClick = true;
				    });
					pics.eq(picIndex).attr('partner', itemIndex);
					pics.eq(picIndex).addClass('shake').removeClass('true');
					pics.eq(picIndex).on('animationend',function(){//监听动画
				        pics.eq(picIndex).removeClass('shake');
				        pics.eq(picIndex).off('animationend');
				        SDK.setEventLock();
						answerClick = true;
				    });
				}

			} else {

				if ( $(this).hasClass('faild') ) {
					pics.each(function (i, ele) {
						if ( $(ele).attr('partner') === that.attr('partner') ) {
							$(ele).removeClass('faild true');
							$(ele).removeAttr('partner');
						}
					})
					$('#lineBox .line').each(function (i, ele) {
						if ( $(this).attr('partner') === that.attr('partner') ) {
							$(this).remove();
						}
					});

					$(this).removeClass('faild').addClass('true');
					$(this).removeAttr('partner');

					SDK.setEventLock();
					answerClick = true;

					return
				}

				items.each(function (i, ele) {
					if ( !$(ele).hasClass('finish') && !$(ele).hasClass('faild') ) {
						$(ele).removeClass('true');
					}
				})
				$(this).addClass('true');
			}
			
			SDK.setEventLock();
			answerClick = true;

			if ( $('.finish').length == pics.length + items.length ) {
				console.log('c-page:完成答题！====== 二期增加星星派送效果');
				if ( isSync ) {
					 //todo 计算结果
	                SDK.bindSyncResultEvt({
	                    sendUser: message.data[0].value.sendUser,
	                    receiveUser: message.data[0].value.receiveUser,
	                    sendUserInfo: message.data[0].value.sendUserInfo,
	                    index: $('#container').data('syncresult'),
	                    resultData: {
	                        isRight: true
	                    },
	                    starSend: message.data[0].value.starSend,
	                    syncName: 'teaShowResult'
	                })
				}
			
				SDK.setEventLock();
				answerClick = false;
				itemClick = false;
			}

		});
	// });

})

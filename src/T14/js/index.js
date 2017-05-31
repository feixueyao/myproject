"use strict"
import '../../common/js/common.js'
import './sync.js'
const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function() {

	console.log($);

	let article = configData.source.article,
		dialImg = configData.source.dial,
		dialNum = configData.source.dialNum;

	let [dial, start, stop] = [$('.dial'), $('.start-dial'), $('.stop-dial')];
	let textList = $('.left-text .text-list');
	let angle = 360 / dialNum;
	let rotateTimer = null;
	let deg = 0,
		number = 0,
		remaNumber = 0,	// 取余数每次递增一
		times = 0;


	// 页面初始化
	$('.dial').attr('src', dialImg);

	textList.html(article);

	let startRotate;
	let isAllowClick = true;

	// 开始转
	var startClick = true;
	start.on('click touchstart', function(e) {
		e.stopPropagation();
		if (startClick) {
			startClick = false;
			if (!isSync) {
				$(this).trigger('syncStartClick');
				return;
			}
			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncStartClick'
			});
		}
	});

	start.on('syncStartClick', begin);

	function begin() {

		if (!isAllowClick) {
			return
		}

		// console.log('c-page=========================classConf:' + JSON.stringify(SDK.getClassConf()));
		var ram, status, rema, uid;

		if (isSync) {
			ram = Math.floor(Math.random()*dialNum + 1);
			status = SDK.getClassConf().h5Course.classStatus;
			uid = window.frameElement.getAttribute('user_id');
			rema = uid%dialNum + 1;
		}

		// if (status == 2 || status == 0) {
		// 	deg = ram*angle;
		// } else {
		// 	number ++;
		// 	deg = number*angle;
		// }

		// console.log('c-page=========================SDK user_id:' + uid);
		// console.log('c-page=========================SDK rema:' + rema);

		if (status == 2 || status == 0) {
			remaNumber += (Math.floor(dialNum/2)+1);
			deg = (rema+remaNumber)*angle;
		} else {
			number ++;
			deg = number*angle;
		}

		// num ++;
		// deg = rema*angle;
		// console.log('c-page:>>>>>>>>>>>>>>>>>>>>>>>>>>>>:number:', number);
		// console.log('c-page:>>>>>>>>>>>>>>>>>>>>>>>>>>>>:remaNumber:', remaNumber);
		// console.log('c-page=========================deg:' + deg);

		dial.css({
			'animation': 'dial 1s linear infinite',
			'transform': 'rotate(' + deg + 'deg)',
			'transition': 'none'
		});

		start.hide();
		stop.show();

	}

	// 停止转
	var stopClick = true;
	stop.on('click touchstart', function(e) {

		e.stopPropagation();

		if (stopClick) {

			stopClick = false;

			if (!isSync) {
				$(this).trigger('syncStopClick');
				return;
			}

			SDK.bindSyncEvt({
				index: $(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				syncName: 'syncStopClick'
			});

		}
	});
	stop.on('syncStopClick', function() {

		if (!isAllowClick) {
			return
		}

		if ( number > dialNum ) {
			number = 1;
		}

		if ( remaNumber > dialNum ) {
			remaNumber = remaNumber - dialNum;
		}

		isAllowClick = false;

		// clearInterval(rotateTimer);

		start.show();
		stop.hide();

		// times = parseInt(deg / 360);

		// if (deg - 360 * times > angle) {
		// 	console.log('> ' + angle);
		// 	deg = 360 * times + parseInt((deg - 360 * times) / angle) * angle;
		// } else {
		// 	console.log('<= ' + angle);
		// 	deg = 360 * times;
		// }

		// deg += (360 + number * angle);
		deg += 360;

		// console.log('c-page======== after stop ==========:%s', deg);
		// console.log('c-page======== after stop number ==========:%s', number);

		dial.css({
			'animation': 'none'
		});
		setTimeout(() => {
			dial.css({
				'transform': 'rotate(' + deg + 'deg)',
				'transition': '1.7s ease-out'
			});
		});

		setTimeout(function() {
			SDK.setEventLock();
			isAllowClick = true;
			startClick = true;
			stopClick = true;
		}, 1800)

	});

})
"use strict"

import '../../common/js/common.js'
import './sync.js'
const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

$(function(){
	/*let testRemoteData=[{
		"count":33,
		"id":800003733
	},{
		"count":22,
		"id":800003995
	},{
		"count":33,
		"id":800003996
	},{
		"count":22,
		"id":800003997
	}]*/
	let testRemoteData
	let remotePersonList
	let currenUserId
	let person_list=[{
		uid:'person_A',//用户ID
		starCount:11,//星星总数
		rank:3,//排名
		user_img:'image/user_img_2.jpg',//用户头像
		user_name:'jack',//用户名
		isMe:false//是否为本人
	},{
		uid:'person_B',
		starCount:44,
		rank:0,
		user_img:'image/user_img_1.jpg',
		user_name:'jack',
		isMe:true
	},{
		uid:'person_C',
		starCount:22,
		rank:2,
		user_img:'image/user_img_4.jpg',
		user_name:'jack',
		isMe:false
	},{
		uid:'person_D',
		starCount:33,
		rank:1,
		user_img:'image/user_img_3.jpg',
		user_name:'jack',
		isMe:false
	}];
	let ranks=['champion','second_place','third_place','fourth_place'];
	let rank_ary = ['rank_1','rank_2','rank_3','rank_4']
	let lens = 0;
	let currentWindowId = $(window.frameElement).attr('id');
    let cacheFrameId = "h5_course_cache_frame";
	let func = {
		TimeoutShow:(callback,timeout,i)=>{
			if( !callback || !timeout || !i ) return
			let _this = this

			setTimeout(()=>{
				i--;
				callback(i);
				if(i>-1){
					func.TimeoutShow(callback,timeout,i)	
				}
			},timeout)
			
		},
		build_dom:(callback)=>{//创建dom

			let data = person_list;
			let domEles = ''
			let star_count = ''

			if(!data.length)return

			for(var i=0;i<data.length;i++){
				star_count = ''
				for (var j = 0 ; j < data[i].starCount ; j++){
					star_count +=	`<li class='hide'></li>`
				}
				domEles+=`
					<li class="${ data[i].uid } ${ ranks[data[i].rank] } " is-me="${ data[i].isMe }">
			            <div class="rank  ${ rank_ary[data[i].rank] } animated bounce"></div>
			            <div class="score">
			                <div class="shadow"></div>
			                <div class="det">${data[i].starCount}</div>
			            </div>
			            <div class="user">
			                <img src="${ data[i].user_img}" alt="user_img">
			                <h4>${data[i].user_name}</h4>
			                <span class="isMe ${ data[i].isMe ? '' : 'hide'}" ></span>
			            </div>
			            <ul class="star clearfix">
			                ${ star_count }
			            </ul>
			        </li>
				`
			}
			$('.person_list').html(domEles)

			lens = $('.person_list>li').length

			if(callback)callback()
		},
		rightPerson:()=>{//判断是否在正确用户的iframe下
			
			var frame_user_id = $(window.frameElement).attr('user_id');
			
			var current_user_id = SDK.getClassConf().user.id;

			if(frame_user_id == current_user_id){
				return true
			}else{
				return false
			}
			
		},
		last_page:()=>{//判断是否在正确用户的iframe下
			var local_page = SDK.getClassConf().h5Course.localPage
//			var current_page = SDK.getClassConf().url.h5Course.countNum
			var current_page = 23

			return local_page == current_page ? true : false
		},
		init:()=>{//初始化动画
			func.build_dom(()=>{
				func.TimeoutShow((i)=>{//触发动画

					let els = $('.person_list>li.'+ranks[i])

					//用户按名次出场

					let one_lens = els.find('ul.star>li').length

					els.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',()=>{
						//星星出现
						/*if(func.rightPerson()) {
							$('#twinkle')[0].play();
						}*/
						if(func.rightPerson()) {
							$('#colorClound')[0].play();
						}

						for( var m = 0;m<one_lens;m++){

							let ele = els.find('ul.star>li').eq(m)

							let timeout = 100*m < 100? 100: 100*m

							setTimeout(function(){
								ele.removeClass('hide');
								ele.addClass('animated zoomIn');
								//星星增加音效

							},timeout)

						}
					});
					//当最后一颗星星加完之后，名词、奖杯开始分批次出现
					$('ul.star>li:last').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',()=>{
						setTimeout(()=>{
							//总分数出现
							els.find('div.score').css({opacity:1})

							/*if(els.data('is-me')=='true') {
								$('#score')[0].play();
							}*/

							els.find('div.score').addClass('animated zoomInDown' )
						},800-i*200)
					})
						

						
					els.find('div.score').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',()=>{
						
						//名次出现	
						els.find('div.rank').css({opacity:1})
						els.find('div.rank').addClass('animated zoomInDown');

						/*if(func.rightPerson()) {
							$('#'+ranks[i])[0].play();
						}*/
						//出现彩带
						/*setTimeout(()=>{
						
						},1000)*/
					})
				},200,lens) 	
			})		
		},
		updateUserConnect:()=>{//建立数据长连接
			try{
				remotePersonList = SDK.getClassConf().h5Course.starData.value.data
				currenUserId = SDK.getClassConf().user.id
				if(remotePersonList.length>0 && currenUserId){
					//console.log('c_page ----88-----------------%s', JSON.stringify(testRemoteData))
					func.formatData();
					func.init();
				}
			}catch(e){
				console.log(e)
			}
			
		},
		formatData:()=>{//格式化数据
			//extend本地数据
			
			testRemoteData = remotePersonList

			
			//计算排名
			testRemoteData.sort( function( a, b ){ //从大到小排序
				if( a.count > b.count ){
					return -1;
				}else if( a.count < b.count ){
					return 10;	
				}else{
					return 0;	
				}
			} )
			let format_rank = []// 2.利用多维数组进行排名
			
			let j=0;//多维数组索引，也是排名，排名从0开始

			for(let i=0;i<testRemoteData.length;i++){

				let obj=new Array(testRemoteData[i])

				if(i==0){//第一个值，直接变为多维数组

					format_rank.push(obj);

				}else if(testRemoteData[i].count==format_rank[j][0].count){//当计算值与多维数组值相同，则放入多维数组
					
					format_rank[j].push(obj);

				}else if(testRemoteData[i].count!=format_rank[j][0].count){//当计算值与多维数组值不同，则继续向后追加
					
					j++;
					format_rank.push(obj);

				}

				testRemoteData[i].rank=j;//赋值排名
			}

			//console.log(format_rank)  format_rank一维数组的索引值，即为排名 

			person_list.forEach((v,i)=>{

				v.starCount = testRemoteData[i].count;

				v.uid = testRemoteData[i].id;

				v.rank = testRemoteData[i].rank;

				v.user_img = func.getUserById(testRemoteData[i].id).userImg
				
				v.user_name = testRemoteData[i].name
			})
			person_list.forEach((v,i)=>{
				v.isMe = v.uid == currenUserId ? true : false;
			})
			person_list.sort(function(a,b){//1对12用用户ID去固定排序
				return a.uid-b.uid
			})
			//console.log('person_list',person_list)
			//计算排名
			
		},
		getUserById: function(id){
			let userDetail = SDK.getClassConf().appointMemberList;
			let user 
			userDetail.forEach((v,i)=>{
				if(v.uid==id){
					user = v;
				}
			})
			return user
		}
	}

	//轮询请求数据
	
	
	if(isSync){
		let right = func.last_page()
		if( right ){//最后一页，并且在正确的iframe下
	        func.updateUserConnect();
	    }
	}


})

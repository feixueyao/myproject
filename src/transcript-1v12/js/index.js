"use strict"

import '../../common/js/common.js'

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
	let testRemoteData;
	let remotePersonList;
	let currenUserId;
	let appointMemberList;
	let person_list=[{
		uid:'person_A',//用户ID
		starCount:20,//星星总数
		rank:1,//排名
		isMe:false,//是否为本人
		teamName:'TEAM C',
		color:'blue'
	},{
		uid:'person_B',
		starCount:22,
		rank:0,
		isMe:true,
		teamName:'TEAMATEAMATEAMA',
		color:'green'
	},{
		uid:'person_C',
		starCount:18,
		rank:2,
		isMe:false,
		teamName:'TEAM B',
		color:'red'
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
					<li class="${ data[i].uid } ${ data[i].color } ${ ranks[data[i].rank] }" is-me="${ data[i].isMe }">
			            <div class='rank_container'>
							<div class="rank  ${ rank_ary[data[i].rank] } "></div>
							<div class="shanshan ${ data[i].rank == 0 ? '' : 'hide'}"></div>
			            </div>
			            
			            <div class="score clearfix">
			            	<p>${ data[i].teamName }</p>
			                <div class="det">${data[i].starCount}</div>
			                <span style='opacity:0' class="isMe ${ data[i].isMe ? '' : 'hide'}" ></span>
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
			var current_page = SDK.getClassConf().url.h5Course.countNum
			return local_page == current_page ? true : false
		},
		init:()=>{//初始化动画
			func.build_dom(()=>{

				//如果三个组都没有数据，对组名和星星进行处理，避免样式问题
				let abcCount=[];//记录三个组星星数量的变量
				for(let item of person_list){
					abcCount.push(item.starCount)
				}

				if( abcCount[0] === 0 && abcCount[1] === 0 && abcCount[2] === 0 ){
					$(".score").hide();
				}else{
					$(".score").show();
				}

				//如果有数据，则触发动画
				func.TimeoutShow((i)=>{//触发动画
					let els = $('.person_list>li.'+ranks[i])

					//用户按名次出场

					let one_lens = els.find('ul.star>li').length

					if(func.rightPerson()) {//播放背景音乐
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
					
					//当最后一颗星星加完之后，名词、奖杯开始分批次出现
					$('ul.star>li:last').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',()=>{
						setTimeout(()=>{
							els.find('div.score').css({
								width:'5.52rem'
							})
							setTimeout(()=>{
								els.find('div.score').css({
									overflow:'initial'
								})
								els.find('span.isMe').css({
									opacity:1
								})

								//名次出现	
								els.find('div.rank').css({opacity:1})
								els.find('div.rank').addClass('animated zoomInDown');
							},800)
							

						},800-i*200)
					})
					els.find('div.rank').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',()=>{
						els.find('div.shanshan').css({opacity:1})
					})
				},200,lens) 	
			})		
		},
		updateUserConnect:()=>{//建立数据长连接
			try{
				remotePersonList = SDK.getClassConf().h5Course.starData.value.gdata;

				currenUserId = SDK.getClassConf().user.id;

				appointMemberList = SDK.getClassConf().appointMemberList;

				if(remotePersonList.length>0 && currenUserId){
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
			
			let j=0;//多维数组索引，也是排名，只不过从0开始，所需要的排名从1开始（只需要加1即为排名）

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
			let groupId = func.personInGroup(currenUserId,appointMemberList);//取到用户所在组的ID

			person_list.forEach((v,i)=>{

				v.starCount = testRemoteData[i].count;

				v.gid = testRemoteData[i].gid;

				v.rank = testRemoteData[i].rank;

				v.teamName = testRemoteData[i].gname.slice(0,15);

				v.isMe = testRemoteData[i].gid == groupId ? true : false
				
			});

			person_list.sort(function(a,b){//1对12用组ID去固定排序
				return a.gid-b.gid
			});
			//console.log('person_list',person_list)
			//计算排名
			
		},
		personInGroup:(userId,group)=>{
			if( !userId || !group )return
			for ( var i = 0 ; i < group.length ; i++ ){
				if( i!=0 && group[i].uid == userId ){//0为老师
					return group[i].gid  //gid为组的带号
				}
			}

		}
	}
	//轮询请求数据X
	//func.init()
	if(isSync){
		let right = func.last_page() 
		if( right ){//最后一页，并且在正确的iframe下
	        func.updateUserConnect();
	    }
	}


})

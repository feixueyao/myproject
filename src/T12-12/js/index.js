"use strict"
import '../../common/js/common.js'
import './sync.js'
$(function(){
	let staticData = configData.source;
	//console.log(staticData);
	const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
	var stuTem='';
	var teaTem='';
	(function (){
			stuTem='<div class="img-edge"><div class="img-show"><img class="image" src="'+staticData.themePic+'" alt=""></div><audio class="autoAudio" src="'+staticData.bkaudio+'"></audio><audio class="startAudio" controls src="'+staticData.audio+'"></div>';
			teaTem='<div class="stage"><div class="img-edge"><div class="img-show"><img class="image" src="'+staticData.themePic+'" alt=""></div></div></div><div class="audio"><audio class="autoAudio" src="'+staticData.bkaudio+'"></audio><audio class="startAudio" controls src="'+staticData.audio+'"></audio></div>'; 
		$('.stage').append(stuTem);
		$('.tea-stage').append(teaTem);
	})()
	// console.log(stuTem);
	// console.log(teaTem);
	//let imgs;
	let desc,title;
	let naturalWidth;
	let naturalHeight;
	let imgShowPosition;
	let imgObj;

	var frame_id = $(window.frameElement).attr('id');
	var frame_user_id = $(window.frameElement).attr('user_id');
	if(isSync){
		var current_user_id = SDK.getClassConf().user.id;
		if(frame_id != 'h5_course_cache_frame' && frame_user_id == current_user_id){
			//console.log("=======当前不是cache-frame========学生自己的frame");
			$(".autoAudio").attr("autoplay","autopaly");
		}
	}

	// let imgEgde;
	// desc=$(".desc").html();
	title=$(".title h3").html();	

	//判断图片大小并定位图片
	function getImage(index){
		// imgEgde=$(".img-edge");
		imgObj=$(".image");
		//console.log(imgObj);
		imgShowPosition=$(".img-show");
		imgShowPosition.find('img').on('load',function(e){
			naturalWidth=this.naturalWidth;
			naturalHeight=this.naturalHeight;
				//console.log(naturalWidth);
		if(staticData.themePic){
			imgShowPosition.find('img').css({width:"100%"});
				//图片大小在安全区以内
				if(1920>=naturalWidth&&760>=naturalHeight){
					imgShowPosition.css(setPosition());
					imgObj.css({"border-radius":"0.1rem"});
				}
				//图片大小超出1920
				else if(naturalWidth>=1920||naturalHeight>=1080){
					$(".img-edge").css({"position":"static"});
					imgShowPosition.css({
						"border":"none",
						"border-radius":"0rem",
						"box-shadow":"none",
						"width":1920/100+"rem",
						"height":1080/100+"rem",
						"position":"absolute",
						"left":"50%",
						"top":"50%",
						"margin-top":-naturalHeight/100/2+"rem",
						"margin-left":-naturalWidth/100/2+"rem"	,
						"background-color":"#fff"			
						// "z-index":1
					});	
					$(".desc").css({"position":"relative","z-index":3});
					$(".title").css({"position":"relative","z-index":3});
						imgObj.css({"border-radius":"0rem"});
				}
				//图片大小在全屏以内安全区以外
				else if(760<naturalHeight<1080){
					$(".img-edge").css({"position":"static"});
					
					imgShowPosition.css(setPosition());
					imgObj.css({"border-radius":"0.1rem"});
					$(".title").css({"position":"relative","z-index":3});
				}	
		}
	});
	
		
		//判断标题、问题是否为空
		if(title==''){
			$(".img-edge").css({"position":"static"});
				if(staticData.themePic){
					imgShowPosition.css(setPosition());
				}	
			
				imgObj.css({"border-radius":"0.18rem"});
				$(".title").css({"position":"relative","z-index":3});
			}	
		}
		//console.log(staticData.title);
		if(!configData.desc){
			$(".title").css({"margin-top":"0.8rem"});	
		}else{
			$(".title").css({"margin-top":"0"});	
				//console.log(staticData.title);
		}
		//判断声音是否为空
		if(staticData.audio==''){
			$("#audio").css({"display":"none"});
		}
	//图片定位

	getImage();
	//图片定位
	function setPosition(){
		return {
					"border":"0.14rem solid #fff",
					"border-radius":"0.25rem",
					"box-shadow":"0 0 0.3rem #616060",
					"width":naturalWidth/100+"rem",
					"height":naturalHeight/100+"rem",
					"position":"absolute",
					"left":"50%",
					"top":"50%",
					"margin-top":-naturalHeight/100/2+"rem",
					"margin-left":-naturalWidth/100/2+"rem"	,
					"box-sizing":" border-box",
					"background-color":"#fff"						
				};
	}
		//判断是否显示音频按钮
	// var $audioImg= document.getElementById("audio");
	// 	console.log($audioImg);
	// console.log(staticData.audio);
	// 	if(!staticData.audio){
	// 		$audioImg.style.display="none";
	// 	}
	 // var audioImg=$(".tea #audio");
	 // if(!staticData.audio){
	 // 	audioImg.css({"display":"none"});
	 // }
	//声音控件
	//let flag=true;
	
	let isStartBtn=true;
	$('.audio').on('click',function(e){
		if(isStartBtn){
			isStartBtn=false;
			if(!isSync){
	    		$(this).trigger("audioSync");
	    		return 
	    	}
	    	SDK.bindSyncEvt({
	    		sendUser: '',
                receiveUser: '',
				index:$(e.currentTarget).data('syncactions'),
				eventType: 'click',
				method: 'event',
				funcType:'audio',
				syncName: 'audioSync'
			});
    }
	});
	//老师端声音播放同步到学生端
	$('.audio').on("audioSync",function(e){
		var $audio=null;
		$audio = document.getElementsByClassName("startAudio")[0];
		//console.log($audio);
	    var $img = $(this).find("img");
		$audio?$audio.play():"";
		//flag = false;//播放声音的时候不能点击
		//console.log(1);
	    if($img.length!=0){
		    $img.attr("src", $(this).find("img").attr("src").replace(".png", ".gif"));
		  	//播放完毕img状态
		  	$audio.onended = function() {
			    $img.attr("src", $(this).find("img").attr("src").replace(".gif", ".png"));
			    //flag = true;//恢复点击
			}.bind(this);
	    }
	    SDK.setEventLock();
		isStartBtn=true;
	});
})


var configData = {
	defaultValue:{
		bgImage:'',
		bgColor:'',
		desc:''
	},
	bg:'',
	desc:'According to the questions and choose the right pictures',
	bgImage:'',
	bgColor:'',
	tg:[{
		title:"1234",
		content:"123132132131"
	},{
		title:"1234",
		content:"123132132131"
	}],
	source:{
		title:'description-Can you find some differences in the bedroom?',
		// questionImg:'',
		// word:"",
		// audio:'',
		questionImg:'',
		word:"cake",
		audio:"assets/audios/word-aBird.mp3",
		items:[
			{
				id:0,
				text:'',
				audio:'',
				isRight:false,
				img:'assets/images/answer-3.png'
			},
			{
				id:1,
				text:'',
				audio:'',
				isRight:true,
				img:'assets/images/answer-2.png'
			},
			{
				id:2,
				text:'',
				audio:'',
				isRight:false,
				img:'assets/images/answer-3.png'
			},
			{
				id:3,
				text:'',
				audio:'',
				isRight:false,
				img:'assets/images/answer-3.png'
			}
		]
	},
	person_list:[{
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
	}]
};
(function (pageNo) { configData.page = pageNo })(4)

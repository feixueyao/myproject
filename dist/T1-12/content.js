var configData = {
	defaultValue:{
		bgImage:'./image/defaultBg.jpg',
		bgColor:'',
		desc:''
	},
	bg:'./image/bg.png',
	desc:'According to the questions and choose the right pictures',
	bgImage:'',
	bgColor:'',
	tg:[{
		title:"123",
		content:"123132132131"
	},{
		title:"123",
		content:"123132132131"
	}],
	source:{
		title:'description-Can you find some differences in the bedroom?',
		// questionImg:'',
		// word:"",
		// audio:'',
		questionImg:'assets/images/answer-2.png',
		word:"wwwwwwwww",
		audio:"assets/audios/word-aBird.mp3",//
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
	}
};
(function (pageNo) { configData.page = pageNo })(2)

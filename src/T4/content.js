var configData = {
	bg:'',
	desc:'description-When do we have breakfast?',
	tg:[],
	source:{
		title:'When do we have breakfast?',
		article: 'These two cartoons show two contrasting scenes. While the male student spends all his time and money playing Internet games,\
the female student studies diligently. One could easily argue that a bright future awaits the students who study hard, \
while those who waste tuition playing games have little to look forward to. \
The above images encourage students to value their time in school and take advantage scenes.',
		audio: './assets/audios/01.mp3',
		options: [
			{
				pic: './assets/images/item_1.png',
				text: 'cake'
			},
			{
				pic: './assets/images/item_2.png',
				text: 'coco'
			},
			{
				pic: './assets/images/item_1.png',
				text: 'water'
			},
			{
				pic: './assets/images/item_2.png',
				text: 'apple'
			},
		]
	}
};
(function (pageNo) { configData.page = pageNo })(4)
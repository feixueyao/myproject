var domain = '';
 // domain = 'http://172.16.0.107:9011/pages/10001/';
var Data = {
    configData: {
    	defaultValue:{
    		bgImage:'',
    		bgColor:'',
    		desc:''
    	},
    	bg:'',
    	desc:'',
    	bgImage:'',
    	bgColor:'',
    	tg:[{
    		title:"",
    		content:""
    	}],
    	source:{
    		title:'',
            sentance:[]
    	}
    }
};

$.ajax({
	type:"get",
	url: domain + "content?_method=put",
	async:false,
	success: function(res){
		if(res.data!=""){
			Data.configData = JSON.parse(res.data);
		}
	},
	error: function(res){
		console.log(res)
	}
});

new Vue({
    el: '#container',
    data: Data,
    mounted: function() {
      var ths = this;
      console.log("mount之后");

      var toolbarOptions = [ 'underline'];
      var quill = new Quill('#QuillEditor', {
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: '输入的句子总长度，不能超过52个字母！',
        readOnly: false,
        theme: 'snow'
      });
      quill.setContents(ths.configData.source.sentance);
      quill.on('text-change', function(delta, oldDelta, source) {

        // if (source == 'api') {
        //   console.log("An API call triggered this change.");
        // } else if (source == 'user') {
        //   console.log("A user action triggered this change.");
        // }
        var content = $.extend({},quill.getContents());
        ths.configData.source.sentance =content.ops;
        console.log("====================",JSON.stringify(content.ops));
      });
      this.quill = quill;
    },
    methods: {

        imageUpload: function(e, item, attr) {

            var file = e.target.files[0],
                size = file.size,
                naturalWidth = -1,
                naturalHeight = -1,
                that = this;

            if ( (!isNaN(parseInt($(e.target).attr('volume'))) ) && (size / 1024).toFixed(2) > parseInt($(e.target).attr('volume'))) {
                console.error("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的图片大小为" + (size / 1024).toFixed(2) + "KB, 超过"+$(e.target).attr('volume')+"K上限，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            var img = new Image();
            img.onload = function() {
                naturalWidth = img.naturalWidth;
                naturalHeight = img.naturalHeight;
                var check = that.sourceImgCheck(e.target, {
                    height: naturalHeight,
                    width: naturalWidth
                },item,attr);
                if (check) {
                    that.postData(file, item, attr);
                    img = null;
                } else {
                    img = null;
                }
            }
            var reader = new FileReader();
            reader.onload = function(evt) {
                img.src = evt.target.result;
            }
            reader.readAsDataURL(file, "UTF-8"); //读取文件
        },
        sourceImgCheck: function(input, data,item,attr) {
            let dom = $(input),
                size = dom.attr("size").split(",");
            if (size == "") return true;
            let checkSize = size.some(function(item, idx) {
                let _size = item.split("*"),
                    width = _size[0],
                    height = _size[1];
                if (width == data.width && height == data.height) {
                    return true;
                }
                return false;
            });
            if (!checkSize) {
                console.error("应上传图片大小为：" + size.join("或") + ", 但上传图片尺寸为：" + data.width + "*" + data.height);
                item[attr] = "";
                alert("应上传图片大小为：" + size.join("或") + ", 但上传图片尺寸为：" + data.width + "*" + data.height);
            }
            return checkSize;
        },
        validate: function() {
            return true;
        },
        onSend: function() {
            var data = this.configData;
            var _data = JSON.stringify(data);
            console.log( _data);
            var val = this.validate();
            if (val === true) {
                $.ajax({
                    url: domain + 'content?_method=put',
                    type: 'POST',
                    data: {
                        content: _data
                    },
                    success: function(res) {
                        console.log(res);
                        //alert("提交成功");

                        window.parent.postMessage('close', '*');
                    },
                    error: function(err) {
                        console.log(err)
                    }
                });
            } else {
                console.error('提交失败');
                //alert("提交失败");
            }
        },
        postData: function(file, item, attr) {
            var FILE = 'file';
            bg = arguments.length > 2 ? arguments[2] : null;
            var oldImg = item[attr];
            var data = new FormData();
            data.append('file', file);
            if (oldImg != "") {
                data.append('key', oldImg);
            };
            $.ajax({
                url: domain + FILE,
                type: 'post',
                data: data,
                async: false,
                processData: false,
                contentType: false,
                success: function(res) {
                    console.log("===============res=================", res);
                    item[attr] = domain+res.data.key;
                },
                error: function(err) {
                    item[attr] = "";
                    console.log(err)
                }
            })
        },
        audioUpload: function(e, item, attr) {
            //校验规则
            //var _type = this.rules.audio.sources.type;

            //获取到的内容数据
            var file = e.target.files[0],
                type = file.type,
                size = file.size,
                name = file.name,
                path = e.target.value;
            // if (!_type.test(type)) {
            //     alert("您上传的文件类型错误，请检查后再上传！");
            //     return;
            // }
            if ((size / 1024).toFixed(2) > 500) {
                console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            } else {
                console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            }
            if ( (!isNaN(parseInt($(e.target).attr('volume'))) ) && (size / 1024).toFixed(2) > parseInt($(e.target).attr('volume'))) {
                console.error("您上传的音频大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的音频大小为" + (size / 1024).toFixed(2) + "KB, 超过"+$(e.target).attr('volume')+"K上限，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            this.postData(file, item, attr);
        },
        addItem: function(e,items) {
            items.push({
              id:Date.now(),
              text:'',
              audio:'',
              img:''
            });
        },
        delQue: function(item, array) {
            array.remove(item);
        },
    		addTg:function(item){
             this.configData.tg.push({title:'',content:''});
      	},
      	deleTg:function(item){
  	        this.configData.tg.remove(item);
      	},
        play: function(e){
            e.target.children[0].play();
        },
        radioClick:function(e,item,items){
          items.forEach(function(elm,i,arr){
            if(elm.id == item.id){
              elm.isRight = true;
            }else{
              elm.isRight = false;
            }
          })
        }

    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

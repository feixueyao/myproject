// var domain = 'http://172.16.0.107:9011/pages/3/content?_method=put';
var domain = '';
var Data = {
    configData: {
        bg: "",
        desc: "",
        tg: [{
            title: "",
            content: "",
        }],
        source: {
            title:'',
            themePic:'',
            audio:'',
            options:['',''],
            right:'^_^'
        }

    }
}
$.ajax({
    type:"get",
    url: domain + "content?_method=put",
    async:false,
    success: function(res){
        if(res.data!=""){
            console.log(res)
            Data.configData = JSON.parse(res.data);

        }
    },
    error: function(res){
        console.log(res)
    }
})

new Vue({
    el: '#container',
    data: Data,
    methods: {

        imageUpload: function(e, item, attr,fileSize) {
            var file = e.target.files[0],
                size = file.size,
                naturalWidth = -1,
                naturalHeight = -1,
                that = this;

            if ((size / 1024).toFixed(2) > fileSize) {
                alert("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB, 超过"+fileSize+"KB上限，请检查后上传！");
                return;
            }

            var img = new Image();
            img.onload = function() {
                naturalWidth = img.naturalWidth;
                naturalHeight = img.naturalHeight;
                var check = that.sourceImgCheck(e.target, {
                    height: naturalHeight,
                    width: naturalWidth
                });
                if (check) {
                    item[attr] = "./form/img/loading.jpg";
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
            reader.readAsDataURL(file, "UTF-8");
        },
        sourceImgCheck: function(input, data) {
            console.log(input)
            let dom = $(input),
                size = dom.attr("size").split(",");
            console.log(size)
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
                alert("应上传图片大小为：" + size.join("或") + ", 上传图片尺寸为：" + data.width + "*" + data.height);
                // item[attr] = "";
                // alert("图片尺寸不符合要求！");
            }
            return checkSize;
        },
        validate: function() {
            var check = true
            let options = Data.configData.source.options
            // let right = Data.configData.source.right
            let right = $('input[type=radio]:checked').val()
            options.forEach(function(item){
                if(item.length === 0){
                    check = false
                }
            })
            if ( !right || right==='^_^') {
                check = false
            }
            return check
        },
        onSend: function() {
            var data = this.configData;
            let themePic = data.source.themePic
            let audio = data.source.audio
            if(!(themePic || audio)){
                alert('“编辑问题”区域至少上传一个元素')
                return
            }
            var _data = JSON.stringify(data);
            console.log(_data);
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
                        window.parent.postMessage('close', '*');
                    },
                    error: function(err) {
                        console.log(err)
                    }
                });
            } else {
                alert("带“*”为必填项");
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
                    console.log(res.data.key);
                    item[attr] = domain + res.data.key;
                },
                error: function(err) {
                    console.log(err)
                }
            })
        },
        audioUpload: function(e, item, attr) {
            var file = e.target.files[0],
                type = file.type,
                size = file.size,
                name = file.name,
                path = e.target.value;
            if ((size / 1024).toFixed(2) > 500) {
                console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            } else {
                console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            }
            if ((size / 1024).toFixed(2) > 100) {
                console.error("您上传的音频存储大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB, 超过100KB上限，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            this.postData(file, item, attr);
        },
        addScreen: function(items, obj) {
        },
        delQue: function(item, array) {
            array.remove(item);
        },
        addTg: function(item) {
            this.configData.tg.push({
                title: '',
                content: ''
            });
        },
        deleTg: function(item) {
            this.configData.tg.remove(item);
        },
        play: function(e) {
            e.target.children[0].play();
        },
        addOption: function() {
            this.configData.source.options.push('')
        },
        delOption: function(item) {
            if(this.configData.source.right === item){
                this.configData.source.right = '^_^'
            }
            this.configData.source.options.remove(item)
        },
        setAnswer: function(item) {
            this.configData.source.right = item;
        }
    }
})
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
}
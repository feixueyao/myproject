"use strict";
import '../../common/js/common.js';
import './sync.js';

$(()=>{
  const isSync =parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;

  //console.info("当前显示环境处在"+(isSync?"":" 非")+"同步状态！！！");

  if(configData.defaultValue.bgImage){
    $(".container").css({
      'backgroundImage':'url(' + configData.defaultValue.bgImage + ')'
    });
  }
  if(configData.bg){
    $(".container").css({
      'backgroundImage':'url(' + configData.bg + ')'
    });
  }
  if(configData.defaultValue.bgColor){
    $(".container").css({
      'backgroundColor':configData.defaultValue.bgColor
    });
  }
  if(configData.bgColor){
    $(".container").css({
      'backgroundColor':configData.bgColor
    });
  }
  let isTitle = $('.title').is(':hidden');
	if(isTitle){
		$('.content-wrap').css('height','calc(100% - .76rem)');
	}

  //==================================================================================================//
  let wrapper = $('.content-wrap');
  let source =configData.source;

  let initSentance = source.sentance;//是一个文本描述数组
  //eg： [{"insert":"Th"},{"attributes":{"underline":true},"insert":"i"},{"insert":"s is \n"}]
  var codeLetterSheetTpl =`
      <li class="letter-code" data-syncactions="letter-code-{{i}}" data-code="{{prefix-code}}" data-letter="{{letter}}">
        <div class="letter-code-layout"><span class="letter">{{letter}}</span><span class="code">{{prefix-code}}</span></div>
      </li>
  `;
  var sheetWrap = `<div class="sheet-wrap"><ul class="letter-code-sheet">{{letters}}</ul></div>`;
  var editorWrap = `<div class="editor-wrap"><ul class="letter-code-editor">{{letters}}</ul><div class="mask-editor hide"><p class="sentance">{{sentance}}</p></div></div>`;
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var sheetHtml ="",editorHtml;
  letters.split("").forEach(function(letter,idx){
    // idx+;
    sheetHtml+=codeLetterSheetTpl.replace(/{{prefix-code}}/g,idx+1 < 10 ? '0'+(idx+1):idx+1).replace(/{{letter}}/g,letter).replace(/{{i}}/g,idx);
  });
  var sheetDom = $(sheetWrap.replace(/{{letters}}/g,sheetHtml)).appendTo(wrapper);


//eg： [{"insert":"Th"},{"attributes":{"underline":true},"insert":"i"},{"insert":"s is \n"}]
  var fragmentLetters = function(fragment,defaultValue){
    let codeLetterEditorTpl=`
      <li class="letter-code {{default}}" data-code="{{code}}" data-letter="{{letter}}" data-source="{{source}}">
        <div class="letter-code-layout"><span class="letter">{{code}}</span><span class="code">{{source}}</span></div>
      </li>
    `;
    let str ="";
    var fragmentArray = fragment.split("");

    //console.log("=========letter array============",fragmentArray);
    while(fragmentArray.length){
      let letter = fragmentArray.shift(),letterReg = /[A-Za-z]/g;
      //console.log("==========current letter===========",letter);
      if(letterReg.test(letter)){//这个字符是字母便处理。
        let code = letters.indexOf(letter.toLowerCase()), //获取字母的编码
        sourceLetter = letter;//存储当前字母
        //确定下一个字符是否非字母
        if(fragmentArray.length && fragmentArray[0] !==' ' && (letterReg.test(fragmentArray[0]))){//如果数组中还存在内容且非空非字母
          //console.log('============已经判定下一个是标点字符===================',fragmentArray[0]);
          sourceLetter+=fragmentArray.shift();
        }else{
          //console.log('============已经判定下一个不是标点字符===================',fragmentArray[0]);
        }

        str += codeLetterEditorTpl.replace(/{{letter}}/g,letter).replace(/{{source}}/g,sourceLetter).replace(/{{code}}/g,code+1 < 10 ? '0'+(code+1):code+1 ).replace(/{{default}}/g,defaultValue);
      }
    }
    return str;
  }

  var sentance ="";
  initSentance.forEach(function(item,i){
      let fragment = item.insert;
      fragment = fragment.replace('\n',' ');
      //console.log(fragment);
      if(item.hasOwnProperty('attributes')&&item.attributes.hasOwnProperty('underline')){//这是挖空的
        editorHtml+=fragmentLetters(fragment,'');
      }else{//这是不挖空的
        editorHtml+=fragmentLetters(fragment,'default');
      }
      // console.log(fragment);
      sentance += fragment;//拼接句子
      // console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||",editorHtml);
  });

// console.log(editorHtml);
  var editorDom =$(editorWrap.replace(/{{letters}}/g,editorHtml).replace(/{{sentance}}/g,sentance)).appendTo(wrapper);
  if(editorDom.find(".letter-code").length>26){
   // console.log(editorDom)
    editorDom.find('.letter-code-editor').css("display","inherit")
  }
  editorDom.attr("data-sentance",sentance);


  var curLetterEdtor = editorDom.find(".letter-code").not(".done").not(".default").eq(0);
  curLetterEdtor.addClass("process");

  var letterCodeClickTimer = true;
  sheetDom.on("click", ".letter-code", function(e) {
   // console.log(1);
    if (letterCodeClickTimer) {
      letterCodeClickTimer = false;

      if (!isSync) {
        $(this).trigger('syncLetterCodeClick');
        return;
      }

      SDK.bindSyncEvt({
        index: $(e.currentTarget).data('syncactions'),
        method: 'event',
        syncName: 'syncLetterCodeClick'
      });
    }
  });

  sheetDom.on("syncLetterCodeClick", ".letter-code", function() {
   // console.log('c-page======================>同步点击啦！！！！！！！！！！！！！！！！！')
    var ths = $(this),
        letter = ths.data('letter');
        if( letter == curLetterEdtor.data("letter").toLowerCase() ){
          curLetterEdtor.removeClass('process').addClass("done");
          curLetterEdtor = editorDom.find(".letter-code").not(".done").not(".default").eq(0);
          if(curLetterEdtor.length){
            curLetterEdtor.addClass("process");
            SDK.setEventLock();
            letterCodeClickTimer = true;
          }else{
            editorDom.find(".mask-editor").removeClass("hide");
            SDK.setEventLock();
            letterCodeClickTimer = false;
          }
        }else{
          ths.addClass("shake");
          setTimeout(function(){
            ths.removeClass("shake");
          },500);
          SDK.setEventLock();
          letterCodeClickTimer = true;
        }
  });

});

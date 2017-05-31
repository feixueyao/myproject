!function(e){function t(e){var t=document.getElementsByTagName("head")[0],n=document.createElement("script");n.type="text/javascript",n.charset="utf-8",n.src=f.p+""+e+"."+w+".hot-update.js",t.appendChild(n)}function n(e){if("undefined"==typeof XMLHttpRequest)return e(new Error("No browser support"));try{var t=new XMLHttpRequest,n=f.p+""+w+".hot-update.json";t.open("GET",n,!0),t.timeout=1e4,t.send(null)}catch(t){return e(t)}t.onreadystatechange=function(){if(4===t.readyState)if(0===t.status)e(new Error("Manifest request to "+n+" timed out."));else if(404===t.status)e();else if(200!==t.status&&304!==t.status)e(new Error("Manifest request to "+n+" failed."));else{try{var r=JSON.parse(t.responseText)}catch(t){return void e(t)}e(null,r)}}}function r(e){function t(e,t){"ready"===_&&i("prepare"),D++,f.e(e,function(){function n(){D--,"prepare"===_&&(k[e]||l(e),0===D&&0===x&&d())}try{t.call(null,r)}finally{n()}})}var n=A[e];if(!n)return f;var r=function(t){return n.hot.active?A[t]?(A[t].parents.indexOf(e)<0&&A[t].parents.push(e),n.children.indexOf(t)<0&&n.children.push(t)):b=[e]:(console.warn("[HMR] unexpected require("+t+") from disposed module "+e),b=[]),f(t)};for(var s in f)Object.prototype.hasOwnProperty.call(f,s)&&(h?Object.defineProperty(r,s,function(e){return{configurable:!0,enumerable:!0,get:function(){return f[e]},set:function(t){f[e]=t}}}(s)):r[s]=f[s]);return h?Object.defineProperty(r,"e",{enumerable:!0,value:t}):r.e=t,r}function s(e){var t={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],active:!0,accept:function(e,n){if("undefined"==typeof e)t._selfAccepted=!0;else if("function"==typeof e)t._selfAccepted=e;else if("object"==typeof e)for(var r=0;r<e.length;r++)t._acceptedDependencies[e[r]]=n;else t._acceptedDependencies[e]=n},decline:function(e){if("undefined"==typeof e)t._selfDeclined=!0;else if("number"==typeof e)t._declinedDependencies[e]=!0;else for(var n=0;n<e.length;n++)t._declinedDependencies[e[n]]=!0},dispose:function(e){t._disposeHandlers.push(e)},addDisposeHandler:function(e){t._disposeHandlers.push(e)},removeDisposeHandler:function(e){var n=t._disposeHandlers.indexOf(e);n>=0&&t._disposeHandlers.splice(n,1)},check:o,apply:u,status:function(e){return e?void S.push(e):_},addStatusHandler:function(e){S.push(e)},removeStatusHandler:function(e){var t=S.indexOf(e);t>=0&&S.splice(t,1)},data:$[e]};return t}function i(e){_=e;for(var t=0;t<S.length;t++)S[t].call(null,e)}function a(e){var t=+e+""===e;return t?+e:e}function o(e,t){if("idle"!==_)throw new Error("check() is only allowed in idle status");"function"==typeof e?(m=!1,t=e):(m=e,t=t||function(e){if(e)throw e}),i("check"),n(function(e,n){if(e)return t(e);if(!n)return i("idle"),void t(null,null);E={},O={},k={};for(var r=0;r<n.c.length;r++)O[n.c[r]]=!0;y=n.h,i("prepare"),v=t,g={};var s=0;l(s),"prepare"===_&&0===D&&0===x&&d()})}function c(e,t){if(O[e]&&E[e]){E[e]=!1;for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(g[n]=t[n]);0===--x&&0===D&&d()}}function l(e){O[e]?(E[e]=!0,x++,t(e)):k[e]=!0}function d(){i("ready");var e=v;if(v=null,e)if(m)u(m,e);else{var t=[];for(var n in g)Object.prototype.hasOwnProperty.call(g,n)&&t.push(a(n));e(null,t)}}function u(t,n){function r(e){for(var t=[e],n={},r=t.slice();r.length>0;){var i=r.pop(),e=A[i];if(e&&!e.hot._selfAccepted){if(e.hot._selfDeclined)return new Error("Aborted because of self decline: "+i);if(0===i)return;for(var a=0;a<e.parents.length;a++){var o=e.parents[a],c=A[o];if(c.hot._declinedDependencies[i])return new Error("Aborted because of declined dependency: "+i+" in "+o);t.indexOf(o)>=0||(c.hot._acceptedDependencies[i]?(n[o]||(n[o]=[]),s(n[o],[i])):(delete n[o],t.push(o),r.push(o)))}}}return[t,n]}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];e.indexOf(r)<0&&e.push(r)}}if("ready"!==_)throw new Error("apply() is only allowed in ready status");"function"==typeof t?(n=t,t={}):t&&"object"==typeof t?n=n||function(e){if(e)throw e}:(t={},n=n||function(e){if(e)throw e});var o={},c=[],l={};for(var d in g)if(Object.prototype.hasOwnProperty.call(g,d)){var u=a(d),p=r(u);if(!p){if(t.ignoreUnaccepted)continue;return i("abort"),n(new Error("Aborted because "+u+" is not accepted"))}if(p instanceof Error)return i("abort"),n(p);l[u]=g[u],s(c,p[0]);for(var u in p[1])Object.prototype.hasOwnProperty.call(p[1],u)&&(o[u]||(o[u]=[]),s(o[u],p[1][u]))}for(var h=[],v=0;v<c.length;v++){var u=c[v];A[u]&&A[u].hot._selfAccepted&&h.push({module:u,errorHandler:A[u].hot._selfAccepted})}i("dispose");for(var m=c.slice();m.length>0;){var u=m.pop(),S=A[u];if(S){for(var x={},D=S.hot._disposeHandlers,k=0;k<D.length;k++){var E=D[k];E(x)}$[u]=x,S.hot.active=!1,delete A[u];for(var k=0;k<S.children.length;k++){var O=A[S.children[k]];if(O){var C=O.parents.indexOf(u);C>=0&&O.parents.splice(C,1)}}}}for(var u in o)if(Object.prototype.hasOwnProperty.call(o,u))for(var S=A[u],U=o[u],k=0;k<U.length;k++){var T=U[k],C=S.children.indexOf(T);C>=0&&S.children.splice(C,1)}i("apply"),w=y;for(var u in l)Object.prototype.hasOwnProperty.call(l,u)&&(e[u]=l[u]);var H=null;for(var u in o)if(Object.prototype.hasOwnProperty.call(o,u)){for(var S=A[u],U=o[u],P=[],v=0;v<U.length;v++){var T=U[v],E=S.hot._acceptedDependencies[T];P.indexOf(E)>=0||P.push(E)}for(var v=0;v<P.length;v++){var E=P[v];try{E(o)}catch(e){H||(H=e)}}}for(var v=0;v<h.length;v++){var j=h[v],u=j.module;b=[u];try{f(u)}catch(e){if("function"==typeof j.errorHandler)try{j.errorHandler(e)}catch(e){H||(H=e)}else H||(H=e)}}return H?(i("fail"),n(H)):(i("idle"),void n(null,c))}function f(t){if(A[t])return A[t].exports;var n=A[t]={exports:{},id:t,loaded:!1,hot:s(t),parents:b,children:[]};return e[t].call(n.exports,n,n.exports,r(t)),n.loaded=!0,n.exports}var p=this.webpackHotUpdate;this.webpackHotUpdate=function(e,t){c(e,t),p&&p(e,t)};var h=!1;try{Object.defineProperty({},"x",{get:function(){}}),h=!0}catch(e){}var v,g,y,m=!0,w="447f60e0c0a06a609c8f",$={},b=[],S=[],_="idle",x=0,D=0,k={},E={},O={},A={};return f.m=e,f.c=A,f.p="/dist/",f.h=function(){return w},r(0)(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";n(2),n(4);var r=parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync;$(function(){function e(e){var t=null;t=$(e).find("audio").get(0);var n=$(e).find("img");t?t.play():"",0!=n.length&&(n.attr("src",$(".con-audio img").attr("src").replace(".png",".gif")),t.onended=function(){n.attr("src",$(".con-audio img").attr("src").replace(".gif",".png"))})}var t=configData.source,n=t.txt,s=t.img,i=t.audio,a=t.key;!function(){var e="",t='<div class="con-img"><img src='+s+' alt=""></div>',r='<div class="con-audio" data-syncactions="audio-1"><audio src='+i+'></audio><img src="image/volumeBtn_02.png" alt=""></div>',o='<div class="con-text">'+n+"</div>";s&&(e+=t),i&&(e+=r),n&&(e+=o),$(".dis-area").append(e),$(".ans-sele").data("key",a);var c=$(".desc").text();""!=c&&$(".desc").removeClass("desc-visi")}();var o=$(".title").is(":hidden");o&&$(".dis-area").css("height","7.84rem");var c=!0;$(".container").on("click touchstart",".ans-sele",function(e){if(e.stopPropagation(),c){if(c=!1,!r)return void $(this).trigger("syncItemClick");SDK.bindSyncEvt({sendUser:"",receiveUser:"",index:$(e.currentTarget).data("syncactions"),eventType:"click",method:"event",syncName:"syncItemClick"})}}),$(".ans-sele").on("syncItemClick",function(e,t){var n=$(this).data("key"),s=$(this).find("p").text();s===n?($(this).find("p").addClass("sele-p"),$(this).find(".icon").show(),r&&SDK.bindSyncResultEvt({sendUser:t.data[0].value.sendUser,receiveUser:t.data[0].value.receiveUser,sendUserInfo:t.data[0].value.sendUserInfo,index:$("#container").data("syncresult"),resultData:{nowAns:s},syncName:"syncResultClick"}),SDK.setEventLock(),c=!1):($(this).addClass("shake"),$(this).on("animationend",function(){$(this).removeClass("shake"),$(this).off("animationend"),SDK.setEventLock(),c=!0}),r&&SDK.bindSyncResultEvt({sendUser:t.data[0].value.sendUser,receiveUser:t.data[0].value.receiveUser,sendUserInfo:t.data[0].value.sendUserInfo,index:$("#container").data("syncresult"),resultData:{nowAns:s},syncName:"syncResultClick"}),SDK.setEventLock(),c=!0)});var l=a.toLowerCase();"false"==l?$(".ans-sele-t[name='true']").addClass("error"):$(".ans-sele-t[name='false']").addClass("error");var d={};$(".container").on("syncResultClick",function(e,t){var n=t.data[0].value.sendUserInfo,r=t.data[0].value.syncAction.resultData;$(".ans-sele-t").find("p").addClass("sele-p"),"stu"==n.type?d[n.id]={name:n.name,nowAns:r.nowAns.toLowerCase()}:console("=========条件匹配不成立=====");var s="",i="";for(var a in d)"true"==d[a].nowAns?s+='<div class="s-name">'+d[a].name+"</div>":"false"==d[a].nowAns?i+='<div class="s-name">'+d[a].name+"</div>":console.log("stusObj error!============="+d),$(".t-r").text(""),$(".t-e").text(""),$(".t-r").append(s),$(".t-e").append(i);SDK.setEventLock(),c=!0});var u=!0;$(".con-audio").on("click touchstart",function(e){if(e.stopPropagation(),u){if(u=!1,!r)return void $(this).trigger("syncSoundClick");if("tea"!=window.frameElement.getAttribute("user_type"))return void $(this).trigger("syncSoundClick");SDK.bindSyncEvt({index:$(e.currentTarget).data("syncactions"),eventType:"click",method:"event",syncName:"syncSoundClick",funcType:"audio"})}}),$(".con-audio").on("syncSoundClick",function(t,n){e(".con-audio"),SDK.setEventLock(),u=!0})})},function(e,t,n){"use strict";n(3)},function(e,t){"use strict";$(function(){var e={bg:configData.bg,desc:configData.desc,title:configData.source.title,tgs:configData.tg,tgMoved:!1,sync:parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync,getQueryString:function(e){var t=this.parseURL("http://www.example.com");return top.frames[0]&&top.frames[0].frameElement&&(t=this.parseURL(top.frames[0].frameElement.src)),t.params[e]},parseURL:function(e){var t=document.createElement("a");return t.href=e,{source:e,protocol:t.protocol.replace(":",""),host:t.hostname,port:t.port,query:t.search,params:function(){for(var e,n={},r=t.search.replace(/^\?/,"").split("&"),s=r.length,i=0;i<s;i++)r[i]&&(e=r[i].split("="),n[e[0]]=e[1]);return n}(),file:(t.pathname.match(/\/([^\/?#]+)$/i)||[,""])[1],hash:t.hash.replace("#",""),path:t.pathname.replace(/^([^\/])/,"/$1"),relative:(t.href.match(/tps?:\/\/[^\/]+(.+)/)||[,""])[1],segments:t.pathname.replace(/^\//,"").split("/")}},userType:function e(){var e="";return e=this.sync?window.frameElement.getAttribute("user_type"):"1"===this.getQueryString("role")?"tea":"stu"},setBg:function(){this.bg&&$(".container").css("background-image","url("+this.bg+")")},setDesc:function(){this.desc&&$(".desc").text(this.desc).show()},setTitle:function(){var e=this.title.length;e>0&&(e<=28?$(".title h3").css("font-size","0.72rem"):e<=42?$(".title h3").css("font-size","0.48rem"):$(".title h3").css("font-size","0.36rem"),$(".title h3").text(this.title),$(".title").show())},createTg:function(){var e="",t="";this.tgs.forEach(function(t,n){e+='\n        \t\t<li>\n\t\t\t\t    <div class="tg-list-tit clearfix">\n\t\t\t\t    <span class="fl tg-list-num">'+(n+1)+'</span>\n\t\t\t\t    <h3 class="fl">'+t.title+'</h3>\n\t\t\t\t    </div>\n\t\t\t\t    <p class="tg-list-des">'+t.content+"</p>\n\t\t\t    </li>\n        \t\t"}),t='<img src="image/tg.png" alt="" class="tg" style="display: none">\n            <div class="tg-content">\n                <ul>'+e+"</ul>\n            </div>\n            ",$(t).appendTo("#tg")},showTg:function(){this.tgs&&this.tgs.length>0&&(this.tgs[0].title.length>0||this.tgs[0].content.length>0)&&(this.createTg(),$(".tg").show())},showStu:function(){$(".tea").remove(),$(".stu").removeClass("hide")},showTea:function(){$(".stu").remove(),$(".tea").removeClass("hide"),this.showTg()},showMainPage:function(){var e=this.userType();switch(e){case"stu":this.showStu();break;default:this.showTea()}},bindEvents:function(){$("#tg").on("click",".tg",function(){this.tgMoved?(this.tgMoved=!1,$(".tg-content,.tg").removeClass("active")):(this.tgMoved=!0,$(".tg-content,.tg").addClass("active"))})},init:function(){this.setBg(),this.setDesc(),this.setTitle(),this.showMainPage(),this.bindEvents()}};e.init()})},function(e,t){"use strict";window.onload=function(){window.location.hostname;if(parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync){var e=$(window.frameElement).attr("id"),t="h5_course_self_frame";"h5_course_cache_frame"!=e&&$(window.frameElement).attr("load_status","1"),e==t&&(parent.window.h5SyncActions.isPracticePage(!0),parent.window.h5SyncActions.isResultPage(!1))}}}]);
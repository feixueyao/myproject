!function(e){function t(e){var t=document.getElementsByTagName("head")[0],n=document.createElement("script");n.type="text/javascript",n.charset="utf-8",n.src=f.p+""+e+"."+w+".hot-update.js",t.appendChild(n)}function n(e){if("undefined"==typeof XMLHttpRequest)return e(new Error("No browser support"));try{var t=new XMLHttpRequest,n=f.p+""+w+".hot-update.json";t.open("GET",n,!0),t.timeout=1e4,t.send(null)}catch(t){return e(t)}t.onreadystatechange=function(){if(4===t.readyState)if(0===t.status)e(new Error("Manifest request to "+n+" timed out."));else if(404===t.status)e();else if(200!==t.status&&304!==t.status)e(new Error("Manifest request to "+n+" failed."));else{try{var a=JSON.parse(t.responseText)}catch(t){return void e(t)}e(null,a)}}}function a(e){function t(e,t){"ready"===_&&s("prepare"),O++,f.e(e,function(){function n(){O--,"prepare"===_&&(D[e]||l(e),0===O&&0===k&&d())}try{t.call(null,a)}finally{n()}})}var n=C[e];if(!n)return f;var a=function(t){return n.hot.active?C[t]?(C[t].parents.indexOf(e)<0&&C[t].parents.push(e),n.children.indexOf(t)<0&&n.children.push(t)):b=[e]:(console.warn("[HMR] unexpected require("+t+") from disposed module "+e),b=[]),f(t)};for(var r in f)Object.prototype.hasOwnProperty.call(f,r)&&(h?Object.defineProperty(a,r,function(e){return{configurable:!0,enumerable:!0,get:function(){return f[e]},set:function(t){f[e]=t}}}(r)):a[r]=f[r]);return h?Object.defineProperty(a,"e",{enumerable:!0,value:t}):a.e=t,a}function r(e){var t={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],active:!0,accept:function(e,n){if("undefined"==typeof e)t._selfAccepted=!0;else if("function"==typeof e)t._selfAccepted=e;else if("object"==typeof e)for(var a=0;a<e.length;a++)t._acceptedDependencies[e[a]]=n;else t._acceptedDependencies[e]=n},decline:function(e){if("undefined"==typeof e)t._selfDeclined=!0;else if("number"==typeof e)t._declinedDependencies[e]=!0;else for(var n=0;n<e.length;n++)t._declinedDependencies[e[n]]=!0},dispose:function(e){t._disposeHandlers.push(e)},addDisposeHandler:function(e){t._disposeHandlers.push(e)},removeDisposeHandler:function(e){var n=t._disposeHandlers.indexOf(e);n>=0&&t._disposeHandlers.splice(n,1)},check:o,apply:u,status:function(e){return e?void S.push(e):_},addStatusHandler:function(e){S.push(e)},removeStatusHandler:function(e){var t=S.indexOf(e);t>=0&&S.splice(t,1)},data:$[e]};return t}function s(e){_=e;for(var t=0;t<S.length;t++)S[t].call(null,e)}function i(e){var t=+e+""===e;return t?+e:e}function o(e,t){if("idle"!==_)throw new Error("check() is only allowed in idle status");"function"==typeof e?(m=!1,t=e):(m=e,t=t||function(e){if(e)throw e}),s("check"),n(function(e,n){if(e)return t(e);if(!n)return s("idle"),void t(null,null);E={},x={},D={};for(var a=0;a<n.c.length;a++)x[n.c[a]]=!0;y=n.h,s("prepare"),v=t,g={};var r=0;l(r),"prepare"===_&&0===O&&0===k&&d()})}function c(e,t){if(x[e]&&E[e]){E[e]=!1;for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(g[n]=t[n]);0===--k&&0===O&&d()}}function l(e){x[e]?(E[e]=!0,k++,t(e)):D[e]=!0}function d(){s("ready");var e=v;if(v=null,e)if(m)u(m,e);else{var t=[];for(var n in g)Object.prototype.hasOwnProperty.call(g,n)&&t.push(i(n));e(null,t)}}function u(t,n){function a(e){for(var t=[e],n={},a=t.slice();a.length>0;){var s=a.pop(),e=C[s];if(e&&!e.hot._selfAccepted){if(e.hot._selfDeclined)return new Error("Aborted because of self decline: "+s);if(0===s)return;for(var i=0;i<e.parents.length;i++){var o=e.parents[i],c=C[o];if(c.hot._declinedDependencies[s])return new Error("Aborted because of declined dependency: "+s+" in "+o);t.indexOf(o)>=0||(c.hot._acceptedDependencies[s]?(n[o]||(n[o]=[]),r(n[o],[s])):(delete n[o],t.push(o),a.push(o)))}}}return[t,n]}function r(e,t){for(var n=0;n<t.length;n++){var a=t[n];e.indexOf(a)<0&&e.push(a)}}if("ready"!==_)throw new Error("apply() is only allowed in ready status");"function"==typeof t?(n=t,t={}):t&&"object"==typeof t?n=n||function(e){if(e)throw e}:(t={},n=n||function(e){if(e)throw e});var o={},c=[],l={};for(var d in g)if(Object.prototype.hasOwnProperty.call(g,d)){var u=i(d),p=a(u);if(!p){if(t.ignoreUnaccepted)continue;return s("abort"),n(new Error("Aborted because "+u+" is not accepted"))}if(p instanceof Error)return s("abort"),n(p);l[u]=g[u],r(c,p[0]);for(var u in p[1])Object.prototype.hasOwnProperty.call(p[1],u)&&(o[u]||(o[u]=[]),r(o[u],p[1][u]))}for(var h=[],v=0;v<c.length;v++){var u=c[v];C[u]&&C[u].hot._selfAccepted&&h.push({module:u,errorHandler:C[u].hot._selfAccepted})}s("dispose");for(var m=c.slice();m.length>0;){var u=m.pop(),S=C[u];if(S){for(var k={},O=S.hot._disposeHandlers,D=0;D<O.length;D++){var E=O[D];E(k)}$[u]=k,S.hot.active=!1,delete C[u];for(var D=0;D<S.children.length;D++){var x=C[S.children[D]];if(x){var T=x.parents.indexOf(u);T>=0&&x.parents.splice(T,1)}}}}for(var u in o)if(Object.prototype.hasOwnProperty.call(o,u))for(var S=C[u],A=o[u],D=0;D<A.length;D++){var P=A[D],T=S.children.indexOf(P);T>=0&&S.children.splice(T,1)}s("apply"),w=y;for(var u in l)Object.prototype.hasOwnProperty.call(l,u)&&(e[u]=l[u]);var j=null;for(var u in o)if(Object.prototype.hasOwnProperty.call(o,u)){for(var S=C[u],A=o[u],H=[],v=0;v<A.length;v++){var P=A[v],E=S.hot._acceptedDependencies[P];H.indexOf(E)>=0||H.push(E)}for(var v=0;v<H.length;v++){var E=H[v];try{E(o)}catch(e){j||(j=e)}}}for(var v=0;v<h.length;v++){var U=h[v],u=U.module;b=[u];try{f(u)}catch(e){if("function"==typeof U.errorHandler)try{U.errorHandler(e)}catch(e){j||(j=e)}else j||(j=e)}}return j?(s("fail"),n(j)):(s("idle"),void n(null,c))}function f(t){if(C[t])return C[t].exports;var n=C[t]={exports:{},id:t,loaded:!1,hot:r(t),parents:b,children:[]};return e[t].call(n.exports,n,n.exports,a(t)),n.loaded=!0,n.exports}var p=this.webpackHotUpdate;this.webpackHotUpdate=function(e,t){c(e,t),p&&p(e,t)};var h=!1;try{Object.defineProperty({},"x",{get:function(){}}),h=!0}catch(e){}var v,g,y,m=!0,w="8846d59f4edb0da7a47e",$={},b=[],S=[],_="idle",k=0,O=0,D={},E={},x={},C={};return f.m=e,f.c=C,f.p="/dist/",f.h=function(){return w},a(0)(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";n(2),n(4);var a=parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync;$(function(){function e(e,t){return e.key%2==0?-1:1}function t(e){var t=$(".dis-area").find(".sele-area").eq(e);t.attr("tag","on").siblings().attr("tag","off"),t.find(".sele-img").removeClass("sele-p").addClass("num-area-active"),t.siblings(".sele-area").children(".sele-img").removeClass("num-area-active")}var n=configData.source,r=n.seleList.sort(e),s="",i="";!function(){for(var e=0,t=r.length;e<t;e++)s+='<div class="sele-area" tag="off"><div class="sele-img sele-p"><p>'+(e+1)+"</p></div></div>",i+=""==r[e].audio?'<div class="sele-area" data-syncactions=obj-'+e+" data_key="+r[e].key+'><div class="sele-img" data-syncactions=img-'+e+'><img src="'+r[e].img+'" alt=""></div></div>':'<div class="sele-area" data-syncactions=obj-'+e+" data_key="+r[e].key+'><div class="sele-img" data-syncactions=img-'+e+'><img src="'+r[e].img+'" alt=""></div><div class="sele-audio" data-syncactions=audio-'+e+'><img src="image/volumeBtn_02.png" alt=""><audio src="'+r[e].audio+'"></audio></div></div>';$(".dis-area").append(s),$(".ans-area").append(i);var n=$(".desc").text();""!=n&&$(".desc").removeClass("desc-visi")}(),t(0);var o=!0;$(".ans-area .sele-area").on("click touchstart",".sele-img",function(e){if(e.stopPropagation(),o){if(o=!1,!a)return void $(this).trigger("syncItemClick");SDK.bindSyncEvt({sendUser:"",receiveUser:"",index:$(e.currentTarget).data("syncactions"),eventType:"click",method:"event",syncName:"syncItemClick"})}});var c=1,l=!0;$(".ans-area .sele-area").on("syncItemClick",".sele-img",function(e,n){if(!l)return SDK.setEventLock(),void(o=!0);c==r.length&&a&&(SDK.bindSyncResultEvt({sendUser:n.data[0].value.sendUser,receiveUser:n.data[0].value.receiveUser,sendUserInfo:n.data[0].value.sendUserInfo,index:$("#container").data("syncresult"),syncName:"syncResultClick"}),SDK.setEventLock(),o=!1);var s=$(this).parent(".sele-area"),i=s.attr("data_key");if(i==c){t(c),s.addClass("visi-hide");var d=s.children();$(".dis-area").find(".sele-area").eq(c-1).html(d),c+=1}else s.addClass("shake"),s.on("animationend",function(){s.removeClass("shake"),s.off("animationend")});SDK.setEventLock(),o=!0});var d={};$(".container").on("syncResultClick",function(e,t){var n=t.data[0].value.sendUserInfo;t.data[0].value.syncAction.resultData;"stu"==n.type&&(d[n.id]={name:n.name});var a="";for(var r in d)a+='<div class="stu-name">'+d[r].name+"</div>";$(".show-area").text(""),$(".show-area").append(a)});var u=!0;$(".sele-area").on("click touchstart",".sele-audio",function(e){if(e.stopPropagation(),u){if(u=!1,!a)return void $(this).trigger("syncSoundClick");if("tea"!=window.frameElement.getAttribute("user_type"))return void $(this).trigger("syncSoundClick");SDK.bindSyncEvt({index:$(e.currentTarget).data("syncactions"),eventType:"click",method:"event",syncName:"syncSoundClick",funcType:"audio"})}}),$(".sele-area").on("syncSoundClick",".sele-audio",function(e,t){var n=null;n=$(this).find("audio").get(0);var a=$(this).find("img");n?n.play():"",l=!1,0!=a.length&&(a.attr("src",$(this).find("img").attr("src").replace(".png",".gif")),n.onended=function(){a.attr("src",$(this).find("img").attr("src").replace(".gif",".png")),l=!0}.bind(this)),SDK.setEventLock(),u=!0});var f=!0;$(".ans-area").on("mouseenter",".sele-area",function(e){if(e.stopPropagation(),f){if(f=!1,!a)return void $(this).trigger("syncItemOver");SDK.bindSyncEvt({index:$(this).data("syncactions"),eventType:"mouseover",method:"event",syncName:"syncItemOver"})}}),$(".ans-area").on("syncItemOver",".sele-area",function(e,t){$(this).addClass("sele-hover"),SDK.setEventLock(),f=!0});var p=!0;$(".ans-area").on("mouseleave",".sele-area",function(e){if(e.stopPropagation(),p){if(p=!1,!a)return void $(this).trigger("syncItemOut");SDK.bindSyncEvt({index:$(this).data("syncactions"),eventType:"mouseout",method:"event",syncName:"syncItemOut"})}}),$(".ans-area").on("syncItemOut",".sele-area",function(e,t){$(this).removeClass("sele-hover"),SDK.setEventLock(),p=!0})})},function(e,t,n){"use strict";n(3)},function(e,t){"use strict";$(function(){var e={bg:configData.bg,desc:configData.desc,title:configData.source.title,tgs:configData.tg,tgMoved:!1,sync:parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync,getQueryString:function(e){var t=this.parseURL("http://www.example.com");return top.frames[0]&&top.frames[0].frameElement&&(t=this.parseURL(top.frames[0].frameElement.src)),t.params[e]},parseURL:function(e){var t=document.createElement("a");return t.href=e,{source:e,protocol:t.protocol.replace(":",""),host:t.hostname,port:t.port,query:t.search,params:function(){for(var e,n={},a=t.search.replace(/^\?/,"").split("&"),r=a.length,s=0;s<r;s++)a[s]&&(e=a[s].split("="),n[e[0]]=e[1]);return n}(),file:(t.pathname.match(/\/([^\/?#]+)$/i)||[,""])[1],hash:t.hash.replace("#",""),path:t.pathname.replace(/^([^\/])/,"/$1"),relative:(t.href.match(/tps?:\/\/[^\/]+(.+)/)||[,""])[1],segments:t.pathname.replace(/^\//,"").split("/")}},userType:function e(){var e="";return e=this.sync?window.frameElement.getAttribute("user_type"):"1"===this.getQueryString("role")?"tea":"stu"},setBg:function(){this.bg&&$(".container").css("background-image","url("+this.bg+")")},setDesc:function(){this.desc&&$(".desc").text(this.desc).show()},setTitle:function(){var e=this.title.length;e>0&&(e<=28?$(".title h3").css("font-size","0.72rem"):e<=42?$(".title h3").css("font-size","0.48rem"):$(".title h3").css("font-size","0.36rem"),$(".title h3").text(this.title),$(".title").show())},createTg:function(){var e="",t="";this.tgs.forEach(function(t,n){e+='\n        \t\t<li>\n\t\t\t\t    <div class="tg-list-tit clearfix">\n\t\t\t\t    <span class="fl tg-list-num">'+(n+1)+'</span>\n\t\t\t\t    <h3 class="fl">'+t.title+'</h3>\n\t\t\t\t    </div>\n\t\t\t\t    <p class="tg-list-des">'+t.content+"</p>\n\t\t\t    </li>\n        \t\t"}),t='<img src="image/tg.png" alt="" class="tg" style="display: none">\n            <div class="tg-content">\n                <ul>'+e+"</ul>\n            </div>\n            ",$(t).appendTo("#tg")},showTg:function(){this.tgs&&this.tgs.length>0&&(this.tgs[0].title.length>0||this.tgs[0].content.length>0)&&(this.createTg(),$(".tg").show())},showStu:function(){$(".tea").remove(),$(".stu").removeClass("hide")},showTea:function(){$(".stu").remove(),$(".tea").removeClass("hide"),this.showTg()},showMainPage:function(){var e=this.userType();switch(e){case"stu":this.showStu();break;default:this.showTea()}},bindEvents:function(){$("#tg").on("click",".tg",function(){this.tgMoved?(this.tgMoved=!1,$(".tg-content,.tg").removeClass("active")):(this.tgMoved=!0,$(".tg-content,.tg").addClass("active"))})},init:function(){this.setBg(),this.setDesc(),this.setTitle(),this.showMainPage(),this.bindEvents()}};e.init()})},function(e,t){"use strict";window.onload=function(){window.location.hostname;if(parent.window.h5SyncActions&&parent.window.h5SyncActions.isSync){var e=$(window.frameElement).attr("id"),t="h5_course_self_frame";"h5_course_cache_frame"!=e&&$(window.frameElement).attr("load_status","1"),e==t&&(parent.window.h5SyncActions.isPracticePage(!0),parent.window.h5SyncActions.isResultPage(!1))}}}]);
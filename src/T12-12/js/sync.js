window.onload=function () {
		//是否同步
	var hostName = window.location.hostname;
    if (parent.window.h5SyncActions && parent.window.h5SyncActions.isSync) {
        var currentWindowId = $(window.frameElement).attr('id');
        var iframeId = "h5_course_self_frame";
        if (currentWindowId != "h5_course_cache_frame") {
            $(window.frameElement).attr('load_status', '1');  
        }
        if(currentWindowId == iframeId){
            parent.window.h5SyncActions.isPracticePage(false); //是否需要授权
            parent.window.h5SyncActions.isResultPage(false);  //是否需要显示答案
        }
    }
}

require("js/common/ajaxhook.min.js");

console.log(hookAjax);

hookAjax({
	    //拦截回调
	    onreadystatechange:function(xhr){
	    	if(xhr.responseXML){
	    		window.location.reload();
	    		return true ;
	    	}
	    },
	    onload:function(xhr){
	    	if(xhr.responseXML){
	    		return true ;
	    		window.location.reload();	
	    	}
	    },
});

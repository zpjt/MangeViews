require("js/common/ajaxhook.min.js");


hookAjax({
	    //拦截回调
	    onreadystatechange:function(xhr){
	    	if(xhr.responseXML){
	    		window.open ('/login.html','_top')
	    		//window.location.reload();
	    		return true ;
	    	}
	    },
	    onload:function(xhr){
	    	if(xhr.responseXML){
	    		window.open ('/login.html','_top')
	    		//window.location.reload();	
	    		return true ;
	    	}
	    },
});

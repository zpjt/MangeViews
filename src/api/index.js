require("js/common/ajaxhook.min.js");

const {baseUrl,resourse} = window.jsp_config; 

const rootUrl = !resourse &&  "./" || baseUrl; 

hookAjax({
	    //拦截回调
	    onreadystatechange:function(xhr){
	    	if(xhr.responseXML){
	    		window.open (rootUrl+'login.html','_top')
	    		return true ;
	    	}
	    },
	    onload:function(xhr){
	    	if(xhr.responseXML){
	    		window.open (rootUrl+'login.html','_top')
	    		return true ;
	    	}
	    },
});

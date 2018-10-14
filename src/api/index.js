require("js/common/ajaxhook.min.js");

const {baseUrl} = window.jsp_config; 

//const baseUrl = "./"; 

hookAjax({
	    //拦截回调
	    onreadystatechange:function(xhr){
	    	if(xhr.responseXML){
	    		window.open (baseUrl+'login.html','_top')
	    		return true ;
	    	}
	    },
	    onload:function(xhr){
	    	if(xhr.responseXML){
	    		window.open (baseUrl+'login.html','_top')
	    		return true ;
	    	}
	    },
});


require("./index.js");

const {baseUrl} = window.jsp_config;
const control = "layout/";

const URL= baseUrl+control;

class API {

	getAllLayout(keyword=""){
		return Promise.resolve($.get(URL+"getAllLayout",{keyword}));
	}
	
	addView(type,data){
		const method = type ==="view" && "addLayout" || "addLayout_par";
		return Promise.resolve($.post(URL+method,data));
	}
	checkName(data){
		return Promise.resolve($.post(URL+"checkName",data));
	}
	updataRecycle(data){
		return Promise.resolve($.post(URL+"updataRecycle",data));
	}

	getAllLayout_icon(){
		return Promise.resolve($.get(URL+"getAllLayout_icon"));
	}
	updataIcon(data){
		return Promise.resolve($.post(URL+"updataIcon",data));
	}

	updataName(data){
		return Promise.resolve($.post(URL+"updataName",data));
	}
	getLayoutUserTree(keyword=""){
		return Promise.resolve($.get(URL+"getLayoutUserTree",{keyword}));
	}
	ReleaseLayout(obj){
		return Promise.resolve(
			$.ajax({
				method:"post",
				url:URL+"ReleaseLayout",
				contentType:"application/json",
				data:JSON.stringify(obj),
			})
		);
	}
	showReleaseLayout(layout_id){
		return Promise.resolve($.post(URL+"showReleaseLayout",{layout_id}));
	}
	copyLayout(layoutId,layoutName){
		return Promise.resolve($.post(URL+"copyLayout",{layoutId,layoutName}));
	}

}  


const api = new API();
export {api};
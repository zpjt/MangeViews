
require("./index.js");

const {baseUrl} = window.jsp_config;
const control = "layout/";

const URL= baseUrl+control;
const MAIN= baseUrl+"main/";

class API {

	getPreams(role_id){
		
		return Promise.resolve($.post(MAIN+"getPreams",{role_id}));
	}

	savePreams(obj){
		return Promise.resolve($.ajax({
			url:MAIN+"savePreams",
			data:JSON.stringify(obj),
			contentType:"application/json",
			type:"post",
		}));
	}

}  

const api = new API();

export {api};


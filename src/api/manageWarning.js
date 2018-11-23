
require("./index.js");

const {baseUrl,role_id,user_id} = window.jsp_config;
const control = "Alarm/";

const URL= baseUrl+control;

class API {

	getAllKpiAlarm(flag="0"){
		return Promise.resolve($.get(URL+"getAllKpiAlarm",{flag,role_id,user_id}));
	}
	deleteAlarmHestory(obj){
		return Promise.resolve(
					$.ajax({
						method:"post",
						url:URL+"deleteAlarmHestory",
						contentType:"application/json",
						data:JSON.stringify(obj),
					})
				);
	}
}  

const api = new API();

export {api};


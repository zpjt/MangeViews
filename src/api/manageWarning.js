
require("./index.js");

const {baseUrl} = window.jsp_config;
const control = "Alarm/";

const URL= baseUrl+control;

class API {

	getAllKpiAlarm(flag="0"){
		return Promise.resolve($.get(URL+"getAllKpiAlarm",{flag}));
	}
}  

const api = new API();

export {api};


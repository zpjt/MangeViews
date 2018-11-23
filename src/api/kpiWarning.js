
require("./index.js");

const {baseUrl,role_id,user_id} = window.jsp_config;
const control = "Alarm/";

const URL= baseUrl+control;
const MAIN= baseUrl+"main/";

class API {

	roleResource(){
		const data = {
			role_id,
			menu_id:$("#menu .child-item.active",window.parent.document).attr("echo-id"),
		};
		return Promise.resolve($.post(MAIN+"role_resource",data));
	}

	getAllKpiAlarm(flag="-1"){
		return Promise.resolve($.get(URL+"getAllKpiAlarm",{flag,user_id,role_id}));
	}

	kpitree(){
		return Promise.resolve($.get(baseUrl+"main/kpitree"));
	}
	orgtree(){
		return Promise.resolve($.get(baseUrl+"main/orgtree"));
	}
	dimtree(){
		return Promise.resolve($.get(baseUrl+"main/dimtree"));
	}
	getAllAlarmModel(obj){
		return Promise.resolve($.get(URL+"getAllAlarmModel"));
	}
	getLayoutUserTree(keyword=""){
		return Promise.resolve($.get(baseUrl+"layout/getLayoutUserTree",{keyword}));
	}
	GroupKpiByDim(obj){
			return Promise.resolve(
				$.ajax({
					method:"post",
					url:baseUrl+"main/GroupKpiByDim",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
			);
	}
	addKpiAlarm(obj){
			return Promise.resolve(
				$.ajax({
					method:"post",
					url:URL+"addKpiAlarm",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
			);
	}
	deleteAlarm(obj){
		return Promise.resolve(
				$.ajax({
					method:"post",
					url:URL+"deleteAlarm",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
			);
	}
	deleteAlarmModel(obj){

	 return Promise.resolve(
				$.ajax({
					method:"post",
					url:URL+"deleteAlarmModel",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
			);
	}
	addAlarmModel(obj){
		return Promise.resolve(
				$.ajax({
					method:"post",
					url:URL+"addAlarmModel",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
			);
	}
	updateAlarmModel(obj){
		return Promise.resolve(
				$.ajax({
					method:"post",
					url:URL+"updateAlarmModel",
					contentType:"application/json",
					data:JSON.stringify(obj),
				})
		);
	}
}  

const api = new API();

export {api};


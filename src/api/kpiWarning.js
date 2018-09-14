

const {baseUrl} = window.jsp_config;
const control = "Alarm/";

const URL= baseUrl+control;

class API {

	getAllKpiAlarm(){
		return Promise.resolve($.get(URL+"getAllKpiAlarm"));
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

}  

const api = new API();

export {api};


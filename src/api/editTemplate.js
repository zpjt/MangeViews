const {baseUrl} = window.jsp_config;
const control_1 = "main/";
const control_2 = "chart/";

const URL_WD= baseUrl+control_1;
const URL_C= baseUrl+control_2;

class API {

	orgtree(){
		return Promise.resolve($.get(URL_WD+"orgtree"));
	}
	kpitree(){
		return Promise.resolve($.get(URL_WD+"kpitree"));
	}
	dimtree(){
		return Promise.resolve($.get(URL_WD+"dimtree"));
	}
	GroupKpiByDim(obj){
		return Promise.resolve($.ajax({
			url:URL_WD+"GroupKpiByDim",
			data:JSON.stringify(obj),
			contentType:"application/json",
			type:"post",
		}));
	}
	getTableInfo(obj){
		return Promise.resolve($.ajax({
				url:URL_C+"getTableInfo",
				data:JSON.stringify(obj),
				contentType:"application/json",
				type:"post",
			}));
	}

	getGraphInfo(obj){
		return Promise.resolve($.ajax({
				url:URL_C+"getGraphInfo",
				data:JSON.stringify(obj),
				contentType:"application/json",
				type:"post",
			}));
	}

	saveTableInfo(obj){

		return Promise.resolve($.ajax({
				url:URL_C+"saveTableInfo",
				data:JSON.stringify(obj),
				contentType:"application/json",
				type:"post",
			}));	

	}

	
}  

const api = new API();

export {api};
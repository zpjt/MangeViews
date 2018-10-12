require("./index.js");
const {baseUrl} = window.jsp_config;
const control_1 = "main/";
const control_2 = "chart/";
const control_3 = "layout/";

const URL_WD= baseUrl+control_1;
const URL_C= baseUrl+control_2;
const URL_L= baseUrl+control_3;

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
	saveGraphInfo(obj){

		return Promise.resolve($.ajax({
				url:URL_C+"saveGraphInfo ",
				data:JSON.stringify(obj),
				contentType:"application/json",
				type:"post",
			}));	

	}
	saveLayout(formData){

		return Promise.resolve($.ajax({
			url: URL_L + 'saveLayout',
			type: 'post',
			cache: false,
			data: formData,
			processData: false,
			contentType: false,
    	}));
	}

	showLayoutModel(layout_id){
		return Promise.resolve($.post(URL_L+"showLayoutModel",{layout_id}));
	}

	
}  

const api = new API();

export {api};
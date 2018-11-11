
require("./index.js");

const {baseUrl} = window.jsp_config;
const control = "layout/";

const URL= baseUrl+control;

class API {

	role_resource(data){
		return Promise.resolve($.post(URL+"RecycleLayoutshow"));
	}

	RecycleLayoutshow(){
		return Promise.resolve($.get(URL+"RecycleLayoutshow"));
	}

	RecycleChartshow(){
		return Promise.resolve($.get(URL+"RecycleChartshow"));
	}

	delLayout(obj){
		return Promise.resolve(
			$.ajax({
				method:"post",
				url:URL+"delLayout",
				contentType:"application/json",
				data:JSON.stringify(obj),
			})
		);
	}
	delchart(obj){
		return Promise.resolve(
			$.ajax({
				method:"post",
				url:URL+"delchart",
				contentType:"application/json",
				data:JSON.stringify(obj),
			})
		);
	}
	getAllLayoutPar(keyword=""){
		return Promise.resolve($.post(URL+"getAllLayoutPar",{keyword}));
	}
	checkName(data){
		return Promise.resolve($.post(URL+"checkName",data));
	}
	RecycleLayout(data){
		return Promise.resolve($.post(URL+"RecycleLayout",data));
	}

}  

const api = new API();

export {api};


require("./index.js");
const {baseUrl} = window.jsp_config;
const control_1 = "main/";
const control_2 = "chart/";
const control_3 = "layout/";

const URL_WD= baseUrl+control_1;
const URL_C= baseUrl+control_2;
const URL_L= baseUrl+control_3;

class API {
	getAllLayoutPar(keyword=""){
		return Promise.resolve($.post(URL_L+"getAllLayoutPar",{keyword}));
	}
	checkName(data){
		return Promise.resolve($.post(URL_L+"checkName",data));
	}
	copyLayout(data){
		return Promise.resolve($.post(URL_L+"copyLayout",data));
	}
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
	
	upload(obj){
			return Promise.resolve($.ajax({
				url: baseUrl + '/Expo/upload',
				data:JSON.stringify(obj),
				contentType:"application/json",
				type:"post",
	    	}));
	}
	addAssembly(formData){
			return Promise.resolve($.ajax({
				url: URL_L + 'addAssembly',
				type: 'post',
				cache: false,
				data: formData,
				processData: false,
				contentType: false,
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
	deleteChart(CHART_ID){
		console.log("删掉了...",CHART_ID);
		return Promise.resolve($.post(URL_C+"deleteChart",{CHART_ID}));
	}
	
}  

const api = new API();

export {api};
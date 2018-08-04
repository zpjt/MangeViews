const {baseUrl} = window.jsp_config;
const control_1 = "layout/";
const control_2 = "chart/";
const control_3 = "Expo/";

const URL_M= baseUrl+control_1;
const URL_V= baseUrl+control_2;
const URL_E= baseUrl+control_3;

class API {

	showLayoutModel(layout_id){
		return Promise.resolve($.post(URL_M+"showLayoutModel",{layout_id}));
	}
	getGraphData(chart_id){
		return Promise.resolve($.post(URL_V+"getGraphData",{chart_id}));
	}
	getExeclld(obj){
		return Promise.resolve($.ajax({
				url:URL_E+"getExeclId",
				type:"post",
				contentType:"application/json",
				data:JSON.stringify(obj),
		}));
	}


	
	
}  

const api = new API();

export {api};
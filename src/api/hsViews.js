

const {baseUrl} = window.jsp_config;
const control = "layout/";

const URL= baseUrl+control;

class API {

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
	

}  

const api = new API();

export {api};


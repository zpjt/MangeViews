

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



import {kpiTree,orgTree,dimTree} from "js/editTemplate/kpi.js";

const {baseUrl} = window.jsp_config;
const control = "Alarm/";

const URL= baseUrl+control;


 /*Mock.mock(/kpitree/, {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL',
            'children|0-6':[
				{
				 first: '@FIRST',
		          middle: '@FIRST',
		        last: '@LAST',
		        full: '@first @middle @last'
				}
            ]
    	}]//所有ajax地址以.json结尾的都被拦截，并且返回数据
});

$.ajax({
    url: baseUrl+"main/kpitree",
    dataType: 'json'
}).done(function(data, status, jqXHR){
    $('<pre>').text(JSON.stringify(data, null, 4))
        .appendTo($(".page"))
});*/

class API {

	getAllKpiAlarm(){

		

		//return Promise.resolve($.get(URL+"getAllKpiAlarm"));

		return Promise.resolve([
			    {
			        "id": 8,
			        "kpi_id": 116,
			        "kpi_name": "重点疾病总例数（测试）",
			        "param_cond": "高于",
			        "param_value": "500",
			        "alarm_level": "1",
			        "alarm_type": "1",
			        "alarm_type_name": "短信",
			        "status": "1",
			        "param_user": "10",
			        "param_user_name": "demo",
			        "updata_time": "2018-09-14 15:02:31",
			        "send_status": "null",
			        "model_id": "4",
			        "model_text": "25423333333333",
			        "start_time": "20180914@10:30",
			        "end_time": "20181015@12:50",
			        "dim2": "10",
			        "dimN": "3",
			        "dimX": "304",
			        "senduser": [
			            {
			                "send_user_id": "144",
			                "send_user_name": "01031"
			            },
			            {
			                "send_user_id": "160",
			                "send_user_name": "01033"
			            }
			        ],
			        "send_time": "null"
			    },
			    {
			        "id": 9,
			        "kpi_id": 101010200,
			        "kpi_name": "ICU总床位数",
			        "param_cond": "高于",
			        "param_value": "500",
			        "alarm_level": "3",
			        "alarm_type": "1",
			        "alarm_type_name": "短信",
			        "status": "1",
			        "param_user": "10",
			        "param_user_name": "demo",
			        "updata_time": "2018-09-14 15:07:01",
			        "send_status": "null",
			        "model_id": "4",
			        "model_text": "25423333333333",
			        "start_time": "20180914@10:30",
			        "end_time": "20181015@15:50",
			        "dim2": "10",
			        "dimN": "null",
			        "dimX": "null",
			        "senduser": [
			            {
			                "send_user_id": "144",
			                "send_user_name": "01031"
			            },
			            {
			                "send_user_id": "160",
			                "send_user_name": "01033"
			            },
			            {
			                "send_user_id": "127",
			                "send_user_name": "00128"
			            }
			        ],
			        "send_time": "null"
			    },
			    {
			        "id": 6,
			        "kpi_id": 101020105,
			        "kpi_name": "总诊疗人次",
			        "param_cond": "低于",
			        "param_value": "5555",
			        "alarm_level": "3",
			        "alarm_type": "1",
			        "alarm_type_name": "短信",
			        "status": "1",
			        "param_user": "10",
			        "param_user_name": "demo",
			        "updata_time": "2018-09-14 14:32:02",
			        "send_status": "null",
			        "model_id": "4",
			        "model_text": "25423333333333",
			        "start_time": "20180914@10:30",
			        "end_time": "20181015@12:50",
			        "dim2": "10",
			        "dimN": "null",
			        "dimX": "null",
			        "senduser": [
			            {
			                "send_user_id": "144",
			                "send_user_name": "01031"
			            }
			        ],
			        "send_time": "null"
			    }
			]);
	}

	kpitree(){


		// return Promise.resolve($.get(baseUrl+"main/kpitree"));

		 return Promise.resolve(kpiTree);
	}
	orgtree(){
		//return Promise.resolve($.get(baseUrl+"main/orgtree"));
		return Promise.resolve(orgTree);
	}
	dimtree(){
		//return Promise.resolve($.get(baseUrl+"main/dimtree"));

		return  Promise.resolve(dimTree);
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


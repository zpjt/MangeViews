import "css/kpiWarning.scss";

import {api} from "api/kpiWarning.js";

import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp,Calendar,SCombobox} from "js/common/Unit.js";


/* 
 jq 对象
 @$table：回收表格 
 */


 const $tableBox = $("#tabBox"),
       $table = $("#tab"),
       $addModal = $("#addModal");


class Table extends EasyUITab{

	constructor(){
       super();
       this.setPageHeight($tableBox,96);
       this.handle();
    }

	tabConfig(idField){
		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField,{
				order:true,
			}),
			columns: [
				[{
					field: 'kpi_name',
					title: '指标名称',
					width: "16%",
					formatter:function(val){

						return `<span style="color:#00A0E9">${val}</span>` ;
					}
				}, 
				{
					field: 'warn_condition',
					title: '预警条件',
					align:"center",
					width: "15%",
					formatter:function(val,rowData){
						
						return `<b>${rowData.param_cond + " , " + rowData.param_value}</b>`;
					}
				}, 
				{
					field: 'alarm_level',
					title: '预警级别',
					align:"center",
					width: "8%",
					formatter:function(val){

						const levStr = ["","一级","二级","三级","四级"][ +val];

						const colorStr = ["","#00A0E9","#E96500","#E90010","red"][ +val];
						
						return `<b style="color:${colorStr}">${levStr}</b>`;
					}
				},
				{
					field: 'alarm_type_name',
					title: '提醒方式',
					align:"center",
					width: "10%",
				},{
					field: 'param_user_name',
					title: '创建人',
					align:"center",
					width: "10%",
				},{
					field: 'updata_time',
					title: '创建时间',
					width: "15%",
				},
				{
					field: 'status',
					title: '状态',
					align:"center",
					width: "8%",
					formatter:function(val){

						const status = val === "1" && "运行中" || "关闭" ;
						const color = val === "1" && "#00A0E9" || "red" ;

						return `<b style="color:${color}">${status}</b>` ;
					}
				},
				
				{
					field: 'optBtn',
					title: '操作',
					align:"center",
					width: "12%",
					formatter: function(val, rowData,index) {
						
						let str = `
										<div class="tab-opt s-btn s-Naira" node-sign="set">
												<i class="fa fa-sliders"></i>
												<span>设置</span>	
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="pre">
												<i class="fa fa-eye"></i>	
												<span>查看</span>	
										</div>	
							   		`;

						return `
								<div class="tabBtnBox" echo-data='${index}' >
										${str}
								</div>
							`;
					}
				}]
			],
		};
    }

    loadTab(data){
		this.creatTab(data,$table,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
		//复选框事件
		$tableBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle($tableBox);
		});
		//
		$tableBox.on("click",".tab-opt",function(){

			const type =  $(this).attr("node-sign");
			const par = $(this).parent(),
				  index = +par.attr("echo-data");

			
			switch(type){
				case "set":{

					const node = $table.datagrid("getData").rows[index];

					console.log(node);

					page.addModal.setValue(node);

					break;
				}
				case "pre":{


					break;
					}
				default:
					break;
			}



		});
    }
}

class AddModal{

	constructor(){
		this.init();
		this.handle();
	}

	init(){
		this.getData();
		// 日历
		this.calendar = new Calendar($("#dataTime"),$("#viewShowTime"),{
			style:2,
			time:true,
		});
		this.dimN = "" ;
		
	}

	setValue(node){

	//	this.optId = id ;
		page.modal.show($addModal);
	}

	initRender(){
		page.modal.show($addModal);
	}

	GroupKpiByDim(kpi){



		api.GroupKpiByDim({kpi}).then(res=>{
			if(res){
				this.dimN = Object.keys(res)[0].split("_")[1];
			}else{
				alert("出错！")
			}
		})
	}

	getData(){

		const _me = this ;


		api.kpitree().then(res=>{
			if(res){
				this.zbTreeCombo = new SComboTree($("#zbTree"),{
					width:320,
					treeConfig:{
						 data:res.sub,
						"textField":"kpi_name",
						"idField":"kpi_id",
						"childrenField":"sub",
						"judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
								return val.kpi_type === "0";
						 },
						 clickCallback:function(node){
						 	const kpis = [node.kpi_id];
								_me.GroupKpiByDim(kpis);
						 }

					}
				});
				
			}else{
				alert("出错！");
			}
		});

		api.orgtree().then(res=>{
			if(res){
				this.orgTreeCombo = new SComboTree($("#orgTree"),{
					width:200,
					treeConfig:{
						data:res.sub,
						"textField":"dim_name",
						"idField":"dim_value",
						"childrenField":"sub",
						"judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
								return val.type === "0";
						 }
					}
				});
				
			}else{
				alert("出错！")
			}
		});

		api.dimtree().then(res=>{
			if(res){
				this.dimData = res.sub;
				this.dimCombo = new SCombobox($("#dimCombo"),{
						"data":res.sub[0].sub,
						"textField":"dim_name",
						"idField":"dim_value",
						"defaultVal":"",
						 width:280,
				})
				
			}else{
				alert("出错！");
			}
		});

		api.getAllAlarmModel().then(res=>{
			if(res){
				this.messageCombox = new SCombobox($("#messageCombox"),{
						"data":res,
						"textField":"model_text",
						"defaultVal":"",
						 width:420,
						 dropFormatter:function(node){
								return node.model_name;
						 }
				})
				
			}else{
				alert("出错！");
			}
		});

		api.getLayoutUserTree().then(res=>{
			if(res){
				this.userTreeCombo = new SComboTree($("#userTreeCombobox"),{
					width:300,
					treeConfig:{
						data:res.sub,
						checkbox:true,
						"textField":"name",
						"childrenField":"sub",
						"judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
								return val.type === 0;
						 }
					}
				});
				
			}else{
				alert("出错！");
			}
		});
	}

	handle(){

		const _self = this ;

		$("#addModal").on("click", function() {

			requestAnimationFrame(function(){
		         const $comboDrop = $(".combo-drop");
				 $comboDrop.parent().removeClass("active");
				 $comboDrop.hide();
		    });
		});
		
		$("#addMBtn").click(function(){
			
		  const id = "" ;
		  const status = $(".warn-switch").prop("checked") && "1" || "2";
		  const kpi_id = _self.zbTreeCombo.box.find(".combo-value").val();

		  const param_cond = $("#warnCon option:selected").val(),
		        param_value = $("#warnVal").val();

		  const start_time = _self.calendar.value.map(val=>val.join(""))[0],
		        end_time = _self.calendar.value.map(val=>val.join(""))[1];

		  const dim2 = _self.orgTreeCombo.box.find(".combo-value").val(),
			    dimN = _self.dimN,
		        dimX = dimN !== "2" && _self.dimCombo.box.find(".combo-value").val() || "";

		  const alarm_level = $(".warnlev:checked").val(),
		        alarm_type = $(".warnType:checked").val();

		  const model_id = _self.messageCombox.box.find(".combo-value").val(),
		        model_text = _self.messageCombox.box.find(".combo-text").val();
		 
		  const senduser = _self.userTreeCombo.getValue().map(val=>{
					const send_user_id = val.id ,
							send_user_name = val.name ;
		  			return {
						send_user_id,
						send_user_name
		  			}
		  });

		  const obj = {
		  	id,
		  	dim2,
		  	dimN,
		  	dimX,
		  	status,
		  	kpi_id,
		  	param_cond,
		  	param_value,
		  	start_time,
		  	end_time,
		  	alarm_level,
		  	alarm_type,
		  	param_value,
		  	model_id,
		  	model_text,
		  	senduser,

		  };

		  console.log(obj);

		  api.addKpiAlarm(obj).then(res=>{
		  	if(res){
				console.log(res);
		  	}else{
				alert("出错！")
		  	}
		  })
			

		});
	}
}

class Page{

	constructor(){
		
		this.handle();
		this.init();

	}

	init(){
		this.table = new Table();
		this.unit = new Unit();
		this.modal = new SModal();
		this.addModal = new AddModal();
		this.inp = new SInp();

		this.getData();
	}

	getData(){

		api.getAllKpiAlarm().then(res=>{

			if(!res){
				alert("出错！")
			}else{
				this.table.loadTab(res);
			}

		});
	}

	del(obj){

		const  method = this.state === "layout" && "delLayout" || "delchart";

		api[method](obj).then(res=>{
			if(!res){
				alert("删除失败！");
			}else{
				alert("删除成功！");
			}
		});
	}

	handle(){
		const _self = this ;
		// 切换 视图与图表
		$("#j-addBtn").on("click",function(){
			

			_self.addModal.initRender();

		});
		//批量删去
		$("#delBtn").click(function(){

			const ids =$.map($tableBox.find(".checkSingle"),function(val){
					return +val.value;
			}) ;

			_self.del({ids});

		});
	}
}

const page = new Page();
import "css/kpiWarning.scss";

import {api} from "api/kpiWarning.js";

import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp,Calendar} from "js/common/Unit.js";


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
			rotate:4,
			style:2
		});
	}

	setValue(node){

	//	this.optId = id ;
		page.modal.show($addModal);
	}

	getData(){


		api.kpitree().then(res=>{
			if(res){
				this.zbTreeCombo = new SComboTree($("#zbTree"),{
					width:420,
					treeConfig:{
						 data:res.sub,
						"textField":"kpi_name",
						"idField":"kpi_id",
						"childrenField":"sub",
						"judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
								return val.kpi_type === "0";
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
					width:280,
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
				
			}else{
				alert("出错！");
			}
		});
		
	}

	handle(){

		const _self = this ;
		
		$("#addMBtn").click(function(){
			
			const par_id = _self.restCombo.box.find(".combo-value").val(),
				  name = $("#name").val();

			if(!name || !par_id){
				
				alert("清填写完整！");
				return ;
			}
		    api.checkName({par_id,name}).then(res=>{

		   	  if(res){
				const id = _self.optId;
				api.RecycleLayout({id,par_id}).then(res=>{
					
					if(res){
						page.getData();
					}else{
						alert("还原失败！");
					}
				});

		   	  }else{
		   	  	alert("重名！")
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
		$("#j-tab").on("click",".m-tab-item",function(){
			const $this = $(this);
			const type = $this.index();

			if($this.hasClass("active")){
					return ;			
			}

			$this.addClass("active").siblings().removeClass("active");
			_self.state = type === 0 ? "layout" : "chart" ;
			_self.getData();

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
import "css/kpiWarning.scss";
import {api} from "api/kpiWarning.js";
import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp,Calendar,SCombobox,Search} from "js/common/Unit.js";

/**
 * @user_id ：用户id
 */
 const {user_id} = window.jsp_config;

/**
 * $tableBox description]:预警表格容器
 * [$table description]：预警表格，用来使用 easyui的datagrid
 * [$addMBtn description]:添加模态框的确定按钮
 * [$addModal description]：添加模态框容器
 * [$dimBox description]：主题维度下拉框的容器
 * [$gMessage description]：自定义短信模板的布局容器
 */

 const $tableBox = $("#tabBox"),
       $table = $("#tab"),
       $addMBtn = $("#addMBtn"),
       $dimBox = $("#j-dimBox"),
       $gMessage = $("#g-message"),
       $addModal = $("#addModal");

/**
 * 预警指标表格组件
 */
class Table extends EasyUITab{

	constructor()	{
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
				checkbox:Page.tabOptDel
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
						
						let str = Page.tabOptStr;

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
				case "mod":{

					const node = $table.datagrid("getData").rows[index];
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

class DelModal{

	static delArr = null;

	constructor(unit){

		this.unit = unit ;
		this.confirmBtn = $("#confirmBtn");
		this.confirmMd = $("#confirm-MView");
		this.handle();
	}


	del(ids){

		api.deleteAlarm(ids).then(res=>{
			if(res){
				page.unit.tipToast("删除预警指标成功！",1);
				page.getData();
			}else{
				page.unit.tipToast("删除预警指标失败！",0);
			}
			DelModal.delArr = null ;
		});
	}


	handle(){
		
		const _self = this;
		// 删除模态框确认按钮
		this.confirmBtn.click(function(){

			const obj = DelModal.delArr;
			_self.del(obj);
			page.modal.close(_self.confirmMd);
		});
	
	}
}

/**
 * 短信模板表格
 */
class MessageTab extends EasyUITab{

	constructor(){
       super();
      
       this.tabBox = $("#g-tabMessageBox");
       this.tab = $("#g-tabMessage");
       this.handle();
    }

	tabConfig(idField){
		return {
			idField:idField,
			tabId:"#g-tabMessageBox",
			frozenColumns: this.frozenColumns(idField,{
				order:false,
			}),
		    onAfterEdit:function(rowIndex, rowData, changes){

		    	const has_change = Object.keys(changes);

		    	if(!has_change.length){
					return ;
		    	}
				
				const method = rowData.id && "updateAlarmModel" || "addAlarmModel" ;
				api[method](rowData).then(res=>{
					if(res){
						method === "addAlarmModel" && page.addModal.getAllAlarmModel();
						page.unit.tipToast("短信添加成功！",1);
					}else{
						page.unit.tipToast("短信添加失败！",0);
					}
				});	
		    },
			columns: [
				[{
					field: 'model_name',
					title: '模板名称',
					editor:"textbox",
					width: "25%",
				}, 
				{
					field: 'model_text',
					title: '模板内容',
					width: "55%",
					editor:"textbox",
					formatter:function(val,rowData){
						
						return `<b>${val}</b>`;
					}
				}, 
				{
					field: 'optBtn',
					title: '操作',
					width: "16%",
					formatter: function(val,rowData,index) {

						const editStatus = !rowData.id ? "s-editing" : "";
						
						let str =  `
										<div class="j-handle s-btn s-Naira ${editStatus}" sign="j-edit">
												${ editStatus? `<i class="fa fa-check"></i><span>提交</span>` :`<i class="fa fa-edit"></i> <span>编辑</span>`}	
										</div>
							   		` ;

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
		this.creatTab(data,this.tab,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
		//复选框事件
		this.tabBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle(_self.tabBox);
		});
		//
		this.tabBox.on("click",".tab-opt",function(){

			const type =  $(this).attr("node-sign");
			const par = $(this).parent(),
				  index = +par.attr("echo-data");

			
			switch(type){
				case "set":{

					const node = $table.datagrid("getData").rows[index];
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

/**
 * 添加模态框
 */
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
		this.optId = "";
		this.$title = $("#s-Mtitle");
		this.messageTab = new MessageTab();

		
	}

	setValue(node){

		this.$title.html("修改指标预警");
		const {status,kpi_id,param_value,dim2,start_time,end_time,alarm_level,alarm_type,model_id,senduser,param_cond,dimN,dimX} = node ;

		this.optId = node.id;
		this.dimN = dimN ;
		this.dimX = dimX ;

		$(".warn-switch").prop("checked",status === "1");
		
		this.zbTreeCombo.tree.setSingleValue(kpi_id);

		const param_cond_num = param_cond === "高于" ? 0 : 1;

		  $("#warnCon option").eq(param_cond_num).prop("selected","selected");
		  $("#warnVal").val(param_value);

	      this.calendar.setTime([start_time,end_time]);

		  this.orgTreeCombo.tree.setSingleValue(dim2);
		 

		 $(".warnlev").eq(+alarm_level - 1).prop("checked",true);
		 $(".warnType").eq(+alarm_type - 1).prop("checked",true);

		 this.messageCombox.setValue(model_id);
		 
		 const ids = senduser.map(val=>val.send_user_id);
		 this.userTreeCombo.setValue(ids);

		 $addModal.find(".no-fill").removeClass("no-fill");

		 page.modal.show($addModal);
	}

	initRender(){
		this.$title.html("添加指标预警");
		this.optId = "";

		page.modal.show($addModal);
		this.zbTreeCombo.clearValue();
		this.orgTreeCombo.clearValue();
		this.userTreeCombo.clearValue();
		$dimBox.html(null);
	}

	GroupKpiByDim(kpi){
		$addMBtn.prop("disabled","disabled");
		api.GroupKpiByDim({kpi}).then(res=>{
			if(res){
				const dimN = Object.keys(res)[0].split("_")[1];
				this.dimN = dimN;
				const dimX = this.dimX;
				this.dimCombo = null;
				$dimBox.html(null);
				if(this.dimN !== "2"){

					const dimStr = `<p class="s-title"><b class="inp-tip">*</b>主题维度:</p>
									<div class="s-comboBox" id="dimCombo"> </div>`;
					$dimBox.html(dimStr);

					const data  = this.dimData.find(val=>val.dim_id === dimN).sub;
					this.dimCombo = new SCombobox($("#dimCombo"),{
						"data":data,
						"textField":"dim_name",
						"idField":"dim_value",
						 width:280,
						 "dropIcon":"sicon sicon-kpi",
				    });

					if(this.optId && dimX &&  dimX !== "null"){
						this.dimCombo.setValue(dimX);
						this.dimCombo.box.find(".no-fill").removeClass("no-fill");
					} 　

				

				}

				$addMBtn.removeAttr("disabled");

			}else{
				page.unit.tipToast("指标分类失败！",0);
			}
		})
	}
	/**
	 * [getAllAlarmModel description]
	 * @param  {Boolean} first [是否第一次加载,第一次不加装短信模板表格]
	 * @return {[type]}        [description]
	 */
	getAllAlarmModel(first=false,reloadCombox = false){

		api.getAllAlarmModel().then(res=>{
			if(res){
				if(first){
					this.messageCombox = new SCombobox($("#messageCombox"),{
											"data":res,
											"textField":"model_text",
											"defaultVal": "",
											 width:420,
											 textarea:true,
											 dropIcon:"fa fa-commenting",
											 dropFormatter:function(node){
													return node.model_name;
											 }
									});
				}else{
						
					if(reloadCombox){
						this.messageCombox.loadData(res);
						//this.messageCombox.clearValue()
					}else{
						this.messageTab.loadTab(res);
					}
				}

			}else{
				page.unit.tipToast("短信模板获取失败！",0);
			}
		});
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
						"childIcon":"sicon sicon-kpi",
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
				page.unit.tipToast("指标获取失败！",0);
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
				page.unit.tipToast("科室获取失败！",0);
			}
		});

		api.dimtree().then(res=>{
			if(res){
				this.dimData = res.sub;
				
				
			}else{
				page.unit.tipToast("主题维度获取失败！",0);
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
				
					page.unit.tipToast("用户树获取失败！",0);

			}
		});
		
		this.getAllAlarmModel(true);
	}

	getAllParams(){

		  const status = $(".warn-switch").prop("checked") && "1" || "2";
		  const kpi_id = this.zbTreeCombo.box.find(".combo-value").val();

		  const param_cond = $("#warnCon option:selected").val(),
		        param_value = $("#warnVal").val();

	      const {value,timeWatchArr,rotate} = this.calendar;
	      const timestr_1 = rotate === 4 && "@"+timeWatchArr[0].join(":")|| "" ;
	      const timestr_2 = rotate === 4 && "@"+timeWatchArr[1].join(":")|| "" ;
		  const start_time = value[0].join("") + timestr_1,
		        end_time = value[1].join("") + timestr_2;

		  const dim2 = this.orgTreeCombo.box.find(".combo-value").val(),
			    dimN = this.dimN > 2 && this.dimN || "",
		        dimX = this.dimN !== "2" && this.dimCombo.box.find(".combo-value").val() || "";

		  const alarm_level = $(".warnlev:checked").val(),
		        alarm_type = $(".warnType:checked").val();

		  const model_id = this.messageCombox.box.find(".combo-value").val(),
		        model_text = this.messageCombox.box.find(".combo-text").val();
		 
		  const senduser = this.userTreeCombo.getValue().map(val=>{
					const send_user_id = val.id ,
							send_user_name = val.name ;
		  			return {
						send_user_id,
						send_user_name
		  			}
		  });

		  const param_user = user_id ;
		  const id = this.optId ;
		  return {
				  	id,
				  	param_user,
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
	}

	handle(){

		const _self = this ;
		/**
		 * [description]
		 * 模态框的点击事件，用来隐藏出现的下拉框和日历
		 */
		 $addModal.on("click", function() {

			requestAnimationFrame(function(){
		         const $comboDrop = $(".combo-drop");
				 $comboDrop.parent().removeClass("active");
				 $comboDrop.hide();
		    });
		});
		/**
		 * [description]
		 * 模态框确定按钮事件
		 */
		$addMBtn.click(function(){
			if($addModal.find('.no-fill').length){

				page.unit.tipToast("请填写完整！",2);
				return ;
					
			}
		  const obj = _self.getAllParams();
		  page.modal.close($addModal);
		  api.addKpiAlarm(obj).then(res=>{
		  	if(res){
				page.getData();

				const status = obj.id && "修改" || "添加";
				
					page.unit.tipToast(status+"预警指标成功！",1);
		  	}else{
				
					page.unit.tipToast(status+"预警指标失败！",0);
		  	}
		  })
		});
		/**
		 * [description]
		 * 自定义短信模板钩子
		 */
		$("#j-mesageTemp").click(function(){
			$gMessage.show();
			_self.messageTab.loadTab(_self.messageCombox.config.data);
		});

		/**
		 * [description]
		 * 关闭都短信模板
		 */
		$("#j-back").click(function(){
			$gMessage.hide();
			_self.getAllAlarmModel(false,true);
		});

		/**
		 * [短信模板事件委托:用html标签的属性sing区分]
		 * @param  {[j-add]} ){		} [新增]
		 * @param  {[j-del]} ){		} [删去]
		 * @param  {[j-edit]} ){		} [编辑]
		 */
		$gMessage.on("click",".j-handle",function(){
			const $this = $(this);
			const sign = $this.attr("sign");
			const $messageTab = _self.messageTab.tab;


			switch(sign){
				case 'j-add':{
					
					const count = $messageTab.datagrid("getRows").length;

					 $messageTab.datagrid("appendRow", {
						  "model_name": "模板X",
        				  "model_text": "XXXXX",
        				  "id":"",
					 })
 					 .datagrid('selectRow', count)
					 .datagrid('beginEdit', count);
						
				}
				break;
				case 'j-del':{
					const ids =$.map($gMessage.find(".checkSingle:checked"),function(val){
						return {id:val.value};
					}) ;
					if(!ids.length){ return };
					api.deleteAlarmModel(ids).then(res=>{
											if(res){
												page.unit.tipToast("删去成功！",1);
												_self.getAllAlarmModel();
											}else{
												page.unit.tipToast("删去失败！",0);
											}
										});
				}
				break;
				case 'j-edit':{
				    const index = +$this.parent().attr("echo-data");
				    let sEditStr = "";

				    if(!$this.hasClass("s-editing")){
				  
				    	sEditStr =`<i class="fa fa-check"></i><span>提交</span>`;
				  		$this.addClass("s-editing");
				  		$messageTab.datagrid("beginEdit", index);
				  
				   }else{

				    	sEditStr =`<i class="fa fa-edit"></i><span>编辑</span>`;
						$this.removeClass("s-editing");
						$messageTab.datagrid("endEdit", index);
							
				    }
				   
				    $this.html(sEditStr);
					
				}
				break;
			}

		});

	}
}

/**
 * 页面类
 */
class Page{

	static tabOptStr = null ;
	static tabOptDel = null ;

	constructor(){

		this.btnBox = $("#btnBox");
		
		this.handle();
		this.getRoleRes().then(res=>{

			if(res){
				this.init();
			}
		})
	}

	getRoleRes(){

		return 	api.roleResource().then(res=>{
			
				if(res){

					const config = {
						add:["fa fa-plus","添加指标预警","s-moema"],
						del:["fa fa-trash","","s-sacnite"],
						mod:["fa fa-sliders","设置"],
					};

					const strArr = res.btn.map(val=>{

						const {btn_code,btn_flag} = val ;

						if(btn_code === "mod"){ 

							Page.tabOptDel = btn_flag === "1";
							
							const str = btn_flag === "1" && `<div class="tab-opt s-btn s-Naira" node-sign="${btn_code}">
																	<i class="${config[btn_code][0]}"></i>
																	<span>${config[btn_code][1]}</span>	
															</div>` || "";
							
							Page.tabOptStr = str;

							return "";
						 }else{

							return btn_flag === "1" && `<button class="s-btn  ${config[btn_code][2]}" sign="${btn_code}">
															<i class="${config[btn_code][0]}"></i>
															<span>${config[btn_code][1]}</span>
														</button>` || "";

						 };

						
					});

					
					this.btnBox.html(strArr.join(""));

					return true ;
			
				}else{
					page.unit.tipToast("获取功能权限出错！","0");

					return false ;
				}

		});
	}

	init(){
		this.table = new Table();
		this.unit = new Unit();
		this.modal = new SModal();
		this.addModal = new AddModal();
		this.inp = new SInp();
		this.search = new Search($("#u-search"),{
			serachCallback:(result)=>{
				
				this.table.loadTab(result);
			},
			closeCallback:(res)=>{
				
				this.table.loadTab(res);
			},
			keyField:"kpi_name",

		});

		this.delModal = new DelModal(this.unit);
		this.getData();
	}

	getData(){

		api.getAllKpiAlarm().then(res=>{

			if(!res){
				page.unit.tipToast("获取预警指标失败！",0);
			}else{
				this.search.data = res;
				this.table.loadTab(res);
			}

		});
	}
 

	handle(){
		const _self = this ;

		_self.btnBox.on("click",".s-btn",function(){

			const $this = $(this);
			const sign = $this.attr("sign");

			switch(sign){
				
				case"add":{
					_self.addModal.initRender();
					break;
				}
				case"del":{
						const ids =$.map($tableBox.find(".checkSingle:checked"),function(val){
								return {id:val.value};
						}) ;

						if(!ids.length){
							_self.unit.tipToast("选择要删除的！",2);
							return ;
						}
						DelModal.delArr = ids ;
						_self.modal.show(page.delModal.confirmMd);
					break;
				}
				default:
				break;
			}
		});


	}
}

const page = new Page();
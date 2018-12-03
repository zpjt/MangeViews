import {SComboTree ,Calendar,SCombobox} from "js/common/Unit.js";
import {MessageTab} from "./MessageTab.js";
import {api} from "api/kpiWarning.js";

 
 /**
 * 添加模态框
 */
class AddModal{

	constructor(config){

		const { unit, modal ,reloadTab} = config;
	  this.$addMBtn = $("#addMBtn");
	  this.$dimBox = $("#j-dimBox");
	  this.$addModal = $("#addModal");
	  
		this.unit = unit ;
		this.modal = modal ;
		this.reloadTab = reloadTab ;
	
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

		//短信模板表格
		this.messageTab = new MessageTab({
			unit: this.unit,
			getAllAlarmModel:(first,reloadCombox)=>{
				this.getAllAlarmModel(first,reloadCombox);
			}	
		});

		
	}

	setValue(node){

		this.$title.html("修改指标预警");
		const $addModal = this.$addModal;
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
		 
		 const ids = senduser.map(val=>val.send_user_id);

		 $addModal.find(".no-fill").removeClass("no-fill");

 		 model_id !== "null" ? this.messageCombox.setValue(model_id) : this.messageCombox.clearValue();

 		  this.userTreeCombo.setValue(ids);
		  this.modal.show($addModal);
	}

	initRender(){
		this.$title.html("添加指标预警");
		this.optId = "";

		this.modal.show(this.$addModal);
		this.zbTreeCombo.clearValue();
		this.orgTreeCombo.clearValue();
		this.userTreeCombo.clearValue();
		this.$dimBox.html(null);
	}

	GroupKpiByDim(kpi){

		const $addMBtn = this.$addMBtn;
		const $dimBox = this.$dimBox;

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
				this.unit.tipToast("指标分类失败！",0);
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
					}else{
						this.messageTab.loadTab(res);
					}
				}

			}else{
				this.unit.tipToast("短信模板获取失败！",0);
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
				this.unit.tipToast("指标获取失败！",0);
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
				this.unit.tipToast("科室获取失败！",0);
			}
		});

		api.dimtree().then(res=>{
			if(res){
				this.dimData = res.sub;
			}else{
				this.unit.tipToast("主题维度获取失败！",0);
			}
		});

		api.getLayoutUserTree().then(res=>{
			if(res){
				this.userTreeCombo = new SComboTree($("#userTreeCombobox"),{
					width:310,
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
				
					this.unit.tipToast("用户树获取失败！",0);

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


 			const user_id = window.jsp_config.user_id;

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
		 const $addModal = this.$addModal;
		 const $gMessage = $("#g-message");

		 $addModal.on("click",".combo-inp",function(e) {
			e.stopPropagation();
			const $this = $(this);
			requestAnimationFrame(function(){
				  $addModal.find(".combo-inp").not($this).parent().removeClass("active");
				  $addModal.find(".combo-inp").not($this).siblings().hide();

		    });
		});

		 $addModal.on("click",function() {
			requestAnimationFrame(function(){
				 const drop =  $addModal.find(".combo-drop ");
				 drop.parent().removeClass("active");
				 drop.hide();
				 
		    });
		});
		/**
		 * [description]
		 * 模态框确定按钮事件
		 */
		this.$addMBtn.click(function(){
			if($addModal.find('.no-fill').length){

				_self.unit.tipToast("请填写完整！",2);
				return ;
					
			}
		  const obj = _self.getAllParams();
		  _self.modal.close($addModal);
		  api.addKpiAlarm(obj).then(res=>{
		  	if(res){
				_self.reloadTab();

				const status = obj.id && "修改" || "添加";
				
					_self.unit.tipToast(status+"预警指标成功！",1);
		  	}else{
				
					_self.unit.tipToast(status+"预警指标失败！",0);
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

					if(_self.messageTab.tabBox.find("textarea").length){
						_self.unit.tipToast("请提交正在编辑的模板，再创建！",2);
						return ;
					}

					const count = $messageTab.datagrid("getRows").length;

					 $messageTab.datagrid("appendRow", {
						  "model_name": "",
        				  "model_text": "",
        				  "id":"",
					 })
 					 .datagrid('selectRow', count)
					 .datagrid('beginEdit', count);
						
				}
				break;
				case 'j-del':{
					
					
					const ids =$.map($gMessage.find(".checkSingle:checked"),function(val){
						return {id:val.value};
					});	

					if(!ids.length){ return };

					if(!ids[ids.length-1].id){
						ids.pop();
						const last = $messageTab.datagrid("getRows").length-1;
						$messageTab.datagrid("deleteRow", last);
					};



				
					api.deleteAlarmModel(ids).then(res=>{
								if(res){
									_self.unit.tipToast("删去成功！",1);
									_self.getAllAlarmModel();
								}else{
									_self.unit.tipToast("删去失败！",0);
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

				     	const editorText = $messageTab.datagrid("getEditor", {index,field:"model_text"});
				     	const editorName = $messageTab.datagrid("getEditor", {index,field:"model_name"});

				     	const curItem = $messageTab.datagrid("getRows")[index];

				     	const name = editorName.actions.getValue(editorName.target).trim();


				     	if(!editorText.actions.getValue(editorText.target).trim() || !name){
				     		_self.unit.tipToast("填写的内容不能为空！",0);
				     		return ;
				     	}

				     	const is_repeat = $messageTab.datagrid("getRows").some((val,oIndex)=>{
								return val.model_name === name && oIndex !== index;
				     	});

				     	if(is_repeat){
				     		_self.unit.tipToast("该模板名称已经存在！",2);
							return ;
				     	}

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


export {AddModal} ;
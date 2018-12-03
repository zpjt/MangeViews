import "css/kpiWarning.scss";
import {api} from "api/kpiWarning.js";
import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal,SInp,Search} from "js/common/Unit.js";
import {AddModal} from "./AddModal.js";
import {Table} from "./Table.js";


 


class DelModal{

	static delArr = null;

	constructor(config){
		const {unit,reloadTab,modal} = config ;
		this.unit = unit ;
		this.modal = modal ;
		this.reloadTab = reloadTab ;
		this.confirmBtn = $("#confirmBtn");
		this.confirmMd = $("#confirm-MView");
		this.handle();
	}


	del(ids){

		api.deleteAlarm(ids).then(res=>{
			if(res){
				this.unit.tipToast("删除预警指标成功！",1);
				this.reloadTab();
			}else{
				this.unit.tipToast("删除预警指标失败！",0);
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
			_self.modal.close(_self.confirmMd);
		});
	
	}
}



/**
 * 页面类
 */
class Page{

	static tabOptStr = "" ;
	static tabOptDel = "" ;

	constructor(){

		this.btnBox = $("#btnBox");
		
		this.handle();

		//权限按钮
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
					this.unit.tipToast("获取功能权限出错！","0");

					return false ;
				}

		});
	}

	init(){


		this.inp = new SInp();
		this.unit = new Unit();
		this.modal = new SModal();

		//设置模态框
		this.addModal = new AddModal({
			unit:this.unit,
			modal:this.modal,
			reloadTab:()=>{
				this.getData();
			},
		});

		this.table = new Table({
			setAddModalValue:(node)=>{
				this.addModal.setValue(node);
			},
			getRoleResStr:()=>{
				return {
					 tabOptStr: Page.tabOptStr ,
					 tabOptDel: Page.tabOptDel ,
				};
			}
		});	

		//搜索
	
		this.search = new Search($("#u-search"),{
			serachCallback:(result)=>{
				
				this.table.loadTab(result);
			},
			closeCallback:(res)=>{
				
				this.table.loadTab(res);
			},
			keyField:"kpi_name",

		});

		this.delModal = new DelModal({
			unit:this.unit,
			modal:this.modal,
			reloadTab:()=>{
				this.getData();
			},
		});
		this.getData();
	}

	getData(){

		api.getAllKpiAlarm().then(res=>{

			if(!res){
				this.unit.tipToast("获取预警指标失败！",0);
			}else{
				this.search.data = res;
				this.table.loadTab(res);
			}

		});
	}
 

	handle(){
		const _self = this ;

		const $tableBox = $("#tabBox");

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
						_self.modal.show(_self.delModal.confirmMd);
					break;
				}
				default:
				break;
			}
		});

	}
}

const page = new Page();
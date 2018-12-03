import "css/News.scss";
import {api} from "api/News.js";
import {Table} from "./Table.js";

import {Unit, SModal,DropMenu,Search} from "js/common/Unit.js"


class DelModal{

	static delArr = null;

	constructor(config){

		const {unit,reloadTab,modal} = config;

		this.unit = unit ;
		this.modal = modal ;
		this.reloadTab = reloadTab ;
		this.confirmBtn = $("#confirmBtn");
		this.confirmMd = $("#confirm-MView");
		this.handle();
	}


	del(ids){

		api.deleteAlarmHestory(ids).then(res=>{
				if(res){
					this.unit.tipToast("删去成功！",1);
					this.reloadTab();
				}else{
					this.unit.tipToast('删去失败！',0);
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

	constructor(){

		this.btnBox = $("#btnBox");
		
		this.handle();
		this.init();

	}

	init(){

		this.unit = new Unit();
		this.modal = new SModal();
		this.search = new Search($("#u-search"),{
			serachCallback:(result)=>{
				this.table.loadTab(result);
			},
			closeCallback:(res)=>{
				this.table.loadTab(res);
			},
			keyField:"kpi_name",
		});


		this.table = new Table({
			unit:this.unit,
			reloadTab:()=>{
				this.getData();
			}
		});

		this.levDrop = "";
		this.delModal = new DelModal({
			unit:this.unit,
			modal:this.modal,
			reloadTab:()=>{
				this.getData();
			}
		});
		this.levDropInit();
		this.getData();
	}

	levDropInit(){

		const _me = this;
		const warnLevArr = [
								{
									id:"0",
									text:"全部",
									icon:"fa fa-thermometer"
								},
								{
									id:"1",
									text:"一级",
									icon:"fa fa-thermometer-1"
								},

								{
									id:"2",
									text:"二级",
									icon:"fa fa-thermometer-2"
								},

								{
									id:"3",
									text:"三级",
									icon:"fa fa-thermometer-3"
								},
							];

	    this.dropMenu = new DropMenu($("#dropMenu"),{
			buttonIcon:"fa fa-thermometer-empty",
			buttonTxt:"预警级别选择",	
			itemH:40,
			data:warnLevArr,
			itemCallback:function($this){
				if($this.hasClass('active')){
					return;
				}else{
					$this.addClass('active').siblings().removeClass('active');
				}	
				const type = $this.attr("echo-data");

				switch(type){
					case "0":{
						_me.table.$table.datagrid("loadData",_me.tabData);
					}
					break;
					default:{
						_me.levFilter(type);
					}
					break;
				}	
			}
	    });
		
	}

	getData(){

		api.getAllKpiAlarm().then(res=>{

			if(!res){
				page.unit.tipToast("获取预警指标失败！",0);
			}else{
				this.tabData = res;
				this.search.data = res ;
				this.table.loadTab(res);
			}

		});
	}

	async levFilter(type){
			
		const filter = this.tabData.filter(val=>{

			return val.alarm_level === type ;
		});

		this.table.$table.datagrid('loadData',filter);
	}
 

	handle(){
		const _self = this ;
		const $tableBox = $("#tabBox");
		$("#j-readAll").click(function(){
			
			const ids =$.map($tableBox.find(".checkSingle:checked"),val=>{
				return {id:val.value};
			});
			if(!ids.length){ 
				_self.unit.tipToast("选择要标记的！",2);
				return 
			}

			_self.table.upAlarmSendStatus(ids);
			

		});

		this.btnBox.on("click",".s-btn",function(){

			const $this = $(this);
			const sign = $this.attr("sign");

			switch(sign){
				
				case"addView":{
				
					break;
				}
				case"delCata":{
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
			
		

		})

		$("#delBtn").click(function(){
			const ids =$.map($tableBox.find(".checkSingle:checked"),val=>{

				return {id:val.value};
			});

			if(!ids.length){
				_self.unit.tipToast("选择要删除的！",2);
				return ;
			}

			DelModal.delArr = ids ;
			_self.modal.show(page.delModal.confirmMd);

		});



	}
}

const page = new Page();
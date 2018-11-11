import "css/manageWarning.scss";
import {api} from "api/manageWarning.js";
import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp,Calendar,SCombobox,DropMenu,Search} from "js/common/Unit.js";

/**
 * @user_id ：用户id
 */
 const {user_id} = window.jsp_config;

/**
 * $tableBox description]:预警表格容器
 * [$table description]：预警表格，用来使用 easyui的datagrid
 */

 const $tableBox = $("#tabBox"),
 	   $menuDropBox = $("#menuBox"),
       $table = $("#tab");

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
			}),
			columns: [
				[{
					field: 'kpi_name',
					title: '指标名称',
					width: "15%",
					formatter:function(val){

						return `<span style="color:#00A0E9">${val}</span>` ;
					}
				}, 
				{
					field: 'warn_condition',
					title: '预警条件',
					align:"center",
					width: "10%",
					formatter:function(val,rowData){
						
						return `<b>${rowData.param_cond + " , " + rowData.param_value}</b>`;
					}
				}, 
				{
					field: 'alarm_level',
					title: '预警级别',
					align:"center",
					width: "12%",
					formatter:function(val){

						const levStr = ["","一级","二级","三级","四级"][ +val];

						const colorStr = ["","#00A0E9","#E96500","#E90010","red"][ +val];
						
						return `<b style="color:${colorStr}">${levStr}</b>`;
					}
				},
				{
					field: 'alarm_type_name',
					title: '提醒方式',
					width: "10%",
				},{
					field: 'model_text',
					title: '提醒内容',
					width: "24%",
				},{
					field: 'send_time',
					title: '发送时间',
					width: "12%",
				},
				{
					field: 'send_status',
					title: '状态',
					align:"center",
					width: "8%",
					formatter:function(val){

						const status = val === "1" && "运行中" || "关闭" ;
						const color = val === "1" && "#00A0E9" || "red" ;

						return `<b style="color:${color}">${status}</b>` ;
					}
				},
				]
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
		
		api.deleteAlarmHestory(ids).then(res=>{
				if(res){
					page.unit.tipToast("删去成功！",1);
					page.getData();
				}else{
					page.unit.tipToast('删去失败！',0);
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
 * 页面类
 */
class Page{

	static warnLevArr = [
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

	constructor(){

		this.btnBox = $("#btnBox");
		
		this.handle();
		this.init();

	}

	init(){
		this.table = new Table();
		this.unit = new Unit();
		this.modal = new SModal();
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
		this.levDrop = "";
		this.levDropInit();
		this.getData();
	}

	levDropInit(){

		const _me = this;

	    this.dropMenu = new DropMenu($("#dropMenu"),{
			buttonIcon:"fa fa-thermometer-empty",
			buttonTxt:"预警级别选择",	
			itemH:40,
			data:Page.warnLevArr,
			itemCallback:function($this){

				if($this.hasClass('active')){
					return;
				}else{
					$this.addClass('active').siblings().removeClass('active');
				}
				const type = $this.attr("echo-data");

				switch(type){
					case "0":{
						$table.datagrid("loadData",_me.tabData);
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
				this.search.data = res;
				this.table.loadTab(res);
			}

		});
	}

	async levFilter(type){
			
		const filter = this.tabData.filter(val=>{

			return val.alarm_level === type ;
		});

		$table.datagrid('loadData',filter);
	}
 

	handle(){
		const _self = this ;
		this.btnBox.on("click","#delBtn",function(){
			
			const ids =$.map($tableBox.find(".checkSingle:checked"),function(val){
							return {id:val.value};
					}) ;

			if(!ids.length){
				_self.unit.tipToast("选择要删除的！",2);
				return ;
			}
			DelModal.delArr = ids ;
			_self.modal.show(page.delModal.confirmMd);

		})


	}
}

const page = new Page();
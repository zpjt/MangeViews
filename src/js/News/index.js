import "css/News.scss";
import {api} from "api/News.js";
import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp,Calendar,SCombobox,DropMenu} from "js/common/Unit.js";

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
				[ 
				
				{
					field: 'model_text',
					title: '提醒内容',
					width: "32%",
				},{
					field: 'send_time',
					title: '预警时间',
					width: "20%",
				},
				{
					field: 'alarm_level',
					title: '预警级别',
					align:"center",
					width: "15%",
					formatter:function(val){

						const levStr = ["","一级","二级","三级","四级"][ +val];

						const colorStr = ["","#00A0E9","#E96500","#E90010","red"][ +val];
						
						return `<b style="color:${colorStr}">${levStr}</b>`;
					}
				},
				{
					field: 'send_status',
					title: '消息状态',
					align:"center",
					width: "12%",
					formatter:function(val){

						const status = val === "2" && "已读" || "未读" ;
						const color = val === "2" && "#00A0E9" || "red" ;

						return `<b style="color:${color}">${status}</b>` ;
					}
				},
				{
					field: 'optBtn',
					title: '操作',
					width: "15%",
					formatter: function(val, rowData,index) {
						
						let str = `
										<div class="tab-opt s-btn s-Naira" node-sign="read">
												<i class="fa fa-check"></i>
												<span>标为已读</span>	
										</div>
										
							   		`;

						return `
								<div class="tabBtnBox" echo-data='${index}' >
										${str}
								</div>
							`;
					}
				}
				]
			],
		};
    }

    loadTab(data){
		this.creatTab(data,$table,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
		/**
		 * [全选事件]
		 */
		$tableBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle($tableBox);
		});
		/**
		 * [消息操作]
		 * @param  {[read]} ){	        [标为已读]
		 * @return {[type]}             [description]
		 */
		$tableBox.on("click",".tab-opt",function(){

			const $this = $(this);

			const type = $this.attr("node-sign");
			switch(type){
				case "read":
					
				break;
				default:
				break;
			}
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
		
		this.handle();
		this.init();

	}

	init(){
		this.table = new Table();
		this.unit = new Unit();
		this.modal = new SModal();
		this.inp = new SInp();
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
				page.unit.tipToast("获取预警指标失败！");
			}else{
				this.tabData = res;
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
		$("#j-readAll").click(function(){
			

		});

		$("#delBtn").click(function(){
			const ids =$.map($tableBox.find(".checkSingle"),val=>{

				return {id:val.value};
			});

			if(!ids.length){

				return ;
			}

			api.deleteAlarmHestory(ids).then(res=>{
				if(res){
					page.unit.tipToast("删去成功！");
					page.getData();
				}else{
					page.unit.tipToast('删去失败！')
				}
			})

		});



	}
}

const page = new Page();
import {EasyUITab} from "js/common/EasyUITab.js";
import {api} from "api/News.js";



/**
 * 预警指标表格组件
 */
class Table extends EasyUITab{

	constructor(config)	{
       super();
       const {unit,reloadTab} = config;
       this.unit= unit ;
       this.reloadTab = reloadTab;
       this.$tableBox = $("#tabBox");
       this.$table = $("#tab");
       this.setPageHeight(this.$tableBox,96);
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
					field: 'kpi_name',
					title: '预警指标',
					width: "15%",
				},{
					field: 'model_text',
					title: '提醒内容',
					width: "32%",
				},{
					field: 'send_time',
					title: '预警时间',
					width: "12%",
				},
				{
					field: 'alarm_level',
					title: '预警级别',
					align:"center",
					width: "10%",
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
					width: "10%",
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

						const status = rowData.send_status !== "2" && "read" || "" ;
						
						let str = `
										<div class="tab-opt s-btn s-Naira" node-sign="${status}">
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
			this.creatTab(data,this.$table,this.tabConfig("id"));
    }

    upAlarmSendStatus(ids){

    	api.upAlarmSendStatus(ids).then(res=>{

				if(res){
					this.unit.tipToast("标记成功！",1);
					this.reloadTab();
				}else{
					this.unit.tipToast("标记失败！",0);
				}
		})	
    }

    handle(){
    	const _self = this ;
		/**
		 * [全选事件]
		 */
		 const $tableBox = this.$tableBox;
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
			const index = $this.parent().attr('echo-data');
			const node = _self.$table.datagrid('getRows')[index];

			switch(type){
				case "read":
					const ids = [{id:node.id}]	
					_self.upAlarmSendStatus(ids);
					
				break;
				default:
				break;
			}
		});
	
    }
}

export {Table} ;
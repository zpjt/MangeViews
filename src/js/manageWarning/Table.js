import {EasyUITab} from "js/common/EasyUITab.js";


class Table extends EasyUITab{

	constructor()	{
       super();
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
					title: '消息状态',
					align:"center",
					width: "8%",
					formatter:function(val){

						const status = val === "1" && "未读" || "已读" ;
						const color = val === "1" &&  "red" || "#00A0E9";

						return `<b style="color:${color}">${status}</b>` ;
					}
				},
				]
			],
		};
    }

    loadTab(data){
			this.creatTab(data,this.$table,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
		//复选框事件
		const $tableBox = this.$tableBox;
		$tableBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle($tableBox);
		});
	
    }
}


export {Table};
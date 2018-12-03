import {api} from "api/kpiWarning.js";
import {EasyUITab} from "js/common/EasyUITab.js";
/**
 * 预警指标表格组件
 */
class Table extends EasyUITab{

	constructor(config)	{
       super();
       const {setAddModalValue,getRoleResStr} = config;

       this.getRoleResStr = getRoleResStr();

       this.$tableBox = $("#tabBox");
       this.$table = $("#tab");
       this.setAddModalValue = setAddModalValue ;
       this.setPageHeight(this.$tableBox,96);
       this.handle();
    }

		tabConfig(idField){

			const getRoleResStr = this.getRoleResStr;

			return {
				idField:idField,
				tabId:"#tabBox",
				frozenColumns: this.frozenColumns(idField,{
					order:true,
					checkbox:getRoleResStr.tabOptDel
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
						align:"left",
						width: "12%",
						formatter: function(val, rowData,index) {
							
							let str = getRoleResStr.tabOptStr;

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
			this.creatTab(data,this.$table,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
    	const $tableBox = this.$tableBox;
			//复选框事件
			$tableBox.on("click",".checkSingle",function(){
				_self.checkSingleHandle($tableBox);
			});
		
		$tableBox.on("click",".tab-opt",function(){

			const type =  $(this).attr("node-sign");
			const par = $(this).parent(),
				  index = +par.attr("echo-data");

			
			switch(type){
				case "mod":{

					const node = _self.$table.datagrid("getData").rows[index];
					_self.setAddModalValue(node);

					break;
				}
				default:
					break;
			}
		});
    }
}

export {Table} ;
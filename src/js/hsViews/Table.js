
import {EasyUITab} from "js/common/EasyUITab.js";

class Table extends EasyUITab{

	constructor(config){

       super();
       const {getRoleResStr,restMSet,delMSet} = config;
       this.$tableBox = $("#tabBox");
       this.$table = $("#tab");
       this.setPageHeight(this.$tableBox,140);
       this.getRoleResStr = getRoleResStr();
       this.restMSet = restMSet;
       this.delMSet = delMSet;

       this.handle();
    }

	tabConfig(idField){
		const name = this.state === "layout" && "视图名称" || "图表名称" ;
		const getRoleResStr = this.getRoleResStr;
		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField,{
				checkbox: getRoleResStr.tabOptDel,
			}),
			columns: [
				[{
					field: 'layout_name',
					title: name,
					width: "35%",
				}, 
				{
					field: 'recycle_username',
					title: '删除人',
					width: "15%",
				}, 
				{
					field: 'updata_time',
					title: '删除时间',
					width: "25%",
				},
				
				{
					field: 'optBtn',
					title: '操作',
					align:"left",
					width: "20%",
					formatter: function(val, rowData,index) {
						
						let str = getRoleResStr.tabOptStr;

						return `
								<div class="tabBtnBox" echo-data='${rowData.layout_id}' >
										${str}
								</div>
							`;
					}
				}]
			],
		};
    }

    loadTab(data,type){
    	this.state = type ;
		this.creatTab(data,this.$table,this.tabConfig("layout_id"));
    }

    handle(){
    	const _self = this ;
    	const $tableBox = this.$tableBox;
		//复选框事件
		$tableBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle($tableBox);
		});
		//
		$tableBox.on("click",".tab-opt",function(){

			const type =  $(this).attr("node-sign");
			const par = $(this).parent(),
				  id = +par.attr("echo-data");

			
			switch(type){
				case "rest":{

					const node = _self.$table.datagrid("getData").rows.find(val=>{

						return val.layout_id === id ;
					});


					_self.restMSet(node.layout_name,node.par_id,id);

					break;
				}
				case "del":{

					const obj = {ids:[id]} ;
					_self.delMSet(obj);

					break;
					}
				default:
					break;
			}



		});
    }

}

export {Table} ;
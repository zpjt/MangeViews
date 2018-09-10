import "css/hsViews.scss";
import {api} from "api/hsViews.js";

import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit , SModal} from "js/common/Unit.js";


/* 
 jq 对象
 @$table：回收表格 
 */

 const $tableBox = $("#tabBox"),
       $table = $("#tab");


class Table extends EasyUITab{

	constructor(){
       super();
       this.setPageHeight($tableBox,140);
       this.handle();
    }

	tabConfig(idField){

		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField),
			columns: [
				[{
					field: 'layout_name',
					title: '视图名称',
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
					align:"center",
					width: "20%",
					formatter: function(val, rowData,index) {
						
						let str = `
										<div class="tab-opt s-btn s-Naira" node-sign="rest">
												<i class="fa fa-edit"></i>
												<span>还原</span>	
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="del">
												<i class="fa fa-trash"></i>	
												<span>删除</span>	
										</div>	
							   		`;

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

    loadTab(data){
		this.creatTab(data,$table,this.tabConfig("layout_id"));
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
				  id = par.attr("echo-data");

			
			switch(type){
				case "rest":

					break;
				case "del":{

					const obj = {ids:[id]} ;
					api.delLayout(obj).then(res=>{

						if(!res){
							alert("删除失败！");
						}else{
							alert("删除成功！");
						
						}

					});
					break;
					}
				default:
					break;
			}



		});
    }

}

class Page{

	state = "layout" ;

	constructor(){
		
		this.handle();
		this.init();

	}

	init(){
		this.table = new Table();
		this.search = new Unit();
		this.modal = new SModal();

		this.getData();
	}

	getData(){

		const  method = this.state === "layout" && "RecycleLayoutshow" || "RecycleChartshow";
		api[method]().then(res=>{

			if(!res){
				alert("出错！")
			}else{
				this.table.loadTab(res);
			}

		});
	}

	del(obj){

		const  method = this.state === "layout" && "delLayout" || "delchart";

		api[method](obj).then(res=>{
			if(!res){
				alert("删除失败！");
			}else{
				alert("删除成功！");
			}
		});
	}

	handle(){

	}
}

const page = new Page();
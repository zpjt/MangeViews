import { EasyUITab } from "js/common/EasyUITab.js";


class TableStyle extends EasyUITab{

	constructor(config){

       super();
 			const {getRoleResStr,tabCardInit,toEdit,$tabCard} = config;

       this.$tab = $("#tab");
       this.getRoleResStr = getRoleResStr();
       this.$ViewContainer = $("#section");
       this.tabCardInit = tabCardInit;
       this.toEdit = toEdit ;
       this.$treeTab =  $("#tree-tab");
       this.$tabContainer = $("#tabBox");

       this.$tabCard = $tabCard;

       this.setPageHeight(this.$ViewContainer,150);
       this.handle();
    }

		tabConfig(idField){

			const getRoleResStr = this.getRoleResStr;

			return {
				idField:idField,
				tabId:"#tabBox",
				frozenColumns: this.frozenColumns(idField,{
					disableCheck:function(rowData){
							return rowData.layout_type === 1  &&  rowData.sub.length ? true :false;
					},
					checkbox: getRoleResStr.cataOpt.del === "1" ,
				}),
				columns: [
					[{
						field: 'layout_name',
						title: '视图名称',
						width: "24%",
						formatter: function(val,rowData,index) {

							const {layout_icon_name,layout_type} = rowData;

							const arr = ["","node-catalogue",""];

							arr[2] = getRoleResStr.viewOpt.pre && "node-file" || "";


							return `<div class="tab-node ${arr[+rowData.layout_type]}" echo-data="${index}"><i class="sicon ${layout_icon_name}">&nbsp;</i><span>${val}</span></div>` ;
						}
					}, 
					{
						field: 'layout_type',
						title: '类型',
						width: "8%",
						formatter: function(val,rowData,index) {

							return `<span class="${val === 2 ? "tab-type" : "" }">${val===1 ? "分类" :"视图"}</span>`;
						}
					}, 
					{
						field: 'create_user_name',
						title: '创建人',
						width: "10%",
						
					},
					{
						field: 'released',
						title: '发布状态',
						width: "80",
						formatter: function(val,rowData,index) {

							return  rowData.layout_type === 2 && `<span class="${val=== 1 ? "tab-type" : "" }">${val===1 ? "已发布" :"未发布"}</span>` || "无";
						}
					},
					
					 {
						field: 'updata_time',
						title: '更新时间',
						width: "18%",
					},{
						field: 'optBtn',
						title: '操作',
						align:"left",
						width: "30%",
						formatter: function(val, rowData,index) {
							
							const  str= rowData.layout_type === 1 ?getRoleResStr.cataOpt.str 
							: getRoleResStr.viewOpt.str ;


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
		this.creatTab(data,this.$tab,this.tabConfig("layout_id"));
    }

    createTreeGrid(data){

    	const getRoleResStr = this.getRoleResStr;

			let order = 0;
			this.$treeTab.treegrid({
					animate: true,
					data: data,
					checkbox: getRoleResStr.cataOpt.del === "1" ,
					fitColumns: true,
					scrollbarSize: 0,
					rownumbers: false,
					idField: 'layout_id',
					treeField: 'layout_name',
					columns: [
						[{
							"field": "order",
							"title": "行号",
							"align": "center",
							"width": "60px",
							"formatter": function() {
								order++;
								return order;
							}
						}, {
							"field": "layout_name",
							"title": "视图名称",
							"align": "left",
							"width": "29%",
							"formatter": function(val, rowData) {

								const {layout_icon_name,layout_type} = rowData;

								const arr = ["","node-catalogue",""];

								arr[2] = getRoleResStr.viewOpt.pre && "node-file" || "";

								return `<div class="tab-node ${arr[+rowData.layout_type]}" echo-data="${rowData.layout_id}"><i class="sicon ${layout_icon_name}">&nbsp;</i><span>${val}</span></div>` ;
							}

						}, {
							field: 'layout_type',
							title: '类型',
							width: 80,
							formatter: function(val,rowData,index) {

								return `<span class="${val===2 ? "tab-type" : null }">${val===1 ? "分类" :"视图"}</span>`;
							}
						}, {
							field: 'released',
							title: '发布状态',
							width: "80",
							formatter: function(val,rowData,index) {

								return  rowData.layout_type === 2 && `<span class="${val=== 1 ? "tab-type" : "" }">${val===1 ? "已发布" :"未发布"}</span>` || "";
							}
						},{
							field: 'create_user_name',
							title: '创建人',
							width: 100,
						},
						 {
							field: 'updata_time',
							title: '更新时间',
							width: 180,
						},{
							field: 'optBtn',
							title: '操作',
							align:"left",
							width: "30%",
							formatter: function(val,rowData) {
								
								const  str= rowData.layout_type === 1 ?getRoleResStr.cataOpt.str 
							: getRoleResStr.viewOpt.str ;

								return `
										<div class="tabBtnBox" echo-data='${rowData.layout_id}' >
												${str}
										</div>
									`;
							}
						}]
					],
			});
		}

    changeTabcard($this){ // 进入目录

			const tabData = this.$tab.datagrid("getData").rows;


			const index = +$this.attr("echo-data");
			const childArr = tabData[index].sub;

			this.loadTab(childArr);
			const {layout_name,layout_id}=tabData[index];
			const lastData = this.$tabCard.data("menuArr");

			lastData.push({layout_name,index,layout_id});
			this.tabCardInit(lastData);

    }

    handle(){
    	const _self = this ;
    	const $tabContainer = this.$tabContainer ;
			//  进入目录
			$tabContainer.on("click",".node-catalogue",function(){
				const $this = $(this);
				_self.changeTabcard($this);

			});

				// 进入模板编辑器
			$tabContainer.on("click",".node-file",function(){
				_self.toEdit($(this),0);
			});

			$("#treeTabBox").on("click",".node-file",function(){
				_self.toEdit($(this),2);
			});

			//复选框事件
			$tabContainer.on("click",".checkSingle",function(){
				_self.checkSingleHandle($tabContainer);
			});
    }

}
export {TableStyle};
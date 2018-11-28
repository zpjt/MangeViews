import {EasyUITab} from "js/common/EasyUITab.js";
/**
 * 短信模板表格
 */
class MessageTab extends EasyUITab{

	constructor(config){

       super();
      const {unit,} = config ;
      this.unit = unit;
       this.tabBox = $("#g-tabMessageBox");
       this.tab = $("#g-tabMessage");
       this.handle();
    }

	tabConfig(idField){
		const $messageTab = this.tab; 
		return {
			idField:idField,
			tabId:"#g-tabMessageBox",
			frozenColumns: this.frozenColumns(idField,{
				order:false,
			}),
		    onAfterEdit:function(rowIndex, rowData, changes){

		    	
		    	const has_change = Object.keys(changes);
		    	if(!has_change.length){
					return ;
		    	}
				
				const method = rowData.id && "updateAlarmModel" || "addAlarmModel" ;
				api[method](rowData).then(res=>{
					if(res){
						method === "addAlarmModel" && page.addModal.getAllAlarmModel();
						page.unit.tipToast("短信添加成功！",1);
					}else{
						page.unit.tipToast("短信添加失败！",0);
					}
				});	
		    },
			columns: [
				[{
					field: 'model_name',
					title: '模板名称',
					editor:"text",
					width: "25%",
				}, 
				{
					field: 'model_text',
					title: '模板内容',
					width: "55%",
					editor:"textarea",
					formatter:function(val,rowData){
						
						return `<b>${val}</b>`;
					}
				}, 
				{
					field: 'optBtn',
					title: '操作',
					width: "16%",
					formatter: function(val,rowData,index) {

						const editStatus = !rowData.id ? "s-editing" : "";
						
						let str =  `
										<div class="j-handle s-btn s-Naira ${editStatus}" sign="j-edit">
												${ editStatus? `<i class="fa fa-check"></i><span>提交</span>` :`<i class="fa fa-edit"></i> <span>编辑</span>`}	
										</div>
							   		` ;

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
		this.creatTab(data,this.tab,this.tabConfig("id"));
    }

    handle(){
    	const _self = this ;
		//复选框事件
		this.tabBox.on("click",".checkSingle",function(){
			_self.checkSingleHandle(_self.tabBox);
		});
		//
		this.tabBox.on("click",".tab-opt",function(){

			const type =  $(this).attr("node-sign");
			const par = $(this).parent(),
				  index = +par.attr("echo-data");

			
			switch(type){
				case "set":{

					const node = $table.datagrid("getData").rows[index];
					page.addModal.setValue(node);

					break;
				}
				default:
					break;
			}

		});
    }
}
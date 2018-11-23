import "css/common/EasyTab.scss";


class EasyUITab {

	creatTab(data,$el,tabObj,callback){
		const self = this ;
		const obj = {
			data:data,
			idField:tabObj.idField,
			singleSelect:true,
			fitColumns:true,
			nowrap:false,
			selectOnCheck:true,
			frozenColumns:tabObj.frozenColumns,
			columns:tabObj.columns,
			onLoadSuccess:function(){
				const $checkAll = $el.parent().find(".checkAll");
				$checkAll.attr("checkedStatus","off");
				callback ? callback():null ;
				$checkAll.unbind();
				$checkAll.on("click",function(events){
					self.checkAll(events,tabObj.tabId);
				});
			},
		};

		if(tabObj.onAfterEdit){
			obj.onAfterEdit = tabObj.onAfterEdit;
		}


		$el.datagrid(obj);
	}
	checkAll(events,tabId){
		let $tragetEl = $(events.target);
		const status = $tragetEl.attr("checkedStatus");
		const input_status = status ==="off" && true || false ;
		$(tabId + " .checkSingle").prop("checked",input_status ) ;
		$tragetEl.attr("checkedStatus",(status ==="off" && "on" || "off"));
	}
	checkSingleHandle($el){

		let checkboxAll = $el.find(".checkAll");
		let checkbox = $el.find(".checkSingle");
		let isAll =  checkbox.not(":checked").length && "off" || "on";
		checkboxAll.attr("checkedStatus",isAll);
	}
	setPageHeight($tabEl,lessH){
		
		//高度设置
		const min_H = $(window).height();
		$tabEl.css("height", min_H - lessH);

	}
	frozenColumns(field,obj){

		const defaultObj = {
			disableCheck:null,
			order:false,
			checkbox:true,
		};

		const config = Object.assign({},defaultObj,obj);
		const {disableCheck,order,checkbox} = config ;
		const checkboxAll = `<div class="tab-checkbox"><span  name="tab_node" checkedStatus="off"  class="tab_node checkAll fa fa-square-o fa-lg"></span></div>`;
		

		let columns = [] ;
		if(checkbox){
					const checkboxObj = {
							field: 'custom_checkbox',
							title: checkboxAll,
							align: "center",
							width: 40,
							formatter: function(value, rowData, rowIndex) {

								const  status = disableCheck && disableCheck(rowData) ? "dis-check" :"checkSingle" ;

								const disable = status === "dis-check" && "disabled" || "" ;
								const tip = status === "dis-check" && "禁止删除,该文件夹里包含内容！" || "" ;


								return  `<div class="tab-checkbox">
												<input type="checkbox"
												       name="tab_node" 
												       ${disable} 
												       class="tab_node ${status}" 
												       value="${field=="无" ? index :rowData[field]}" 
												       title="${tip}" />
												<label for="tab_node" class="fa fa-square-o fa-lg"></label></div>`;
							}
					}		
			columns.push(checkboxObj);
		}
		if(order){
			columns.push({
				field: 'custom_order',
					title: "序号",
					align: "center",
					width: 48,
					formatter: function(value, rowData, rowIndex) {

						return  rowIndex + 1;
					}
			})
		}


		
		return [columns ] ;
	}

}

export {EasyUITab};
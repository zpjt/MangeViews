import "css/common/EasyTab.scss";


class EasyUITab {

	creatTab(data,$el,tabObj,callback){
		var self = this ;
		$el.datagrid({
			data:data,
			idField:tabObj.idField,
			singleSelect:true,
			fitColumns:true,
			nowrap:false,
			selectOnCheck:true,
			frozenColumns:tabObj.frozenColumns,
			columns:tabObj.columns,
			onLoadSuccess:function(){
				console.log($el.datagrid("options"));
				const $checkAll = $el.parent().find(".checkAll");
				$checkAll.attr("checkedStatus","off");
				callback ? callback():null ;
				$checkAll.on("click",function(events){
					self.checkAll(events,tabObj.tabId);
				});
			},
		});
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
	frozenColumns(field,color="#0092DC"){

		const checkboxAll = `<div class="tab-checkbox"><span  name="tab_node" checkedStatus="off"  class="tab_node checkAll fa fa-square-o fa-lg"></span></div>`;

		return [
				[{
					field: 'order_td',
					title: checkboxAll,
					align: "center",
					width: "4%",
					formatter: function(value, rowData, rowIndex) {



						const  status = rowData.layout_type === 1  &&  rowData.sub.length ? "dis-check" :"checkSingle" ;

						const disable = status === "dis-check" && "disabled" || "" ;

						const tip = status === "dis-check" && "禁止选择" || "" ;


						return  `<div class="tab-checkbox"><input type="checkbox" name="tab_node" ${disable} class="tab_node ${status}" value="${field=="无" ? index :rowData[field]}" title="${tip}" /><label for="tab_node" class="fa fa-square-o fa-lg"></label></div>`;;
					}
				}]
			] ;
	}

}

export {EasyUITab};
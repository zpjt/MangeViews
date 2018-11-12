import "css/hsViews.scss";
import {api} from "api/hsViews.js";

import {EasyUITab} from "js/common/EasyUITab.js";
import {Unit, SModal, SComboTree ,SInp ,Search} from "js/common/Unit.js";


/* 
 jq 对象
 @$table：回收表格 
 */

 const $tableBox = $("#tabBox"),
       $table = $("#tab"),
       $restModal = $("#restModal");


class Table extends EasyUITab{

	constructor(unit){
       super();
       this.setPageHeight($tableBox,140);
       this.unit = unit ;
       this.handle();
    }

	tabConfig(idField){
		const name = this.state === "layout" && "视图名称" || "图表名称" ;
		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField,{
				checkbox: Page.tabOptDel,
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
					align:"center",
					width: "20%",
					formatter: function(val, rowData,index) {
						
						let str = Page.tabOptStr;

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
				  id = +par.attr("echo-data");

			
			switch(type){
				case "rest":{

					const node = $table.datagrid("getData").rows.find(val=>{

						return val.layout_id === id ;
					});


					page.restModal.setValue(node.layout_name,node.par_id,id);

					break;
				}
				case "del":{

					const obj = {ids:[id]} ;
					page.delModal.del(obj);

					break;
					}
				default:
					break;
			}



		});
    }

}

class DelModal{

	static delArr = [];

	constructor(unit){

		this.unit = unit ;
		this.confirmBtn = $("#confirmBtn");
		this.confirmMd = $("#confirm-MView");
		this.handle();
	}

	del(obj){

		const  method = Page.state === "layout" && "delLayout" || "delchart";
		api[method](obj).then(res=>{
			if(!res){
				this.unit.tipToast("删除失败！",0);
			}else{
				this.unit.tipToast("删除成功！",1);
				page.getData();
			}
			DelModal.delArr = null ;
		});
	}


	handle(){
		
		const _self = this;
		// 删除模态框确认按钮
		this.confirmBtn.click(function(){

			const obj = {ids:DelModal.delArr};
			_self.del(obj);
			page.modal.close(_self.confirmMd);
		})
	
	}
}

class RestModal{

	constructor(unit,modal){
		 this.unit = unit ;
		 this.modal = modal ;
		this.init();
		this.handle();
	}

	init(){
		this.getAllLayoutPar();
	}

	setValue(name,par_id,id){

		this.optId = id ;
		$("#name").val(name);
		this.restCombo.tree.setSingleValue(par_id);
		page.modal.show($restModal);
	}

	getAllLayoutPar(){

		api.getAllLayoutPar().then(res=>{

			if(res){

				this.restCombo = new SComboTree($("#parName"),{
					width:300,
					treeConfig:{
						data:res.sub,
						"textField":"layout_name",
						"idField":"layout_id",
						"childIcon":"fa fa-folder-open-o",
						"childrenField":"sub",
						"parClick":true,
						"judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
								return val.sub.length > 0 ;
						 }
					}
				});
				
			}else{

				this.unit.tipToast("获取目录出错！",0);
			}
		})
		
	}

	handle(){

		const _self = this ;
		const unit = this.unit;
		const modal = this.modla;
		
		$("#addMBtn").click(function(){
			
			const par_id = _self.restCombo.box.find(".combo-value").val(),
				  name = $("#name").val();

			if(!name || !par_id){
				unit.tipToast("请填写完整！",2);
				return ;
			}
		    api.checkName({par_id,name}).then(res=>{

		   	  if(res){
				const id = _self.optId;
				api.RecycleLayout({id,par_id}).then(res=>{
					
					if(res){
						unit.tipToast("还原成功！",1);
						page.getData();

						modal.hide($restModal);

					}else{
						unit.tipToast("还原失败！",0);
					}
				});

		   	  }else{
		   	  	unit.tipToast("此目录下已经存在该名称！",2);
		   	  }
		   })

			

		});
	}
}

class Page{

	static state = "layout" ;
	static tabOptStr = null ;
	static tabOptDel = null ;

	constructor(){
		this.btnBox = $("#btnBox")
		this.unit = new Unit();
		this.handle();

		this.getRoleRes().then(res=>{

			if(res){
				this.init();
			}

		});
	}

	init(){

		const unit = this.unit;
		this.table = new Table(unit);
		
		this.modal = new SModal();
		this.restModal = new RestModal(unit);
		this.delModal = new DelModal(unit);
		this.inp = new SInp();
		this.search = new Search($("#u-search"),{
			serachCallback:(result)=>{
				
				this.table.loadTab(result,Page.state);
			},
			closeCallback:(res)=>{
				
				this.table.loadTab(res,Page.state);
			},
			keyField:"layout_name",

		});
		this.getData();
	}
	getRoleRes(){

		return 	api.roleResource().then(res=>{
			
				if(res){

					const config = {
						rest:["fa fa-edit","还原"],
						del:["fa fa-trash","删除"]
					};

					const strArr = res.btn.map(val=>{

						const {btn_code,btn_flag} = val ;

						if(btn_code === "del"){ 
							Page.tabOptDel = btn_flag === "1";
							
							const str = btn_flag === "1" && `<button class="s-btn s-sacnite "  sign="${btn_code}">
												<i class="fa fa-trash"></i>
										</button>` || "";
							this.btnBox.html(str);

						 };

						return btn_flag === "1" && `<div class="tab-opt s-btn s-Naira" node-sign="${btn_code}">
											<i class="${config[btn_code][0]}"></i>
												<span>${config[btn_code][1]}</span>	
								</div>` || "";
					});

					Page.tabOptStr = strArr.join("");


					return true ;
			
				}else{
					page.unit.tipToast("获取功能权限出错！","0");

					return false ;
				}

		});
	}
	getData(){

		const  method = Page.state === "layout" && "RecycleLayoutshow" || "RecycleChartshow";
		api[method]().then(res=>{

			if(!res){
				this.unit.tipToast("出错！",0);
			}else{
				this.search.data = res ;
				this.table.loadTab(res,Page.state);
			}

		});
	}


	handle(){
		const _self = this ;

		// 切换 视图与图表
		/*$("#j-tab").on("click",".m-tab-item",function(){
			const $this = $(this);
			const type = $this.index();

			if($this.hasClass("active")){
					return ;			
			}

			$this.addClass("active").siblings().removeClass("active");
			Page.state = type === 0 ? "layout" : "chart" ;
			_self.getData();

		});*/

		

		this.btnBox.on("click",".s-btn",function(){

			const $this = $(this);
			const sign = $this.attr("sign");

			switch(sign){
				case"del":{
					const ids =$.map($tableBox.find(".checkSingle:checked"),function(val){
						return +val.value;
					}) ;

					if(!ids.length){
						_self.unit.tipToast("请选择要删除的！",2);
						return ;
					}

					DelModal.delArr = ids ;
					_self.modal.show(_self.delModal.confirmMd);
					break;
				}
				default:
				break;
			}
		});


	}
}

const page = new Page();
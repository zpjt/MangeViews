import "css/hsViews.scss";
import {api} from "api/hsViews.js";
import {DelModal,RestModal} from "./OptModal.js";
import {Table} from "./Table.js";

import {Unit, SModal,SInp ,Search} from "js/common/Unit.js";




class Page{

	static state = "layout" ;
	static tabOptStr = null ;
	static tabOptDel = null ;

	constructor(){
		this.btnBox = $("#btnBox")
	
		this.handle();

		this.getRoleRes().then(res=>{

			if(res){
				this.init();
			}

		});
	}

	init(){


		this.unit = new Unit();
		this.modal = new SModal();
		this.inp = new SInp();
	
		this.restModal = new RestModal({
			unit:this.unit,
			modal:this.modal,
			reloadTab:()=>{
				this.getData();
			}
		});

		this.delModal = new DelModal({
			unit:this.unit,
			modal:this.modal,
			reloadTab:()=>{
				this.getData();
			}
		});

		this.table = new Table({
      restMSet:(name,par_id,id)=>{
				this.restModal.setValue(name,par_id,id);
			},
			delMSet:(obj)=>{
					this.delModal.del(obj);
			},
			getRoleResStr:()=>{
				return {
					 tabOptStr: Page.tabOptStr ,
					 tabOptDel: Page.tabOptDel ,
				};
			}
		});


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
		const $tableBox = $("#tabBox");

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
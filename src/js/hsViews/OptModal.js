import {api} from "api/hsViews.js";
import {SComboTree} from "js/common/Unit.js";


class DelModal{

	static delArr = [];

	constructor(config){

		const {unit,reloadTab,modal} = config ;
		this.unit = unit ;
		this.modal = modal ;
		this.reloadTab = reloadTab ;

		this.confirmBtn = $("#confirmBtn");
		this.confirmMd = $("#confirm-MView");
		this.handle();
	}

	del(obj){

		//const  method = Page.state === "layout" && "delLayout" || "delchart";
		const  method = "delLayout";

		api[method](obj).then(res=>{
			if(!res){
				this.unit.tipToast("删除失败！",0);
			}else{
				this.unit.tipToast("删除成功！",1);
				this.reloadTab();
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
			_self.modal.close(_self.confirmMd);
		})
	
	}
}

class RestModal{

	constructor(config){

		const {unit,reloadTab,modal} = config ;
	
		this.unit = unit ;
		this.modal = modal ;
		this.reloadTab = reloadTab ;

		this.$restModal = $("#restModal");

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
		this.modal.show(this.$restModal);
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
		
		$("#addMBtn").click(function(){
			
			const par_id = _self.restCombo.box.find(".combo-value").val(),
				  name = $("#name").val();

			if(!name || !par_id){
				_self.unit.tipToast("请填写完整！",2);
				return ;
			}
		    api.checkName({par_id,name}).then(res=>{

		   	  if(res){
				const id = _self.optId;
				api.RecycleLayout({id,par_id}).then(res=>{
					
					if(res){
						_self.unit.tipToast("还原成功！",1);
						_self.reloadTab();
						_self.modal.close(_self.$restModal);

					}else{
						_self.unit.tipToast("还原失败！",0);
					}
				});

		   	  }else{
		   	  	_self.unit.tipToast("此目录下已经存在该名称！",2);
		   	  }
		   })

			

		});
	}
}

export {RestModal,DelModal} ;

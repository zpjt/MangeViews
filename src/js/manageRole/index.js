import "css/manageRole.scss";
import {api} from "api/manageRole.js";

import {Unit, SCombobox } from "js/common/Unit.js";

class Table {

	constructor(config){

	   const {unit} = config;
	   this.tabBox = $("#tabBox");
	
	   this.unit = unit;
	   this.data = null ;
       this.handle();
       this.init();
    }

    init(){

    	this.renderTemplate();
		
		

    }


    async roleSelArr(role_id){
 
   	    const obj = this.data ;

    	const selArr = await api.getPreams(role_id);	
    	if(!selArr.data){
    		this.unit.tipToast("获取角色功能出错！",0);
			return ;
    	};

		const data = selArr.data;

    	const str = obj.map(val=>{

		 	const inpStatus ='checked="checked"';

		 	const total = val.operations.length ;

		 	let count = 0 ;
				
		 	const funItemsStr = val.operations.map(val=>{

					const index = data.findIndex(oVal=>oVal.id === val.id);
				
					

					if(index>-1){
						data.splice(index,1);
						count ++ ;	
					}


		 			return `
						<div class="funBtn">
								<span class="s-checkbox">
										<input type="checkbox" ${index>-1&&inpStatus||""} class="child-checkbox" value="${val.id}"><label class="fa fa-square-o"></label>
								</span>
								<b>${val.btn_Name}</b>
						</div>
						`;
		 	});

		 	const parStatus = count > 0 && count < total && "has-chec" || "";

			return `<tr>
						<td width="30%">
							<p>
								<span class="s-checkbox">
										<input type="checkbox" ${count === total && inpStatus||"" } class="par-checkbox" ><label class="fa fa-square-o ${parStatus}"></label>
								</span>
								<b>${val.title}</b>
							</p>
						</td>
						<td width="70%">
							<div>
								${funItemsStr.join("")}
							</div>
						</td>
					</tr>`;

    	 });

    	this.tabBox.html(str.join(""));

    }

    renderTemplate(){

    	api.getAllPreams().then(res=>{

    		if(res.data){
		
				this.data = res.data[0].sub;
				this.roleSelArr(window.jsp_config.role_id);
    		}else{
    			this.unit.tipToast("获取功能按钮出错！",0);
    		}
    	});
    }

    handle(){
    	this.tabBox.on("click",".par-checkbox",function(){
    		const $this= $(this);
    		const status = $this.prop("checked");
			const childTd = $this.closest("td").siblings("td");
			childTd.find(".child-checkbox").prop("checked",status);

			$this.siblings("label").removeClass("has-chec");
    	});	

    	this.tabBox.on("click",".child-checkbox",function(){
    		
    		const $this= $(this);
    		const par = $this.closest("td");

    		const childEl = par.find(".child-checkbox");
			const notCheckCount = childEl.not(":checked").length;

			const parTd = par.siblings("td");

			if(notCheckCount > 0 && notCheckCount < childEl.length){
				
				parTd.find("label").addClass("has-chec");
				parTd.find(".par-checkbox").prop("checked",false);
			
			}else{
				parTd.find("label").removeClass("has-chec");
				parTd.find(".par-checkbox").prop("checked",!notCheckCount);
			}
			

    	});	


    }

}


class Page{


	constructor(){
		this.unit = new Unit();
		this.roleMd = $("#roleMd");
	    this.btnBox= $("#btnBox");
		this.handle();
		this.init();

	}

	init(){

		const unit = this.unit;
		this.table = new Table({
			unit
		});
		
		this.getAllRole();

	}

	  getAllRole(){

    	api.sel_role().then(res=>{

    		const data = res.data;

    		console.log(data);

    		if(data){
				const _me = this;

				this.roleCombo = new SCombobox($("#roleCombo"),{
					data:data,
					defaultVal:[data[0].id],
					textField:"role_name",
					clickCallback:function(node){
						_me.table.roleSelArr(node.id);
					}
				});
				
    		}else{
    			this.unit.tipToast("获取角色出错！",0);
    		}
    	})
    }

	setLimt(){

		const menu_id = $.map(this.table.tabBox.find(".child-checkbox:checked"),function(val){
			return val.value;
		});

		const id = this.roleCombo.getValue();

		api.savePreams({menu_id,id}).then(res=>{

			let str = "" ,
				status = "";

			if(res){
				str = "设置成功！"	
				status = 1 ;
			}else{
				str = "设置失败！"					
				status = 0 ;
			};

			this.unit.tipToast(str,status);
		});
	}
	handle(){

		const _self= this;

		this.btnBox.on("click",".s-btn",function(){

			const $this= $(this);
			const id = $this.prop("id");

			switch(id){
				case "j-set":{

					_self.setLimt();
					break;
				}
				default:
				break;
			}
			




		});

	}
}

const page = new Page();
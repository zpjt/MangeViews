import "css/manageRole.scss";
import {api} from "api/manageRole.js";

import {Unit, SModal, SCombobox ,SInp ,Search} from "js/common/Unit.js";

class Table {

	constructor(config){

	    const {unit} = config;

	   this.tabBox = $("#tabBox");

	   this.unit = unit;
       this.handle();
       this.init();
    }

    init(){
		
		const str = this.templateStr();
		this.loadTab(str);

		const data = [
			{
				id:"1",
				text:"系统管理员"
			},
			{
				id:"2",
				text:"部门管理员"
			},
			{
				id:"3",
				text:"质能科室"
			},
		]

		this.roleCombo = new SCombobox($("#roleCombo"),{
			data:data,
			defaultVal:"1",
			clickCallback:function(node){
				console.log(node);
			}
		});

    }

    loadTab(data){
		

		 this.tabBox.html(data);

    }
    templateStr(){

    	 const obj =[
	    	 {
	    	 	text:" 视图管理",
	    	 	children:[
							{
								text:"创建视图分类",
								limit:true,
							},
							{
								text:"修改分类图标",
								limit:true,
							},
							{
								text:"重命名分类",
								limit:true,
							},
							{
								text:"删除分类",
								limit:true,
							},
							{
								text:"创建视图",
								limit:true,
							},
							{
								text:"删除视图",
								limit:true,
							},
							{
								text:"预览视图",
								limit:true,
							},
							{
								text:"发布视图",
								limit:true,
							},
							{
								text:"复制视图",
								limit:true,
							},
							{
								text:"修改视图图标",
								limit:true,
							},
							{
								text:"重命名视图",
								limit:true,
							},
		    			]
	    	 },
	    	 {
	    	 	text:"视图回收站",
	    	 	children:[
							{
								text:"还原",
								limit:true,
							},
							{
								text:"删除",
								limit:true,
							},
		    			]
	    	 },
	    	 {
	    	 	text:"预警设置",
	    	 	children:[
							{
								text:"新增",
								limit:true,
							},
							{
								text:"设置预警",
								limit:true,
							},
							{
								text:"删除",
								limit:true,
							},
		    			]
	    	 },

    	 ];



    	 const str = obj.map(val=>{

    	 	const inpStatus ='checked="checked"';
			
    	 	const funItemsStr = val.children.map(val=>{
    	 		return `
						<div class="funBtn">
								<span class="s-checkbox">
										<input type="checkbox" ${val.limit && inpStatus || ""} class="child-checkbox" ><label class="fa fa-square-o"></label>
								</span>
								<b>${val.text}</b>
						</div>
						`;
    	 	});

			return `<tr>
						<td width="30%">
							<p>
								<span class="s-checkbox">
										<input type="checkbox" ${inpStatus} class="par-checkbox" ><label class="fa fa-square-o"></label>
								</span>
								<b>${val.text}</b>
							</p>
						</td>
						<td width="70%">
							<div>
								${funItemsStr.join("")}
							</div>
						</td>
					</tr>`;


    	 });
		
    	return str.join("");
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
		this.modal = new SModal();
		this.roleMd = $("#roleMd");
		this.handle();
		this.init();

	}

	init(){

		const unit = this.unit;
		this.table = new Table({
			unit
		});
		
		this.modal = new SModal();
		this.inp = new SInp();
	
		this.getData();
	}

	getData(){

		
	}

	del(){

	
	}

	handle(){

		const _self= this;
		$("#j-addBtn").click(function(){

			_self.modal.show(_self.roleMd);

		});
		
		$("#j-set").click(function(){
				
			

		});

	}
}

const page = new Page();
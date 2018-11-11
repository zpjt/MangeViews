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

		 	const total = val.children.length ;

		 	let count = 0 ;
				
		 	const funItemsStr = val.children.map(val=>{
					const index = data.findIndex(oVal=>oVal.id === val.id);
					data.splice(index,1);
					
					index>-1 &&　count ++ ;	


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

    	this.tabBox.html(str.join(""));

    }

    renderTemplate(){

		const obj =[
	    	 {
	    	 	text:" 视图管理",
	    	 	children:[
							{
					            "id": 103,
					            "btn_Code": "addView",
					            "btn_Name": "创建视图",
					            "btn_title": "创建视图",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 98,
					            "btn_Code": "modView",
					            "btn_Name": "视图编辑",
					            "btn_title": "视图编辑",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					         {
					            "id": 102,
					            "btn_Code": "preView",
					            "btn_Name": "预览视图",
					            "btn_title": "预览视图",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 101,
					            "btn_Code": "copyView",
					            "btn_Name": "复制视图",
					            "btn_title": "复制视图",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 99,
					            "btn_Code": "renameView",
					            "btn_Name": "重命名视图",
					            "btn_title": "重命名视图",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 110,
					            "btn_Code": "addCata",
					            "btn_Name": "创建分类",
					            "btn_title": "创建分类",
					            "menu_id": 9020,
					            "type": 1,
					            "status": 1
					        },
					        {
					            "id": 106,
					            "btn_Code": "delCata",
					            "btn_Name": "删除分类",
					            "btn_title": "删除分类",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 111,
					            "btn_Code": "issueView",
					            "btn_Name": "发布视图",
					            "btn_title": "发布视图",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 100,
					            "btn_Code": "modViewIcon",
					            "btn_Name": "修改视图图标",
					            "btn_title": "修改视图图标",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					         {   "id": 95,
					            "btn_Code": "modCataIcon",
					            "btn_Name": "修改分类图标",
					            "btn_title": "修改分类图标",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 104,
					            "btn_Code": "delView",
					            "btn_Name": "删除视图",
					            "btn_title": "删除视图",
					            "menu_id": 9020,
					            "type": 1,
					            "status": 1
					        },
					        {
					            "id": 105,
					            "btn_Code": "renameCata",
					            "btn_Name": "重命名分类",
					            "btn_title": "重命名分类",
					            "menu_id": 9020,
					            "type": 2,
					            "status": 1
					        },
		    			]
	    	 },
	    	 {
	    	 	text:"视图回收站",
	    	 	children:[
							{
					            "id": 109,
					            "btn_Code": "del",
					            "btn_Name": "删除",
					            "btn_title": "删除",
					            "menu_id": 9030,
					            "type": 2,
					            "status": 1
					        },
					        
					        {
					            "id": 97,
					            "btn_Code": "rest",
					            "btn_Name": "还原",
					            "btn_title": "还原",
					            "menu_id": 9030,
					            "type": 2,
					            "status": 1
					        },
		    			]
	    	 },
	    	 {
	    	 	text:"预警设置",
	    	 	children:[
							{
					            "id": 107,
					            "btn_Code": "mod",
					            "btn_Name": "设置预警",
					            "btn_title": "新增预警",
					            "menu_id": 9070,
					            "type": 2,
					            "status": 1
					        },
					        {
					            "id": 108,
					            "btn_Code": "add",
					            "btn_Name": "新增预警",
					            "btn_title": "新增预警",
					            "menu_id": 9070,
					            "type": 2,
					            "status": 1
					        },
							 {
					            "id": 109,
					            "btn_Code": "del",
					            "btn_Name": "删除预警",
					            "btn_title": "删除预警",
					            "menu_id": 9070,
					            "type": 2,
					            "status": 1
					        }
		    			]
	    	 },
		];
		this.data = obj ;
		this.roleSelArr(window.jsp_config.role_id);
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
		const data = [
			{
				id:"70000",
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

		const _me = this;

		this.roleCombo = new SCombobox($("#roleCombo"),{
			data:data,
			defaultVal:data[0].id,
			clickCallback:function(node){
				_me.table.roleSelArr(node.id);
			}
		});
	}

	setLimt(){

		const s = $.map(this.table.tabBox.find(".child-checkbox:checked"),function(val){
			return val.value;
		}).join(",");

		const role_id = this.roleCombo.getValue();

		api.savePreams({s,role_id}).then(res=>{

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
import "css/szViews.scss";
import "css/common/dropMenu.scss";
import "css/common/Svg.scss";


import { EasyUITab } from "js/common/EasyUITab.js";
import {Unit,SCombobox,SModal,Calendar,SComboTree,Tree,SInp,DropMenu ,Search} from "js/common/Unit.js";
import {api} from "api/szViews.js";




const {user_id,role_id} = window.jsp_config;

//工具类实例
const UnitOption = new Unit();

/*
  JQ对象
*/

// 表格视图相关dom
const $tab = $("#tab"),
	  $ViewContainer = $("#section"),
	  $treeTab = $("#tree-tab"),
	  $tabContainer = $("#tabBox"),
	  $styleView = $(".style-view"),
	  $catalogueBox = $("#catalogueBox"),
	  $iconBox = $("#iconBox"),
	  $tabCard=$("#tabCard");

//
const $menuBox=$("#menuBox"),
	  $addMBtn=$("#addMBtn"),
	  $confirmBtn=$("#confirmBtn"),
	  $issueBtn=$("#issueBtn"),
	  $svg_statusBox=$("#statusBox"),
	  $tipText=$("#tipText"),
	  $confirmMView=$("#confirm-MView"),
	  $issueMView=$("#issue-MView"),
	  $org = $("#orgTree"),
	  $addMView=$("#add-MView");

const $inpName = $("#name"),
	  $parName = $("#parName");



class TableStyle extends EasyUITab{

	constructor(){
       super();
       this.setPageHeight($ViewContainer,150);
       this.handle();
    }

	tabConfig(idField){

		console.log(Page.cataOpt.del);

		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField,{
				disableCheck:function(rowData){
						return rowData.layout_type === 1  &&  rowData.sub.length ? true :false;
				},
				checkbox: Page.cataOpt.del === "1" ,
			}),
			columns: [
				[{
					field: 'layout_name',
					title: '视图名称',
					width: "24%",
					formatter: function(val,rowData,index) {

						const {layout_icon_name,layout_type} = rowData;

						const arr = ["","node-catalogue",""];
						arr[2] = Page.viewOpt.pre && "node-file" || "";


						return `<div class="tab-node ${arr[+rowData.layout_type]}" echo-data="${index}"><i class="sicon ${layout_icon_name}">&nbsp;</i><span>${val}</span></div>` ;
					}
				}, 
				{
					field: 'layout_type',
					title: '类型',
					width: "10%",
					formatter: function(val,rowData,index) {

						return `<span class="${val===2 ? "tab-type" : null }">${val===1 ? "分类" :"视图"}</span>`;
					}
				}, 
				{
					field: 'create_user_name',
					title: '创建人',
					width: "14%",
				},
				
				 {
					field: 'updata_time',
					title: '更新时间',
					width: "18%",
				},{
					field: 'optBtn',
					title: '操作',
					align:"center",
					width: "30%",
					formatter: function(val, rowData,index) {
						
						const  str= rowData.layout_type === 1 ?Page.cataOpt.str 
						: Page.viewOpt.str ;


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
		this.creatTab(data,$tab,this.tabConfig("layout_id"));
    }

    createTreeGrid(data){

		let order = 0;
		$treeTab.treegrid({
				animate: true,
				data: data,
				checkbox: Page.cataOpt.del === "1" ,
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
						"width": "34%",
						"formatter": function(val, rowData) {

							const {layout_icon_name,layout_type} = rowData;

							const arr = ["","node-catalogue",""];

							arr[2] = Page.viewOpt.pre && "node-file" || "";

							return `<div class="tab-node ${arr[+rowData.layout_type]}" echo-data="${rowData.layout_id}"><i class="sicon ${layout_icon_name}">&nbsp;</i><span>${val}</span></div>` ;
						}

					}, {
						field: 'layout_type',
						title: '类型',
						width: 80,
						formatter: function(val,rowData,index) {

							return `<span class="${val===2 ? "tab-type" : null }">${val===1 ? "分类" :"视图"}</span>`;
						}
					},  {
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
						align:"center",
						width: "30%",
						formatter: function(val,rowData) {
							
							const  str= rowData.layout_type === 1 ?Page.cataOpt.str 
						: Page.viewOpt.str ;

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

		const tabData = $tab.datagrid("getData").rows;


		const index = +$this.attr("echo-data");
		const childArr = tabData[index].sub;

		this.loadTab(childArr);
		const {layout_name,layout_id}=tabData[index];
		const lastData = $tabCard.data("menuArr");

		lastData.push({layout_name,index,layout_id});
		page.tabCardInit(lastData);

    }

    handle(){
    	const _self = this ;
		//  进入目录
		$tabContainer.on("click",".node-catalogue",function(){
			const $this = $(this);
			_self.changeTabcard($this);

		});

		// 进入模板编辑器
		$tabContainer.on("click",".node-file",function(){
			page.toEdit($(this),0);
		});

		$("#treeTabBox").on("click",".node-file",function(){
			page.toEdit($(this),2);
		});

		//复选框事件
		$tabContainer.on("click",".checkSingle",function(){
			_self.checkSingleHandle($tabContainer);
		});
    }

}

class CatalogueStyle{

	constructor(){

		this.catalogueContentmenu = $("#catalogueContentmenu");
		this.contentMenuInit();
		this.handle();
	}

	contentMenuInit(){

		const cataStr = Page.cataOpt.str.replace(/s-btn s-Naira/g,"");
		const viewStr = Page.viewOpt.str.replace(/s-btn s-Naira/g,"");

		const str = `
						<div class="contentmenu-item">
							${cataStr}
						</div>
						<div class="contentmenu-item">
							${viewStr}
						</div>
					`

		this.catalogueContentmenu.html(str);
	}

	catalogueInit(tabData){
		
		const str = tabData.map((val,index)=>{
			const {layout_icon_name,layout_name,layout_id,layout_type,sub} = val ;
			const type = layout_type ===1 && "view-catalogue" || "view-file";
			const is_disCheck = sub.length === 0 ;

			return `
					<div class="catalogue-item " >
						<div class="view-show ${type}" echo-data="${index}">
							<p><i class="sicon ${layout_icon_name}"></i></p>
							<p class="catalogue-name"><span>${layout_name}</span></p>
							<span class="s-checkbox catalogue-chec ${!is_disCheck && "dis-check" || ""}">
									${is_disCheck && '<input type="checkbox"  class="catalogue-chec-inp" value="'+layout_id+'">' || ""}
									<label class="fa fa-square-o"></label>
							</span>
						</div>
						
					</div>
				  `
		});
		$catalogueBox.html(str);
		$catalogueBox.data("getData",tabData);
		this.cataFooterInit();
    }
    cataFooterInit(){
		const str = ` 
				<div class="footer-item">
					<i class="fa fa-bookmark-o">&nbsp;</i>
					<span>点击获取文件信息</span>
					<br>
					<i class="fa fa-bookmark-o">&nbsp;</i>
					<span>双击进入目录</span>
				</div>
				`;
		$catalogueBox.siblings(".cata-footer").html(str);
    }
    cataFooterRender(data){

    	const {layout_type,create_user_name,layout_name,updata_time,layout_icon_name} =data;
		
		var str = `
					<div class="cata-info footer-item">
						<span class="sicon ${layout_icon_name.trim()}"></span>
						<span>
						   <span><b>文件名：</b>${layout_name}</span><br><span><b>包含对象：</b>${data.sub.length}个</span>
						  </span>
					</div>
					<div class="footer-item" style="width:25%">
						<b>创建时间：</b>
						<br />
						<span style="padding-left:5em">${updata_time}</span>
					</div>
					<div class="footer-item" style="width:15%">
						<b>创建人：</b>
						<br />
						<span style="padding-left:4em">${create_user_name}</span>
					</div>
					<div class="footer-item" style="width:15%">
						<b>文件类型：</b>
							<br />
						<span style="padding-left:5em">${layout_type===1?"分类文件夹":"视图文件"}</span>
					</div>
					`
		$catalogueBox.siblings(".cata-footer").html(str);
    }

    handle(){

    	const _self = this ;
    	const contentMenu = this.catalogueContentmenu;
		$catalogueBox.on("dblclick",".view-catalogue",function(){
			window.clearTimeout(timer);
			const $this = $(this);
			const tabData = $catalogueBox.data("getData");
			const index = +$this.attr("echo-data");
			const childArr = tabData[index].sub;
			_self.catalogueInit(childArr);
			const {layout_name,layout_id}=tabData[index];
			const lastData = $tabCard.data("menuArr");
			
			lastData.push({layout_name,index,layout_id});
			page.tabCardInit(lastData);
			$("#catalogueChecAll").children("input").prop("checked",false);
		});


		$catalogueBox.on("dblclick",".view-file",function(){
			page.toEdit($(this),1);
		});

		let timer = null;
		$styleView.eq(1).on("click",".view-show",function(){
			const $this = $(this);
			clearTimeout(timer);
			timer = setTimeout(function(){
				const index =$this.attr("echo-data");
				$this.parent().addClass("catalogue-item-sel").siblings().removeClass("catalogue-item-sel");
				const node = $catalogueBox.data("getData")[index];
				_self.cataFooterRender(node);
			}, 150);
		});

		$styleView.eq(1).on("contextmenu",".view-show",function(e){
			const $this = $(this);
			const index =$this.attr("echo-data");
			const node = $catalogueBox.data("getData")[index];
			const {layout_type} = node ;
			e.stopPropagation();
			contentMenu.show();
			contentMenu.attr("echo-data",index);

			contentMenu.find(".contentmenu-item").eq(layout_type-1).show().siblings().hide();
			contentMenu.css({"top":e.clientY-115,"left":e.clientX-40});

			return false ;
		});

		$styleView.eq(1).on("click",".catalogue-chec",function(e){
			e.stopPropagation();
			const is_allCheck = $styleView.eq(1).find(".catalogue-chec-inp").not(":checked").length === 0 ;

			$("#catalogueChecAll").children("input").prop("checked",is_allCheck);
		});

		$("#catalogueChecAll").click(function(){
			const status = $(this).children("input").prop("checked");
			$styleView.eq(1).find(".catalogue-chec-inp").prop("checked",status);
		});
    }
}

class AddModal{

	constructor(){

		this.parCatalogCombox = $("#parName") ;
		this.handle();
		this.init();
		this.orgBoxInit();
	}

	init(){

		// 日历
		this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
			rotate:4,
			style:2
		});
	}

	initMD(type){

		// 创建类型选择

		$addMBtn.attr({"type":type,"method":"create"});
		$inpName.val(null);

		let curCatalogueArr = null;

		// layout_type :0:根目录 1 目录 ，2：文件
		let comboboxType = null ;

		if(Page.style === 2){ // 树形表格

			comboboxType = 2 ;

			const _data =JSON.stringify( $treeTab.treegrid("getData"));
			const copy_data = JSON.parse(_data);
			const obj = page.getCatalogue(copy_data);
			
			  curCatalogueArr = type === "view" && obj || [{
				"layout_name":"当前分类",
				"layout_id":-2,
				 children:obj,
			}];

		}else{

			comboboxType = 1 ;

			const _data = Page.style === 0 ? $tab.datagrid("getData").rows :
					    $catalogueBox.data("getData");

			curCatalogueArr = _data.reduce(function(total,curVal){
				const {layout_name,layout_id,layout_type} = curVal;
				layout_type === 1 && total.push({layout_name,layout_id});
				 return total;
			},[]);

			const menuArr = $tabCard.data("menuArr");
			const curId = menuArr[menuArr.length-1].layout_id;
			curCatalogueArr.unshift({"layout_name":"当前分类","layout_id":curId});	
		};

		this.reloadParCatalogCombox(curCatalogueArr,comboboxType);
				
		$parName.parent().show();
		page.modal.show($addMView);

	}
		
	reloadParCatalogCombox(data,style){

		this.parCatalogSel = null ;
		this.parCatalogCombox.unbind();	

		this.parCatalogSel = style == 1 ? new SCombobox(this.parCatalogCombox,{
			 data:data,
			"textField":"layout_name",
			"idField":"layout_id",
			"validCombo":false,
			"prompt":"请选择所属分类...",
			"width":300,
		}) : new SComboTree(this.parCatalogCombox,{
				width:300,
				treeConfig:{
					 data:data,
					"textField":"layout_name",
					"idField":"layout_id",
					"childIcon":"fa fa-folder-open-o",
					"parClick":true,
				}
		});

		const  curId =data[0].layout_id ;

		this.parCatalogSel.setValue(curId);

	}
	
	
	addCatalogue(type,obj,style){

		
		api.checkName(obj)
		.then(res=>{
			return res ? api.addView(type,{user_id,...obj}) : "重名" ;
		})
		.then(res=>{

			if(res === "重名"){
				UnitOption.tipToast("重名，换一个名称！",2);
				return ;
			}

			if(res){ //true
				const menuIndexArr = $tabCard.data("menuArr").map(val=>{
					  return  val.index ;
				}) ;
				 page.styleBoxrender(menuIndexArr,style);
				 page.modal.close($addMView);

				UnitOption.tipToast("新增成功！",1);
			}else{
				UnitOption.tipToast("新增失败！",0);
			}

		}).catch(error=>{

			console.log(error);
		})
    }
    orgBoxInit(){

    	
    	api.getLayoutUserTree().then(res=>{

			if(res){

				
				this.orgTree = new Tree($org,{
					"data":res.sub,
					"textField":"name",
					"idField":"id",
					"checkbox":true,
					 "checkCallback":function(node,$this,selArr){

					 	setTimeout(function(){
							
							const strArr = selArr.map(val=>{
									const {id,name} = val ;
									return 	`<li echo-id="${id}" class="org-sel-item ">
												<i class="fa fa-user-circle-o">&nbsp;</i>
												<b>${name}</b>
											 </li>`;

							});
							$("#orgSel").html(strArr.join(""));
					 	}, 60);

					 },
					 "clickAndCheck":true,
					 "childrenField":"sub",
					 "judgeRelation":(val)=>{//自定义判断是目录还是文件的函数
							return val.type == 0 ;
					 }
				});
			}else{
				UnitOption.tipToast("获取用户失败！",0);
			}

    	});
    }

    
	handle(){

		const _self = this ;

		

		//模态框确定按钮
		$addMBtn.click(function(){

			const type = $(this).attr("type");
			const method = $(this).attr("method");
			const name = $inpName.val().trim();
			if(!name){return ; }
			const par_id = method==="create" ? _self.parCatalogSel.box.find(".combo-value").val() : $ViewContainer.attr("curid");
			const style = Page.style;

			switch(method){
				case "create":{
					_self.addCatalogue(type,{name,par_id},style);
				}
					break;
				case "copy":{

					const tabCardArr = $tabCard.data("menuArr");
					api.checkName({par_id:tabCardArr[tabCardArr.length-1].layout_id,name})
					.then(res=>{

						if(res){
							api.copyLayout(par_id,name).then(res=>{
								
									if(res){
										const menuIndexArr = tabCardArr.map(val=>{
										  return  val.index ;
										}) ;
										page.styleBoxrender(menuIndexArr,style);
								 		page.modal.close($addMView);
										UnitOption.tipToast("视图复制成功！",1);

									}else{
										UnitOption.tipToast("视图复制失败！",0);
									}

							})
						}else{

							UnitOption.tipToast("该视图名称已经存在！",2);
						}
						
					});
					}
					break;
				case "modify":{

					api.updataName({name,id:par_id}).then(res=>{
							if(res){
									const menuIndexArr = $tabCard.data("menuArr").map(val=>{
										  return  val.index ;
									}) ;
									 page.styleBoxrender(menuIndexArr,style);
									 page.modal.close($addMView);
									 UnitOption.tipToast("重命名成功！",1);
							}else{
								UnitOption.tipToast("重名，换个名称！",2);
							}

						}).catch(res=>{

							console.log(res);
						});
					}
					break;	
				default:
					break;
			}
			
		
		});

		//发布
		$("#issueBtn").click(function(){

			const id= +$ViewContainer.attr("curid");

			let user = ["-1"],
				starttime ="-1",
			    endtime = "-1",
			    release = 1 ;

			const switchs = [].slice.call($issueMView.find(".s-switch input"));

			switchs.map((val,index)=>{
				const status = val.checked;
				if(!status){
					switch(index){
						case 0:
							const timeValue =_self.calendar.value;
							starttime = timeValue[0].join("");
							endtime = timeValue[1].join("");
							break;
						case 1:
							const selArr =$.map($issueMView.find(".child-checkinp:checked"),val=>{
								return val.value;
							});
							user = !selArr.length && null || selArr ;

							break;
						case 2:
							 release = 0 ;
							break;
			
					}

				}		
			});


			if(!user){
				UnitOption.tipToast("请选择可见用户！",2);
				return ;
			}
			
			api.ReleaseLayout({id,user,starttime,endtime,release}).then(res=>{
				if(res){
					UnitOption.tipToast("设置成功！",1);
				
					const menuIndexArr = $tabCard.data("menuArr").map(val=>{
							  return  val.index ;
					}) ;
					page.styleBoxrender(menuIndexArr,Page.style);
					page.modal.close($issueMView);
				}else{
					UnitOption.tipToast("设置失败！",0);
				}
			});
		});
		//开关
		$issueMView.on("click",".s-switch",function(){

			const type = $(this).attr("sign");

			switch(type){

				case "time":
					$(this).siblings(".time-inpbox").toggleClass("active");
					break;
				case "org":
					$(this).parent().siblings(".org-box").toggleClass("active");
					break;

			}
		});
	}

}

class DelModal{

	constructor(){

		this.handle();
	}

	delHandle(){

		let selArr = null;
			
			if(Page.style===0){

				 selArr = $.map($tabContainer.find(".checkSingle:checked"),function(val){
						return val.value;
				});

			}else if(Page.style===1){

				 selArr = $.map($catalogueBox.find(".catalogue-chec-inp:checked"),function(val){
						return val.value;
				 });

			}else{
				
				 selArr = $treeTab.treegrid("getCheckedNodes").map(val=>val.layout_id);

			}
			
			if(!selArr.length){
				UnitOption.tipToast("选择要删去的！",2);
				return ;
			}
			const id = selArr.join(",");
			page.modal.show($confirmMView);
			$confirmBtn.attr("delArr",id);
	}

	del(id){
		
		api.updataRecycle({user_id,id}).then(res=>{


				if(res){
					const menuIndexArr = $tabCard.data("menuArr").map(val=>{
							  return  val.index ;
					}) ;
					const style = Page.style;
					page.styleBoxrender(menuIndexArr,style);
					UnitOption.tipToast("删除成功！",1);
				}else{
					UnitOption.tipToast("删除失败！",0);
				}

				page.modal.close($confirmMView);

			});

	}


	handle(){
		
		const _self = this;
		// 删除模态框确认按钮
		$confirmBtn.click(function(){

			const id = $(this).attr("delArr");
			_self.del(id);

		})
	
	}
}

class IconBox{

	constructor(){
		this.InitIconBox($iconBox);
		this.handle();
	}

	InitIconBox($el){
		api.getAllLayout_icon().then(res=>{

			if(res){
				const {par,child}=res;
				const par_strArr = par.map(val=>{
					const {name,id} = val ;
					return `
						    <span class="sicon ${name}" echo-data="${id}"></span> 

							`
				});

				const child_strArr = child.map(val=>{
					const {name,id} = val ;
					return `
						    <span class="sicon ${name}" echo-data="${id}"></span> 
							`
				});

				const str = `
							<div class="iconBox-item">${child_strArr.join("")}</div>	
							<div class="iconBox-item">${par_strArr.join("")}</div>	
							`
				$el.html(str);
			}else{
				UnitOption.tipToast("图标获取失败！",0);
		
			}

			
		});
    }

	handle(){

		//选择icon
		$iconBox.on("click",".sicon",function(){
			$(".icon-sel").removeClass("icon-sel");
			$(this).addClass("icon-sel");
		});
		//操作icon
		$("#iconFooter").on("click","p",function(){

			const sign = $(this).attr("sign");
			const $parContainer = $iconBox.parent();

			switch(sign){
				case "sub":
					
					const id = $ViewContainer.attr("curId");
					const icon_id =$(".icon-sel").attr("echo-data");

					api.updataIcon({icon_id,id}).then(res=>{

						if(res){
							page.modal.close($parContainer,"icon-active") ;
							const menuIndexArr = $tabCard.data("menuArr").map(val=>{
							  return  val.index ;
							}) ;

							const style = Page.style ;

							page.styleBoxrender(menuIndexArr,style);
							UnitOption.tipToast("图标更新成功！",1);
						}else{
							UnitOption.tipToast("图标更新失败！",0);
						} 
					
						
					});

					break;
				case "close":
					page.modal.close($parContainer,"icon-active") ;
					break;
			}
		});

		$("#iconContainer").on("click",function(e){
			e.stopPropagation();
		});

	}

}


//初始化页面类
class Page  {

	static style = 0 ;
	static cataOpt = {};
	static viewOpt = {};

	constructor(){

		this.btnBox = $("#btnBox");

		this.handle();

		this.getRoleRes().then(res=>{

			this.init();
		});
		
		this.searchTreeMd = $("#search-MView");
	}

	getCatalogue(arr){

		return arr.filter(val=>{
			const child = val.children ;
			if(child.length){

				const filteArr = this.getCatalogue(child);
				val.children = filteArr ;

				return true ;


			}else{
				return val.layout_type === 1 ;
			}
		});
	}

	getRoleRes(){

		const optBoxArr = ["addCata","addView","delCata"];
		const catArr = ["modCataIcon","renameCata","delCata"];

		const optBoxStr = [] ;
		const viewBoxStr = [] ;
		const cataBoxStr = [] ;

		return 	api.roleResource().then(res=>{
			
				if(res){

					res.btn.forEach(val=>{
						const {btn_code,btn_flag} = val ;
						if(optBoxArr.includes(btn_code)){

							Page.cataOpt.del = btn_flag;

							optBoxStr.push(val)

						}else if(catArr.includes(btn_code)){

							cataBoxStr.push(val)

						}else{

							if( btn_code=== "delView"){

						
							}else if( btn_code=== "modView"){
								
								Page.viewOpt.pre =  btn_flag;
						
							}else{

								viewBoxStr.push(val);
							}

						}
					});

					this.initOptBox(optBoxStr);
					Page.cataOpt.str = this.initCataBox(cataBoxStr).join("");
					Page.viewOpt.str = this.initViewBox(viewBoxStr).join("");

				}else{
					page.unit.tipToast("获取功能权限出错！","0")
				}

		});
	}

	initOptBox(arr){

		const config = {
			addCata:["创建目录","sicon sicon-par-1","s-moema"],
			addView:["创建视图","fa fa-plus","s-Toslide"],
			delCata:["","fa fa-trash","s-sacnite"],
		}

		const str = arr.map(val=>{
			const {btn_flag,btn_status,btn_code} = val;
			const disable = btn_flag=== "0" && btn_status == "1"  && "disabled" || "";
			const str = (btn_flag !== "0" && btn_status === "1") && `<button class="s-btn ${config[btn_code][2]} ${disable}" sign="${btn_code}">
						<i class="${config[btn_code][1]}"></i>
						<span>${config[btn_code][0]}</span>
				</button>` || "";
			return str ;
		});

		this.btnBox.html(str.join(""));
		

	}
	initCataBox(arr){
		
		const config = {
			modCataIcon:["图标","sicon sicon-btn-3"],
			renameCata:["重命名","sicon sicon-btn-4"],
		}

		return  arr.map(val=>{

					const {btn_flag,btn_status,btn_code} = val;
					const disable = btn_flag=== "0" && btn_status == "1"  && "disabled" || "";

					const str = (btn_flag !== "0" && btn_status === "1") && `<div class="tab-opt s-btn s-Naira ${disable}" node-sign="${btn_code}">
								<i class="${config[btn_code][1]}"></i>	
								<span>${config[btn_code][0]}</span>
						</div>` || "";

					return str ;
		});
		
	}
	initViewBox(arr){
		
		const config = {
			modViewIcon:["图标","sicon sicon-btn-3"],
			renameView:["重命名","sicon sicon-btn-4"],
			preView:["预览","fa fa-eye"],
			issueView:["发布","fa fa-paper-plane-o"],
			copyView:["复制","sicon sicon-btn-1"],
		}

		return  arr.map(val=>{

					const {btn_flag,btn_status,btn_code} = val;

					
					
					const disable =btn_flag=== "0" && btn_status == "1"  && "disabled" || "";

					const str = (btn_flag !== "0" && btn_status === "1") && `<div class="tab-opt s-btn s-Naira ${disable}" node-sign="${btn_code}">
								<i class="${config[btn_code][1]}"></i>	
								<span>${config[btn_code][0]}</span>
						</div>` || "";
						return str ;
		});

	}
	
    init(){

    	const _self = this ;

		this.modal = new SModal();
		this.table = new TableStyle();
		this.catalogue  = new CatalogueStyle();
		this.addModal = new AddModal();
		this.delModal = new DelModal();
		this.iconBox = new IconBox();
		this.inp = new SInp();
		this.search = new Search($("#u-search"),{
			serachCallback:(result)=>{
				console.log(result);
				this.changeStyle($(".style-item").eq(2),result);
			},
			closeCallback:(res)=>{
				this.table.createTreeGrid(res);	
			},
			keyField:"layout_name",
			judgeRelation:(val)=>{
				return val["layout_type"] === 1;
			},
			is_Arr:false,

		});

		this.styleBoxrender();
		this.tabCardInit([{layout_name:"我的创建",index:0,layout_id:-2}]);

 	}

   
    styleBoxrender(menuIndexArr=[0], type = 0){
		api.getAllLayout().then(res=>{

			if(res){
				
				const copy_data= JSON.parse(JSON.stringify(res.sub).replace(/sub/g,"children"));

				this.search.data = copy_data ;

				
				const  allData = [res] ;
				
				$ViewContainer.data("tabData",allData);
				
				let tabData=JSON.stringify(allData);
				    tabData=JSON.parse(tabData);

				//获取当前tab的层级
				menuIndexArr.map(function(val){
					tabData = tabData[val].sub
				});

				type===0 ? this.table.loadTab(tabData) : type === 1 ? this.catalogue.catalogueInit(tabData) 
				:this.table.createTreeGrid(copy_data);
			
			}else {

				UnitOption.tipToast("视图获取失败！",0);

			}
				
			

		})
			
    }
    
    tabCardInit(menuArr){
		$tabCard.data("menuArr",menuArr);
		const leg = menuArr.length;
		const str = menuArr.map((val,ind)=>{
			const {layout_name,index}=val;
			const is_last = ind === leg-1;

			const icon_str = !is_last && `&nbsp;&nbsp;<i class="fa fa-angle-right fa-lg">&nbsp;&nbsp;</i>` || "";
			
			return `<div class="card" echo-data="${index}"><span>${layout_name}</span>${icon_str}</div>` ;
		});
		$tabCard.html(str.join(""));
    }

    toEdit($this,style){

		const index = +$this.attr("echo-data");
		const data = style === 1 ?  $catalogueBox.data("getData")[index] 
		: style === 0 ? $tab.datagrid("getData").rows[index] : $treeTab.treegrid("find",index);
		
		const {layout_name,layout_id,par_id} = data ;

		const fatherWin = window.parent;
			  fatherWin.menuID = layout_id;
			  fatherWin.menuName =layout_name;

			  console.log(fatherWin.menuID);

		const str = `?layout_id=${layout_id}&&par_id=${par_id}&&layout_name=${layout_name}`;
		
		$("#slide",fatherWin.document).animate({"width":0},500,function(){
			$("#content",window.parent.document).addClass("no-head");
			window.location.href="./editTemplate.html" + str ;;
		});
    }

    getCurTabData(menuArr,curIndex){
		
		let tabData = $ViewContainer.data("tabData");
		let i = 0;
		while(i<=curIndex){
			tabData=tabData[menuArr[i].index].sub;
			i++;
		}
    	return tabData;
    }

    handleCard($this){//分类选项卡
    	const menuArr = $tabCard.data("menuArr");
		const leg =menuArr.length;
		const index = $this.index();

		if(index=== leg-1){
			return ;
		}

		const tabData =this.getCurTabData(menuArr,index);
		

		const styleIndex = $(".style-sel").index();
		styleIndex ? this.catalogue.catalogueInit(tabData) :this.table.loadTab(tabData);
		const newmenuArr=menuArr.slice(0,index+1);
		this.tabCardInit(newmenuArr);

    }
    changeStyle($this,reloadData = null){

		if($this.hasClass("style-sel")){

			Page.style === 2 && reloadData && this.table.createTreeGrid(reloadData);
		
			return ;
		}

		const type = $this.attr("sign");

		let index = $this.index();

		Page.style = index ;

		// 要先显示容器，不然加载出来的表格没高度
		
		const showView = $styleView.eq(index);

		page.modal.close(showView.siblings(".style-view"),"style-active");
		page.modal.show(showView,"style-active");

		$this.addClass("style-sel").siblings(".style-item").removeClass("style-sel");

		switch(type){
			case "icon":{
				const tabData = $tab.datagrid("getData").rows;
				this.catalogue.catalogueInit(tabData);
				$tabCard.show();
				break;
			}
			case "list":{
				const tabData = $catalogueBox.data("getData");
				this.table.loadTab(tabData);
				$tabCard.show();
				break;
			}
			case "tree":{

				$tabCard.hide();

				if(!reloadData){
					const tabData = page.search.data;
				    this.table.createTreeGrid(tabData);
				}else{
					this.table.createTreeGrid(reloadData);
				}
			
				break;
			}
		}
    }

    handle(){
		const _self = this ;

    	$(window).on("click",function(){
          		$(".icon-active").removeClass("icon-active");
          		$("#catalogueContentmenu").hide();
		});
		
		//切换选项卡
		$tabCard.on("click",".card",function(){
			const $this = $(this);
			page.handleCard($this);
			$("#catalogueChecAll").children("input").prop("checked",false);

		});

		//切换显示风格
		$("#styleBox").on("click",".style-item",function(){
			const $this = $(this);
			page.changeStyle($this);
		});

		//操作按钮
		$ViewContainer.on("click",".tab-opt",function(e){


			const type = $(this).attr("node-sign");
			const index =Page.style === 1 ? $(this).parent().parent().attr("echo-data") : $(this).parent().attr("echo-data");

			const style = Page.style;

			const data = style === 1 ?  $catalogueBox.data("getData")[index] 
			: style === 0 ? $tab.datagrid("getData").rows[index] : $treeTab.treegrid("find",index);


			const {layout_type,layout_id,layout_icon,layout_icon_name,layout_name} = data ;    
			const last_layoutId = +$ViewContainer.attr("curId");

			switch(type){

				case "preView":

				    const fatherWin = window.parent ;
				
					$("#content",fatherWin.document).addClass("no-head");
					window.location.href="./ManageViews.html?pre="+layout_id;
					
					fatherWin.menuID = layout_id;
					fatherWin.menuName =layout_name;


					break;
				case "issueView":
					
					  	api.showReleaseLayout(layout_id).then(res=>{
							if(res){
								
								page.modal.show($issueMView);
								const {user,starttime,endtime,release} = res;
							
							  	[].slice.call($issueMView.find(".s-switch input")).map((val,index)=>{

									switch(index){
										case 0 : //时间
											const status =  starttime == "-1" ;
											val.checked= status ;

											if(status){
												$(val).parent().siblings(".time-inpbox").removeClass("active");
											}else{
												$(val).parent().siblings(".time-inpbox").addClass("active");
												page.addModal.calendar.setTime([starttime,endtime]);
											}

											break;
										case 1 ://用户
											const status_2 =  user[0] == "-1" ;
											val.checked= status_2 ;

											if(status_2){
												$(val).closest(".item-status").siblings(".org-box").removeClass("active");
											}else{
												$(val).closest(".item-status").siblings(".org-box").addClass("active");

												page.addModal.orgTree.setValue(user);
											}
									
											break;
										case 2 :
											const status_3 =  release === 1 ;
											val.checked= status_3 ;
											break;
									}
							 	 });	
							}else{
								
							}
						});
					break;
				case "copyView":

					page.modal.show($addMView);
					$parName.parent().hide();
					$addMBtn.attr({"method":"copy"});
					break;
				case "renameCata":
				case "renameView":
					page.modal.show($addMView);
					$parName.parent().hide();
					$addMBtn.attr({"method":"modify"});
					 $inpName.val(layout_name);
				//	 $inpName.parent().addClass("inp-fill");
					break;
				case "modViewIcon":
				case "modCataIcon":
					e.stopPropagation();
					const $parContainer = $iconBox.parent();
					const status = $parContainer.hasClass("icon-active");
					const $iconBoxItem = $(".iconBox-item");

					$iconBoxItem.css("display","none");
					$iconBoxItem.eq(2-layout_type).css("display","flex");
					$(".icon-sel").removeClass("icon-sel");
					$iconBox.find("."+layout_icon_name.trim()).addClass("icon-sel");

				  !status || last_layoutId !== layout_id ? page.modal.show($parContainer,"icon-active") :page.modal.close($parContainer,"icon-active") ;
					break;
			}


			$ViewContainer.attr("curId",layout_id);

		});
		
		_self.btnBox.on("click",".s-btn",function(){

			const $this = $(this);
			const sign = $this.attr("sign");

			switch(sign){
				
				case"addView":{
					let lev = $tabCard.data("menuArr").length;
			    	if(lev === 1 && Page.style !==2){
						UnitOption.tipToast("第一层只能创建目录!",2);
						return ;
			    	}
					_self.addModal.initMD("view");
					break;
				}
				case"delCata":{
					_self.delModal.delHandle();
					break;
				}
				case"addCata":{
					_self.addModal.initMD("catalogue");
					break;
				}
				default:
				break;

			}
		});

    }
}


const page = new Page();

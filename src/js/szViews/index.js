import "css/common/common.scss";
import "css/szViews.scss";
import "css/common/dropMenu.scss";
import "css/common/button.scss";
import "css/common/modal.scss";
import "css/common/Svg.scss";
import "css/common/input.scss";
import { EasyUITab } from "js/common/EasyUITab.js";
import { Calendar } from "js/common/calendar.js";
import { Unit } from "js/common/Unit.js";
import {API} from "api/szViews.js";
import RotateMenu from "js/common/rotateMenu.js";

const {user_id} = window.jsp_config;

//工具类实例
const UnitOption = new Unit();

// API请求类实例
const API_szViews = new API();

/*
  JQ对象
*/

// 表格视图相关dom
const $tab = $("#tab"),
	  $ViewContainer = $("#section"),
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


//初始化页面类
class InitPage extends EasyUITab{
	dropMenuConfig=[
		{"icon":"fa-file-text",text:"创建视图",type:"view"},
		{"icon":"fa-folder",text:"创建分类",type:"catalogue"},
	]

	constructor(){
		super();
		this.init();
	}
	
    init(){
		
		this.setPageHeight($ViewContainer,160);
		this.tabInit();
		this.tabCardInit([{layout_name:"我的创建",index:0,layout_id:-2}]);
		this.InitIconBox($iconBox);
		this.orgBoxInit();
		this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
			rotate:4,
			style:2
		});
    }

    InitIconBox($el){
		API_szViews.getAllLayout_icon().then(res=>{

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
		});
    }

    tabConfig(idField){

		return {
			idField:idField,
			tabId:"#tabBox",
			frozenColumns: this.frozenColumns(idField),
			columns: [
				[{
					field: 'layout_name',
					title: '视图名称',
					width: "24%",
					formatter: function(val,rowData,index) {

						const {layout_icon_name,layout_type} = rowData;
						const arr = ["","node-catalogue","node-file"];
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
						
						let str="" ;
						switch (rowData.layout_type){

							case 1 ://目录
							      str =`
										<div class="tab-opt s-btn s-Naira" node-sign="icon">
												<i class="sicon sicon-btn-3"></i>
												<span>图标</span>	
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="rename">
												<i class="sicon sicon-btn-4"></i>	
												<span>重命名</span>	
										</div>	
							   		`;

								break;
							case 2 ://文件
								 str =`
								 		<div class="tab-opt s-btn s-Naira" node-sign="icon">
												<i class="sicon sicon-btn-3"></i>	
												<span>图标</span>
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="rename">
												<i class="sicon sicon-btn-4"></i>	
												<span>重命名</span>
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="pre">
												<i class="fa fa-eye"></i>
												<span>预览</span>		
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="issue">
												<i class="fa fa-paper-plane-o"></i>	
												<span>发布</span>
										</div>
										<div class="tab-opt s-btn s-Naira" node-sign="copy">
												<i class="sicon sicon-btn-1"></i>	
												<span>复制</span>
										</div>
										
										
							   		`;
								break;
						}

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

    tabInit(menuIndexArr=[0],type="tab"){
		API_szViews.getAllLayout().then(res=>{
				
			const  allData = [res] ;

			$ViewContainer.data("tabData",allData);
			
			let tabData=JSON.stringify(allData);
			    tabData=JSON.parse(tabData);

			menuIndexArr.map(function(val){
				tabData = tabData[val].sub
			});

			type==="tab"?this.loadTab(tabData):this.catalogueInit(tabData);

		})
    }

    catalogueInit(tabData){
		
		const str = tabData.map((val,index)=>{
			const {layout_icon_name,layout_name,layout_id,layout_type} = val ;
			const type = layout_type ===1 && "view-catalogue" || "view-file";

			let str = `
					<div class="tab-opt rotate-btn rotate-icon" node-sign="icon" echo-text="图标"><span class="sicon sicon-btn-3"></span></div>
					<div class="tab-opt rotate-btn rotate-rename" node-sign="rename" echo-text="重命名"><span class="sicon sicon-btn-4"></span></div>
					`;
			const fileopt = `
					<div class="tab-opt rotate-btn rotate-pre" node-sign="pre" echo-text="预览"><span class="fa fa-eye"></span></div>
					<div class="tab-opt rotate-btn rotate-issue" node-sign="issue" echo-text="发布"><span class="fa fa-paper-plane-o "></span></div>
					<div class="tab-op rotate-btn rotate-copy" node-sign="copy" echo-text="复制"><span class="sicon sicon-btn-1"></span></div>
					`;

				str = layout_type !==1 &&  str + fileopt || str ;

			return `
					<div class="catalogue-item " >
						<div class="view-show ${type}" echo-data="${index}">
							<p><i class="sicon ${layout_icon_name}"></i></p>
							<p class="catalogue-name"><span>${layout_name}</span></p>
						</div>
						<div class="view-opt" echo-data="${index}">
							${str}
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

    loadTab(data){
		this.creatTab(data,$tab,this.tabConfig("layout_id"));
    }
    tabCardInit(menuArr){
		$tabCard.data("menuArr",menuArr);
		const leg = menuArr.length;
		const str = menuArr.map((val,ind)=>{
			const {layout_name,index}=val;
			const is_last = ind === leg-1;

			const icon_str = !is_last && `&nbsp;&nbsp;<i class="fa fa-angle-right fa-lg">&nbsp;&nbsp;</i>` || "";
			
			return `<div class="card" echo-data="${index}"><span>${layout_name}</span>${icon_str}</div>` ;
		})
		

		$tabCard.html(str.join(""));
    }

    changeTabcard($this){ // 进入目录

		const tabData = $tab.datagrid("getData").rows;


		const index = +$this.attr("echo-data");
		const childArr = tabData[index].sub;

		this.loadTab(childArr);
		const {layout_name,layout_id}=tabData[index];
		const lastData = $tabCard.data("menuArr");

		lastData.push({layout_name,index,layout_id});
		this.tabCardInit(lastData);

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
		styleIndex ? this.catalogueInit(tabData) :this.loadTab(tabData);
		const newmenuArr=menuArr.slice(0,index+1);
		this.tabCardInit(newmenuArr);

    }
    changeStyle($this){
		if($this.hasClass("style-sel")){
			return ;
		}

		const  index = $this.index();

		$(".style-active").removeClass("style-active");
		$styleView.eq(index).addClass("style-active");

		$this.addClass("style-sel").siblings(".style-item").removeClass("style-sel");

		if(index){
			const tabData = $tab.datagrid("getData").rows;
			this.catalogueInit(tabData);
		}else{
			const tabData = $catalogueBox.data("getData");
			this.loadTab(tabData);
		}

    }

    addCatalogue(type,obj,style){
	
		API_szViews.checkName(obj)
		.then(res=>{
			return res ? API_szViews.addView(type,{user_id,...obj}) : "重名" ;
		})
		.then(res=>{

			if(res === "重名"){
				alert(res);
				return ;
			}

			if(res){ //true
				const menuIndexArr = $tabCard.data("menuArr").map(val=>{
					  return  val.index ;
				}) ;
				 this.tabInit(menuIndexArr,style);
				 UnitOption.closeModal($addMView);
			}else{
			}

		}).catch(error=>{

			console.log(error);
		})
    }

    dropMenuCallback=(state)=>{

    		const lev = $tabCard.data("menuArr").length;
		
			let dropMenuConfig = this.dropMenuConfig.slice();
			if(lev===1){
				dropMenuConfig.splice(0,1);
			}else if(lev>3){
				dropMenuConfig.splice(1,1);
			}

			UnitOption.renderDropMenu($menuBox,!state?dropMenuConfig:[]);
    }

    orgBoxInit(){

    	
    	API_szViews.getLayoutUserTree().then(res=>{

			if(res){
				const str = this.renderOrgJson(res.sub,0);
				
				$org.html(str.join(""));
			}

    	});

    	$org.on("click",".slide-icon",function(){
			
			

			const parLi = $(this).closest(".org-li");
			const $parDiv = $(this).parent();

			$parDiv.hasClass("org-active") && $parDiv.removeClass("org-active") || $parDiv.addClass("org-active");

			const parMenu =parLi.children(".par-menu"); 
    		parMenu.slideToggle();

    	});

    	$org.on("click",".org-inp",function(){

    		const status =$(this).prop("checked");
    		const type = $(this).hasClass("par-checkinp");
			const par_li = $(this).closest(".org-li");

			if(type){
				par_li.find(".has-chec").removeClass("has-chec");
				par_li.find(".org-inp").prop("checked",status);
			}

			let lev = par_li.attr("lev");
			if(lev!=="1"){
				
				let up_par_li = $(this).closest(".org-li");

				while (lev > 1 ){
					  up_par_li = up_par_li.parent().parent();
					  lev = +up_par_li.attr("lev");
 					  const checkEl = up_par_li.children(".menuItem").find(".org-inp");
 					  const ul_par =  up_par_li.children(".par-menu") ;
					  const ul_par_leg = ul_par.children().length;
					  const check_leg = ul_par.children().children(".menuItem").find(".org-inp:checked").length;

					 if(check_leg === 0 ){ //一个没选
					 	checkEl.siblings("label").removeClass("has-chec");
					 	checkEl.prop("checked",false);

						
						
					 }else if( check_leg < ul_par_leg ){

						checkEl.prop("checked",false);
						checkEl.siblings("label").addClass("has-chec");


					
					 }else{// 全选 

					 	checkEl.siblings("label").removeClass("has-chec");
					 	checkEl.prop("checked",false);

					 	checkEl.prop("checked",true);
						checkEl.siblings("label").removeClass("has-chec");
					 }

					  const is_has_chec = up_par_li.find(".has-chec").length;

					 if(check_leg == 0 &&  is_has_chec){
					 	checkEl.prop("checked",false);
						checkEl.siblings("label").addClass("has-chec");
					 }

				}
				
			}
			
			

			const selArr = [].slice.call($(".child-checkinp:checked"));
			const strArr = selArr.map(val=>{
					const name = val.getAttribute("echo-name");
					const id = val.value ;

					return 	`<li echo-id="${id}" class="sel-item menuItem">
								<i class="fa fa-user-circle-o">&nbsp;</i>
								<b>${name}</b>
							 </li>`

			});
			$("#orgSel").html(strArr.join(""));

    	});

    }

    renderOrgJson(arr,_lev){

    	let lev = _lev ;
    		lev ++ ;
		return arr.map((val,index)=>{
			
			const {type,id,name,sub,par_id} = val;

			let data = {id , name ,lev,par_id} ;

			if(type===0){
 
				let  childrenEl = this.renderOrgJson(sub,lev);

				return this.parentComponent(childrenEl,data);

			}else{

				const item = this.childComponent(data);
			
				return 	item;					
			
			}
		})
	}
	
	parentComponent(child,data){

		let {name,id,lev,par_id}= data;

		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");

		return (`
			<li  lev="${lev}" class="org-li">
				<div class="menuItem par-item" echo-id="${id}">
					${indent}
					<span class="s-checkbox">
						<input type="checkbox" class="par-checkinp org-inp"  par="${par_id}" value="${id}" /><label class="fa fa-square-o" ></label>
					</span>
					<i class="fa fa-folder-open-o"></i>
					<span>${name}</span><span class="slide-icon"><i class="fa fa-caret-down  "></i></span>
				</div>
				<ul class="par-menu">${child.join("")}</ul>
			</li>
		`);

	}

	childComponent(data){

		let {name,id,lev}= data;
		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");
	
		return (`
			<li lev="${lev}" class="org-li">
				<div class="menuItem child-item" echo-id="${id}">
				${indent}
				<span class="s-checkbox">
						<input type="checkbox" class="child-checkinp org-inp" value="${id}" echo-name="${name}" /><label class="fa fa-square-o" ></label>
				</span>
				<i class="fa fa-user-circle-o">&nbsp;</i>
				${name}
				</div>
			</li>
		`);		
	}
   
}






const page = new  InitPage();

$(window).on("click",function(){
		  $(".active-menu").removeClass("active-menu");
		  $(".icon-active").removeClass("icon-active");
		  $(".dataTime").hide();
});

//切换选项卡
$tabCard.on("click",".card",function(){
	const $this = $(this);
	page.handleCard($this);

});

//  进入目录

$tabContainer.on("click",".node-catalogue",function(){
	const $this = $(this);
	page.changeTabcard($this);

});

$catalogueBox.on("dblclick",".view-catalogue",function(){

	clearTimeout(timer);
	const $this = $(this);
	const tabData = $catalogueBox.data("getData");
	const index = +$this.attr("echo-data");
	const childArr = tabData[index].sub;
	page.catalogueInit(childArr);
	const {layout_name,layout_id}=tabData[index];
	const lastData = $tabCard.data("menuArr");

	lastData.push({layout_name,index,layout_id});
	page.tabCardInit(lastData);


});

let timer = null;
const rotateMenu = new RotateMenu();

$catalogueBox.on("click",".view-show",function(){
	const $this = $(this);
	clearTimeout(timer);
	timer = setTimeout(function(){

		const index =$this.attr("echo-data");
		$this.parent().addClass("catalogue-item-sel").siblings().removeClass("catalogue-item-sel");
		const node = $catalogueBox.data("getData")[index];
		page.cataFooterRender(node);
		const rangeAngle = node.layout_type===1 ? 60: 180 ;
		rotateMenu.setPath($this,rangeAngle);

	}, 200);

});

//切换显示风格
$("#styleBox").on("click",".style-item",function(){
	const $this = $(this);
	page.changeStyle($this);
});


// 下拉框显示
$("#menuBtn").click(function(e){
	const $this = $(this);
	 e.stopPropagation();
	UnitOption.dropMenuHandle($this,page.dropMenuCallback);
});


// 创建类型选择
$menuBox.on("click",".menu-item",function(e){

	e.stopPropagation();
	const $this = $(this);

	const type =$this.attr("sign");
	$addMBtn.attr({"type":type,"method":"create"});

	$parName.parent().show();
	$inpName.val(null);
		
	const curCatalogueArr = $tab.datagrid("getData").rows.reduce(function(total,curVal){
			// layout_type : 1 目录 ，0：文件
			const {layout_name:text,layout_id:id,layout_type} = curVal;
			layout_type === 1 && total.push({text,id});
			 return total;

	},[]);
	
	const menuArr = $tabCard.data("menuArr");

	curCatalogueArr.unshift({"text":"当前分类","id":menuArr[menuArr.length-1].layout_id});

	const $comboBox = $parName.siblings(".combo-box");
	UnitOption.initCombobox(curCatalogueArr,$comboBox);
	UnitOption.showModal($addMView);
});

//模态框确定按钮
$addMBtn.click(function(){

	const type = $(this).attr("type");
	const method = $(this).attr("method");
	const name = $inpName.val().trim();
	const par_id = method==="create" ? $parName.children(".combo-value").val() : $ViewContainer.attr("curid");
	const style = $(".style-sel").index() ? "catalogue":"tab";
	
	if(name){
		method==="create" ? page.addCatalogue(type,{name,par_id},style) : API_szViews.updataName({name,id:par_id}).then(res=>{

				if(res){
						const menuIndexArr = $tabCard.data("menuArr").map(val=>{
							  return  val.index ;
						}) ;
						 page.tabInit(menuIndexArr,style);
						 UnitOption.closeModal($addMView);
				}else{
					alert("重名");
				}

			}).catch(res=>{

				console.log(res);
			})
	}

});

//删除
$("#delBtn").click(function(){
	
	const selArr = $.map($(".checkSingle:checked"),function(val){
		return val.value;
	});
	
	if(!selArr.length){
		return ;
	}
	const id = selArr.join(",");
	UnitOption.showModal($confirmMView);
	$confirmBtn.attr("delArr",id);
	
});
// 删除模态框确认按钮
$confirmBtn.click(function(){

	UnitOption.renderTipM($svg_statusBox,"#g-load");
	const id = $(this).attr("delArr");
	$tipText.html("");
	API_szViews.updataRecycle({user_id,id}).then(res=>{
		$svg_statusBox.addClass("g-status");
		if(res){
			const menuIndexArr = $tabCard.data("menuArr").map(val=>{
					  return  val.index ;
			}) ;
			page.tabInit(menuIndexArr);
			UnitOption.renderTipM($svg_statusBox,"#g-success");
		}else{
			UnitOption.renderTipM($svg_statusBox,"#g-error");
		}

	});

})

//复选框事件
$tabContainer.on("click",".checkSingle",function(){
	page.checkSingleHandle($tabContainer);
});


//操作按钮
$ViewContainer.on("click",".tab-opt",function(e){
	

	const type = $(this).attr("node-sign");
	const index = $(this).parent().attr("echo-data");

	const style = $(".style-sel").index();
	const data = style ? $catalogueBox.data("getData")[index] :$tab.datagrid("getData").rows[index];

	const {layout_type,layout_id,layout_icon,layout_icon_name,layout_name} = data ;    
	const last_layoutId = +$ViewContainer.attr("curId");

	switch(type){

		case "pre":
			break;
		case "issue":
			
			 

			  	API_szViews.showReleaseLayout(layout_id).then(res=>{
								if(res){
									
									UnitOption.showModal($issueMView);
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
														page.calendar.setTime([starttime,endtime]);
													}

													break;
												case 1 ://用户
													const status_2 =  user[0] == "-1" ;
													val.checked= status_2 ;

													if(status_2){
														$(val).closest(".item-status").siblings(".org-box").removeClass("active");
													}else{
														$(val).closest(".item-status").siblings(".org-box").addClass("active");

														$org.find(".org-inp").prop("checked",false).removeClass("has-chec");
														user.map(val=>{

															$org.find(`.child-checkinp[value=${val}]`).click();
														})

														
													}
											
													break;
												case 2 :
													const status_3 =  release === 1 ;
													val.checked= status_3 ;
													break;
											}
									  });
								}
				});

			


			break;
		case "copy":
			break;
		case "rename":
			UnitOption.showModal($addMView);
			$parName.parent().hide();
			$addMBtn.attr({"method":"modify"});
			 $inpName.val(layout_name);
			 $inpName.parent().addClass("inp-fill");
			break;
		case "icon":
			e.stopPropagation();
			const $parContainer = $iconBox.parent();
			const status = $parContainer.hasClass("icon-active");
			const $iconBoxItem = $(".iconBox-item");

			$iconBoxItem.css("display","none");
			$iconBoxItem.eq(2-layout_type).css("display","flex");
			$(".icon-sel").removeClass("icon-sel");
			$iconBox.find("."+layout_icon_name.trim()).addClass("icon-sel");

		  !status || last_layoutId !== layout_id ?  $parContainer.addClass("icon-active"): $parContainer.removeClass("icon-active");
			break;
	}


	$ViewContainer.attr("curId",layout_id);

});
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

			API_szViews.updataIcon({icon_id,id}).then(res=>{

				if(res){
					$iconBox.parent().removeClass("icon-active");
					const menuIndexArr = $tabCard.data("menuArr").map(val=>{
					  return  val.index ;
					}) ;

					const style =$(".style-sel").index() ? "catalogue" :"tab";

					page.tabInit(menuIndexArr,style);
				} 
			
				
			});

			break;
		case "close":
			$parContainer .removeClass("icon-active");
			break;
	}

});

$("#iconContainer").on("click",function(e){
	e.stopPropagation();
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
					const timeValue =page.calendar.value;
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
		alert("请选择可见用户！");
		return ;
	}
	
	API_szViews.ReleaseLayout({id,user,starttime,endtime,release}).then(res=>{
		if(res){
			alert("成功！");
			const menuIndexArr = $tabCard.data("menuArr").map(val=>{
					  return  val.index ;
			}) ;
			page.tabInit(menuIndexArr);
			UnitOption.closeModal($issueMView);
		}else{
			alert("发布失败！");
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



 

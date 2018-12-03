import "css/szViews.scss";
import "css/common/dropMenu.scss";

import {Unit,SModal,SInp,Search} from "js/common/Unit.js";
import {api} from "api/szViews.js";
import {IconBox} from "./IconBox.js";
import {DelModal} from "./DelModal.js";
import {AddModal,IssueMView} from "./AddModal.js";
import {TableStyle} from "./Table.js";
import {CatalogueStyle} from "./CatalogueStyle.js";


const {resourse} = window.jsp_config;
const ENV_SRC = resourse ? "index/lists/" : "./" ;


//初始化页面类
class Page  {

	static style = 0 ;
	static cataOpt = {};
	static viewOpt = {};

	constructor(){

		this.btnBox = $("#btnBox");
		this.$tabCard = $("#tabCard");
		this.handle();

		this.getRoleRes().then(res=>{

			this.init();
		});
		
	}
	/**
	 * @param Array {筛选目录}
	 * @return {[type]}
	 */
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
	/**
	 * @return {获取权限按钮}
	 */
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

							if(btn_code=== "delCata"){Page.cataOpt.del = btn_flag;}

							optBoxStr.push(val)

						}else if(catArr.includes(btn_code)){

							cataBoxStr.push(val)

						}else{

							if( btn_code=== "modView"){
								
								Page.viewOpt.pre =  btn_flag==="1";
						
							}else{

								viewBoxStr.push(val);
							}

						}
					});

					this.initOptBox(optBoxStr);
					Page.cataOpt.str = this.initCataBox(cataBoxStr).join("");
					Page.viewOpt.str = this.initViewBox(viewBoxStr).join("");

				}else{
					this.unit.tipToast("获取功能权限出错！","0")
				}

		});
	}
	/**
	 * @param  {[]}
	 * @return {头部操作按钮}
	 */
	initOptBox(arr){

		const config = {
			addCata:["创建目录","sicon sicon-par-1","s-moema"],
			addView:["创建视图","fa fa-plus","s-Toslide"],
			delCata:["","fa fa-trash","s-sacnite"],
		}

		const str = arr.map(val=>{
			const {btn_flag,btn_status,btn_code} = val;
		
			const disable = "";
			const str = btn_flag === "1"  && `<button class="s-btn ${config[btn_code][2]} ${disable}" sign="${btn_code}">
						<i class="${config[btn_code][1]}"></i>
						<span>${config[btn_code][0]}</span>
				</button>` || "";
			return str ;
		});

		this.btnBox.html(str.join(""));
	}
	/**
	 * @param  {图标风格里的操作按钮}
	 * @return {[type]}
	 */
	initCataBox(arr){
		
		const config = {
			modCataIcon:["图标","sicon sicon-btn-3"],
			renameCata:["重命名","sicon sicon-btn-4"],
		}

		return  arr.map(val=>{

					const {btn_flag,btn_status,btn_code} = val;
					const disable =  "";

					const str = btn_flag === "1"  && `<div class="tab-opt s-btn s-Naira ${disable}" node-sign="${btn_code}">
								<i class="${config[btn_code][1]}"></i>	
								<span>${config[btn_code][0]}</span>
						</div>` || "";

					return str ;
		});
	}
	/**
	 * @param  {表格风格操作按钮}
	 * @return {[type]}
	 */
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

					
					
					const disable =  "";

					const str = btn_flag === "1"  && `<div class="tab-opt s-btn s-Naira ${disable}" node-sign="${btn_code}">
								<i class="${config[btn_code][1]}"></i>	
								<span>${config[btn_code][0]}</span>
						</div>` || "";
						return str ;
		});

	}
  init(){

    	const _self = this ;

			this.modal = new SModal();
			this.unit = new Unit();
			this.inp = new SInp();

			const tableCommonMethod = {
				getRoleResStr:()=>{
					return {
							 cataOpt:Page.cataOpt,
	 						 viewOpt:Page.viewOpt
					};
				},
				tabCardInit:(menuArr)=>{
					this.tabCardInit(menuArr);
				},
				toEdit:($this,style)=>{
					this.toEdit($this,style);
				},
				$tabCard:this.$tabCard,
			};

			this.table = new TableStyle(tableCommonMethod);
			this.catalogue  = new CatalogueStyle(tableCommonMethod);
			const CommonMethod = {
						modal:this.modal,
						unit:this.unit,
						reloadStyleBox:()=>{

								const menuIndexArr = this.$tabCard.data("menuArr").map(val=>{
									  return  val.index ;
								});

								const style = Page.style ;
								this.styleBoxrender(menuIndexArr,style);
						},
						getPageStyle:()=>{
							return Page.style ;
						},
			};

			this.addModal = new AddModal(CommonMethod);
			this.issueMView = new IssueMView(CommonMethod);
			this.delModal = new DelModal(CommonMethod);
			this.iconBox = new IconBox(CommonMethod);

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

			this.getUrlSearch();

 	}

 	
	/**
	 * @return {获取页面初始化时选择的视图}
	 */
 	getUrlSearch(){

		let layoutId =  window.location.search.split("=")[1];

		const record = [];
		const recordData = [];

		function findLayout(arr,lev){

			lev ++ ;

			return arr.find((val,index)=>{
				
				const {sub} = val ;
				if(sub.length){
				
					const result = findLayout(sub,lev);
					if(result){
						const {layout_name,layout_id} = val ;
						record[lev -1] = index;
						recordData[lev -1] = {layout_name,layout_id,index};
					}
					return 	result	;
				}else{

					const is_exit = val.layout_id === layoutId ;
					if(is_exit){
						record[lev -1] = index;
						recordData[lev -1] = {index};
					}
					return is_exit;
				}

			})
 		}

		api.getAllLayout().then(res=>{
			
			if(res){

			

				if(layoutId){

					layoutId =  +layoutId;
					findLayout(res.sub,0);
					record.pop();
					this.createTab(res,[0,...record],0);
					const curview = recordData.pop();

					recordData.unshift({layout_name:"我的创建",index:0,layout_id:-2});
					this.table.$tab.datagrid("selectRow",curview.index);
				}else{

					recordData.push({layout_name:"我的创建",index:0,layout_id:-2});
					this.createTab(res,[0],0);
				}

				this.tabCardInit(recordData);
				
				

			}else{
				this.unit.tipToast("视图获取失败！",0);
			}
		});
 	}

 	createTab(res,menuIndexArr,type){

		const copy_dataStr= JSON.stringify(res.sub).replace(/sub/g,"children");
		const copy_data= JSON.parse(copy_dataStr);
		this.search.data = copy_data ;

		const catalogueArr = this.getCatalogue(JSON.parse(copy_dataStr));
		this.addModal.reloadParCatalogCombox([{
				"layout_name":"根目录",
				"layout_id":-2,
				 children:catalogueArr,
		}]);

				
		const  allData = [res] ;
		this.table.$ViewContainer.data("tabData",allData);
				
		let tabData=JSON.stringify(allData);
		    tabData=JSON.parse(tabData);

		//获取当前tab的层级
		menuIndexArr.forEach(function(val){
			tabData = tabData[val].sub
		});

		type===0 ? this.table.loadTab(tabData) : type === 1 ? this.catalogue.catalogueInit(tabData) 
				:this.table.createTreeGrid(copy_data);
 	}

  styleBoxrender(menuIndexArr=[0], type = 0){
		api.getAllLayout().then(res=>{

			if(res){
				this.createTab(res,menuIndexArr,type);
			}else {
				this.unit.tipToast("视图获取失败！",0);
			}
		})
			
  }
    
  tabCardInit(menuArr){

  	const $tabCard = this.$tabCard;
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
			const data = style === 1 ?  this.catalogue.$catalogueBox.data("getData")[index] 
			: style === 0 ? this.table.$tab.datagrid("getData").rows[index] : this.table.$treeTab.treegrid("find",index);
			
			const {layout_name,layout_id,par_id} = data ;

			const str = ENV_SRC + `editTemplate.html?layout_id=${layout_id}&&par_id=${par_id}&&layout_name=${layout_name}`;
		
			$("#slide",window.parent.document).animate({"width":0},500,function(){
			
			$("#content",window.parent.document).addClass("no-head");
			$("#routerConter",window.parent.document).html(`<iframe frameborder="0" id="router" name="myFrameName" src="${str}"></iframe>`);
			});
    }

    getCurTabData(menuArr,curIndex){
		
			let tabData = this.table.$ViewContainer.data("tabData");
			let i = 0;
			while(i<=curIndex){
				tabData=tabData[menuArr[i].index].sub;
				i++;
			}
    	return tabData;
    }

    handleCard($this){//分类选项卡
    	const menuArr = this.$tabCard.data("menuArr");
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
		
		const showView = this.catalogue.$styleView.eq(index);

		this.modal.close(showView.siblings(".style-view"),"style-active");
		this.modal.show(showView,"style-active");

		$this.addClass("style-sel").siblings(".style-item").removeClass("style-sel");

		switch(type){
			case "icon":{
				const tabData = this.table.$tab.datagrid("getData").rows;
				this.catalogue.catalogueInit(tabData);
				this.$tabCard.show();
				break;
			}
			case "list":{
				const tabData = this.catalogue.$catalogueBox.data("getData");
				this.table.loadTab(tabData);
				this.$tabCard.show();
				break;
			}
			case "tree":{

				this.$tabCard.hide();

				if(!reloadData){
					const tabData = this.search.data;
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
			this.$tabCard.on("click",".card",function(){
				const $this = $(this);
				_self.handleCard($this);
				$("#catalogueChecAll").children("input").prop("checked",false);

			});

			//切换显示风格
			$("#styleBox").on("click",".style-item",function(){
				const $this = $(this);
				_self.changeStyle($this);
			});

			//操作按钮
			const $ViewContainer = $("#section");
			$ViewContainer.on("click",".tab-opt",function(e){


				const type = $(this).attr("node-sign");
				const index =Page.style === 1 ? $(this).parent().parent().attr("echo-data") : $(this).parent().attr("echo-data");

				const style = Page.style;

				const data = style === 1 ?  _self.catalogue.$catalogueBox.data("getData")[index] 
				: style === 0 ? _self.table.$tab.datagrid("getData").rows[index] : _self.table.$treeTab.treegrid("find",index);


				const {layout_type,layout_id,layout_icon,layout_icon_name,layout_name,par_id} = data ;    
				const last_layoutId = +$ViewContainer.attr("curId");

				switch(type){

					case "preView":

						if( data.model!="null" && data.model){
						
							$("#content",window.parent.document).addClass("no-head");
							const src = ENV_SRC + "ManageViews.html?layout_id="+layout_id+"&layout_name="+layout_name+"&type=pre";
							$("#routerConter",window.parent.document).html(`<iframe frameborder="0" id="router" name="myFrameName" src="${src}"></iframe>`);

						//	window.location.href = src ;
						
						}else{
							_self.unit.tipToast("该视图获没有模板存在，请去编辑器里创建！",2);
						}

						break;
					case "issueView":{
						if(data.model=="null" || !data.model){
								_self.unit.tipToast("该视图内容为空！",2);
								return ;
						};

				  	api.showReleaseLayout(layout_id).then(res=>{
							if(res){
								_self.issueMView.setMd(res);
							}
						});
						break;
					}
					case "copyView":
						_self.addModal.initMD("view","copy");
						break;
					case "renameCata":
					case "renameView":{
							_self.addModal.setMd(type,layout_name,par_id);
						break;
					}
					case "modViewIcon":
					case "modCataIcon":{
						e.stopPropagation();
						_self.iconBox.setIcon(layout_type,layout_icon_name,last_layoutId,layout_id);

					}
						
				}

				$ViewContainer.attr("curId",layout_id);

			});
		
		_self.btnBox.on("click",".s-btn",function(){

			const $this = $(this);
			const sign = $this.attr("sign");

			switch(sign){
				
				case"addView":{
					_self.addModal.initMD("view");
					break;
				}
				case"delCata":{
					const style =  Page.style;

					let selArr = null;
					if(style===0){
						 selArr = $.map(_self.table.$tabContainer.find(".checkSingle:checked"),function(val){
								return val.value;
					   });
					}else if(style===1){
						 selArr = $.map(_self.catalogue.$catalogueBox.find(".catalogue-chec-inp:checked"),function(val){
								return val.value;
						 });
					}else{
						 selArr = _self.table.$treeTab.treegrid("getCheckedNodes").map(val=>val.layout_id);
					}
					_self.delModal.delHandle(selArr);
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

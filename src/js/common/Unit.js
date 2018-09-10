import "css/common/input.scss";
import "css/common/modal.scss";
import "css/common/common.scss";
import "css/common/button.scss";

import { Calendar } from "js/common/calendar.js";
class Unit {

	constructor(){
		this.initSearch();
	}


	/*
	closeModal($el){

		new Promise(res=>{
			
			$el.removeClass("m-show");
			$el.hasClass("s-tip") && this.initTipM($el.find("#tipText"),$el.find("#statusBox"),$el.find("#g-out"));
			res();
		}).then(()=>{

			setTimeout(function(){
				$el.hide();
			},100);
		})

	}
	*/


	initSearch(){
		// 搜索
		$(".search-btn").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			const state = $wrap.hasClass("active-search");

			if(state){
				return ;
			}

			$wrap.addClass("active-search");
		});

		// 搜索按钮关闭
		$(".search-close").click(function(){
			const $wrap = $(this).closest(".search-wrap");
			$wrap.removeClass("active-search");
		});
	}
	dropMenuHandle($el,callback){

		const $wrap = $el.closest(".dropMenu");
		const state = $wrap.hasClass("active-menu");

		if(state){
			$wrap.removeClass("active-menu");
			setTimeout(function(){
				callback(state);
			 },100);	
	
		}else{
			
			callback(state);
			setTimeout(function(){
				$wrap.addClass("active-menu");
			 },0);
			
		}
	}
	renderDropMenu($el,config){

		const strArr=config.map((val,index)=>{

			const {type,icon,text} = val;
			    
			    return `<li class="menu-item" style="top:${index*30}px" sign="${type}">
			    			<i class="fa ${icon}">&nbsp;&nbsp;</i>
			    			<span>${text}</span>
			    		</li>`;
		});	
		
		$el.html(strArr.join(""));
	}
	
	initTipM($tip,$svg,$circle){
		
		setTimeout(function(){
			$tip.html("确定删除吗？");
			$svg.removeClass("g-status");
			$svg.attr("xlink:href","#g-warn");
			$circle.attr("stroke","#F8C186");
		}, 200);
	}

	renderTipM($svg,status){
		const color = {"#g-success":"#A5DC86","#g-load":"grey","#g-error":"red"};
		$svg.attr({"xlink:href":status,"stroke":color[status]});
		$("#g-out").attr("stroke",color[status]);
	}
}

/*
 下拉框类
 @data:数组
 @multiply:true 多选,
 @dropFormatter:自定义返回的内容，但是主要显示的文字一定要用 item-txt包住
*/

class SInp{
	constructor(){
		this.init();
	}

	init(){
		this.handle();
	}

	handle(){
		$(".s-inp-box .s-inp" ).on("blur",function(){
			
			const val = this.value.trim();
			!val && $(this).addClass("no-fill") || $(this).removeClass("no-fill");
		

		});
	}
}
class SCombobox {

	constructor($el,config){

		const defaultConfig = {
			"prompt":"请选择...",
			"slideIcon":"fa fa-chevron-down",
			"data":[],
			"dropIcon":"fa fa-circle",
			"textField":"text",
			"idField":"id",
			validCombo:true,
			"dropFormatter":null,
			"multiply":false,
			"defaultVal":"",
			 clickCallback:null,
			 width:260,
		}

		this.config = Object.assign({},defaultConfig,config);
		this.box = $el ;
		this.selValue = this.config.defaultVal;
		this.init();

	}

	init(){
		const {width} = this.config;
		this.box.css({"width":width});
		this.box.html(this.initRender());
	    this.handle();
	}

	loadData(data,$el=this.box){
		this.config.data = data;
		const str = this.renderDrop().join("");
		$el.children(".combo-drop").html(`<ul>${str}</ul>`);
	}

	initRender(){

		const {prompt,slideIcon,data,validCombo} = this.config;

		const is_valid = validCombo && "no-fill" || "" ;

		return `
				<div class="combo-inp ${is_valid}">
					<input type="text" class="s-inp combo-text" placeholder="${prompt}" readOnly="readOnly"/>
					<input type="hidden" class="s-inp combo-value"  value="${this.selValue}"/>
					<span class="slide-icon ${slideIcon}">
					</span>
				</div>
				<div class="combo-drop ">
					<ul>
						${this.renderDrop().join("")}
					</ul>
				</div>
				`
	}

	setValue(values,$el=this.box){

	   const $drop = $el.children(".combo-drop").children("ul");

	   if(this.config.multiply){
	   	 	$drop.html(this.renderDrop(values));
	   }else{
			$drop.children(`li[echo-id=${values}]`).addClass("active").siblings().removeClass("active");
	   }

	  this.updateInpBox($drop);
	}

	getValue($el=this.box,node="id"){

		const selIds =  $el.find(".combo-value").val();

		if(node=="id"){
			return selIds;
		}else{

			const {data,idField} = this.config;
			return this.config.data.filter(val=>{


				return selIds.includes(val[idField]);

			})
		}
		
	}
	clearValue($el=this.box){

		const $inp = $el.find(".combo-value");
		this.selValue = "" ;
		 $inp.val(null);
		 $inp.siblings(".combo-text").val(null);
		$el.find(".active").removeClass("active");
			
	}
	updateInpBox($drop){
		
		const inpBox = $drop.parent().siblings();
        const comboText = inpBox.children(".combo-text"),
        	  comboValue=inpBox.children(".combo-value");

		const txts = [];
		const ids = $.map($drop.children(".active"),(val,index)=>{
				
				const $val = $(val);
				txts[index] = $val.children(".item-txt").text();

				return $val.attr("echo-id") ;
		});
		this.selValue = ids;
		comboText.val(txts.join(","));
		comboValue.val(ids.join(","));
	}

	renderDrop(values=this.selValue){

		const {data,dropIcon,textField,idField} = this.config;
		return data.map((val,index)=>{

			const id = val[idField];
			const active = values.includes(id) && "active" || "" ;

			return `<li class="drop-item ${active}" echo-id="${id}">
						<span class="${dropIcon}"></span>
						<b class="item-txt">${ this.config.dropFormatter && this.config.dropFormatter(val) || val[textField] }</b>
					</li>`

		});
	}

	handle(){

		const self = this ;
		
		//选择item
		this.box.on("click",".drop-item",function(e){

			if(self.config.multiply){
			//	e.stopPropagation();	
			}

			e.stopPropagation();

			const $this= $(this);
			let status = null ;
			const is_self = $this.hasClass("active");
			if(self.config.multiply){
				 is_self &&  $this.removeClass("active")|| $this.addClass("active");
				 status	= !is_self;
			}else{
				if(is_self){
					return ;
				}
				status = self.getValue();
				$this.addClass("active").siblings().removeClass("active");
				
			}
			// 更新inp里所选择的值
			const par = $this.parent();
			self.updateInpBox(par);

			//单选时，关闭下拉框
			!self.config.multiply && self.hideUp(self.box);

			//回调函数
			if(self.config.clickCallback){
				const id = $this.attr("echo-id");
				const node = self.config.data.find(val=>{
					return val[self.config.idField] == id ;
				});
				self.config.clickCallback(node,self,status);
			}

		});

		this.box.on("click",".combo-inp",function(e){

			e.stopPropagation();
			const $this= $(this);
			const par = $this.parent();

			const is_active = par.hasClass("active");

			!is_active ? self.showDown(par) : self.hideUp(par,function($el){
				const $inp = par.find(".combo-value");
				 $inp.val() && $inp.parent().removeClass("no-fill") || $inp.parent().addClass("no-fill");
			});

		});



	}

	showDown(par,callback){
	
		par.children(".combo-drop").show();
		requestAnimationFrame(function(){
           par.addClass("active");
        });

        
	}

	hideUp(par){
		 par.removeClass("active");
		 const $drop = par.children(".combo-drop");
       	 $drop.hide();

       	 this.config.validCombo && this.valid(par.children(".combo-inp"));
	}

	valid($par){
		const $inp = $par.children(".combo-value");
       	$inp.val() ? $par.removeClass("no-fill") : $par.addClass("no-fill");
	}
}

/*
  模态框类
*/
class SModal{

	constructor(){
		this.handle();
	}

	init(){

	}

	close($el,className="m-show"){
		$el.removeClass(className);
		requestAnimationFrame(function(){
			$el.hide();
		});
	}

	show($el,className="m-show"){
		$el.show();
		requestAnimationFrame(function(){
			$el.addClass(className);
		});
	}

	handle(){
		const self = this;
		$(".m-close").click(function(e){
			const Modal = $(this).closest(".s-modal");
			self.close(Modal);
		});

		let moveStatus = null;
		let moveTarget = null;
		let moveOffset = null ;

		$(".m-title").mousedown(function(e){

			const target = e.target || e.srcElement;

			if(target.classList.contains("m-title")){
				moveStatus = "move";
				moveTarget = $(this).closest(".s-modal");
	     		moveOffset = {x:e.offsetX,y:e.offsetY} ;
			}
		});

		$(window).on("mousemove",function(e){

			const event = e || window.events;
			
			if(moveStatus){
				const x = e.clientX  - moveOffset.x;
				const y = e.clientY - moveOffset.y;
				moveTarget[0].style.transform = `translate(${x}px,${y}px)`;
				moveTarget[0].style.top = 0;
				moveTarget[0].style.left = 0;
			}

			return ;

		});

		$(".m-title").on("mouseup",function(){
			
			moveStatus = null;
			moveTarget = null ;
			moveOffset = null ;


		});

		
	}
}

/*
  tree结构类
  judgeRelation:true：目录 ,false:文件
*/

class Tree{

	constructor($el,config){

		const defaultConfig = {
			"data":[],
			"textField":"text",
			"idField":"id",
			"childIcon":"fa fa-user-circle-o",
			"parIcon":"fa fa-folder-open-o",
			"checkbox":false,
			"formatter":null,
			 "clickCallback":function(){
			 },
			 "checkCallback":function(){
			 },
			 "clickAndCheck":true,
			 "childrenField":"children",
			 "judgeRelation":(val)=>{//自定义判断是目录还是文件的函数

					return val[defaultConfig.childrenField].length > 0 ;

			 }
		}

		this.config = Object.assign({},defaultConfig,config);
		this.box = $el ;
		this.init();

	}

	init(){

		const {data} = this.config;
		const str = this.renderOrgJson(data,0);
		this.box.html(`<ul class="s-tree">${str.join("")}</ul>`);
		this.handle();
	}

	changeType(checkbox){
		this.config.checkbox = checkbox;
		this.box.unbind();
		this.init();
	}


    renderOrgJson(arr,_lev){

    	let lev = _lev ;
    		lev ++ ;

    		const {idField,textField,childrenField,judgeRelation,childIcon,parIcon,formatter} = this.config ;

		return arr.map((val,index)=>{
			

			const id = val[idField],
				  name =!formatter && val[textField] || formatter(val),
				  children = val[childrenField],
				  par_id = val["par_id"];


		    const type = judgeRelation(val);


			let data = {id,name,lev,par_id} ;

			if(type){


 				data.parIcon=parIcon;
				let  childrenEl = this.renderOrgJson(children,lev);

				return this.parentComponent(childrenEl,data);

			}else{
				data.childIcon=childIcon;
				const item = this.childComponent(data);
			
				return 	item;					
			
			}
		})
	}
	
	parentComponent(child,data){

		let {name,id,lev,par_id}= data;
		const {parIcon,checkbox} = this.config;

		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");

		const checkboxStr =checkbox &&  `<span class="s-checkbox">
						<input type="checkbox" class="par-checkinp tree-inp" value="${id}"  /><label class="fa fa-square-o" ></label>
				</span>` || "";

		return (`
			<li  lev="${lev}" class="tree-li">
				<div class="menuItem par-item" echo-id="${id}">
					${indent + checkboxStr}
					<i class="${parIcon}"></i>
					<span class="item-txt">${name}</span><span class="tree-slide-icon"><i class="fa fa-caret-down  "></i></span>
				</div>
				<ul class="par-menu">${child.join("")}</ul>
			</li>
		`);

	}

	childComponent(data){

		let {name,id,lev}= data;
		const {childIcon,checkbox} = this.config;

		const checkboxStr =checkbox &&  `<span class="s-checkbox">
						<input type="checkbox" class="child-checkinp tree-inp" value="${id}"  /><label class="fa fa-square-o" ></label>
				</span>` || "";


		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");
	
		return (`
			<li lev="${lev}" class="tree-li">
				<div class="menuItem child-item" echo-id="${id}">
				${indent + checkboxStr }
				<i class="${childIcon}">&nbsp;</i>
				<span class="item-txt">${name}</span>
				</div>
			</li>
		`);		
	}

	handle(){

		const {clickCallback,clickAndCheck,checkbox,checkCallback} = this.config;

		const self = this;

		this.box.on("click",".tree-slide-icon",function(e){
			
			e.stopPropagation();
			const parLi = $(this).closest(".tree-li");
			const $parDiv = $(this).parent();

			$parDiv.hasClass("tree-active") && $parDiv.removeClass("tree-active") || $parDiv.addClass("tree-active");

			const parMenu =parLi.children(".par-menu"); 
    		parMenu.slideToggle();

    	});

    	this.box.on("click",".child-item",function(){
			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();
			
			if(checkbox){
				
			}else{
				
				$this.closest(".s-tree").find(".active").removeClass("active");
				$this.addClass("active");
			}

			clickCallback(node,$this);

    	});

    	this.box.on("click",".par-item",function(){
			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();

			checkbox && clickCallback(node,$this);

    	});

    	this.box.on("click",".tree-inp",function(e){

    		 e.stopPropagation();
			const $this= $(this);
    		const status = $this.prop("checked");
    		const type =  $this.hasClass("par-checkinp");
			const par_li =  $this.closest(".tree-li");

			if(type){
				par_li.find(".has-chec").removeClass("has-chec");
				par_li.find(".tree-inp").prop("checked",status);
			}

			let lev = par_li.attr("lev");
			if(lev!=="1"){
				
				let up_par_li =  $this.closest(".tree-li");

				while (lev > 1 ){
					  up_par_li = up_par_li.parent().parent();
					  lev = +up_par_li.attr("lev");
 					  const checkEl = up_par_li.children(".menuItem").find(".tree-inp");
 					  const ul_par =  up_par_li.children(".par-menu") ;
					  const ul_par_leg = ul_par.children().length;
					  const check_leg = ul_par.children().children(".menuItem").find(".tree-inp:checked").length;

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
			
			const node = self.findNode( +$this.val());
			checkCallback(node, $this);
    	});

	}
	setValue(ids,$el=this.box){

		$el.find(".tree-inp").prop("checked",false).removeClass("has-chec");
		ids.map(val=>{
			$el.find(`.child-checkinp[value=${val}]`).click();
		});
	}

	getValue(fieldCount,$el=this.box){
		
		if(this.config.checkbox){
			return $.map(this.box.find(".child-checkinp:checked"),val=>{
			 	  const id = val.value ;
					return fieldCount === "id" && id || this.findNode(id);
			});

		}else{

			const id = this.box.find(".active").attr("echo-id");

			const flag = fieldCount === "id" && id || this.findNode(id);

			return [flag] ;

		}
		
	}

	findNode(id){

		let node = null ;
		
		const {childrenField,idField,data}  = this.config ;

		findFn(data);

		function findFn(arr){
			return arr.find(val=>{
				const status = val[idField] == id ;
				if(status){
					node = val ;
				}

				if(val[childrenField].length){
				
					return !status && findFn(val[childrenField]) || status;
				
				}else{
					return status;
				}

			});
		}
		
		return node;
	}
}






/*
 下拉框类
 data:数组
 multiply:true 多选,
 dropFormatter:自定义返回的内容，但是主要显示的文字一定要用 item-txt包住
*/
class SComboTree {

	constructor($el,config){

		const defaultConfig = {
			"prompt":"请选择...",
			"slideIcon":"fa fa-chevron-down",
			"defaultVal":"",
			 validCombo:true,
			 width:300,
		}

		this.config = Object.assign({},defaultConfig,config);
		this.box = $el ;
		this.init();

	}

	init(){
		const {width} = this.config;
		this.box.css({"width":width});
		this.box.html(this.initRender());
		this.renderDrop();
	    this.handle();
	}

	initRender(){

		const {prompt,slideIcon} = this.config;

		const checkbox = this.config.treeConfig.checkbox || false ;

		const inpStr = !checkbox && `<input type="text" class="s-inp combo-text" placeholder="${prompt}" readOnly="readOnly"/>` || `<textarea type="text" class="s-textarea combo-text" placeholder="${prompt}" readOnly="readOnly"/></textarea>` ;

		return `
				<div class="combo-inp no-fill">
					${inpStr}
					<input type="hidden" class="s-inp combo-value"  value=""/>
					<span class="slide-icon ${slideIcon}">
					</span>
				</div>
				<div class="combo-drop ">
					<ul class="s-tree"></ul>
				</div>
				`
	}

	setValue($el,values){

	  this.tree.setValue($el,values);
	  this.updateInpBox($el,values);
	}

	getValue(){
			
		return this.tree.getValue("all");
		
	}
	clearValue($el=this.box){

		const $inp = $el.find(".combo-value");
		$inp.val(null);
		$inp.siblings(".combo-text").val(null);

	}
	updateInpBox($drop,node){
		
		const {checkbox} = this.tree.config;
		const inpBox = $drop.siblings();
        const comboText = inpBox.children(".combo-text"),
        	  comboValue=inpBox.children(".combo-value");

		let txts = [],
		    ids = [];

		if(checkbox){
			txts = $.map($drop.find(".child-checkinp:checked"),function(val,index){
					const $this = $(val);
					ids[index]=$this.val();
					return $this.parent().siblings(".item-txt").text();
			});

		}else{
			const {id,txt} = node ;
			txts[0] = txt;
			ids[0] = id;
		}

		comboText.val(txts.join(","));
		comboValue.val(ids.join(","));
	}

	renderDrop(){

		const treeBox = this.box.children(".combo-drop");

		const {clickCallback:clickHandle,checkCallback:checkHandle} = this.config.treeConfig;

		const clickCallback = (node,$dom)=>{

			    const id = node[this.tree.config.idField];
			    const txt = node[this.tree.config.textField];
			    const curTreeBox = $dom.closest(".combo-drop");

				this.updateInpBox(curTreeBox,{id,txt});
				!this.tree.config.checkbox && this.hideUp(this.box);
				clickHandle && clickHandle(node);
		}

		const checkCallback = (node,$dom)=>{

			    const curTreeBox = $dom.closest(".combo-drop");
				this.updateInpBox(curTreeBox);
				checkHandle && checkHandle(node);
		}

			
		const treeConfig =Object.assign({},this.config.treeConfig,{clickCallback,checkCallback});
		
		this.tree = new Tree(treeBox,treeConfig);
	}

	handle(){

		const self = this ;
		
		this.box.on("click",".combo-inp",function(e){
			e.stopPropagation();
			const $this= $(this);
			const par = $this.parent();
			const is_active = par.hasClass("active");

			!is_active ? self.showDown(par) : self.hideUp(par);

		});
	}

	showDown(par){

		par.children(".combo-drop").show();
		requestAnimationFrame(function(){
           par.addClass("active");
        });

      
	}

	hideUp(par){
		 par.removeClass("active");
         par.children(".combo-drop").hide();
    	 this.config.validCombo && this.valid(par.children(".combo-inp"));
	}

	valid($par){
		const $inp = $par.children(".combo-value");
       	 	$inp.val() ? $par.removeClass("no-fill") : $par.addClass("no-fill");
	}
}

export {Unit,SCombobox,SModal,Calendar,Tree,SComboTree,SInp};
import "css/common/input.scss";
import "css/common/modal.scss";
import "css/common/common.scss";
import "css/common/button.scss";

import { Calendar } from "js/common/calendar.js";



class Unit {

	constructor(){
		this.tipInit();
		this.initSearch();
	}
	JsonTofind(obj,value){

		const defaultConfig = {
			childField:"children",
			keyField:"id",
			data:[],
			
		}

		const config = Object.assign({},defaultConfig,obj);

		const {childField,keyField,data} = config;
		
		let result = null ;

		function findJson(_arr){

			return _arr.find(val=>{

				const child = val[childField] ;

				const is_key = val[keyField] === value;

				if(is_key){
					result = val ;
					return true ;
				}

				if(child.length){
					return findJson(child);
				}
			})
		}

		findJson(data);
		
		return result ;

	}
	tipToast(txt,status=true){

		const icon = ``;

		const itemStr = `<div class="tip-item tip1">
							<p class="tip-close">
								<span class="j-close"><i class="fa fa-times"></i></span>
							</p>
							<p class="tip-txt"><i class="fa fa-warning"></i><span>${txt}</span></p>
							<div class="tip-progress"></div>
						</div>`;
	  this.$tipBox.append(itemStr);

	  const $tip  = $(".tip-item:last-child");

	  setTimeout(function(){
		$tip.remove();
	  },2000);
	}


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
	tipInit(){
		this.$tipBox = $("#tipToast");
		this.$tipBox.on("click",".j-close",function(){
			 $(this).closest(".tip-item").remove();
		});
	}
}




class MyWebSocket{

	static heartflag = false ;
	static tryTime = 0 ;
	
	constructor(config){

		this.config = {
						url:"ws://localhost:8099/ManageViews/connect",
						userId:3,
					};



		if (!window.WebSocket) {
           alert("您的浏览器不支持ws<br/>");
            return;
        }
		

		this.initSocket();
		this.handle();


	}

	initSocket(){

		const {url,userId} = this.config ;
		
		this.webSocket = new WebSocket(url+"/"+userId);

	}

	heart() {

        if (MyWebSocket.heartflag){
           this.webSocket.send("&");
           console.log("  心跳 <br/>");
        }

        setTimeout("this.heart()", 10*60*1000);

    }

  	send(message){
        this.webSocket.send(message);
    }


	handle(){

		const webSocket = this.webSocket ;
		const _self = this ;
		// 收到服务端消息
        webSocket.onmessage = function (msg) {
            if(msg.data == "&"){

            }else{
                console.log("  收到消息 : "+msg.data);
            }
        };

        // 异常
        webSocket.onerror = function (event) {
            MyWebSocket.heartflag = false;
           console.log(" 异常 ");
        };

        // 建立连接
        webSocket.onopen = function (event) {
            MyWebSocket.heartflag = true;
            _self.heart();
           console.log("建立连接成功");
            MyWebSocket.tryTime = 0;
        };

        // 断线重连
        webSocket.onclose = function () {
            MyWebSocket.heartflag = false;
            // 重试10次，每次之间间隔10秒
            if (MyWebSocket.tryTime < 10) {
                setTimeout(function () {
                    _self.webSocket = null;
                    MyWebSocket.tryTime++;
                    _self.initSocket();
                    console.log("  第"+MyWebSocket.tryTime+"次重连");
                }, 3*1000);
            } else {
                alert("重连失败.");
            }
        };

	}
}



class DropMenu{
	constructor($el, obj) {

		const defaultConfig = {
			data: [],
			buttonIcon: 'fa fa-plus',
			dropIcon: 'fa fa-chevron-down',
			buttonTxt:"新增",
			itemH:30,
			itemCallback:function(){
				
			},
			slideCallBack:function(){

			}
		};

		this.config = Object.assign({}, defaultConfig, obj);
		this.box = $el;

		this.init();
		this.handle();

	}
	init() {
		
		const buttonStr = this.renderButtons();
		const dropStr =`<ul class="menu-box">${this.renderDrop().join('')}</ul>`;

		this.box.html(buttonStr + dropStr);
	}

	renderDrop() {
		const {
			data,itemH
		} = this.config;

		return data.map((val,index) => {
			const {
				icon,
				text,
				id
			} = val;
			return `<li class="menu-item" echo-data = '${id}' style="top:${index*itemH}px">
  					<span class="drop-icon">
  						<i class='${icon}'></i>
  					</span>
  					<span class="drop-text">
  						${text}
  					</span>
				</li>`

		});
	}

	renderButtons() {

		const {
			dropIcon,buttonIcon,buttonTxt
		} = this.config ;

		return `<div class="menu-btn">
					<span>
					  <i class="${buttonIcon}"></i>
						${buttonTxt}
					</span>
					<span class="s-Divider"></span>
					<span class="dropmenu-icon">
						<i class="${dropIcon}"></i>
					</span>
				</div>`;
	}
	reload(data){
		this.config.data = data ;
		const str = this.renderDrop().join("");
		this.box.find(".menu-box").html(str);
	}
	handle() {
      const _self = this ;
		/**
		 * [下拉菜单展开]
		 * @param  {[type]} ){                   	  const $this [description]
		 * @return {[type]}     [description]
		 */
      this.box.on('click','.menu-btn',function(){

      	  const $this = $(this);
      	  const $par = $this.parent('.drop-menu');
      	  const $drop = $this.siblings('.menu-box');

      	  if($par.hasClass('active')){
			$par.removeClass('active');
      	  	window.requestAnimationFrame(function(){
				$drop.hide();
			});
      	  }else{
      	  	$drop.show();
      	  	_self.config.slideCallBack();
      	  	window.requestAnimationFrame(function(){
      	  		$par.addClass('active');
      	  	})
      	  }


      });

      this.box.on('click','.menu-item',function(){

			const $this= $(this);

			_self.config.itemCallback($this);
		    _self.box.removeClass("active");
		    _self.box.children(".menu-box").hide();


      })
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

		$(".num-valid").on("blur",function(){

			var state=this.validity;
		    !state.valid?$(this).addClass("no-fill"): $(this).removeClass("no-fill");

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
			"validCombo":true,
			"dropFormatter":null,
			"multiply":false,
			"defaultVal":"",
			 clickCallback:null,
			 width:260,
			 textarea:false,
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
		const $drop = $el.children(".combo-drop");
		$drop.html(`<ul>${str}</ul>`);

		const ids = this.updateInpBox($drop.children());


		!ids.length &&  this.config.validCombo && $el.children(".combo-inp").addClass("no-fill");

	}
	

	initRender(){

		const {validCombo} = this.config;

		const is_valid = validCombo && "no-fill" || "" ;



		return `
				<div class="combo-inp ${is_valid}" >
					${this.renderInpBox()}
				</div>
				<div class="combo-drop ">
					<ul class="drop-ul">
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

			const {data,idField,textField} = this.config;
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
		this.config.validCombo && $inp.parent().addClass("no-fill");
		$el.find(".active").removeClass("active");
			
	}
	updateInpBox($drop){
		
		const inpBox = $drop.parent().siblings();
        const comboText = inpBox.children(".combo-text"),
        	  comboValue=inpBox.children(".combo-value");

        const {data,idField,textField} = this.config;

		const txts = [];
		const ids = $.map($drop.children(".active"),(val,index)=>{
				
				const $val = $(val);
			    const id  = $val.attr("echo-id");
				const node = txts[index] = data.find(val=>val[idField] == id);
				txts[index] = node &&　node[textField] || "";

				return id;
		});
		this.selValue = ids;
		comboText.val(txts.join(","));
		comboValue.val(ids.join(","));

		return this.selValue ;
	}

    renderInpBox(){

    	const {textarea , multiply ,prompt,slideIcon} = this.config;

		const htmlType = (textarea || multiply) && `<textarea  class="s-textarea combo-text" placeholder="${prompt}" readOnly="readOnly"></textarea>` || `<input type="text" class="s-inp combo-text" placeholder="${prompt}" readOnly="readOnly"/>`;

    	return `
					${htmlType}
					<input type="hidden" class="s-inp combo-value"  value="${this.selValue}"/>
					<span class="slide-icon ${slideIcon}">
					</span>
				`
    }

	renderDrop(values=this.selValue){

		const {data,dropIcon,textField,idField,dropFormatter} = this.config;
		return data.map((val,index)=>{

			const id = val[idField];
			const active = values.includes(id) && "active" || "" ;

			return `<li class="drop-item ${active}" echo-id="${id}">
						<span class="${dropIcon}"></span>
						<b class="item-txt">${ dropFormatter && dropFormatter(val) || val[textField] }</b>
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
			"search":true,
			"idField":"id",
			"childIcon":"fa fa-user-circle-o",
			"parIcon":"fa fa-folder-open-o",
			"slideIcon":"fa fa-minus-square-o",
			"checkbox":false,
			"formatter":null,
			"parClick":false,
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
		this.handle();
	}

	init(){

		const {data,search} = this.config;
		const str = this.renderOrgJson(data,0);
		const searchStr = search  ? `<div class="tree-search">
										<label >
											<input type="text" class="s-inp" placeholder="搜索..." />
											<span class="search-close">
												<i class="fa fa-times"></i> 
											</span>
										</label>
										<button class="s-btn j-search"><i class="fa fa-search-plus"></i></button>
									</div>` : "";
		this.box.html(`${searchStr}<ul class="s-tree">${str.join("")}</ul>`);
		
	}

	changeType(checkbox){
		this.config.checkbox = checkbox;
		this.box.unbind();
		this.init();
	}

	seachTree(key){
			
		const {data,childrenField,textField,judgeRelation} = this.config ;


		function filterJson(arr){

			return arr.filter(val=>{
				const child = val[childrenField];
				const type = judgeRelation(val);
				const text = val[textField];

				if(type){

					if(child.length){

						const result = filterJson(child) ;

						val[childrenField] = result ;
						
						return result.length;
			
					}else{
						return false ;
					}

				}else{

					const is_key = val[textField].includes(key);


					if(child.length){

						const result = filterJson(child) ;
							val[childrenField] = result ;
						
						return result.length || is_key;
			
					}else{


						return is_key;
					}
				}
			})

		}
		const copy_data = JSON.parse(JSON.stringify(data));
		
		return filterJson(copy_data);

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

	async reload(key=""){

		let data = data = this.config.data;
		if(key){

			data = this.seachTree(key);		
		}
		const str = this.renderOrgJson(data,0);
		this.box.find(".s-tree").html(str);
	}
	
	parentComponent(child,data){

		let {name,id,lev,par_id}= data;
		const {parIcon,checkbox,slideIcon} = this.config;

		const  indent =new Array(lev).fill(`<span class="indent"></span>`).join("");

		const checkboxStr =checkbox &&  `<span class="s-checkbox">
						<input type="checkbox" class="par-checkinp tree-inp" value="${id}"  /><label class="fa fa-square-o" ></label>
				</span>` || "";

		return (`
			<li  lev="${lev}" class="tree-li">
				<div class="menuItem par-item" echo-id="${id}">
					${indent + checkboxStr}
					<i class="${parIcon}"></i>
					<span class="item-txt">${name}</span><span class="tree-slide-icon"><i class="${slideIcon}"></i></span>
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

		const {clickCallback,clickAndCheck,checkbox,checkCallback,parClick} = this.config;

		const self = this;

		this.box.on("click",".tree-slide-icon",function(e){
			
		    e.stopPropagation();
			const parLi = $(this).closest(".tree-li");
			const $parDiv = $(this).parent();

			$parDiv.hasClass("tree-active") && $parDiv.removeClass("tree-active") || $parDiv.addClass("tree-active");

			const parMenu =parLi.children(".par-menu"); 
    		parMenu.slideToggle();

    	});

    	this.box.on("click",function(e){
			e.stopPropagation();
    	});

    	this.box.on("click",".child-item",function(e){

			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();
			
			if(checkbox){
				
			}else{
				//關閉下拉框
				$this.closest(".s-tree").find(".active").removeClass("active");
				$this.addClass("active");
			}

			clickCallback(node,$this);

    	});

    	this.box.on("click",".search-close",function(){
			const $this = $(this);
			$this.siblings(".s-inp").val(null);
			$this.hide();

			self.reload();
		
    	});

    	this.box.on("click",".j-search",function(){
			const $this = $(this);
			const $close = $this.siblings("label").children(".search-close");

			$close.show();

			const key = $close.siblings(".s-inp").val().trim();

			if(!key){
				return ;
			}

		    self.reload(key);


			
    	});


    	this.box.on("click",".par-item",function(){
			const $this = $(this);
			const node = self.findNode( +$this.attr("echo-id"));
		
			checkbox && clickAndCheck && $this.find(".tree-inp").click();

			checkbox && clickCallback(node,$this);

			if(!checkbox && parClick){
				clickCallback(node,$this);
				$this.closest(".s-tree").find(".active").removeClass("active");
				$this.addClass("active");
			}

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

	setSingleValue(id,$el=this.box){
		$el.find(`.menuItem[echo-id=${id}]`).click();
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

	setValue(values,$el = this.box){
		
	  this.tree.setValue(values);
	  this.updateInpBox($el,values);

	}

	getValue(){
			
		return this.tree.getValue("all");
		
	}
	clearValue($el=this.box){

		const $inp = $el.find(".combo-value");
		$inp.val(null);
		$inp.siblings(".combo-text").val(null);
		
		this.config.validCombo && $inp.parent().addClass("no-fill");
		
		this.config.treeConfig.checkbox && $el.find(".tree-inp").prop("checked",false).removeClass("has-chec") || $el.find(".active").removeClass("active");
		

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

export {Unit,SCombobox,SModal,Calendar,Tree,SComboTree,SInp,DropMenu,MyWebSocket};
import {View,Border,STable} from "js/ManageViews/view.js";
import {api} from "api/editTemplate.js";
import {api as _api} from "api/ManageViews.js";
/**
 * 模板组件
 */
class TemplateView  {

	static positionArr = [
			"t-left","t-middle","t-right",
			"m-left","m-middle","m-right",
			"b-left","b-middle","b-right",
		];


	constructor($el,config) {
	   
	   this.config = config;
	   this.box = $el;
	   this.resiziEl = $("#m-resize");
	   this.gLayout =$("#g-layout");
	   this.templateBox = $("#templateBox");
	   this.templateContainer = $("#g-templateDom");


	   this.startPointX=null;
	   this.startPointY=null;
	   this.cellSize = null ;

	   this.changeStatus = false ;
	   this.init();
       this.handle();
	}

	getTemplate(){

		
		const str = this.templateBox.html();
				
		this.templateContainer.html(str);

		this.templateContainer.find(".view-content").html(null);
		this.templateContainer.find(".bgSvg").html(null);
		const htmlStr = this.templateContainer.html();
		return {
			htmlStr,
			box:this.templateContainer
		}

	}
	throttle(fn,interval){

		let timer = null ;
		let is_first = true ;
		return function(){

				const _me = this;
				const _args = arguments;


				if(is_first){
					fn.apply(_me,_args);
					return is_first = false ; 
				}

				if(timer){return false}

				timer = setTimeout(function(){
			
					window.clearTimeout(timer);
					timer = null ;
					fn.apply(_me,_args);
				}, interval);
		}


	}

	

	 getInitCellSize(){

	 	if(this.cellSize){
	 		return  this.cellSize;
	 	}

		const $viewTemplate = $("#viewTemplate");
		const minWidth =  $viewTemplate.width()    / 3 + 10;
		const minHeight = $viewTemplate.height()   / 3 + 10;
		const minTop = +$viewTemplate.css("paddingTop").match(/\d+/g)[0];
		const minLeft = +$viewTemplate.css("paddingLeft").match(/\d+/g)[0];

		this.cellSize = {
			minWidth,
			minHeight,
			minTop,
			minLeft,
		} ;

		return this.cellSize ;
	}
	
	

	createView(config){
		const {id,type,item,box} = config;

		const {addViewData,unit} = this.config;

		const method={
			table:{
				getDataUrl:"getTableData",
				configName:"tabInfo",
			},
			chart:{
				getDataUrl:"getGraphData",
				configName:"graphInfo",
			},
		}
		const _typeObj = method[type];

		_api[_typeObj.getDataUrl](id).then(res=>{

				if(res.data && res.data.length){
					const node = res.data ;
					const obj = res[_typeObj.configName];
					const borderEl = box.find(".bgSvg");

					const viewObj = {
						$box:box,
						htmlStr:false,
						borderType: borderEl.length && borderEl.attr("echo-type") || "0",
						viewId:id,
						status:"edit",
					};


					addViewData(obj,type,res,viewObj);

				}else{
					unit.tipToast("没数据！",3);
					box.removeClass("view-fill");
					box.attr("echo-id","");
				}
		});

	}


	renderTemplateViews(){

		const _self = this ;

		const views = this.templateBox.find(".view-item.view-fill");

		$.map(views,(val,index)=>{
			(function(item,$val){
				const viewType = $val.attr("echo-type"),
					  id =  $val.attr("echo-id");

			  	const type =  ["line","pie","scatter","bar","rader"].includes(viewType) && "chart" || viewType ; 
				_self.createView({item,box:$val,type,id});
			})(index,$(val));
			
		});
				
	}

	init(e){

		const layout_id = window.parent.menuID;

		const templateMap = this.config.templateMap;


		api.showLayoutModel(layout_id).then(res=>{

			let templateStr = "";

			if(!res.model){

				templateStr = res.model;
				this.box.html(templateStr);
				this.viewDrop();
				this.renderTemplateViews();

			}else{

				const positionArr =TemplateView.positionArr;
				const strArr = positionArr.map(val=>`<div class="view-item ${val}" draggable="true"   style="grid-area:${val}"></div>`);
				
				templateStr = `<div class="view-template "  echo-theme="theme4" id="viewTemplate" style='grid-template-areas:
				    "t-left t-middle t-right"
					"m-left m-middle m-right"
					"b-left b-middle b-right ";'>${strArr.join("")}</div>`;

				this.box.html(templateStr);

				const viewDomArr = Array.from(this.box.find(".view-item"));

				const xAxis = ["left","middle","right"];
				const yAxis = ["t","m","b"];

				const templateData = TemplateView.positionArr.map(val=>{

					const point = val.split("-");
					const x = xAxis.indexOf(point[1]) ;
					const y = yAxis.indexOf(point[0]) ;


						return {
							size:[1,1],
							point:[x,y,val],
							viewID:"",
							borderType:"0",
							type:"",
							par:"",
						}
				});
				templateMap.init(viewDomArr,templateData);
				this.viewDrop();
			}

		});
		
	}


	showResizeBox($el){

		const width = $el[0].offsetWidth + 20 ;
		const height = $el[0].offsetHeight + 20;
		const top = $el[0].offsetTop;
		const left = $el[0].offsetLeft;

		this.getInitCellSize();

 		this.curViewSize = {
 			curTop:top,
 			curLeft:left,
 			width,
 			height
 		}

		


		this.resiziEl.css({
			width,
			height,
			top,
			left,
		});

	}

	move(e,type){


		const resiziEl = this.resiziEl;

		const {startPointX,startPointY} = this;

		const moveX = e.clientX - startPointX ;
		const moveY = e.clientY - startPointY ;

		const directionObject = {
			left:-1,
			middle:0,
			right:1,
			t:-1,
			m:0,
			b:1
		};

		const positionObject = {
			left:1,
			middle:0,
			right:0,
			t:1,
			m:0,
			b:0,
		};
		
		const {
			minWidth,
			minHeight,
			minTop,
			minLeft,
		} = this.cellSize;

		const {
			width,
			height,
			curTop,
			curLeft,
		} = this.curViewSize;



		const [axixY,axixX] = type.split("-");

		let _width = width + moveX*directionObject[axixX];
		const W = _width < minWidth ;
		_width = W && minWidth || _width ;

		let _height = height + moveY*directionObject[axixY];
		const H = _height < minHeight ;
		_height = H && minHeight || _height ;


		let _top = curTop + moveY*positionObject[axixY];
		
		let add = null;
		if(H){
		  _top = curTop   + ( height - minHeight)*positionObject[axixY] ;
		}

		let _left =  curLeft + moveX*positionObject[axixX]  ;
		if(W){
			_left = curLeft + (width - minWidth)*positionObject[axixX] ;
		}
		resiziEl.css({
			width:_width ,
			height:_height,
			top: _top,
			left:_left,
		});
	}
	changeViewSize(e){

		const  {minWidth,minHeight} = this.cellSize; 

		const  curWid = this.resiziEl.width();
		const  curHei = this.resiziEl.height();

		const roateX = Math.round(curWid / minWidth);
		const roateY = Math.round(curHei / minHeight);
	
		
		this.changeStatus = false ;
		const result = this.mergeCell([roateX,roateY]);

		if(!result){
			this.config.unit.tipToast("合并失败,请不要包含组件，以及与其他组件重叠！",0);
			this.resiziEl.hide();
		}
	}

	judgeCellOver(oldView,newView){

		const {size,point} = newView;
		const {size:oldSize,point:oldPoint} = oldView;
		
		
		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];

		const 	cur_y_index = point[1], 
		     	cur_x_index = point[0];

		const cur_x =  cur_x_index + size[0] ;
		const cur_y =  cur_y_index + size[1] ;

		const old_x_index =  oldPoint[0] ;
		const old_y_index =  oldPoint[1] ;
		const old_x =  old_x_index + oldPoint[0] ;
		const old_y =  old_y_index +  oldPoint[1] ;

		

		if(old_x_index < cur_x_index || old_x > cur_x || cur_y < old_y || old_y_index < cur_y_index){

			return true ;
		
		}else{

			return false ;
		}
		
		
	}

	showCell(config){

		const {templateMap} = this.config;

		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];	

		const {newView,oldView,rotate} = config;

		const {attributeObj:{size,point}} = oldView;
		const {attributeObj:{point:newPoint}} = newView;

		const lastAreaX = Xaxis.slice(point[0],  +size[0] + point[0]);
		const lastAreaY = Yaxis.slice(point[1],  +size[1] + point[1]);

		const curAreaX = Xaxis.slice(newPoint[0],  +rotate[0] + newPoint[0]);
		const curAreaY = Yaxis.slice(newPoint[1],  +rotate[1] + newPoint[1]);


		let flagData = lastAreaX;

		lastAreaY.map(y=>{
			
			if(curAreaY.includes(y)){
				const lastLeg = lastAreaX.length ;
				const curLeg = curAreaX.length ;
				const add_count = lastLeg - curLeg ;
				const otherX =	add_count <= 0 ? [] : lastAreaX[0] === curAreaX[0] ? lastAreaX.slice(curLeg) : lastAreaX.slice(0,add_count);
				flagData = otherX;
			}

			flagData.map(x=>{
				const viewClass = y + "-" + x;

				const {dom,value} = templateMap.findViewByPoint(viewClass);
				const cell =$(dom);

				cell
				.removeClass("view-hide")
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
				});

				value.attributeObj.size=[1,1];


			});
			
		});
	};

	mapHideXaxis(data,y,parName,canMergeArr,parArr){

		const {templateMap} = this.config;

		let is_over = false ;

		for(let j = 0 , leg = data.length; j < leg ; j++){

			const x = data[j];
			const viewClass = y + "-" + x;
			const {dom,value:{attributeObj:{size,par,point}}} = templateMap.findViewByPoint(viewClass);
			const cell =$(dom);
			if(cell.hasClass("view-fill")){
					return false ;
			}

			viewClass !== parName && canMergeArr.push(cell);
					
			const is_scale = size[0] + size[1];

						
			if(cell.hasClass("view-hide") && !parArr.includes(par)){
								
				parArr.push(par);
				const {dom:parDom,value:{attributeObj:{size:parSize,point:parPoint}}} = templateMap.findViewByPoint(par);

				const $par = $(parDom);

				if($par.hasClass("view-fill")){
					return false ;
				}

					is_over =  this.judgeCellOver({size:parSize,point:parPoint},{size,point});

				}else if(is_scale > 2){
							
					 parArr.push(viewClass);
					 is_over =  this.judgeCellOver({size,point},{size,point});

				}

				if(is_over){ // 结束循环
					return false;	
				}

			}

			return true ;
	}


	hideCell(config){

		const {templateMap} = this.config;

		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];	

		const {newView,oldView,rotate,is_changeDom} = config;



		const {attributeObj:{size,point}} = oldView;
		const {attributeObj:{point:newPoint}} = newView;

		const parName = newPoint[2];

		const lastAreaX = Xaxis.slice(point[0],  +size[0] + point[0]);
		const lastAreaY = Yaxis.slice(point[1],  +size[1] + point[1]);

		const curAreaX = Xaxis.slice(newPoint[0],  +rotate[0] + newPoint[0]);
		const curAreaY = Yaxis.slice(newPoint[1],  +rotate[1] + newPoint[1]);

		const canMergeArr  = [];

		const parArr = [] ;

		const lastLeg = lastAreaX.length ;
		
		let is_over = true ;

		for(let i = 0 ,legY = curAreaY.length ; i < legY ;i++){

			const y = curAreaY[i];

			let flagData = curAreaX ;

			if(lastAreaY.includes(y)){//在同一行

				const add_count = curAreaX.length - lastLeg ;
				const flagData =	add_count <= 0 ? [] : lastAreaX[0] === curAreaX[0] ? curAreaX.slice(lastLeg) : curAreaX.slice(0,add_count);
					
			}

			is_over = this.mapHideXaxis(flagData,y,parName,canMergeArr,parArr);

			if(!is_over){
				return false;
			}

		}

		canMergeArr.map(val=>{

			val.addClass("view-hide")
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
				});

			const view = templateMap.viewsMap.get(val[0]);
			const {attributeObj} = view;
			attributeObj.size=[1,1];
			attributeObj.par=parName;
		});

		if(is_changeDom){

			const {old,news} = config;

			old
			.removeClass("view-active")
			.addClass("view-hide")
			.css({
					"grid-column-end": "span 1",
					"grid-row-end": "span 1",
			});

			const view =  templateMap.viewsMap.get(old[0]);
			const {attributeObj} = view;
			attributeObj.size=[1,1];
			attributeObj.par="";


			news
			.addClass("view-active")
			.removeClass("view-hide");

		}

		return true ;
	}

	replaceView($this){

		const {templateMap} = this.config;

		const name = type.split("@")[0];

		const dragData = templateMap.findViewByPoint(name);
		const {dom,value:view} = dragData;
		const $dragEl = $(dom);
		const {attributeObj:{size:dragSize,type:_viewType}} = view;

		if( view.attributeObj.point[2] === name){
			return;
		}

		const view_1 = templateMap.viewsMap.get($this[0]);
	

		const has_fill = $this.hasClass("view-fill");

		const {attributeObj:{size,type:_viewType1}} = view_1;


		const w = size[0];
		const y = size[1];
		
		const {object,node,viewType,borderType,viewId} = view;


		const border = borderType!=="0" && `<div class="bgSvg" echo-w="${w}" echo-y="${y}" echo-type="${borderType}"></div>` || "";

		const htmlStr = border+`<div class="view-content"></div>`;

		$this.attr({"echo-type":_viewType});
		const viewObj = {
				$box:$this,
				htmlStr:htmlStr,
				borderType,
				viewId,
				status:"edit"
		}

		addViewData(object,viewType,node,viewObj);

		if(has_fill){


			const size = $dragEl.attr("echo-size").split(",");
			const w = size[0];
			const y = size[1];
		
			const {object,node,viewType,borderType,viewId} = view_1;


			const border = borderType!=="0" && `<div class="bgSvg" echo-w="${w}" echo-y="${y}" echo-type="${borderType}"></div>` || "";

			const htmlStr = border+`<div class="view-content"></div>`;

			$dragEl.attr({"echo-type":_viewType1});

			const viewObj = {
					$box:$dragEl,
					htmlStr:htmlStr,
					borderType,
					viewId,
					status:"edit"
			}

			addViewData(object,viewType,node,viewObj);

		}else{
			$dragEl.attr({"echo-id":""});
			delViewData($dragEl[0]);
			$dragEl.html("").removeClass("view-fill");
		}
	}

	viewDrop(){
		const $template = $(".view-item");
		const viewsArr = Array.from($template);
		const {upModalStatus,getViewData,delViewData,addViewData} =  this.config;

		viewsArr.map((val,index)=>{
			val.ondragover = function(ev) {
				
				ev.stopPropagation();
				ev.preventDefault();

				return true;
			};
			val.ondrop = function(ev) {

				ev.stopPropagation();
				ev.preventDefault();

				const $this = $(this);

				/**
				 * [type 只有左边的组件被设置过type,被拖拽放下的时候会被获取到类型，如果如果拖拽时，获取不到类型，说明拖拽的不是左侧的组件]
				 * @type {[table,line，....]}
				 */
				const type = ev.dataTransfer.getData("type");

				if(type.includes("@")){

					this.replaceView($this);
						
					return ;
				}


				if(!type || $this.hasClass("view-fill")){
					return ;
				}

				$this.attr({"echo-type":type});
				$this.addClass("view-active").siblings().removeClass("view-active");

				const size = $this.attr("echo-size").split(",");
				upModalStatus(type,size,$this);
			};




			val.onselectstart = function(ev) {

				return false;
			};
			val.ondragstart = function(ev) {

				const has_fill = ev.target.classList.contains("view-fill");
				
				if(!has_fill){
					return ;
				}
				const type = ev.target.getAttribute("echo-point");
				const sekin = type +"@";

				ev.dataTransfer.effectAllowed = "move";
				ev.dataTransfer.setData("type", sekin);
				ev.dataTransfer.setDragImage(ev.target, 0, 0);
				return true;
			};
			val.ondragend = function(ev) {
				/*拖拽结束*/
				ev.dataTransfer.clearData("type");
				return false
			};
		});
	}

	
	/**
	 * [mergeCell description]
	 * @param  {[Arr]} rotate [要放大的数据，一个对象，roateX:宽，curMergeY：长]
	 * @param  {[dom]} resiziEl [放大拖动的框]
	 * @param  {[String]} echo-direction [directionY,directionX 拖动的方向]
	 * @param  {[Map]} templateMap [保存模板数据的集合]
	 * @return {[type]}        [description]
	 */
	

	getChangeView(merger,$oldEl){

		const oldView ="" ;

		const [curMergeX,curMergeY] = merger;

		//用来改变方向
		const axisobject={left:-1, middle:0, right:0, t:-1, m:0, b:0};

		 const newOriginY_index =	Yaxis.indexOf(originY) +  (curMergeY - lastMergeY) * axisobject[directionY];
		 const newOriginX_index =	Xaxis.indexOf(originX)  +  (curMergeX - lastMergeX) * axisobject[directionX];

			let newOriginY = Yaxis[newOriginY_index];
			let newOriginX = Xaxis[newOriginX_index];
			
			let flagView = null ;

			const newPoint = [...templateMap.viewsMap.keys()].find(key=>{

				const val =	templateMap.viewsMap.get(key);

				const status = val.attributeObj.point === (newOriginY + "-" + newOriginX);

						flagView =  status && val || null ;

				return status;

			});

			handleGridItem = $(newPoint);

			const [cur_pointY,cur_pointX] =	flagView.attributeObj.point;
			cur_index_x = Xaxis.indexOf(cur_pointX);
			cur_index_y = Yaxis.indexOf(cur_pointY);		


	}
	mergeCell(rotate){

		
		const $activeView = $(".view-active"); 
		const resiziEl = this.resiziEl ;
		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");

		
		//获取dom对应的Map里的数据	
		const {templateMap} = this.config;
		const view = templateMap.viewsMap.get($activeView[0]);
		

		let   flagViewData = null ,
			  is_changeDom = false,
			  flagViewDom = null;

		if(directionY === "t" || directionX === "left"){// dom改变
			
			//现在要变成的大小
			const [curMergeX,curMergeY] = rotate;

			const {attributeObj:{size,point}} = view;
			//之前的大小
			const [lastMergeX,lastMergeY] = size;
			//之前的位置，根据拖动的方向可能会改变位置
			const [originY,originX] = point;

			const Yaxis = ["t","m","b"];
			const Xaxis = ["left","middle","right"];

			//用来改变方向
			 const axisobject={left:-1, middle:0, right:0, t:-1, m:0, b:0};

			 const y =	originY +  (curMergeY - lastMergeY) * axisobject[directionY];
			 const x =	originX  +  (curMergeX - lastMergeX) * axisobject[directionX];

			let newOriginY = Yaxis[y];
			let newOriginX = Xaxis[x];
			const newPointName = newOriginY + "-" + newOriginX;

			const findMapObj = templateMap.findViewByPoint(newPointName);

			flagViewData = findMapObj.value;
			flagViewDom = $(findMapObj.dom);
			is_changeDom = true ;



		}else{

			flagViewData = view ,
		    flagViewDom = $activeView ;

		}

		const is_over_1 = this.hideCell({
			old:$activeView,
			news:flagViewDom,
			newView:flagViewData,
			oldView:view,
			rotate,
			is_changeDom,
		});

		if( !is_over_1 ){ return false } ;

		// 还原之前的；
		this.showCell({newView:flagViewData,oldView:view,rotate});

		const newSize = flagViewData.attributeObj.size;

		/*设置*/
		flagViewDom
		.css({
				"grid-column-end": "span " + rotate[0],
				"grid-row-end": "span " + rotate[1],
		});
		
		/*改变组件状态size*/
		flagViewData.attributeObj.size = rotate ;
		

		resiziEl.hide();

		//重新加载组件
		this.reloadView({newEl:flagViewDom,oldEl:$activeView},rotate);

		return true ;
	}
	reloadView(boxObj,config){

		const {newEl,oldEl} = boxObj;

		if(!oldEl.hasClass("view-fill")){
			return ;
		}

		const {getViewData} = this.config;

		const data = getViewData(oldEl[0]);

		const {viewType} = data ;
		const [curMergeX,curMergeY] = config;

		if(newEl !== oldEl){
			const {delViewData,addViewData} = this.config;
			oldEl.html(null).removeClass("view-fill");

			const viewId = oldEl.attr("echo-id");
		    oldEl.attr("echo-id","");

			const _viewType = oldEl.attr("echo-type");
		
			delViewData(oldEl[0]);

			const {object,node,borderType} = data ;

			const border_str = borderType  === "0" ?"" : `<div class="bgSvg" echo-w="${curMergeX}" echo-y="${curMergeY}" echo-type="${borderType}"></div>`;

			const htmlStr = border_str + `<div class="view-content"></div>`;	
			const viewObj = {
				$box:newEl,
				htmlStr,
				borderType,
				viewId:viewId,
				status:"create",
			};

			addViewData(object,viewType,node,viewObj);

			newEl.attr("echo-type",_viewType);



		}else{

			switch(viewType){
				case "table":{
						const {node,borderType} = data ;
				 new STable(newEl.find(".chart"),{border:borderType},node);	
				}
				break;
				case"chart":{
					echarts.getInstanceByDom(newEl.find(".chart")[0]).resize();	
				}
				break;
			}
			
			const borderBox = newEl.find(".bgSvg");
			if(borderBox.length){
				
				borderBox.attr({"echo-y":curMergeY,"echo-w":curMergeX});
				const {id ,object:{chartName}} = data ;
				new Border(borderBox,{id,title:chartName});
			}
		}
	}

	handle(){

		const _self = this;
		const $templateBox = _self.templateBox;
		const { getViewData ,delViewData,setModalSel} = _self.config;

		const $template = $(".view-item");
		const viewsArr = Array.from($template);


		$templateBox.on("dblclick",".view-item",function(e){

			e.stopPropagation();
			 const $this = $(this);
			 _self.resiziEl.show();
			
			 $this.addClass('view-active').siblings().removeClass("view-active");

			 _self.showResizeBox($this);
		});

		this.resiziEl.on("mousedown",".u-resize-icon",function(e){
			const $this= $(this);
			const type = $this.attr("sign");

			_self.resiziEl.attr("echo-direction",type);

			_self.gLayout[0].onmousemove= _self.throttle(function(isFirst){

				_self.move(isFirst,type);

			} ,60);
			
			_self.changeStatus = true;

			_self.startPointX=e.clientX;
	  		_self.startPointY=e.clientY;
			
		});

		_self.gLayout.on("mouseup",function(){
				
			_self.gLayout[0].onmousemove = null;
			
			if(_self.changeStatus){
			
				_self.changeViewSize();
			}
			

		});

		$(window).on("resize",function(){
			_self.getInitCellSize();
		});
		

		$templateBox.on("click",".btn-handle",function(){
			$(this).toggleClass("active");
		});

		$templateBox.on("click",".view-btn",function(){

			const $this = $(this);
			
			const type = $this.attr("sign");
			const par = $this.closest(".view-item");
			const view = getViewData(par[0]);

			
			switch(type){

				case "expand":
					
					
					break;
				case "set":{

					const {object,borderType} = view ;

					const viewType = par.attr("echo-type");
					const size = par.attr("echo-size").split(",");

					const selObj = {
						borderType,
						object,
					};

					setModalSel(viewType,size,par,selObj);

				}
				break;
				case "compress":
				
					break;
				case "remove":

					delViewData(par[0]);
					par.html(null);
					par.removeClass("view-fill");

					break;
				case "filter":

					break;
			}
		});

	}
}

export {TemplateView};
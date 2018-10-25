import {View,Border,STable} from "js/ManageViews/view.js";
import {api} from "api/editTemplate.js";
import {api as _api} from "api/ManageViews.js";
/**
 * 模板组件
 */

class ChangeView{

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

	judgeCellOver(compareView,curView){

		const {size,point} = curView;
		const {size:oldSize,point:oldPoint} = compareView;
		
		
		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];

		const 	cur_y_index = point[1], 
		     	cur_x_index = point[0];

		const cur_x =  cur_x_index + size[0] ;
		const cur_y =  cur_y_index + size[1] ;

		const old_x_index =  oldPoint[0] ;
		const old_y_index =  oldPoint[1] ;
		const old_x =  old_x_index + oldSize[0] ;
		const old_y =  old_y_index +  oldSize[1] ;

		

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


		let flagData = null;

		lastAreaY.map(y=>{
			
			if(curAreaY.includes(y)){
				const lastLeg = lastAreaX.length ;
				const curLeg = curAreaX.length ;
				const add_count = lastLeg - curLeg ;
				const otherX =	add_count <= 0 ? [] : lastAreaX[0] === curAreaX[0] ? lastAreaX.slice(curLeg) : lastAreaX.slice(0,add_count);
				flagData = otherX;
		
			}else{

				flagData = lastAreaX ;
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
				value.attributeObj.par="";


			});
			
		});
	};

	mapHideXaxis(data,y,parName,canMergeArr,parArr,newAreaObj){

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

				is_over =  this.judgeCellOver({size:parSize,point:parPoint},newAreaObj);

			}else if(is_scale > 2){
							
				 parArr.push(viewClass);
				 is_over =  this.judgeCellOver({size,point},newAreaObj);

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

			let flagData = null ;

			if(lastAreaY.includes(y)){//在同一行

				const add_count = curAreaX.length - lastLeg ;
				flagData =	add_count <= 0 ? [] : lastAreaX[0] === curAreaX[0] ? curAreaX.slice(lastLeg) : curAreaX.slice(0,add_count);
					
			}else{

				flagData = curAreaX ;
			}

			const newAreaObj = {point:newPoint,size:rotate}

			is_over = this.mapHideXaxis(flagData,y,parName,canMergeArr,parArr,newAreaObj);

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
			attributeObj.par= parName;
		});

		

		if(is_changeDom){
			
			config.old.addClass("view-hide");
			curAreaY.forEach(y=>{
				curAreaX.forEach(x=>{
					const viewPoint = y + "-" + x ;
					if(viewPoint !== parName){
						const viewData = templateMap.findViewByPoint(viewPoint);
						const attributeObj = viewData.value.attributeObj;
						attributeObj.par = parName ;
					}
				});
			});
		}

		return true ;
	}

	mergeCell(rotate,$activeView,view){

	
		const resiziEl = this.resiziEl ;
		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");
		
		//获取dom对应的Map里的数据	
		const {templateMap} = this.config;
		
		const {attributeObj:{size,point}} = view;

		let   flagViewData = null ,
			  is_changeDom = false,
			  flagViewDom = null;

		if(directionY === "t" || directionX === "left"){// dom改变
			
			//现在要变成的大小
			const [curMergeX,curMergeY] = rotate;

			
			//之前的大小
			const [lastMergeX,lastMergeY] = size;
			//之前的位置，根据拖动的方向可能会改变位置
			const [originX,originY] = point;

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

		if(is_changeDom){

			$activeView
			.removeClass("view-active")
			.css({
					"grid-column-end": "span 1",
					"grid-row-end": "span 1",
			});

			view.attributeObj.size=[1,1];
		}

			flagViewDom
			.addClass("view-active")
			.removeClass("view-hide")
			.css({
					"grid-column-end": "span " + rotate[0],
					"grid-row-end": "span " + rotate[1],
			});
			/*改变组件状态size*/
			flagViewData.attributeObj.size = rotate ;
			flagViewData.attributeObj.par = "";
		

		resiziEl.hide();

		//重新加载组件
		this.reloadView({newEl:flagViewDom,oldEl:$activeView},rotate);

		return true ;
	}
	reloadView(boxObj,rotate){

		const {newEl,oldEl} = boxObj;

	/*	if(!oldEl.hasClass("view-fill")){
			return ;
		}*/

		const {templateMap} = this.config;

		const viewMap = templateMap.viewsMap.get(oldEl[0]);

		const {attributeObj:{type,size,borderType,viewID,createId},viewData} = viewMap ;


		if(newEl !== oldEl){
			
			const newViewMap =  templateMap.viewsMap.get(newEl[0]);

			const {attributeObj} = newViewMap;

			attributeObj.viewID = viewID ;
			attributeObj.createId = createId ;
			attributeObj.type = type ;


			const _type = type === "table" && "tabInfo" || "graphInfo";

			const viewTitle = viewData[_type].chartName ;

			const attr = {borderType,type,viewTitle,viewID,createId}

			templateMap.add(viewData,newEl,attr,"replace");
			newViewMap.attributeObj.size = rotate ;
			this.delViewData(oldEl);

		}else{
			
			let chartName ;

			const _type = type !== "table" && "chart" || "table";

			switch(_type){
				case "table":{
				     new STable(newEl.find(".chart"),{border:borderType},viewData);	
				     chartName = viewData.tabInfo.chartName;
				}
				break;
				case"chart":{
					echarts.getInstanceByDom(newEl.find(".chart")[0]).resize();	
					chartName = viewData.graphInfo.chartName;
				}
				break;
			}
			
			if(borderType!=="0"){
				const borderBox = newEl.find(".bgSvg");

				borderBox.attr({"echo-y":size[1],"echo-w":size[0]});

				new Border(borderBox,{id:viewID,title:chartName});
			}
			viewMap.attributeObj.size = rotate ;
		}
	}
 }

class TemplateView  extends ChangeView {

	static positionArr = [
			"t-left","t-middle","t-right",
			"m-left","m-middle","m-right",
			"b-left","b-middle","b-right",
		];


	constructor($el,config) {

	  super();
	   
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
	
	

	createView(val,viewID,$dom){

		const {templateMap} = this.config;
		const {type,borderType,size} = val;

		const _type = ["line","pie","scatter","bar","rader"].includes(type) ? "chart" : type ;

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
		const _typeObj = method[_type];

		_api[_typeObj.getDataUrl](viewID).then(res=>{

				if(res.data && res.data.length){

					const viewTitle = res[_typeObj.configName].chartName;
					templateMap.initAdd($dom,borderType,viewTitle,res,size,type);

				}else{
					unit.tipToast("没数据！",3);
					box.removeClass("view-fill");
					box.attr("echo-id","");
				}
		});

	}


	renderTemplateViews(modelData){

		const {templateMap} = this.config;
		const _me =this;

		const views = this.templateBox.find(".view-item");
		const templateData = JSON.parse(modelData);
		templateData.map((val,index)=>{

			const dom = views[index];
			const $dom = $(dom);
			templateMap.viewsMap.set(dom,{attributeObj:{create:"",...val},viewData:null});
			const viewID = val.viewID;

			if(viewID){
				
				!function(_val,_viewID,_dom){

					_me.createView(_val,_viewID,_dom);

				}(val,viewID,$dom);

			}
		})
		
				
	}

	init(e){

		const layout_id = window.parent.menuID;

		const templateMap = this.config.templateMap;


		api.showLayoutModel(layout_id).then(res=>{

			let templateStr = "";

			if(res.model){

				templateStr = res.model;
				this.box.html(templateStr);
				this.viewDrop();
				this.renderTemplateViews(res.modelData);
			}else{

				const positionArr =TemplateView.positionArr;
				const strArr = positionArr.map(val=>`<div class="view-item " draggable="true" id="${val}"  style="grid-area:${val}"></div>`);
				
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

	
	changeViewSize(e){

		const  {minWidth,minHeight} = this.cellSize; 

		const  curWid = this.resiziEl.width();
		const  curHei = this.resiziEl.height();

		const roateX = Math.round(curWid / minWidth);
		const roateY = Math.round(curHei / minHeight);
	
		this.changeStatus = false ;

       const $activeView = $(".view-active"); 
	   const view = this.config.templateMap.viewsMap.get($activeView[0]);
	   const size = view.attributeObj.size;

		if( roateX=== size[0] &&  roateY=== size[1] ){

			return ;
		}
	  

		const result = this.mergeCell([roateX,roateY],$activeView,view);

		if(!result){
			this.config.unit.tipToast("合并失败,请不要包含组件，以及与其他组件重叠！",0);
			this.resiziEl.hide();
		}
	}

	

	replaceView($this,type){

		const {templateMap} = this.config;

		const name = type.split("@")[0];

		const dragData = templateMap.findViewByPoint(name);
		const {dom,value:view} = dragData;
		const $dragEl = $(dom);
		const {viewData,attributeObj:{type:_viewType,borderType,point,createId,viewID}} = view;
		

		const view_1 = templateMap.viewsMap.get($this[0]);
		const has_fill = $this.hasClass("view-fill");

		const {attributeObj:{point:point_1}} = view_1;

		if( point_1[2] === name){
			return;
		}

		const {viewData:viewData_copy,attributeObj:{type:_viewType_1,borderType:borderType_1,createId:createId_1,viewID:viewID_1}} = view_1;

		const viewData_1 = JSON.parse(JSON.stringify(viewData_copy));

		const chartArr = ["line","pie","scatter","bar","rader"];
		const method = chartArr.includes(_viewType) ? "graphInfo" : "tabInfo" ;

		const attr = {borderType,type:_viewType,viewTitle:viewData[method].chartName,createId,viewID};
		templateMap.add(viewData,$this,attr,"replace");

		if(has_fill){
			
			const method = chartArr.includes(_viewType_1) ? "graphInfo" : "tabInfo" ;
		
			const viewTitle = viewData_1[method].chartName ;
				console.log(viewTitle);

			const attr = {borderType:borderType_1,type:_viewType_1,viewTitle,createId:createId_1,viewID:viewID_1};
			templateMap.add(viewData_1,$dragEl,attr,"replace");

		}else{

			view.attributeObj.viewID = "";
			this.delViewData($dragEl);
		}
	}

	viewDrop(){
		const $template = $(".view-item");
		const viewsArr = Array.from($template);
		const {upModalStatus} = this.config;

		const _me = this;

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

					_me.replaceView($this,type);
						
					return ;
				}


				if(!type || $this.hasClass("view-fill")){
					return ;
				}

				$this.addClass("view-active").siblings().removeClass("view-active");
				upModalStatus(type,$this);
			};



			val.onselectstart = function(ev) {

				return false;
			};
			val.ondragstart = function(ev) {

				const has_fill = ev.target.classList.contains("view-fill");
				
				if(!has_fill){
					return ;
				}
				const view = _me.config.templateMap.viewsMap.get(ev.target);
				const type = view.attributeObj.point[2] + "@";

				ev.dataTransfer.effectAllowed = "move";
				ev.dataTransfer.setData("type", type);
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
	
	delViewData(dom){
		this.config.templateMap.remove(dom);
	}
	

	handle(){

		const _self = this;
		const $templateBox = _self.templateBox;
		const {setModalSel} = _self.config;
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

			
			switch(type){

				case "expand":
					
					
					break;
				case "set":{

					setModalSel(par);

				}
				break;
				case "compress":
				
					break;
				case "remove":

					_self.delViewData(par);
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
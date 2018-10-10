import {Border } from "js/ManageViews/svgBorder.js";
import {STable} from "js/ManageViews/sTable.js";
/**
 * 模板组件
 */
class TemplateView {

	static positionArr = [
			["t-left","t-middle","t-right"],
			["m-left","m-middle","m-right"],
			["b-left","b-middle","b-right"]
		];


	constructor($el,config) {
	   
	   this.config = config ;
	   this.box = $el;
	   this.resiziEl = $("#m-resize");
	   this.gLayout =$("#g-layout");
	   this.templateBox = $("#templateBox");

	   this.startPointX=null;
	   this.startPointY=null;
	   this.cellSize = null ;

	   this.changeStatus = false ;
	   this.init(64);
       this.handle();
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


	init(e){
		
		const positionArr =[].concat(...TemplateView.positionArr);

		const strArr = positionArr.map(val=>`<div class="view-item ${val}" echo-size="1,1" echo-point="${val}" style="grid-area:${val}">${val}</div>`);

		this.box.html(`<div class="view-template theme2"  id="viewTemplate" style='grid-template-areas:
		    "t-left t-middle t-right"
			"m-left m-middle m-right"
			"b-left b-middle b-right ";'>${strArr.join("")}</div>`);
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
		const result = this.mergeCell({roateX,roateY});

		if(!result){
			alert("合并失败");
			this.resiziEl.hide();
		}
	}

	judgeCellOver(cellPar,area){
		
		
		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];


		const {cur_Xarea, cur_Yarea} = area ;

		const 	cur_y_index = Yaxis.findIndex(val=> cur_Yarea[0] === val), 
		     	cur_x_index = Xaxis.findIndex(val=> cur_Xarea[0] === val);

		const cur_x =  cur_x_index + cur_Xarea.length ;
		const cur_y =  cur_y_index + cur_Yarea.length ;

		const {	par_originX, par_originY, parMergeX, parMergeY} = cellPar;

		const cell_x_index =  Xaxis.findIndex(val=>par_originX === val) ;
		const cell_y_index =  Yaxis.findIndex(val=>par_originY === val) ;
		const cell_x =  cell_x_index + +parMergeX ;
		const cell_y =  cell_y_index + +parMergeY ;

		

		if(cell_x_index < cur_x_index || cell_x > cur_x || cur_y < cell_y || cell_y_index < cur_y_index){

			return true ;
		
		}else{

			return false ;
		}
		
		
	}

	showCell(lastObj,curObj){

		const {lastAreaX, lastAreaY} = lastObj ;
		const {cur_Xarea, cur_Yarea} = curObj ;


		lastAreaY.map(y=>{
			
			if(cur_Yarea.includes(y)){

				const lastLeg = lastAreaX.length ;
				const curLeg = cur_Xarea.length ;

				const add_count = lastLeg - curLeg ;

				const otherX =	add_count <= 0 ? [] : lastAreaX[0] === cur_Xarea[0] ? lastAreaX.slice(curLeg) : lastAreaX.slice(0,add_count);
				
				otherX.map(x=>{
					const viewClass = y + "-" + x;
					$("." + viewClass)
					.removeClass("view-hide")
					.attr({
						"echo-size":"1,1",
						"echo-par":"",
					})
					.css({
							"grid-column-end": "span 1",
							"grid-row-end": "span 1",
					});
				});
				
			}else{

				lastAreaX.map(x=>{
					const viewClass = y + "-" + x;
					$("." + viewClass)
					.removeClass("view-hide")
					.attr("echo-size","1,1")
					.css({
							"grid-column-end": "span 1",
							"grid-row-end": "span 1",
					});
				});
			}

			
		});
	};

	hideCells(lastObj,curObj,par){

		const {lastAreaX, lastAreaY} = lastObj ;
		const {cur_Xarea, cur_Yarea} = curObj ;
		
		cur_Yarea.map(y=>{
			
			if(lastAreaY.includes(y)){

				const lastLeg = lastAreaX.length ;
				const curLeg = cur_Xarea.length ;

				const add_count = curLeg - lastLeg ;

				const otherX =	add_count <= 0 ? [] : lastAreaX[0] === cur_Xarea[0] ? cur_Xarea.slice(lastLeg) : cur_Xarea.slice(0,add_count);
				
				otherX.map(x=>{
					const viewClass = y + "-" + x;

					if(viewClass===par){

					//	return ;

					}

					$("." + viewClass)
					.addClass("view-hide")
					.attr({
						"echo-size":"1,1",
						"echo-par":par,
					})
					.css({
							"grid-column-end": "span 1",
							"grid-row-end": "span 1",
					});
				});
				
			}else{

				cur_Xarea.map(x=>{
					const viewClass = y + "-" + x;

					if(viewClass===par){

						//return ;

					}
					$("." + viewClass)
					.addClass("view-hide")
					.attr("echo-size","1,1")
					.css({
							"grid-column-end": "span 1",
							"grid-row-end": "span 1",
					});
				});
			}
			
		});

		return true ;
	}

	hideCell(lastObj,curObj,parName,compareEl){


		const {lastAreaX, lastAreaY} = lastObj ;
		const {cur_Xarea, cur_Yarea} = curObj ;
		const canMergeArr  = [ ];

		const parArr = [] ;

		const lastLeg = lastAreaX.length ;
		const curXLeg = cur_Xarea.length ;
		let is_over = false ;

		for(let i = 0 ,legY = cur_Yarea.length ; i < legY ;i++){

			const y = cur_Yarea[i];

			if(lastAreaY.includes(y)){

				const add_count = curXLeg - lastLeg ;
				const otherX =	add_count <= 0 ? [] : lastAreaX[0] === cur_Xarea[0] ? cur_Xarea.slice(lastLeg) : cur_Xarea.slice(0,add_count);

				for(let j = 0 , leg = otherX.length; j < leg ; j++){

					const x = otherX[j];
					const viewClass = y + "-" + x;

					
						const cell = $("." + viewClass);
						if(cell.hasClass("view-fill")){
								return false ;
						}

						viewClass !== parName && canMergeArr.push(cell);
					
						const [cellScaleX , cellScaleY] = cell.attr("echo-size").split(",");
						const is_scale = (+cellScaleX ) + (+cellScaleY);

						
						
						if(cell.hasClass("view-hide") ){
							const par = cell.attr("echo-par");
							if(!parArr.includes(par)){
								
								parArr.push(par);
								const $par = $("." + par);
								if($par.hasClass("view-fill")){
									return false ;
								}
								const [par_originY,par_originX] = par.split("-");
								const [parMergeX,parMergeY] = $par.attr("echo-size").split(",");

								is_over =  this.judgeCellOver({
									par_originX, par_originY, parMergeX, parMergeY
								},curObj);
							}
						}else if(is_scale > 2){
							
							 parArr.push(viewClass);
							 is_over =  this.judgeCellOver({
								par_originX:x, par_originY:y, parMergeX:cellScaleX, parMergeY:cellScaleY
							},curObj);

						}

					if(is_over){
						return false;	
					}

				}

			}else{
				
				for(let j = 0  ; j < curXLeg ; j++){
					const x = cur_Xarea[j];
					const viewClass = y + "-" + x;

						const cell = $("." + viewClass);
						viewClass !== parName && canMergeArr.push(cell);

						const [cellScaleX , cellScaleY] = cell.attr("echo-size").split(",");
						const is_scale = (+cellScaleX )+ (+cellScaleY);


						if(cell.hasClass("view-fill")){
								return false ;
						}

						if(cell.hasClass("view-hide")){

							const par = cell.attr("echo-par");
							
							if(!parArr.includes(par)){
								parArr.push(par);
								const $par = $("." + par);
								
								if($par.hasClass("view-fill")){
									return false ;
								}

								const [par_originY,par_originX] = par.split("-");
								const [parMergeX,parMergeY] = $par.attr("echo-size").split(",");

								is_over =  this.judgeCellOver({
									par_originX, par_originY, parMergeX, parMergeY
								},curObj);
							}
						
						}else if(is_scale > 2){
							
							 parArr.push(viewClass);
							 is_over =  this.judgeCellOver({
								par_originX:x, par_originY:y, parMergeX:cellScaleX, parMergeY:cellScaleY
							},curObj);

						}
					if(is_over){
						return false;	
					}

				}


			}
		}

		canMergeArr.map(val=>{

			val.addClass("view-hide")
				.attr({
					"echo-size":"1,1",
					"echo-par":parName,
				})
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
				});

		});

		const {old,news} = compareEl ;
		if(old !== news ){

			old
			.removeClass("view-active")
			.addClass("view-hide")
			.attr({
					"echo-size":"1,1",
					"echo-par":cur_Yarea[0] + "-" + cur_Xarea[0],
				})
			.css({
					"grid-column-end": "span 1",
					"grid-row-end": "span 1",
			});

			news
			.addClass("view-active")
			.removeClass("view-hide");

		}



		return true ;
	}

	toggleCell(Xaxis,Yaxis,status,area){

		const cellar = []

		for(let i = 0 , xLeg = Xaxis.length; i< xLeg; i++){

			for(let j = 0, yLeg = Yaxis.length; j< xLeg; j++){

				

				const x  = Xaxis[i];
				const y  = Yaxis[j];
				const viewClass = y + "-" + x;
				const cell = $("." + viewClass);
				
				if(status === "addClass" && this.judgeCellOver(cell,area)){
					return false;
				}

				cell[status]("view-hide")
				.attr("echo-size","1,1")
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
					});
			}
		}
	}

	mergeCell(rotate){

	

		const $activeView = $(".view-active");
		const resiziEl = this.resiziEl ;

		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");
		const {roateX:curMergeX,roateY:curMergeY} = rotate;
		const [lastMergeX,lastMergeY] = $activeView.attr("echo-size").split(",");

		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];

		const activePoint = $activeView.attr("echo-point");
		const [originY,originX] = activePoint.split("-") ;
		const lastIndexX = Xaxis.indexOf(originX);
		const lastIndexY = Yaxis.indexOf(originY);


		//重新合并
		let handleGridItem = null ;
		let cur_index_x = null;
		let cur_index_y = null;
		let newOriginY = null ;
		let newOriginX = null ;

		if(directionY === "t" || directionX === "left"){

			

			const axisobject={
					left:-1,
					middle:0,
					right:0,
					t:-1,
					m:0,
					b:0,
			};

			 const newOriginY_index =	Yaxis.indexOf(originY) +  (curMergeY - lastMergeY) * axisobject[directionY];
			 const newOriginX_index =	Xaxis.indexOf(originX)  +  (curMergeX - lastMergeX) * axisobject[directionX];

			newOriginY = Yaxis[newOriginY_index];
			newOriginX = Xaxis[newOriginX_index];

			handleGridItem = $(`.${newOriginY + "-" + newOriginX}`);


			const [cur_pointY,cur_pointX] = handleGridItem.attr("echo-point").split("-");
			cur_index_x = Xaxis.indexOf(cur_pointX);
			cur_index_y = Yaxis.indexOf(cur_pointY);

		}else{
			handleGridItem = $activeView ;
			cur_index_x = lastIndexX;
		    cur_index_y = lastIndexY;
		    newOriginY = originY ;
		    newOriginX = originX ;
		}

		const cur_Xarea = Xaxis.slice(cur_index_x,  curMergeX + cur_index_x);
		const cur_Yarea = Yaxis.slice(cur_index_y ,  curMergeY + cur_index_y);

		const lastAreaX = Xaxis.slice(lastIndexX, + lastMergeX + lastIndexX);
		const lastAreaY = Yaxis.slice(lastIndexY , + lastMergeY + lastIndexY);


		const par = newOriginY + "-" + newOriginX ;
		const is_over_1 = this.hideCell({
				lastAreaX,
				lastAreaY
			},
			{
				cur_Xarea,
				cur_Yarea
		},par,{
			old:$activeView,
			news:handleGridItem,
		});

		if( !is_over_1 ){ return false } ;

		// 还原之前的；
		// 
		

		
		this.showCell(
			{
				lastAreaX,
				lastAreaY
			},
			{
				cur_Xarea,
				cur_Yarea
		});

		/*设置*/
		handleGridItem
		.css({
				"grid-column-end": "span " + curMergeX,
				"grid-row-end": "span " + curMergeY,
		})
		.attr("echo-size",curMergeX + "," + curMergeY);


		

		resiziEl.hide();

		this.reloadView({newEl:handleGridItem,oldEl:$activeView},{
			curMergeX,curMergeY
		});

		return true ;
	}

	reloadView(boxObj,config){

		const {newEl,oldEl} = boxObj;

		const {getViewData} = this.config;

		const data = getViewData(oldEl[0]);

		const {viewType} = data ;
		const {curMergeX,curMergeY} = config;

		if(newEl !== oldEl){
			const {delViewData,addViewData} = this.config;
			oldEl.html(null).removeClass("view-fill");
			delViewData(oldEl[0]);

			const {object,node,borderType} = data ;

			const border_str = borderType  === "0" ?"" : `<div class="bgSvg" echo-w="${curMergeX}" echo-y="${curMergeY}" echo-type="${borderType}"></div>`;

			const htmlStr = border_str + `<div class="view-content"></div>`;	
			const viewObj = {
				$box:newEl,
				htmlStr,
				borderType,
			};

			addViewData(object,viewType,node,viewObj);


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
		const { upModalStatus ,getViewData ,delViewData} = _self.config;

		const $template = $(".view-item");
		const viewsArr = Array.from($template);


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
				if(!type || $this.hasClass("view-fill")){
					return ;
				}

				$this.attr({"echo-type":type});
				$this.addClass("view-active").siblings().removeClass("view-active");

				const size = $this.attr("echo-size").split(",");
				upModalStatus(type,size,$this);
			};
		});


		$templateBox.on("click",".view-item",function(e){

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
		
		$templateBox.on("click",".view-optBox ",function(e){
				e.stopPropagation();
		});

		$templateBox.on("click",".btn-handle",function(){
			$(this).toggleClass("active");
		});

		$templateBox.on("click",".view-btn",function(){

			const $this = $(this);
			
			const type = $this.attr("sign");
			const par = $this.closest(".view-item");
			const view = getViewData(par[0]);

			console.log(view);
			
			switch(type){

				case "expand":
					
					
					break;
				case "set":{

					const {object,viewType} = view ;

					console.log(object);
					console.log(viewType);

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
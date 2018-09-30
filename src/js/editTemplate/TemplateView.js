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
	movesdsd(e,obj,type){


		const resiziEl = this.resiziEl;

		const {startPointX,startPointY} = this;
		const {width,height,top,left} = obj;

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
			curTop,
			curLeft,
		} = this.cellSize;


		const [axixY,axixX] = type.split("-");

		const _width = width + moveX*directionObject[axixX];
		const _height = height + moveY*directionObject[axixY];
		const _top = top + moveY*positionObject[axixY];
		const _left = left + moveX*positionObject[axixX];

		
		const W = _width < minWidth ;
		const H = _height < minHeight ;
		const T = _top < minTop ;
		const L = _left < minLeft ;

		if(T){
			 resiziEl.css({
				width:  _width ,
				height:  _height,
				top:  minTop,
				left:  _left,
		  	});

			 return ;
		}

		if(L){
			 resiziEl.css({
				width:  _width ,
				height:  _height,
				top:  _top,
				left:  minLeft,
		  	});

			 return ;
		}

		if( W  ){

			const maxH = Math.max(_height,minHeight);
		  resiziEl.css({
			width:  minWidth ,
			height: maxH ,
			top:  curTop,
			left:curLeft,
		  });

		  return ;
			 
		}

		if(  H ){

		  resiziEl.css({
			width:  _width ,
			height:  minHeight,
			top:  curTop,
			left:  curLeft,
		  });

		  return ;
			 
		}

		resiziEl.css({
						width:_width ,
						height:_height,
						top: _top,
						left:_left,
					});
	}
	changeViewSize(){

		const  {minWidth,minHeight} = this.cellSize; 

		const  curWid = this.resiziEl.width();
		const  curHei = this.resiziEl.height();

		const roateX = Math.round(curWid / minWidth);
		const roateY = Math.round(curHei / minHeight);
	
		
		this.changeStatus = false ;
		this.mergeCell({roateX,roateY});
	}

	

	toggleCell(Xaxis,Yaxis,status){
		Xaxis.map(x=>{

			Yaxis.map(y=>{

				const viewClass = y + "-" + x;
				$("." + viewClass)[status]("view-hide")
				.attr("echo-size","1,1")
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
					});
			});
		});

	}

	mergeCell(rotate){

	

		const $activeView = $(".view-active");
		const resiziEl = this.resiziEl ;

		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");
		const {roateX:curMergeX,roateY:curMergeY} = rotate;
		const [lastMergeX,lastMergeY] = $activeView.attr("echo-size").split(",");

		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];

		// 还原之前的；
		const [originY,originX] = $activeView.attr("echo-point").split("-");
		const lastIndexX = Xaxis.indexOf(originX);
		const lastIndexY = Yaxis.indexOf(originY);

		const lastAreaX = Xaxis.slice(lastIndexX, + lastMergeX + lastIndexX);
		const lastAreaY = Yaxis.slice(lastIndexY , + lastMergeY + lastIndexY);
		this.toggleCell(lastAreaX,lastAreaY,"removeClass");

		//重新合并
		let handleGridItem = null ;
		let cur_index_x = null;
		let cur_index_y = null;

		if(directionY === "t" || directionX === "left"){

			

			const axisobject={
					left:-1,
					middle:0,
					right:0,
					t:-1,
					m:0,
					b:0,
			};

			const newOriginY =	Yaxis.indexOf(originY) +  (curMergeY - lastMergeY) * axisobject[directionY];
			const newOriginX =	Xaxis.indexOf(originX)  +  (curMergeX - lastMergeX) * axisobject[directionX];



			handleGridItem = $(`.${ Yaxis[newOriginY] + "-" + Xaxis[newOriginX]}`);


			const [cur_pointY,cur_pointX] = handleGridItem.attr("echo-point").split("-");
			cur_index_x = Xaxis.indexOf(cur_pointX);
			cur_index_y = Yaxis.indexOf(cur_pointY);

		}else{
			handleGridItem = $activeView ;
			cur_index_x = lastIndexX;
		    cur_index_y = lastIndexY;
		}

		const cur_Xarea = Xaxis.slice(cur_index_x,  curMergeX + cur_index_x);
		const cur_Yarea = Yaxis.slice(cur_index_y ,  curMergeY + cur_index_y);
		this.toggleCell(cur_Xarea,cur_Yarea,"addClass");

		/*设置*/
		$activeView.removeClass("view-active");
		handleGridItem
		.css({
				"grid-column-end": "span " + curMergeX,
				"grid-row-end": "span " + curMergeY,
		})
		.attr("echo-size",curMergeX + "," + curMergeY)
		.addClass("view-active")
		.removeClass("view-hide");

		resiziEl.hide();
	}

	handle(){

		const _self = this;
		const { upModalStatus } = _self.config;

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
				const type = ev.dataTransfer.getData("type");
				if(!type || $this.hasClass("view-active")){
					return ;
				}

				$this.attr({"echo-type":type});
				$this.addClass("view-active").siblings().removeClass("view-active");

				const size = $this.attr("echo-size").split(",");
					
				$this.html(`<div class="bgSvg" echo-w="${size[0]}" echo-y="${size[1]}" echo-type="1"></div>
       			 <div class="view-content"> </div>`);

				upModalStatus(type);
			};
		});


		$("#templateBox").on("click",".view-item",function(){
			 const $this = $(this);
			 _self.resiziEl.show();

			 if($this.hasClass('view-active')){
			// 	returdddd ;
			 }
				
				
			
			 $this.addClass('view-active').siblings().removeClass("view-active");

			 _self.showResizeBox($this);
		});



		this.resiziEl.on("mousedown",".u-resize-icon",function(e){
			const $this= $(this);
			const type = $this.attr("sign");

		/*	const obj={
				width:_self.resiziEl.width(),
				height:_self.resiziEl.height(),
				top: +_self.resiziEl.css("top").match(/\d+/g)[0],
				left: +_self.resiziEl.css("left").match(/\d+/g)[0],
			};*/
			_self.resiziEl.attr("echo-direction",type);


			
			_self.gLayout[0].onmousemove= _self.throttle(function(isFirst){

				_self.move(isFirst,type);

			} ,60);

			/*_self.gLayout[0].onmousemove= function(e){
				
				_self.move(e,obj,type);
			}*/
			
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

		/*_self.gLayout[0].onmouseup=function(){

			console.log(222);
				_self.gLayout[0].onmousemove = null;
		}*/
		
		/*this.resiziEl.on("mouseup",".u-resize-icon",function(){
			const $this= $(this);
			const type = $this.attr("sign");
			
			console.log("up");

			//_self.gLayout[0].onmousemove=null;
		});*/


	}
}

export {TemplateView};
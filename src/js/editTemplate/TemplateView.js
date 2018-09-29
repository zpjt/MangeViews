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
		//const {id} = config ;
	   
	   this.config = config ;
	   this.box = $el;
	   this.resiziEl = $("#m-resize");
	   this.gLayout =$("#g-layout");

	   this.startPointX=null;
	   this.startPointY=null;

	   this.changeStatus = false ;
	   this.init(64);
       this.handle();
	}

	 getInitCellSize(){

	 	if(this.cellSize){
	 		return  this.cellSize;
	 	}

		const $viewTemplate = $("#viewTemplate");
		const width = $viewTemplate.width() / 3;
		const height = $viewTemplate.height() / 3;
		this.cellSize ={
			width,
			height
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

		const width = $el[0].offsetWidth;
		const height = $el[0].offsetHeight;
		const top = $el[0].offsetTop;
		const left = $el[0].offsetLeft;

		this.resiziEl.css({
			width,
			height,
			top,
			left,
		});

	}

	move(e,obj,type){

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

		const [axixY,axixX] = type.split("-");

		resiziEl.css({
					width:width + moveX*directionObject[axixX],
					height:height + moveY*directionObject[axixY],
					top: top + moveY*positionObject[axixY],
					left: left + moveX*positionObject[axixX],
		});

		
	}

	changeViewSize(){

		const  {width,height} = this.getInitCellSize(); 
		const  curWid = this.resiziEl.width();
		const  curHei = this.resiziEl.height();

		const roateX = Math.round(curWid / width);
		const roateY = Math.round(curHei / height);
	
		
		this.changeStatus = false ;
		this.mergeCell({roateX,roateY});
	}

	getMergeGriditem(rotate){

		

		const $activeView = $(".view-active");
		const resiziEl = this.resiziEl ;


		const [pointY,pointX] = $activeView.attr("echo-point").split("-");


		const pointObject={
				left:0,middle:1,right:2,
				t:0,m:1,b:2,
		};

		const xArr = ["-left","-middle","-right"];
		const yArr = ["t","m","b"];

		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");


		let handleGridItem = null ;


		if(directionY === "t" || directionX === "left"){
				
			const y =	pointObject[pointY] - roateY +1;
			const x =   pointObject[pointX] - roateX +1;


			handleGridItem = $(`.${yArr[y]+xArr[x]}`);

		}else{

			handleGridItem = $activeView ;
		}


		return handleGridItem;

	}

	toggleCell(Xaxis,Yaxis,status){
	
		Xaxis.map(x=>{

			Yaxis.map(y=>{

				const viewClass = y + "-" + x;
				$("." + viewClass)[status]("view-hide")
				.css({
						"grid-column-end": "span 1",
						"grid-row-end": "span 1",
					});
			});
		});

	}

	mergeCell(rotate){

	
	//	this.getMergeGriditem(rotate);


		const $activeView = $(".view-active");
		const resiziEl = this.resiziEl ;

		const [directionY ,directionX]= resiziEl.attr("echo-direction").split("-");
		const {roateX,roateY} = rotate;
		const [curRoateX,curRoateY] = $activeView.attr("echo-size").split(",");



		

		const Xaxis = ["left","middle","right"];
		const Yaxis = ["t","m","b"];


		// 还原之前的；
		const [pointY,pointX] = $activeView.attr("echo-point").split("-");
		const index_X = Xaxis.indexOf(pointX);
		const index_Y = Yaxis.indexOf(pointY);

		const curXarea = Xaxis.slice(index_X, + curRoateX + index_X);
		const curYarea = Yaxis.slice(index_Y , + curRoateY + index_Y);
		this.toggleCell(curXarea,curYarea,"removeClass");

		//重新合并
		const pointObject={
				left:0,middle:1,right:2,
				t:0,m:1,b:2,
		};

		let handleGridItem = null ;

		let cur_index_X = null;
		let cur_index_Y = null;

		if(directionY === "t" || directionX === "left"){

			/*if(){
				y= 0 
			}*/
				
			const y =	(pointObject[pointY] - roateY +1)*test[pointY];
			const x =   pointObject[pointX] - roateX +1;

			


			handleGridItem = $(`.${ Yaxis[y] + "-" + Xaxis[x]}`);

			console.log(handleGridItem);

			const [cur_pointY,cur_pointX] = handleGridItem.attr("echo-point").split("-");
			cur_index_X = Xaxis.indexOf(cur_pointX);
			cur_index_Y = Yaxis.indexOf(cur_pointY);

		}else{

			handleGridItem = $activeView ;
			cur_index_X = index_X;
		    cur_index_Y = index_Y;

		}
		

		const cur_Xarea = Xaxis.slice(cur_index_X,  roateX + cur_index_X);
		const cur_Yarea = Yaxis.slice(cur_index_Y ,  roateY + cur_index_Y);
		this.toggleCell(cur_Xarea,cur_Yarea,"addClass");
		
		handleGridItem
		.css({
				"grid-column-end": "span " + roateX,
				"grid-row-end": "span " + roateY,
		})
		.attr("echo-size",roateX + "," + roateY)
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
			 	return ;
			 }
				
				
			
			 $this.addClass('view-active').siblings().removeClass("view-active");

			 _self.showResizeBox($this);
		});

		this.resiziEl.on("mousedown",".u-resize-icon",function(e){
			const $this= $(this);
			const type = $this.attr("sign");

			const obj={
				width:_self.resiziEl.width(),
				height:_self.resiziEl.height(),
				top: +_self.resiziEl.css("top").match(/\d+/g)[0],
				left: +_self.resiziEl.css("left").match(/\d+/g)[0],
			};
			_self.resiziEl.attr("echo-direction",type);
			
			_self.gLayout[0].onmousemove=function(e){
				
				_self.move(e,obj,type);
			}
			
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
			const $viewTemplate = $("#viewTemplate");
			const width = $viewTemplate.width() / 3;
			const height = $viewTemplate.height() / 3;
			_self.cellSize ={
				width,
				height
			} ;
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
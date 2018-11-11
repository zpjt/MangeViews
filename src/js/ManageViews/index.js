import {api} from "api/ManageViews.js";
import {View,Border,STable,TimeView} from "./view.js";
import {Calendar,SModal,SInp,RippleBtn,Unit} from "js/common/Unit.js";
import "css/ManageViews.scss";
/*Jq对象*/
new RippleBtn();
const {baseUrl} = window.jsp_config;


class App{

	static activeView = null ;


	constructor(){

		const fatherWin = window.parent ;
		this.layout_id = fatherWin.menuID;
		this.layoutName = fatherWin.menuName;
		this.app = $("#app");
		this.maxWindow = $("#maxWindow");
		this.timeBox = $("#g-timeContent");

		this.maxTimer = null ;
		this.maxView = null ;

		this.unit = new  Unit();

		this.items=[];
		this.apiData = [];
		this.init();
		this.handle();
	}


	init(){
		this.getPre();
		this.renderModal();
		this.initHead();
		this.initCalarder();
	}

	initCalarder(){

		this.modal = new SModal();
		new SInp();
		this.calendar = new Calendar($("#calendarBox"),$("#viewShowTime"),{
			rotate:4,
			style:2,
			callback:()=>{

				const index = App.activeView;
				index==="all" ? this.filterAll()　: this.filterTime(index) ;
			}
		});

	}

	initHead(){

		const owidth = $("#viewsHead").width();


		const str = `<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 1500 50" preserveAspectRatio="xMidYMid slice">
								<defs >
									<linearGradient id="linear" gradientUnits="objectBoundingBox">
			    	                  <stop offset="0" stop-color="#005792"  stop-opacity="1"/>
			    	                  <stop offset="1" stop-color="#064782" stop-opacity="0"/>
			    	              	</linearGradient>
			    	              	<linearGradient id="down" xlink:href="#linear" 
										x1="0" y1="100%" x2="0" y2="0">
			    	              	  <stop offset="0" stop-color="#064782"  stop-opacity="1"/>
			    	                  <stop offset="1" stop-color="#1c819e" stop-opacity="0"/>
			    	              	</linearGradient>
								    <g id="right" >
								   		<desc>左</desc>
								    	<polygon points="0 0 , 400 0,375 25,0 25"  stroke="" stroke-width="" fill="url(#linear)" />
								    	<line x1="405" y1="0" x2="380" y2="25" stroke-linecap="round" stroke="#64ACCA" stroke-width="1"/>
								    	<line x1="415" y1="0" x2="385" y2="30" stroke-linecap="round" stroke="#64ACCA" stroke-width="3"/>
								    </g>
								   	<g id="center">
								    		<polygon points="575 0,625 50,875 50,925 0"  fill="url(#down)"/>
								    		<text x="750" y="35" fill="white" id="viewName" text-anchor="middle" font-size="22" letter-spacing="0.2em" lengthAdjust="spacing" >
								    		${this.layoutName}
								    		</text>				
								    </g>
								</defs>
								<g >
									<use xlink:href="#right"   />
									<use xlink:href="#right"  transform="scale(-1,1) translate(-1500)" />
									<use xlink:href="#center"  />
									<polyline points="0 0 ,575 0,625 50,875 50,925 0,1500 0" fill="none" stroke="#64ACCA" stroke-width="2.5"/> 
								</g>
						</svg>`;
		
		$("#viewsHead").html(str);
	}

	getPre(){
		
		 window.location.search.includes("pre") && this.app.append(`<span class="backManage" id="back"><i class="fa fa-chevron-circle-left " ></i></span>`);

				
	}

	IntervalreFresh(type,view,viewData){

		switch(type){
			case "timeReal":{
					const {tabInfo:{ref_time , ref_frequency}} = viewData ;
						
				if( ref_frequency !== "0"){

					const frequencyArr=["",1,60,60*60];
					const delay = 1000*ref_time*frequencyArr[+ref_frequency];
					
					view[type].timer = setInterval(function(){

						api.getTableInfo(viewData.tabInfo).then(res=>{
							view.timeReal.init(res);
						});
			
					},delay);
				}
				break;
			}
			default:
			break;
		}

	}

	createView(config){
		const {id,type,item,box,size,borderType} = config;
		const method={
			table:{
				getDataUrl:"getTableData",
				configName:"tabInfo",
			},
			timeReal:{
				getDataUrl:"getTableData",
				configName:"tabInfo",
			},
			chart:{
				getDataUrl:"getGraphData",
				configName:"graphInfo",
			},
			editView:{
				getDataUrl:"getAssembly",
			}
		}

		api[method[type].getDataUrl](id).then(res=>{

				if(!res){

					this.unit.tipToast("没数据！",2);
					box.removeClass("view-fill");
					box.attr("echo-id","");

				}else{

					const viewTitle = type === "editView" ? "" :  res[method[type].configName].chartName;

					const result = type === "editView" ? res.assembly_data : res ;

					this.items[item] = new View(box,{id,type,index:item,viewTitle,size,borderType},result);
					this.apiData[item] = {viewType:type};
					this.apiData[item].params = type === "editView" ? null : (result.tabInfo || result.graphInfo);
					this.IntervalreFresh(type,this.items[item],result);
				}
		});

	}


	renderModal(){
		const self = this;
		api.showLayoutModel(this.layout_id).then(res=>{

				
				if(res.modelData){
					const model = res.model.replace(/draggable="true"/,"");
					$("#viewsContent").html(model);


					
					
					const url = $("#viewTemplate").css("backgroundImage");
					this.maxWindow.css("backgroundImage",url);


					const modelData = JSON.parse(res.modelData);

					modelData.filter(val=>val.viewID).map((val,index)=>{

						(function(item,_val){
							const {point,size,viewID:id,type:_type,borderType} = _val;
							const $dom = $("#"+point[2]);

			  				const type =  ["line","pie","scatter","bar","rader"].includes(_type) && "chart" || _type ; 
							self.createView({item,box:$dom,type,id,size,borderType});
						})(index,val);
					});
				}else{

					console.log("该视图已经不存在！");
				
				}
		});
	}

	MaxView(config){

		const {borderType,option,index,viewTitle,viewType,id} = config;
		const poitionClass = borderType == "2" ? "border3-opt" : "";	

		const $maxWindow = this.maxWindow ;
		const borderStr = borderType === "0" ? "" : ` <div class="bgSvg"></div>` ;
		const templateStr=`
							<div class="view-item" echo-id="max" style="width:100%;height:100%;">
						       ${borderStr}
						        <div class="view-content" >
						        	<div class="view-optBox ${poitionClass}" >
						        		<div class="btn-handle">
											<span class="fa fa-bars" ></span>
										</div>
						        		<div class="view-btns" echo-id="${id}" echo-index="${index}">
											<span class="fa fa-compress view-btn" sign="compress" title="最小化"></span>
											<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>
											<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>
										</div>
						        	</div>
						            <div class="view_main ${viewType}_main"></div>
						        </div>
						    </div>
							`
		$maxWindow.html(templateStr);
		const chartDom = $maxWindow.find(".view_main");

		const size = [3,3];
		if(viewType==="table" || viewType==="timeReal"  ){

			api.getTableData(id).then(res=>{
				if(viewType==="table"){
					new STable(chartDom,{borderType,size},res)
				}else{

					const view =  new TimeView(chartDom,{borderType,size},res);

					const {tabInfo,tabInfo:{ref_time , ref_frequency}} = res ;
						
					if( ref_frequency !== "0"){
						
						this.maxTimer = setInterval(function(){

							console.log("dddd");

							api.getTableInfo(tabInfo).then(res=>{
								view.init(res);
							});
				
						},3000);
					}
				}
				
			});
			
		}else if(viewType=="chart"){
			
			let myChart= echarts.init(chartDom[0]); 
			    myChart.setOption(option);
	
		}else if(viewType=="editView"){
					
			chartDom.html(option);

		}

		if(borderType !== "0"){
			 new  Border($maxWindow.find(".bgSvg"),{id:"max",title:viewTitle,borderType,size});
		}	
	}

	Toexcel(option,viewType,config){

		let tableArr = [];

		const {WdArr,viewTitle,chartType} = config;
		let body=[], head=[];

		if(viewType=="table"){

			api.getTableData(option).then(res=>{
				tableArr = res.data ;
				const {col_wd} = chartType;
				col_wd.map(function(val,index){
					tableArr[0][index] = WdArr[+val];
				});

				api.getExeclld({data:tableArr,fileName:viewTitle}).then(res=>{
						if(res){
							window.location.href = baseUrl+"Expo/getExecl?id="+res;
						}
				});
			});
			
		}else if(viewType=="chart"){
			
			const {xAxis,series,Dim,legend,radar}= option;
			
			switch(chartType){
				
				case "4": // line 或 bar 
					head = xAxis[0].data.map(val=>{
						return val.value;
					});
					
					head.unshift(WdArr[+Dim.contrastDim]+"/"+WdArr[+Dim.rowDim]);
					body = series.map(val=>{
						const data = val.data.map(val=> val || "--");
						return [val.name,...data];
					});

					tableArr=[head,...body];

					break;
				case "5": // pie 
					body.push(" ");
					head = legend[0].data.map(val=>{
						const item = val.value || "--";
						body.push(item);
						return val.name;
					});
				
					head.unshift(WdArr[+Dim.rowDim]);

					tableArr=[head,body];

					break;
				case "6": // rader
					body = series[0].data.map(val=>{

						const data = val.value.map(val=> val || "--");
						return [val.name,...data];
					});
					head = radar[0].indicator.map(val=>{
						return val.text;
					});
				
					head.unshift(WdArr[+Dim.contrastDim]+"/"+WdArr[+Dim.rowDim]);

					tableArr=[head,...body];

					break;
			}

			
			api.getExeclld({data:tableArr,fileName:viewTitle}).then(res=>{

				if(res){
					window.location.href = baseUrl+"Expo/getExecl?id="+res;
				}

			});

		}
			
	}

	Toimage(view){

		const {viewTitle:title} = view ;

		const $maxWindow = this.maxWindow ;

		const is_max = !$maxWindow.is(":hidden");

		 if(view.border){
			
			const $border = is_max && $maxWindow.find(".bgSvg") ||  view.border.box;
			const $canvas = is_max && $maxWindow.find("canvas") || $(view.chart.Box).find("canvas");
		  	const svgXml = $border.html();

		  	const img1 = new Image();
		  	const img2 = new Image();
		  	const img3 = new Image();

			
		  	img1.src=`data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgXml)))}`;

		   	img2.src=`./img/view_bg1.png`;
		  
		  	img3.src=$canvas[0].toDataURL('png');


		  	const canvas = document.createElement("canvas");
				  canvas.width=$border.width();
				  canvas.height=$border.height();

			const  context = canvas.getContext('2d');  //取得画布的2d绘图上下文

			img1.onload=function(){
				setTimeout(function(){
					context.drawImage(img2, 0, 0);
					context.drawImage(img1, 0, 0);
					context.drawImage(img3, 0, $border.height()*0.05);
				
					const a = document.createElement('a');
					document.body.appendChild(a);
					a.href = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据
					a.download = title+".png";  //设定下载名称
					a.click(); //点击触发下载
					$(a).remove();
				
				},1000);
			};
		}

	}

	filterAll(){
		const time = this.calendar.value; 
		this.apiData.map((val,index)=>{
			const view = this.items[index];
			const {viewType,params} = val ;

			const refreshArr=["chart","table"];
			
			if(!refreshArr.includes(viewType)){
				return ;
			}
			
			const method = viewType === "chart" && "getGraphInfo" || "getTableInfo"　;
			params.startTime = time[0].join("");
			params.endTime = time[1].join("");
			api[method](params).then(res=>{
				view[viewType].init(res);
			});
		});

	}
	filterTime(index,is_reload){

     	const view = this.items[index];
		const viewParams = this.apiData[index];

		const {viewType,params} = viewParams ;
		const time = this.calendar.value; 
		const method = viewType === "chart" && "getGraphInfo" || "getTableInfo"　;

		if(is_reload){
			params.startTime = null;
			params.endTime = null;
		
		}else{
			params.startTime = time[0].join("");
			params.endTime = time[1].join("");
		}

		const {time_id,time_start} = params;

		api[method](params).then(res=>{
			view[viewType].init(res);
		});

	}
	handle(){

		   const $maxWindow = this.maxWindow ;

			const timeBox = $(".time-content-item");
			$("#g-timeContent").on("click",".m-tab-item",function(){
				const $this= $(this);
				const index = $this.index();
				timeBox.eq(index).addClass("active").siblings().removeClass("active");
				$this.addClass("active").siblings().removeClass("active")
			});

			$("#globalSet").on("click",".global-itme",function(){

				const $this = $(this);
				const type  = $this.attr("sign");

				switch(type){
					case"filter":{

					    const refreshArr = ["chart","table"];
						const is_able = page.apiData.some(val=>refreshArr.includes(val.viewType));

						if(!is_able){
							page.unit.tipToast("不存在可以刷新的视图！",2);
							return ;
						}

						page.modal.show(page.timeBox);
						App.activeView = "all" ;
						break;
					}
					case"refresh":{
						
						page.apiData.map((val,index)=>{
							const viewType = val.viewType;
							if(viewType === "table" || viewType === "chart"){
							  page.filterTime(index,true);
							}
						});

						break;
					}
					default:
					break;

				}


			});

			this.app.on("click","#back",function(){
				
				const $slide = $("#slide", window.parent.document);
				const $head = $("#content", window.parent.document);
				const width = $slide.hasClass("collapsed") && 45 || 250;
				$slide.animate({
					"width": width
				}, 500, function() {
					window.history.back();
					$head.removeClass("no-head");
				});

			});
			this.app.on("click",".btn-handle",function(){
				$(this).toggleClass("active");
			});
			this.app.on("click",".view-btn",function(){
				
				const type = $(this).attr("sign");
				const par = $(this).parent();
				const index = par.attr("echo-index");
				const view = page.items[+index];

				const {viewType,viewTitle,borderType,id,size} = view ;


				let option = null,
					$el =null,
					chartType =null,
					WdArr = null;
				
				if(viewType==="table"){

					const {table:{container,title,data,config}} = view;

					$el = container ;
					option = view.id;
					chartType = config;
				    WdArr=["","时间", "科室", "指标", "维度值"];

				}else if(viewType==="chart"){

					const {chart:{Box,type:_chartType}} = view;
					const Mychart = echarts.getInstanceByDom(Box);

					$el = Box ;
					chartType = _chartType;
					option = Mychart.getOption();
					WdArr=["","时间","科室","维度值","指标"];
				
				} else if(viewType === "timeReal"){

					const {timeReal:{box,title,data,config}} = view;

					$el = box ;
					option = view.id;

				}else {
					const {editView:{box}} = view;
					option = box.html();
				} 

				App.activeView = index;
				switch(type){

					case "refresh":

						page.filterTime(index,true);
					
						break;
					case "excel":
						page.Toexcel(option,viewType,{WdArr,chartType,viewTitle});
						break;
					case "expand":
						$("#slide",window.parent.document).animate({"width":0},500,function(){
							$maxWindow.show();
							page.MaxView({
								option,
								borderType,
								index,
								viewTitle,
								viewType,
								id,
								size
							});
						});
						
						break;
					case "compress":

						if(page.maxTimer){
							console.log("qiangc");
							clearInterval(page.maxTimer);
						}
				     	 
						const $slide = $("#slide",window.parent.document);
						const width = $slide.hasClass("collapsed") && 45 || 250;
						$slide.animate({"width":width},500,function(){
							$maxWindow.html("");
							$maxWindow.hide();
						});
						break;
					case "image":
					 	page.Toimage(view);
						break;
					case "filter":
						
						const {time_id,time_start,startTime,endTime} = page.apiData[index].params;

						const flagStart = startTime || time_id ;
						const flagEnd = endTime || time_start ;
						page.calendar.setTime([flagStart,flagEnd]);
						page.modal.show(page.timeBox);
						break;

				}
			});
	}
}

const page = new App();





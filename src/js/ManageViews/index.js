import "css/ManageViews.scss";
import {api} from "api/ManageViews.js";
import {View,Border,STable} from "./view.js";

/*Jq对象*/
const $container= $("#viewsContent"),
      $app= $("#app"),
      $maxWindow = $("#maxWindow");

const {baseUrl} = window.jsp_config;


class App{


	constructor(){

		const fatherWin = window.parent ;
		this.layout_id = fatherWin.menuID;
		$("#viewName").html(fatherWin.menuName);	
		this.items=[];
		this.init();
		this.handle();
	}


	init(){
		this.getPre();

		this.renderModal();

		
	}

	getPre(){
		
		 !window.location.search.includes("pre") && $("#back").remove();


	}

	createView(config){
		const {id,type,item,box} = config;
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

		api[method[type].getDataUrl](id).then(res=>{

				if(res.data && res.data.length){
					const viewTitle =res[method[type].configName].chartName;
					this.items[item] = new View(box,{id,type,index:item,viewTitle},res);
				}else{
					alert("没数据！")
				}
			

		});

	}


	renderModal(){
		const self = this;
		api.showLayoutModel(this.layout_id).then(res=>{


				
				if(res.model){

					$container.html(res.model);
					const url = $("#viewTemplate").css("backgroundImage");
					$maxWindow.css("backgroundImage",url);

					$(".view-item").removeAttr("draggable");
					const views = $("#viewTemplate").find(".view-item.view-fill");
					$.map(views,(val,index)=>{
						(function(item,$val){
							const viewType = $val.attr("echo-type"),
					  				id =  $val.attr("echo-id");

			  				const type =  ["line","pie","scatter","bar","rader"].includes(viewType) && "chart" || viewType ; 
							self.createView({item,box:$val,type,id});
						})(index,$(val));
						
					});
				}else{

					alert("kong");
				
				}
		});
	}

	MaxView(config){

		const {borderType,option,index,viewTitle,viewType,id} = config;
		const poitionClass = borderType == "2" ? "border3-opt" : "";	

		//<span class="fa fa-filter view-btn" sign="filter" title="筛选"></span>
		//<span class="fa fa-refresh view-btn" sign="refresh" title="刷新"></span>
		

		const borderStr = borderType === "0" ? "" : ` <div class="bgSvg" echo-w="3" echo-y="3" echo-type="${borderType}"></div>` ;

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
						            <div class="chart"></div>
						        </div>
						    </div>
							`
		$maxWindow.html(templateStr);
		const chartDom = $maxWindow.find(".chart");
		if(viewType=="table"){

			api.getTableData(id).then(res=>{
				new STable(chartDom,{borderType},res);
			});
			
		}else if(viewType=="chart"){
			let myChart= echarts.init(chartDom[0]); 
			    myChart.setOption(option);
		}
		if(borderType !== "0"){
			 new  Border($maxWindow.find(".bgSvg"),{id:"max",title:viewTitle});
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
	handle(){
			$("#back").click(function(){
				
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
			$app.on("click",".btn-handle",function(){
				$(this).toggleClass("active");
			});
			$app.on("click",".view-btn",function(){
				
				const type = $(this).attr("sign");
				const par = $(this).parent();
				const index = par.attr("echo-index");
				const view = page.items[+index];

				const {viewType,viewTitle,borderType,id} = view ;


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

				}
				switch(type){

					case "refresh":
					
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
							});
						});
						
						break;
					case "compress":
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

						break;
				}
			});
	}
}

const page = new App();







 



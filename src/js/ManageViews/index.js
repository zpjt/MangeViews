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
		this.layout_id = $(".active",parent.document).attr("echo-id");
		this.items=[];
		this.init();
		
	}


	init(){
		this.renderModal();
	}


	renderModal(){
		const self = this;
		api.showLayoutModel(this.layout_id).then(res=>{
				
				if(res.model){

					$container.html(res.model);
					const url = $("#template").css("backgroundImage");
					$maxWindow.css("backgroundImage",url);

					$.map($(".view-item"),(val,index)=>{
						(function(item,$val){
							self.items[item] = new View($val,item);
						})(index,$(val));
						
					});
				}else{
					alert("kong");
				}
		});
	}

	MaxView(config){

		const {id,borderType,option,index,viewTitle,viewType} = config;
		const poitionClass = borderType === 2 ? "border3-opt" : "";	

		const templateStr=`
							<div class="view-item" echo-id="max" style="width:100%;height:100%;">
						        <div class="bgSvg" echo-w="3" echo-y="3" echo-type="${borderType}"></div>
						        <div class="view-content" >
						        	<div class="view-optBox ${poitionClass}" >
						        		<div class="btn-handle">
											<span class="fa fa-bars" ></span>
										</div>
						        		<div class="view-btns" echo-id="${id}" echo-index="${index}">
											<span class="fa fa-refresh view-btn" sign="refresh" title="刷新"></span>
											<span class="fa fa-compress view-btn" sign="compress" title="最小化"></span>
											<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>
											<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>
											<span class="fa fa-filter view-btn" sign="filter" title="筛选"></span>
										</div>
						        	</div>
						            <div class="chart"></div>
						        </div>
						    </div>
							`
		$maxWindow.html(templateStr);
		const chartDom = $maxWindow.find(".chart");
		if(viewType=="table"){
				
			new STable(chartDom,{id},function(){
					
			});

			
		}else if(viewType=="chart"){
			let myChart= echarts.init(chartDom[0]); 
			    myChart.setOption(option);
		}
		if(borderType){
			 new  Border($maxWindow.find(".bgSvg"),{id:"max",title:viewTitle});
		}	
	}

	Toexcel(option,viewType,config){

		let tableArr = [];

		const {WdArr,viewTitle,chartType} = config;
		let body=[], head=[];

		if(viewType=="table"){
				
			const {row_wd,col_wd} = chartType;
			const addArr = col_wd.reverse();
			row_wd.map((row,item)=>{
				addArr.map((val,index)=>{
					option[item].unshift(WdArr[+val]);
				});
			});
			
		
			tableArr = option;

			
		}else if(viewType=="chart"){
			
			const {xAxis,series,Dim,legend,radar}= option;
			
			switch(chartType){
				
				case "4": // line 或 bar 
					head = xAxis[0].data.map(val=>{
						return val.value;
					});
					
					head.unshift(WdArr[+Dim.contrastDim]+"/"+WdArr[+Dim.rowDim]);
					body = series.map(val=>{
						return [val.name,...val.data];
					});

					tableArr=[head,...body];

					break;
				case "5": // pie 
					body.push(" ");
					head = legend[0].data.map(val=>{
						body.push(val.value);
						return val.name;
					});
				
					head.unshift(WdArr[+Dim.rowDim]);

					tableArr=[head,body];

					break;
				case "6": // rader
					body = series[0].data.map(val=>{
						return [val.name,...val.value];
					});
					head = radar[0].indicator.map(val=>{
						return val.text;
					});
				
					head.unshift(WdArr[+Dim.contrastDim]+"/"+WdArr[+Dim.rowDim]);

					tableArr=[head,...body];

					break;
			}

		}
		
		
			api.getExeclld({data:tableArr,fileName:viewTitle}).then(res=>{

				if(res){
					window.location.href = baseUrl+"Expo/getExecl?id="+res;
				}

			});
	}

	Toimage(view){

		console.log(view);
		const {chart:{title}} = view ;

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
}

const page = new App();


$app.on("click",".btn-handle",function(){

		$(this).toggleClass("active");

});
$app.on("click",".view-btn",function(){
	
	const type = $(this).attr("sign");
	const par = $(this).parent();
	const index = par.attr("echo-index");
	const view = page.items[+index];

	console.log(view);
	const {type:viewType} = view ;


	let option = null,
		$el =null,
		chartType =null,
		viewTitle =null,
		WdArr = null;
	
	if(viewType==="table"){

		const {table:{container,title,data,config}} = view;

		$el = container ;
		viewTitle= title;
		option = data;
		chartType = config;
	    WdArr=["","时间", "科室", "指标", "维度值"];

	}else if(viewType==="chart"){

		const {chart:{Box,type:_chartType,title}} = view;
		const Mychart = echarts.getInstanceByDom(Box);

		$el = Box ;
		chartType = _chartType;
		viewTitle= title;
		option = Mychart.getOption();
		WdArr=["","时间","科室","维度值","指标"];

	}


	console.log(option);

	switch(type){

		case "refresh":
		
			break;
		case "excel":
			page.Toexcel(option,viewType,{WdArr,chartType,viewTitle});
			break;
		case "expand":
			const borderType = view.border && view.border.type || 0 ;
			$("#slide",window.parent.document).animate({"width":0},500,function(){
				$maxWindow.show();
				page.MaxView({
					option,
					borderType,
					index,
					id:view.id,
					viewTitle,
					viewType,
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
})





 



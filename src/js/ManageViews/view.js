import {Border} from "./svgBorder.js";
import {Chart} from "./chart.js";

class View {

	constructor($el,index){
		this.container=$el;
		this.id = this.container.attr("echo-id");
		this.index = index;
		this.init();
	}

	init(){

		const chartBox = this.container.children(".view-content");
		chartBox.html(this.renderContent());
		const chartDom = chartBox.children(".chart");
		this.initChart(chartDom);
	}


	initChart($el){
		this.chart = new  Chart($el[0],{id:this.id},(title)=>{
			const borderDom = this.container.children(".bgSvg");
			borderDom.length && this.initBorder(borderDom,title);
		});
	}

	initBorder($el,title){
		this.border = new  Border($el,{id:this.id,title});
	}

	renderContent(){
		const borderDom = this.container.children(".bgSvg");
		const borderType = +borderDom.attr("echo-type");
		
		const poitionClass = borderType === 2 ? "border3-opt" : "";	


		return `<div class="view-optBox ${poitionClass}" >
	        		<div class="btn-handle">
						<span class="fa fa-bars" ></span>
					</div>
	        		<div class="view-btns" echo-id="${this.id}" echo-index="${this.index}">
						<span class="fa fa-refresh view-btn" sign="refresh" title="刷新"></span>
						<span class="fa fa-expand view-btn" sign="expand" title="最大化"></span>
						<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>
						<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>
						<span class="fa fa-filter view-btn" sign="filter" title="筛选"></span>
					</div>
					
	        	</div>
	            <div class="chart"></div>`;
	}



}

export {View,Border} ;
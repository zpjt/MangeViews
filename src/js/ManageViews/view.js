import {Border} from "./svgBorder.js";
import {Chart} from "./chart.js";
import {STable} from "./sTable.js";
import {TimeView} from "./TimeView.js";
import {EditView} from "./EditView.js";


class View {

	constructor($el,config,data,status="1"){

		const {id,type,index,viewTitle} = config;
		
		this.container=$el;// 组件dom
		this.viewType= type; // 组件类型 chart table
		this.borderType= "0"; // 组件边框类型 0，1,2,3
		this.viewTitle = viewTitle; // 组件名称
		this.id = id; // 组件id
		this.index = index;//组件的索引
		this.status = status;// 组件是在编辑器里还是在视图里
		this.init(data);
	}

	init(data){

		const method = {
			"table":"initTable",
			"chart":"initChart",
			"timeReal":"initRealTime",
			"editView":"initEditView",
		}

		const chartBox = this.container.children(".view-content");
		
		const borderDom = this.container.children(".bgSvg");
		this.border = !!borderDom.length;
		this.borderType= this.border && borderDom.attr("echo-type") ||"0"; 
		this.border && this.initBorder(borderDom);

		chartBox.html(this.renderContent());
		const chartDom = chartBox.children(".view_main");
		this[method[this.viewType]](chartDom,data);
		
	}


	initChart($el,data){
		const  border = this.borderType;
		this.chart = new  Chart($el[0],{border},data);
	}

	initTable($el,data){
		const  border = this.borderType;
		this.table = new STable($el,{border},data);
	}

	initRealTime($el,data){
		const border = this.borderType;
		this.timeReal = new TimeView($el,{border},data);
	}

	initEditView($el,data){

		const border = this.borderType;
		this.editView = new EditView($el,{border},data);
	}

	initBorder($el){

		const title = this.viewTitle,
			  id = this.id ;
		this.border = new Border($el,{id,title});
	}

	renderViewOpt1(){

		const poitionClass = this.borderType === "2" ? "border3-opt" : "";	
		return `<div class="view-optBox ${poitionClass}" >
	        		<div class="btn-handle">
						<span class="fa fa-bars" ></span>
					</div>
	        		<div class="view-btns" echo-id="${this.id}" echo-index="${this.index}">
						
						<span class="fa fa-expand view-btn" sign="expand" title="最大化"></span>
						<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>
						<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>
						<span class="fa fa-refresh view-btn" sign="refresh" title="刷新"></span><span class="fa fa-filter view-btn" sign="filter" title="筛选"></span>
					</div>
					
	        	</div>`;
	}


	renderViewOpt2(){

		const poitionClass = this.borderType === "2" ? "border3-opt" : "";	
		return `<div class="view-optBox ${poitionClass}" >
	        		<div class="btn-handle">
						<span class="fa fa-bars" ></span>
					</div>
	        		<div class="view-btns" echo-id="${this.id}" echo-index="${this.index}">
						<span class="fa fa-trash view-btn" sign="remove" title="删除"></span>
						<span class="fa fa-filter view-btn" sign="filter" title="筛选"></span>
						<span class="fa fa-edit view-btn" sign="set" title="设置"></span>
					</div>
					
	        	</div>`;
	}

	renderContent(){
// chart
		return `${ this.status == 1 && this.renderViewOpt1() || this.renderViewOpt2()}<div class="view_main  ${this.viewType+"_main"}"></div>`;
	}
}

export {View,Border,STable} ;
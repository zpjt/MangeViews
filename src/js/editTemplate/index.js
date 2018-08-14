
import {kpiTree,orgTree,dimTree} from "./kpi.js";
import {SCombobox,SModal,Calendar,Tree ,SComboTree,SInp} from "js/common/Unit.js";
import "css/editTemplate.scss";
/*jq对象*/
const $setMd = $("#setComponentMd"),
	  $globalBox = $("#globalBox"),
	  $templateBox = $("#templateBox"),
	  $selZbs = $("#selZbs"),
	  $zbBox = $("#zbTreeBox");

console.log(333);


class ViewSetModal{

	constructor(config){
		const {type} = config ;
		this.wd_arr=[
                {"id":"1","text":"时间"},
                {"id":"2","text":"科室"},
                {"id":"3","text":"指标"},
                {"id":"4","text":"维度值"}
        ];

        this.viewType = type;
		this.config = this.getConfig();
        this.init();
	}

	getConfig(){

		/*
			Axis: true 坐标轴可以多选 false:单选

		*/
		
		const type = this.viewType;

		switch(type){

			case "table":
				
				return {
					Axis:true, 
					singAxis:false,
				};
				case "line":
			break;
				case "pie":
			break;
				case "scatter":
			break;
				case "rader":
			break;
				case "bar":
			break;
		}


	}

	filterAxisData(values){

		return this.wd_arr.filter(val=>{
			return !values.includes(val.id);
		});

	}

	init(){

		const {Axis,singAxis} = this.config;

		const self = this;

		// 模态框
		this.modal=new SModal(); 
		this.inp = new SInp();
		// 指标树
		this.initZbTree();
		// 日历
		this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
					rotate:4,
					style:2
		});
		const initWdArr = this.wd_arr.slice();
		this.xAxis= new SCombobox($("#XAxis"),{
			  width:300,
			 "prompt":"请选择横轴维度...",
			 "multiply":Axis,
			 "data":initWdArr,
			 clickCallback:function(node,_this){

			 	if(!singAxis){
			 		const values = _this.getValue().split(",");
					const Xdata = self.filterAxisData(values);
					self.yAxis.loadData(Xdata);
			 	}
			}
		});

		this.yAxis= new SCombobox($("#YAxis"),{
			 width:300,
			 "prompt":"请选择纵轴维度...",
			 "data":initWdArr,
			 "multiply":Axis,
			 clickCallback:(node,_this)=>{

					const values = _this.getValue().split(",");
					const Ydata = self.filterAxisData(values);
					self.xAxis.loadData(Ydata);
			}
		});
		this.orgWd = new SComboTree($("#orgWd"),{
			"prompt":"请选择科室...",
			 treeConfig:{
				checkbox:false,
				"data":orgTree.data,

			}
		});

		this.dimWd = new SCombobox($("#dimWd"),{
			 width:300,
			 "prompt":"请选择主题维度...",
			 "multiply":false,
			 "data":dimTree[1].data,
			 "idField":"dim_value_id",
			 textField:"dim_value_name",
		});

		this.handle();
	}

	renderZb(node){

		const {text,id} = node;
		return `
			<div class="sel-item sel-zb-item">
				<div >
					<button class="s-btn zb-name" echo-id="${id}">
						<i class="fa fa-times-circle del-zb"></i>
						<b>${text}</b>
					</button>
				</div>
				<div class="sel-item dim-combox">
					<span >住院重点疾病维度:</span>
					<div class="s-comboBox dimCombobox" >
				  </div>
				</div>
				
			</div>
			
		`

	}

	initZbTree(){

		const self = this ;

		this.zbTree = new Tree($("#zbTree"), {
			"clickAndCheck": false,
			"checkbox": true,
			 data:kpiTree.data,
			 judgeRelation:function(val){
			 	return val.data[0] == 0;
			 }
		});

		$("#selZb").click(function(){
			if($zbBox.hasClass("active")){
				return ;
			}
			self.modal.show($zbBox,"active");
		});

		$("#zbOpt").on("click","button",function(){

			const index = $(this).index();

			switch(index){

				case 0: 

					const values = self.zbTree.getValue("all");
					const ids = values.map(val=>val.id);

					const strArr = values.map(val=>{

						return	self.renderZb(val);
					});


					$selZbs.html(strArr.join(""));

					new SCombobox($(".dimCombobox"),{
								 width:300,
								 "prompt":"请选择主题维度...",
								 "multiply":false,
								 "data":dimTree[1].data,
								 "idField":"dim_value_id",
								 textField:"dim_value_name"
					});

					self.modal.close($zbBox,"active");


				break;
				case 1:
					self.modal.close($zbBox,"active");
				break;
			}

		});
		$setMd.on("click",".del-zb",function(){
			const id = +$(this).parent().attr("echo-id");
			self.zbTree.setValue([id]);
			$(this).closest(".sel-zb-item").remove();


		});
		
	}
	handle(){
		const self = this;
		$setMd.on("click",".m-tab",function(){
			const index = $(this).index();
			
			if(index){
				  const sels = self.zbTree.getValue("id");
				 sels.length && $setMd.addClass("other") || alert("选择指标！");
			}else{
				$setMd.removeClass("other");
			}

		});
	}
}


class HeadOpt{
	constructor(){
		this.init();

	}

	init(){
		this.handle();
	}
	handle(){
		$("#headOpt").on("click",".head-btn",function(){

			const type = $(this).attr("sign");
			switch(type){
				case "filter":
				break;
				case "style":
					viewSetModal.modal.show($globalBox,"active");


				break;
				case "pre":
				break;
				case "save-as":
				break;
				case "export":
				break;
				case "back":
					const $slide = $("#slide",window.parent.document);
					const width = $slide.hasClass("collapsed") && 45 || 250;
					$slide.animate({"width":width},500,function(){
								window.history.back();
					});
				break;

			}


		});

		//全局样式设置
		$("#globalOpt").on("click",".s-btn",function(){
				const index = $(this).index();

				switch(index){
					case 0 :
						break;

					case 1 :
						viewSetModal.modal.close($globalBox,"active");
						break;
				}
		});
	}

}

class ViewComponet{

	constructor(){

		this.init();
	}

	init(){

		this.handle();
	}

	handle(){

		//目标组件的拖拽事件
		$templateBox.on("dragover",function(){
			event.preventDefault();
			return true;
		});

		$templateBox.on("drop",function(){
			event.preventDefault();
			viewSetModal.modal.show($setMd);
		});
	}
}



const   viewSetModal = new ViewSetModal({type:"table"}),
		head = new HeadOpt(),
		viewComponet = new ViewComponet();















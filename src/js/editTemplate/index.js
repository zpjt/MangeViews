
import {api} from "api/editTemplate.js";
import {SCombobox,SModal,Calendar,Tree ,SComboTree,SInp} from "js/common/Unit.js";
import {ViewComponent} from "./ViewComponent.js";

import "css/editTemplate.scss";
/*jq对象*/
const $setMd = $("#setComponentMd"),
	  $globalBox = $("#globalBox"),
	  $templateBox = $("#templateBox"),
	  $selZbs = $("#selZbs"),
	  $viewStyleBox = $("#viewStyleBox"),
	  $zbBox = $("#zbTreeBox");

console.log(4233);

class TemplateView{

	constructor(){



	}
}

const page = new TemplateView();


class ZbComponent{

	constructor(config){

		const {kpiTree,dimTree} = config ;
		
		this.kpiTree = kpiTree;
		this.dimTree = dimTree;
		this.init();
	}


	init(){
		
		const kpiTree = this.kpiTree;
		this.zbTree = new Tree($("#zbTree"), {
			"clickAndCheck": false,
			"checkbox": true,
			 data:kpiTree,
			 idField:"kpi_id",
			 textField:"kpi_name",
			 childrenField:"sub",
			 judgeRelation:function(val){
			 	return val.kpi_type == 0;
			 }
		});

		this.handle();
	}

	findDimData(key){
		let node = null ;
		
		const data  = this.dimTree ;

		findFn(data);

		function findFn(arr){
			return arr.find(val=>{
				const status = val["dim_id"] == key ;
				if(status){
					node = val ;
				}

				const sub = val.sub;

				if(sub.length){
				
					return !status && findFn(sub) || status;
				
				}else{
					return status;
				}

			});
		}
		
		return node;
	}

	classifyZb(kpi,values){

			api.GroupKpiByDim({kpi}).then(res=>{

				if(res){
					
				  const dimArr = Object.keys(res);
				  const excelDim_2 = [];
				  const publicDim = dimArr.length === 1 && dimArr[0]!=="dim_2"  && true || false;

				  this.publicDim = publicDim;

				  //获取分类好了的指标数组
				  const zbObj =!publicDim && dimArr.map((key)=>{
					  const dimId = key.split("_")[1];
					  const zbArr = values.filter(node=>{
							return res[key].includes(node.kpi_id);
					  });

					  let dimName=null;

					  if(dimId != "2"){
  							const dimWd = this.findDimData(dimId);
  								  dimName = dimWd.dim_name ;
					  }
					
					  const dimItem = zbArr.map(val=>this.renderZb(val,{key,dimName}));

					 return  `<div class="dim-item" dim-id="${dimId}" dim-name="${dimName}">
										${dimItem.join("")}
							  </div>` ;
			  	  }) || values.map(val=>this.renderZb(val,{key:"dim_2",dimName:""}));


				const htmlStr = !publicDim ? zbObj.join("") : `<div class="publicDim dim-item" >${zbObj.join("")}</div>`;
				 
				 // 公共维度下拉框
				if(publicDim){
					$("#publicDim").show();
					const dimId = dimArr[0].split("_")[1];
					const data =this.findDimData(dimId).sub; 
					viewSetModal.dimWd.loadData(data);
					viewSetModal.wd_arr = wd_arr.slice();	
					viewSetModal.yAxis.loadData(viewSetModal.wd_arr);
					viewSetModal.xAxis.loadData(viewSetModal.wd_arr);
					viewSetModal.yAxis.clearValue();
					viewSetModal.xAxis.clearValue();
				}else{
					$("#publicDim").hide();

					const AxisData = wd_arr.filter(val=>{
						return val.id != "4"
					});
					viewSetModal.wd_arr = AxisData;

					viewSetModal.yAxis.loadData(AxisData);
					viewSetModal.xAxis.loadData(AxisData);
					viewSetModal.yAxis.clearValue();
					viewSetModal.xAxis.clearValue();
				}

				 //渲染分类
				  $selZbs.html(htmlStr);
				// 渲染每个有主题维度的指标下拉框
				  dimArr.length>1 &&  $.map($(".dim-item"),val=>{

						const $val = $(val);
						const dimId = $val.attr("dim-id");

						if(dimId==2){
							return ;
						}

						const dimCombobox = $(val).find(".dimCombobox");
						const data = this.findDimData(dimId).sub;

						new SCombobox(dimCombobox,{
								data:data,
								textField:"dim_name",
								idField:"dim_value",
						});
				 });
				
				}else{

				  alert("没有数据");
			
				}
				
				
			})

	}

	renderZb(node,config){

		const {kpi_name,kpi_id} = node;
		const {key,dimName} = config;
		
		let str = "" ;

		if(key !=="dim_2"){
             str= `
					<div class="sel-item zb-item-box">
						<div >
							<button class="s-btn zb-name dim-zb" echo-id="${kpi_id}">
								<i class="fa fa-times-circle del-zb"></i>
								<b>${kpi_name}</b>
							</button>
						</div>
						<div class="sel-item zb-dim-combobox">
							<span >${dimName}:</span>
							<div class="s-comboBox dimCombobox" >
						  </div>
						</div>
					</div>
					`;
		}else{
			str= `<span class="zb-item-box">
			   			<button class="s-btn zb-name" echo-id="${kpi_id}">
	   						<i class="fa fa-times-circle del-zb"></i>
							<b>${kpi_name}</b>
					    </button>
				    </span>`;
		}

		return  str;
	}

	

	handle(){

		const self = this ;

		$("#selZb").click(function(){
			if($zbBox.hasClass("active")){
				return ;
			}
			viewSetModal.modal.show($zbBox,"active");
		});

		$("#zbOpt").on("click","button",function(){

			const index = $(this).index();

			switch(index){

				case 0: 

				    const values =  self.zbTree.getValue("all");
					const ids = values.map(val=>val.kpi_id);

					if(!ids.length){
						return ;
					}
				    self.classifyZb(ids,values);
					viewSetModal.modal.close($zbBox,"active");

				break;
				case 1:
					viewSetModal.modal.close($zbBox,"active");
				break;
			}

		});
		$setMd.on("click",".del-zb",function(){
			const zb = $(this).closest(".zb-item-box");
			const id = $(this).parent().attr("echo-id");
			self.zbTree.setValue([id]);
			zb.remove();
		});
	}	
}

const wd_arr=[
                {"id":"1","text":"时间"},
                {"id":"2","text":"科室"},
                {"id":"3","text":"指标"},
                {"id":"4","text":"维度值"}
        ];

class ViewSetModal{
	constructor(config){
		const {type} = config ;

        this.viewType = type;
		this.config = this.getConfig();
       	this.getTreeData();
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

	changeSelType(node,status,multiply){

		if(multiply){

			switch(node.id){
				case "1":// 日历
				    const style = status && 2 || 1 ;
					this.calendar.changeStyle(style);
					break;
				case "2"://科室
					this.orgWd.tree.config.checkbox = status;
					this.orgWd.tree.box.unbind();
			  		this.orgWd.tree.init();
			  		this.orgWd.clearValue();
					break;
				case "4":// 维度值
					this.dimWd.config.multiply=status;
					this.dimWd.clearValue();
					break;
			}

		}else{


		}
	}

	init(){

		const {Axis,singAxis} = this.config;
		const self = this;
		// 模态框
		this.modal=new SModal(); 
		this.inp = new SInp();
		// 指标树

		const kpiTree = this.kpiTree,
			  dimTree= this.dimTree;
		this.zbComponent = new ZbComponent({kpiTree,dimTree});
		// 日历
		this.calendar = new Calendar($(".dataTime"),$("#viewShowTime"),{
					rotate:4,
					style:1,
		});
		this.xAxis= new SCombobox($("#XAxis"),{
			  width:300,
			 "prompt":"请选择横轴维度...",
			 "multiply":Axis,
			 clickCallback:function(node,_this,status){
				const values = _this.getValue().split(",");
				self.changeSelType(node,status,_this.config.multiply);
			 	if(!singAxis){
			 		
					const Xdata = self.filterAxisData(values);
					self.yAxis.loadData(Xdata);
			 	}
			}
		});

		this.yAxis= new SCombobox($("#YAxis"),{
			 width:300,
			 "prompt":"请选择纵轴维度...",
			 "multiply":Axis,
			 clickCallback:(node,_this,status)=>{
					self.changeSelType(node,status,_this.config.multiply);
					const values = _this.getValue().split(",");
					const Ydata = self.filterAxisData(values);
					self.xAxis.loadData(Ydata);
			}
		});

		const orgTree = this.orgTree;

		this.orgWd = new SComboTree($("#orgWd"),{
			"prompt":"请选择科室...",
			 treeConfig:{
				"clickAndCheck": false,
				 data:orgTree,
				 idField:"dim_value",
				 textField:"dim_name",
				 childrenField:"sub",
				 judgeRelation:function(val){
				 	return val.type == 0;
				 }
			}
		});
		
		this.dimWd = new SCombobox($("#dimWd"),{
			 width:300,
			 "prompt":"请选择主题维度...",
			 "multiply":false,
			 "idField":"dim_value",
			 textField:"dim_name",
		});

		this.handle();
		this.viewStyleBoxTnit();
	}

	viewStyleBoxTnit(){

		const methodObj={
			table:"tableInit",
		}
		const str = this[methodObj[this.viewType]]();
	}

	tableInit(){

		const htmlStr= 	`<div class="sel-item">
				    <p class="s-title">表格样式:</p>
				    <div>
				        <span><input type="radio" class="s-radio" name="tab-style" checked="checked" value="0"><label>网格</label></span>
				        <span><input type="radio"  class="s-radio" name="tab-style" value="1"><label>三线</label></span>
				    </div>
				</div>
				<div class="sel-item">
				    <p class="s-title">合计:</p>
					<div class="s-comboBox" id="totalCombo">
					
					</div> 
				</div>
				`
		$viewStyleBox.html(htmlStr);

		new SCombobox($("#totalCombo"),{
		 	  width:240,
			 "prompt":"可多选（非必选）",
			 "multiply":true,
			  validCombo:false,
			  data:[
				{"text":"列字段","id":"1"},
				{"text":"行字段","id":"2"},
			  ]
		});

	}
	getTreeData(){

	   return Promise.all([api.dimtree(),api.kpitree(),api.orgtree()]).then((res)=>{
			this.orgTree = res[2].sub;
			this.kpiTree = res[1].sub;
			this.dimTree = res[0].sub;
 			this.init();
	   })
	}

	getCommonValue(){

		const row_wd = this.xAxis.getValue().split(",");
		const col_wd = this.yAxis.getValue().split(",");
		
		const viewName = $("#componentName").val().trim();
		const orgs = this.orgWd.getValue("all").map(val=>{
			const {dim_value:id,dim_value,dim_name:text} = val;
			return {id,text}
		});
		
		const dim_x = this.zbComponent.publicDim;
		const dimWd = dim_x &&  this.dimWd.getValue() || "";
		
		/*time_id：时间段   
		 _0日,_1时,_2分,_3秒,_4年,_5月,_6季度
		 时间点   
		  @0日,@1时,@2分,@3秒,@4年,@5月,@6季度
		  startTime： 表示从当前时间往前推多少*/

		const timeObj={
			1:"4",
			2:"6",
			3:"5",
			4:"0",
		};

        const tags = this.calendar.style == 2 && "_" || "@" ;
		const time = this.calendar.value;
		const time_id = tags + (timeObj[this.calendar.rotate]);
		const time_end = time[time.length-1].join("");
		const time_start = 4;
 
		const startTime=null,
			  endTime=null;


		let kpis = [],
	     	kpi_infos = [];
			const $dimItems = $(".dim-item");
			if($dimItems.length === 1){
	        	const zbArrs = $dimItems.find(".zb-name");
				kpis=$.map(zbArrs,val=>{
					const $this = $(val);
					return {
						"text": $this.children("b").text(),
						"id":  $this.attr("echo-id"),
						"isRef": "0",
					}
				});
			}else{
				
				$.map($dimItems,item=>{
					const $this = $(item);
					const dimId = $this.attr("dim-id");
					const zbArrs = $this.find(".zb-name");
					const dimName = $this.attr("dim-name");

					if(dimId==2){
						kpis=$.map(zbArrs,val=>{
							const $this = $(val);
							return {
								"text": $this.children("b").text(),
								"id":  $this.attr("echo-id"),
								"isRef": "0"
							}
						});

					
					
					}else{
						$.map(zbArrs,val=>{
							const $this = $(val);
							const dimCombox = $this.parent().siblings(".zb-dim-combobox");
							const dimValue = dimCombox.find(".combo-text").val(),
								  dimVal= dimCombox.find(".combo-value").val();
							kpi_infos.push({
								"kpi_name": $this.children("b").text(),
								"kpi_id":  $this.attr("echo-id"),
								"dim_id": dimId,
								"dim_name": dimName,
								"dim_val": dimVal,
								"dim_val_name": dimValue,
								"isRef": "0"
							});
							return ;
						});



					}

					return ;

					
				});
			}

		
		return {
			row_wd,
			col_wd,
			time_id,
			orgs,
			kpis,
			time_start,
			time_end,
			kpi_infos,
			kpis,
			dim_x,
			startTime,
			endTime,
		}
	}

	getTableSet(){

		const _total = $("#totalCombo").find(".combo-value").val();
		const isAdded = "0",
			  tab_style=$("input[name=tab-style]:checked").val(),
			  total = !_total ? "0" :  (_total.includes(",") && "3" || _total);


			  return Object.assign(this.getCommonValue(),{isAdded,tab_style,total});

	}

	getSetData(){

		
		const methodObj={
			table:"getTableSet",
		}

		const object = this[methodObj[this.viewType]]();;

		api.getTableInfo(object).then(res=>{
			

			page.table = new ViewComponent($("#viewTemplate"),res);


		});

		return [] ;
	}
	handle(){
		const self = this;
		// tab切换
		$setMd.on("click",".m-tab",function(){
			const index = $(this).index();
			
			if(index){
				  const sels = self.zbComponent.zbTree.getValue("id");
				 sels.length && $setMd.addClass("other") || alert("选择指标！");
			}else{
				$setMd.removeClass("other");
			}

		});

		// 模态框操作
		$("#viewSure").click(function(){
			self.getSetData();
		});
	}
}

$(window).on("click",function(){

	/*const $scomboBox=$(".s-comboBox");
	 $scomboBox.removeClass("active");
	 const $drop = $scomboBox.children(".combo-drop");
   	 $drop.hide();*/

});


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















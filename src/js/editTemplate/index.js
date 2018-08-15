
import {api} from "api/editTemplate.js";
import {SCombobox,SModal,Calendar,Tree ,SComboTree,SInp} from "js/common/Unit.js";

import "css/editTemplate.scss";
/*jq对象*/
const $setMd = $("#setComponentMd"),
	  $globalBox = $("#globalBox"),
	  $templateBox = $("#templateBox"),
	  $selZbs = $("#selZbs"),
	  $zbBox = $("#zbTreeBox");

console.log(233);


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

					 return  `<div class="dim-item" dim-id="${dimId}">
										${dimItem.join("")}
							  </div>` ;
			  	  }) || values.map(val=>this.renderZb(val,{key:"dim_2",dimName:""}));


				const htmlStr = !publicDim ? zbObj.join("") : `<div class="publicDim dim-item" >${zbObj.join("")}</div>`;

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
								idField:"dim_id",
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

		//checkbox 

		if(multiply){

			switch(node.id){
				case "1":// 日历
					
					break;
				case "2"://科室
					this.orgWd.tree.config.checkbox = status;
					this.orgWd.tree.box.unbind();
			  		this.orgWd.tree.init();
					break;
				case "4":// 维度值
					this.dimWd.config.multiply=status;
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
					style:2
		});
		const initWdArr = this.wd_arr.slice();
		this.xAxis= new SCombobox($("#XAxis"),{
			  width:300,
			 "prompt":"请选择横轴维度...",
			 "multiply":Axis,
			 "data":initWdArr,
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
			 "data":initWdArr,
			 "multiply":Axis,
			 clickCallback:(node,_this)=>{

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
				 idField:"dim_id",
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
			 "idField":"dim_id",
			 textField:"dim_name",
		});

		this.handle();
	}

	
	
	getTreeData(){

	   return Promise.all([api.dimtree(),api.kpitree(),api.orgtree()]).then((res)=>{
			this.orgTree = res[2].sub;
			this.kpiTree = res[1].sub;
			this.dimTree = res[0].sub;
 			this.init();
	   })
	}

	getSetData(){

		
		const obj = 	{
			"time_id": "1",
			"time_start": 2017,
			"time_end": 2018,
			"startTime": null,
			"endTime": null,
			"orgs": [{
				"id": "207",
				"text": "妇科一病区"
			}, {
				"id": "208",
				"text": "肝胆外科"
			}],
			"dim_x": false,
			"kpis": [{
				"text": "实际开放床位",
				"id": "101010101",
				"isRef": "0"
			}, {
				"text": "重症医学科床位数",
				"id": "101010102",
				"isRef": "0"
			}, {
				"text": "急诊留观床位数",
				"id": "101010103",
				"isRef": "0"
			}, {
				"text": "重症医学床位所占的比例(%)",
				"id": "101010105",
				"isRef": "0"
			}],
			"kpi_infos": [{
				"kpi_id": "102020100",
				"kpi_name": "住院重点疾病总例数",
				"dim_id": "3",
				"dim_name": "住院重点疾病维度",
				"dim_val": "311",
				"dim_val_name": "急性阑尾炎伴弥漫性腹膜炎及脓肿",
				"isRef": "0"
			}, {
				"kpi_id": "102020200",
				"kpi_name": "住院重点疾病死亡例数",
				"dim_id": "3",
				"dim_name": "住院重点疾病维度",
				"dim_val": "308",
				"dim_val_name": "慢性阻塞性肺疾病",
				"isRef": "0"
			}, {
				"kpi_id": "102020300",
				"kpi_name": "住院重点疾病死亡率（%）",
				"dim_id": "3",
				"dim_name": "住院重点疾病维度",
				"dim_val": "308",
				"dim_val_name": "慢性阻塞性肺疾病",
				"isRef": "0"
			}],
			"row_wd": ["2"],
			"col_wd": ["1", "3"],
			"isAdded": "0",
			"tab_style": "0",
			"total": "0"
		}


		const xAxis = this.xAxis.getValue();
		const yAxis = this.yAxis.getValue();
		const time = this.calendar.value;
		const viewName = $("#componentName").val().trim();
		const org = this.orgWd.getValue();
		
		api.getTableInfo(obj).then(res=>{

			console.log(res);
		})



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















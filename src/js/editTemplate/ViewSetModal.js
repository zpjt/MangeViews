import {ZbComponent} from "./ZbComponent.js" ;
import {api } from "api/editTemplate.js";
import {SCombobox, SModal, Calendar, Tree, SComboTree ,RippleBtn} from "js/common/Unit.js";

/**
 * 模态框组件
 */
new RippleBtn();
class ViewSetModal {
	static status = "create";
	constructor(config) {

		

		const { modal ,viewDB } = config ;
		this.modal = modal ;
		this.viewDB = viewDB;
		this.setMd = $("#setComponentMd");
		this.modalType = $("#modalType");
		this.viewStyleBox = $("#viewStyleBox");
		this.$viewSure = $("#viewSure");
		this.$componentName=$("#componentName");
		this.$legendBox=$("#g-legendBox");

		this.viewType ="";
		this.wd_arr = null;
		this.commonSel = null ;
		this.activeViewObje = null ;
		this.getTreeData();
		this.handle();
		
	}

	init() {

		const self = this;
		const kpiTree = this.kpiTree,
			  modal = self.modal,
			  viewModal = self,
			  dimTree = this.dimTree;

		this.zbComponent = new ZbComponent({
			kpiTree,
			dimTree,
			modal,
			getViewModal:()=>{
				
				return self ;

			},
		});

		// 日历
		this.calendar = new Calendar($(".dataTime"), $("#viewShowTime"), {
			rotate:3,
			style: 1,
		});
		console.log(this.calendar);
		this.xAxis = new SCombobox($("#XAxis"), {
			width: 300,
			"prompt": "请选择横轴维度...",
			"multiply": true,
			clickCallback: function(node, _this, status) {

				let yData = "";
				const values = _this.getValue().split(",");

				requestAnimationFrame(function(){
					if(self.viewType==="table"){
						 yData = self.filterAxisData(values);
						self.yAxis.loadData(yData);
					
					}else{
						if(!self.zbComponent.isOneZb){
							yData = self.filterAxisData(values);
							yData.push({"id":"4","text":"指标"});
							self.yAxis.loadData(yData);
						}
					}

				});
				
				setTimeout(function(){
					self.changeSelType(node, status, _this.config.multiply);
				},60);
				
			}
		});

		this.yAxis = new SCombobox($("#YAxis"), {
			width: 300,
			"prompt": "请选择纵轴维度...",
			"multiply": true,
			clickCallback: (node, _this, status) => {

				const values = _this.getValue().split(",");
				requestAnimationFrame(function(){
					const Xdata = self.filterAxisData(values);
					self.xAxis.loadData(Xdata);
				});
			

				setTimeout(function(){
					self.changeSelType(node, status, _this.config.multiply);
				},60);
			}
		});

		const orgTree = this.orgTree;

		this.orgWd = new SComboTree($("#orgWd"), {
			"prompt": "请选择科室...",
			treeConfig: {
				"clickAndCheck": true,
				data: orgTree,
				"childIcon":"sicon sicon-org",
				idField: "dim_value",
				textField: "dim_name",
				childrenField: "sub",
				judgeRelation: function(val) {
					return val.type === "0";
				}
			}
		});

		this.dimWd = new SCombobox($("#dimWd"), {
			width: 300,
			"prompt": "请选择主题维度...",
			"dropIcon":"sicon sicon-kpi",
			"multiply": false,
			"idField": "dim_value",
			textField: "dim_name",
		});
	}

	getTreeData() {

		return Promise.all([api.dimtree(), api.kpitree(), api.orgtree()]).then((res) => {
			this.orgTree = res[2].sub;
			this.kpiTree = res[1].sub;
			this.dimTree = res[0].sub;
			this.init();
		})
	}

	filterAxisData(values) {

		return this.wd_arr.filter(val => {
			return !values.includes(val.id);
		});
	}

	changeComboSel(id,status){

		const wd_id = this.viewType === "table" ? "4" : "3" ;
		
		switch (id) {
				case "1": // 日历
					const style = status && 2 || 1;
					this.calendar.changeStyle(style);
					break;
				case "2": //科室
					this.orgWd.changeType(status);
					break;
				case wd_id: // 维度值
					this.dimWd.config.multiply = status;
					this.dimWd.clearValue();
					break;
		}
	}

	changeSelType(node, status, multiply) {

		if (multiply) {
			this.changeComboSel(node.id,status);
		} else {
			this.changeComboSel(node.id,true);
			this.changeComboSel(status,false);
		}
	}

	upModalStatus(type,size,$view){

		this.activeViewObje = {
			$box:$view,
			size
		};

		this.$componentName.val("");
		const icon = $(`.component-item[echo-type=${type}]`).html();
		this.modalType.html(icon);

		this.viewType=type;
	    this.viewStyleBoxTnit();
	    this.upComboxStatus();
		this.modal.show(this.setMd);
		this.zbComponent.sureBtnHandle(this);
		ViewSetModal.status = "create";
			
	}

	setModalSel(type,size,$view,selObj){

		$view.attr({"echo-type":type});
		$view.addClass("view-active").siblings().removeClass("view-active");

		ViewSetModal.status = "edit";

		this.activeViewObje = {
			$box:$view,
			size
		};
		const icon = $(`.component-item[echo-type=${type}]`).html();
		this.modalType.html(icon);
		this.viewType=type;

		const {object,object:{legend,chartName},borderType} = selObj;

		/**
		 * legend-place：图例位置
		 * border-style：边框样式
		 */
		$(".legend-place").eq(legend - 1).prop("checked",true);
		$(".border-style").eq(borderType - 1).prop("checked",true);
		this.$componentName.val(chartName);
	    this.viewStyleBoxTnit(object);
	    this.upComboxStatus(object);
		this.modal.show(this.setMd);


		this.zbComponent.sureBtnHandle(this,object,type);
			
	}


	upComboxStatus(){

		const status = this.viewType ==="table";

		const xAxisBox = this.xAxis.box.parent() ;

		this.viewType ==="pie" && xAxisBox.hide() || xAxisBox.show();
		this.xAxis.config.multiply = status;
		this.yAxis.config.multiply = status;
		this.dimWd.config.multiply = false;
		this.xAxis.clearValue();
		this.yAxis.clearValue();
		this.dimWd.clearValue();
		this.orgWd.changeType(false);
		this.calendar.changeStyle(1);
	}

	

	viewStyleBoxTnit(object={}) {

		const methodObj = {
			table: "tableInit",
			line: "lineInit",
			bar: "barInit",
			pie: "pieInit",
			scatter: "scatterInit",
			rader: "raderInit",
		}
		const str = this[methodObj[this.viewType]](object);
	}

	getChartCommonInit(threeD){

		this.$legendBox.show();

		const AxisArr = threeD.split(",");

		const checkedArr = ["",'checked="checked"'];

		const x = checkedArr[+AxisArr[0]];
		const y = checkedArr[+AxisArr[1]];


		const axis = `<div class="sel-item">
							<div class="sel-item">

								<span class="s-title">X轴:</span>
							   	<span class="s-switch" echo-text="不显示" style="width: 100px">
									<input type="checkbox" id="Xaixs" ${x}>
									<label for="Xaixs" echo-text="显示"></label>
								</span>
							</div>
							<div class="sel-item">
								<span class="s-title">Y轴:</span>
							    <span class="s-switch" echo-text="不显示" style="width: 100px">
									<input type="checkbox" id="Yaixs" ${y}>
									<label for="aixs" echo-text="显示"></label>
								</span>
							</div>
						</div>`;
	
		return {
			axis,
		}
	}

	tableInit(object) {

		this.$legendBox.hide();

		const {tab_style = "0" ,isAdded = "0" ,total = "0"} = object ;


		const checkArr = ["",""];
		 checkArr[+tab_style] = 'checked="checked"';

		const htmlStr = `<div class="sel-item">
				    <p class="s-title">表格样式:</p>
				    <div>
				        <span><input type="radio" class="s-radio" name="tab-style" ${checkArr[0]} value="0"><label class="m-radio-icon u-tab-lab1"></label></span>
				        <span><input type="radio" ${checkArr[1]} class="s-radio " name="tab-style" value="1"><label class="m-radio-icon u-tab-lab2"></label></span>
				    </div>
				</div>
				<div class="sel-item">
				    <p class="s-title">合计:</p>
					<div class="s-comboBox" id="totalCombo"></div>
				</div>
				`
		this.viewStyleBox.html(htmlStr);

		const defaultVal = total === "0" ? [] : total === "3" ? ["1","2"] : [total] ;

		new SCombobox($("#totalCombo"), {
			width: 240,
			"prompt": "可多选（非必选）",
			"multiply": true,
			validCombo: false,
			defaultVal:defaultVal,
			data: [{
				"text": "列字段",
				"id": "1"
			}, {
				"text": "行字段",
				"id": "2"
			}, ]
		});

	}
	barInit(object) {

		const {threeD="0,0",stack="0",landscape="0"} = object ;

		const {axis} = this.getChartCommonInit(threeD);

		const landscapeArr = ["",""];
			landscapeArr[+landscape] = 'checked="checked"';


		const htmlStr = `
						${axis}
						<div class="sel-item">
							<div class="sel-item">
							      <p class="s-title">展示样式:</p>
								  <div>
								        <span><input type="radio" ${landscapeArr[0]} class="s-radio u-radio-sel" name="bar-style" checked="checked" value="0"><label class="m-radio-icon u-bar-lab1"></label></span>
								        <span><input type="radio" ${landscapeArr[1]} class="s-radio u-radio-sel" name="bar-style" value="1"><label class="m-radio-icon u-bar-lab2"></label></span>
								  </div>
							</div>
							<div class="sel-item">
								<span class="s-title">堆叠:</span>
							    <label class="s-switch-2">
										<input type="checkbox" class="stack" name="stack" ${stack==="1" ? 'checked="checked"': ""} >
										<span class="switch-ball"></span>
						    	</label>
							</div>
						</div>
				`
		this.viewStyleBox.html(htmlStr);
	}	
	lineInit(object) {

		const {threeD="0,0",landscape="0"} = object ;

		const {axis} = this.getChartCommonInit(threeD);

		const landscapeArr = ["",""];
			landscapeArr[+landscape] = 'checked="checked"';

		const htmlStr = `
						${axis}
						<div class="sel-item">
							<div class="sel-item">
							      <p class="s-title">展示样式:</p>
								  <div>
								        <span><input type="radio" ${landscapeArr[0]} class="s-radio u-radio-sel" name="line-style"  value="0"><label class="m-radio-icon u-line-lab1"></label></span>
								        <span><input type="radio" ${landscapeArr[1]}  class="s-radio u-radio-sel" name="line-style" value="1"><label class="m-radio-icon u-line-lab2"></label></span>
								  </div>
							</div>
						</div>
				`
		this.viewStyleBox.html(htmlStr);
	}

	pieInit(object) {

		this.$legendBox.show();
		const {roseType = "0"} = object ;

		const roseTypeArr = ["","","",""];
			  roseTypeArr[roseType-1] = 'checked="checked"';

		const htmlStr = `
						<div class="sel-item">
							<div class="sel-item">
							      <p class="s-title">展示样式:</p>
								  <div>
								        <span><input type="radio" ${roseTypeArr[0]} class="s-radio u-radio-sel" name="pie-style"  value="1"><label class="m-radio-icon u-pie-lab1"></label></span>
								        <span><input type="radio" ${roseTypeArr[1]}  class="s-radio u-radio-sel" name="pie-style" value="2"><label class="m-radio-icon u-pie-lab2"></label></span>
								         <span><input type="radio" ${roseTypeArr[2]} class="s-radio u-radio-sel" name="pie-style"  value="3"><label class="m-radio-icon u-pie-lab3"></label></span>
								        <span><input type="radio"  ${roseTypeArr[3]} class="s-radio u-radio-sel" name="pie-style" value="4"><label class="m-radio-icon u-pie-lab4"></label></span>
								  </div>
							</div>
						</div>
				`
		this.viewStyleBox.html(htmlStr);
	}
	raderInit(object) {

		this.$legendBox.show();
		const {area = "0"} = object ;
		const areaArr = ["",""];
			  areaArr[+area] = 'checked="checked"';

		const htmlStr = `
						<div class="sel-item">
							<div class="sel-item">
							      <p class="s-title">展示样式:</p>
								  <div>
								        <span><input type="radio" class="s-radio u-radio-sel" name="rader-style" ${areaArr[0]} value="0"><label class="m-radio-icon u-rader-lab1"></label></span>
								        <span><input type="radio"  class="s-radio u-radio-sel" ${areaArr[1]} name="rader-style" value="1"><label class="m-radio-icon u-rader-lab2"></label></span>
								  </div>
							</div>
						</div>
				`;
		this.viewStyleBox.html(htmlStr);
	}
	scatterInit(object) {
		const {threeD="0,0",landscape="0"} = object ;

		const landscapeArr = ["",""];
			landscapeArr[+landscape] = 'checked="checked"';

		const {axis} = this.getChartCommonInit(threeD);

		const htmlStr = `
						${axis}
						<div class="sel-item">
							<div class="sel-item">
							      <p class="s-title">展示样式:</p>
								  <div>
								        <span><input type="radio" class="s-radio u-radio-sel" ${landscapeArr[0]} name="scatter-style"  value="0"><label class="m-radio-icon u-scatter-lab1"></label></span>
								        <span><input type="radio" ${landscapeArr[1]} class="s-radio u-radio-sel" name="scatter-style" value="1"><label class="m-radio-icon u-scatter-lab2"></label></span>
								  </div>
							</div>
						</div>
				`;
		this.viewStyleBox.html(htmlStr);
	}

	getCommonValue(type,pubDim) {
		const fieldObj = {
			table: {
				xField: "row_wd",
				yField: "col_wd",
				dimZbField: "kpi_infos",
				dimIdField:"dim_id",
				kpiField:"kpi_id",
				nameField:"kpi_name",
				dimNameField:"dim_name",
				dimValField:"dim_val",
				dimNameValField:"dim_val_name",
				pubDimIdField:"pub_dim_id",
				pubDimNameField:"pub_dim_name",
				pubDimValsField:"pub_dim_vals",
			},
			chart: {
				xField: "rowDim",
				yField: "contrastDim",
				dimZbField: "kpisDimX",
				dimIdField:"dimId",
				kpiField:"kpiId",
				nameField:"kpiName",
				dimNameField:"dimName",
				dimNameValField:"dimValName",
				dimValField:"dimVal",
				pubDimIdField:"pubDimId",
				pubDimNameField:"pubDimName",
				pubDimValsField:"pubDimVals",
			}
		}

		const row_wd = type==="table" && this.xAxis.getValue().split(",") || this.xAxis.getValue();
		const col_wd = type==="table" && this.yAxis.getValue().split(",") || this.yAxis.getValue();

		const chartName = this.$componentName.val().trim();
		const orgs = this.orgWd.getValue("all").map(val => {
			const {dim_value: id, dim_value, dim_name: text } = val; 

			return {
				id,
				text
			}
		});

		/**
		 * 时间分三种情况，正常时间，筛选时间，动态时间
		  正常时间：//时间单位：年季月日
				time_id代表开始时间，time_start代表结束时间，userColumnId代表是否为动态时间，此时userColumnId为0，-1代表动态时间，0代表非动态时间，time_id和time_start的时间可以相同，代表时间点
		  筛选时间：//时间单位：年季月日
				startTime代表开始时间，endTime代表结束时间，userColumnId为0，当填写了startTime和endTime这两个字段，会覆盖time_id和time_start，startTime和endTime可以相同代表时间点
		  动态时间：//时间单位：年季月日时分秒，当前时间往前推
				0日，1时，2分，3秒，4年，5月，6季 在数字之前加上_代表什么时间单位的时间段给time_id，time_start此时为当前时间往前推的天数，
				例如 _0,3 代表当前日期往前推3天也就是 20180923,20180924,20180925
				userColumnId此时必须为-1且startTime与endTime必须为空
		 */

		const timeObj = {
			1: "4",
			2: "6",
			3: "5",
			4: "0",
		};

		const tags = this.calendar.style == 2 && "_" || "@";
		const time = this.calendar.value;
		//	const time_id = tags + (timeObj[this.calendar.rotate]);
		const time_id = time[0].join("");
		const time_start = time[time.length - 1].join("");

		const userColumnId = "0";

		const startTime = null,
			  endTime = null;


		let kpis = [],
			kpi_infos = [];
		const $dimItems = $(".dim-item");
		const viewType = this.viewType;

		const objType = fieldObj[type]


		if ($dimItems.length === 1) {
			const zbArrs = $dimItems.find(".zb-name");
			kpis = $.map(zbArrs, val => {
				const $this = $(val);

				const obj = {
					"text": $this.children("b").text(),
					"id": $this.attr("echo-id"),
				}

				if(viewType==="table"){

					obj.isRef="0";

				}else if(viewType==="line"){

					obj.refName="-无-";
					obj.lineType="1";

				}else if(viewType==="bar"){
					obj.refName="-无-";
					obj.lineType="2";
				}

				return obj

			});
		} else {

			$.map($dimItems, item => {
				const $this = $(item);
				const dimId = $this.attr("dim-id");
				const zbArrs = $this.find(".zb-name");
				const dimName = $this.attr("dim-name");

				if (dimId == 2) {
					kpis = $.map(zbArrs, val => {
						const $this = $(val);

						const obj = {
							"text": $this.children("b").text(),
							"id": $this.attr("echo-id"),
						}

						if(viewType==="table"){
							obj.isRef="0";
						}else if(viewType==="line"){
							obj.refName="-无-";
							obj.lineType="1";
						}else if(viewType==="bar"){
							obj.refName="-无-";
							obj.lineType="2";
						}
						return obj;
					});

				} else {
					$.map(zbArrs, val => {
						const $this = $(val);
						const dimCombox = $this.parent().siblings(".zb-dim-combobox");
						const dimValue = dimCombox.find(".combo-text").val(),
							dimVal = dimCombox.find(".combo-value").val();

						const obj ={};
						obj[objType.kpiField]=$this.attr("echo-id");
						obj[objType.nameField]=$this.children("b").text();
						obj[objType.dimIdField]=dimId;
						obj[objType.dimNameField]=dimName;
						obj[objType.dimValField]=dimVal;
						obj[objType.dimNameValField]=dimValue;

						if(viewType==="table"){
							obj.isRef="0";
						}else if(viewType==="line"){
							obj.refName="-无-";
							obj.lineType="1";
						}else if(viewType==="bar"){
							obj.refName="-无-";
							obj.lineType="2";
						}

						kpi_infos.push(obj);
						return ;
					});
				}

				return;


			});
		}

		const common = {
			time_id,
			orgs,
			time_start,
			kpis,
			startTime,
			endTime,
			chartName,
			userColumnId,
		}

       if(pubDim){
					
		common[fieldObj[type].pubDimIdField] = $("#publicDim").attr("dim-id");
		common[fieldObj[type].pubDimNameField] = $("#publicDim").attr("dim-name");

		console.log(this.dimWd.getValue(this.dimWd.box,"all"),"ssss");
		common[fieldObj[type].pubDimValsField] = this.dimWd.getValue(this.dimWd.box,"all").map(val=>{
			return {id:val.dim_value,text:val.dim_name}
		});
     
       }else{
    
       	common[fieldObj[type].dimZbField] = kpi_infos;
    
       }
		
		common[fieldObj[type].xField] = row_wd;
		common[fieldObj[type].yField] = col_wd;

		return common;
	}

	getTableSet() {

		const _total = $("#totalCombo").find(".combo-value").val();
		const isAdded = "0",
			dim_x = this.zbComponent.publicDim,
			tab_style = $("input[name=tab-style]:checked").val(),
			isDsType = "1",
			isMerge = "1",
			total = !_total ? "0" : (_total.includes(",") && "3" || _total);

		return Object.assign(this.getCommonValue("table",dim_x), {
			isAdded,
			tab_style,
			total,
			isMerge,
			isDsType,
			dim_x
		});

	}

	getChartSet() {

		const viewType = this.viewType;
		/*
		    4:折线
			5:饼图
			6:雷达图
			7:散点图
		*/
	
	
		let chartType = "",
		    flagObj = null ,
		    legend= $(".legend-place:checked").val(),
		    isPubDimX = this.zbComponent.publicDimArr.length==1;

	    const style = $(".u-radio-sel:checked").val();


    	const dimId = this.zbComponent.publicDimArr[0]!=="dim_2";

	    const common = this.getCommonValue("chart",dimId);


		switch(viewType){
			case "pie":{
				chartType = "5";
				const roseType = style,	
					  rowDim = common.contrastDim;
				flagObj = {roseType,rowDim};
			}
				break;
			case "scatter":{
				 const Xaxis = $("#Xaixs").prop("checked");
	   			 const Yaxis = $("#Yaixs").prop("checked");
	   			 const threeD= Number(Xaxis) + "," +  Number(Yaxis),
	   			      landscape= style;
				chartType = "7";
				flagObj = {threeD,landscape};
			}
				break;
			case "rader":{
				chartType = "6";
				const area= style;
				flagObj = {area};
			}
				break;
			default:{
				chartType = "4" ;
				/**
				 * @landscape {0：垂直，1:横向}
				 * @stack {1:堆积，0：不堆积}
				 * @maxVal {[type]}
				 * @minVal {[type]}
				 * @threeD {[1,1]:第一个是X轴，第二个Y轴，1:显示，0：不显示}
				 * @moreAxis {[type]}
				 */
				 const Xaxis = $("#Xaixs").prop("checked");
	   			 const Yaxis = $("#Yaixs").prop("checked");
				 const landscape= style,
					  stack= viewType === "bar" ? Number($(".stack").prop("checked")) : "0",
					  threeD= Number(Xaxis) + "," +  Number(Yaxis),
					  maxVal= "@",
					  minVal= "@",
					  moreAxis= "0";
				flagObj = {landscape,stack,threeD,maxVal,minVal,moreAxis}
			}
			break;
		};


	 

		return Object.assign(common,flagObj,{
			  chartType,
			  isPubDimX,
			  legend
		});
	}

	getSetData() {

		const viewType = ["line","pie","scatter","bar","rader"].includes(this.viewType) && "chart" || this.viewType ;

		const methodObj = {
			table:{
				"set":"getTableSet",
				"url":"getTableInfo",
				"save":"saveTableInfo",
			},
			chart:{
				"set":"getChartSet",
				"url":"getGraphInfo",
				"save":"saveGraphInfo",
			},
		}
	    const methodType = methodObj[viewType];

		const object = this[methodType.set]();

		return {
			methodType,
			object,
			viewType
		}

		
	}

	createView(){

		const {methodType , object,viewType} = this.getSetData();
		
		api[methodType.url](object).then(node => {

					if (node.data && node.data.length) {

						const {$box,size} = this.activeViewObje;
						const borderType = $(".border-style:checked").val();
						const border_str = borderType  === "0" ?"" : `<div class="bgSvg" echo-w="${size[0]}" echo-y="${size[1]}" echo-type="${borderType}"></div>`;

						const htmlStr = border_str + `<div class="view-content"></div>`;
						const viewId =  $box.attr("echo-id");
						const status = ViewSetModal.status;

							this.viewDB.add(object,viewType,node,{$box,htmlStr,borderType,viewId,status},);

					} else {
						
						alert("数据出错！");

					}


				});

	}


	handle() {
		const self = this;
		const $setMd = this.setMd;
		// tab切换
		$setMd.on("click", ".m-tab", function(e) {
			e.stopPropagation();
			const index = $(this).index();

			if (index==2) {
				const sels = self.zbComponent.zbTree.getValue("id");
				sels.length && $setMd.addClass("other") || alert("选择指标！");
			} else {
				$setMd.removeClass("other");
			}
		});

		// 模态框确定按钮操作
		self.$viewSure.click(function() {

			const noFill = $setMd.find(".no-fill:visible");
			if(noFill.length){
				alert("请填完必填项！");
				return ;
			}

			const status = $(this).attr("status");
			self.createView();
		});

		$setMd.on("click", function() {
			requestAnimationFrame(function(){
		         const $comboDrop = $(".combo-drop");
				 $comboDrop.parent().removeClass("active");
				 $comboDrop.hide();
		    });
		});

		/**
		 * [删除已经选择的指标]
		 */
		$setMd.on("click", ".del-zb", function() {

			const $this = $(this);
			const zb = $this.closest(".zb-item-box");
			const id = $this.parent().attr("echo-id");
			self.zbComponent.zbTree.box.find(`.child-checkinp[value=${id}]`).click();
			zb.remove();
		});
	}
}


export { ViewSetModal }; 
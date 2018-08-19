import {api } from "api/editTemplate.js";
import {SCombobox, SModal, Calendar, Tree, SComboTree, SInp } from "js/common/Unit.js";

import {View } from "js/ManageViews/view.js";



import "css/ManageViews.scss";
import "css/editTemplate.scss";
/*jq对象*/
const $setMd = $("#setComponentMd"),
	$globalBox = $("#globalBox"),
	$selZbs = $("#selZbs"),
	$modalType = $("#modalType"),
	$viewStyleBox = $("#viewStyleBox"),
	$zbBox = $("#zbTreeBox");

console.log(422);

class TemplateView {

	constructor($el,config) {
		//const {id} = config ;
	   
	   this.box = $el;
 
	   this.init();

	}

	init(){

		const strArr = new Array(9).fill(`<div class="view-item" ></div>`);
		this.box.html(`<div class="view-template theme2" >${strArr.join("")}</div>`);
		this.handle();
	}

	handle(){


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
					
				$this.html(`<div class="bgSvg" echo-w="1" echo-y="1" echo-type="1"></div>
       			 <div class="view-content"> </div>`);

				

				viewSetModal.upModalStatus(type);

			};

		});

		
	}
}

const page = new TemplateView($("#templateBox"));


class ZbComponent {

	constructor(config) {

		const {
			kpiTree,
			dimTree
		} = config;

		this.kpiTree = kpiTree;
		this.dimTree = dimTree;
		this.init();
	}


	init() {

		const kpiTree = this.kpiTree;
		this.zbTree = new Tree($("#zbTree"), {
			"clickAndCheck": false,
			"checkbox": true,
			data: kpiTree,
			idField: "kpi_id",
			textField: "kpi_name",
			childrenField: "sub",
			judgeRelation: function(val) {
				return val.kpi_type == 0;
			}
		});

		this.handle();
	}

	findDimData(key) {
		let node = null;

		const data = this.dimTree;

		findFn(data);

		function findFn(arr) {
			return arr.find(val => {
				const status = val["dim_id"] == key;
				if (status) {
					node = val;
				}

				const sub = val.sub;

				if (sub.length) {

					return !status && findFn(sub) || status;

				} else {
					return status;
				}

			});
		}

		return node;
	}

	classifyZb(kpi, values) {

		api.GroupKpiByDim({
			kpi
		}).then(res => {

			if (res) {

				const dimArr = Object.keys(res);
				const excelDim_2 = [];
				const publicDim = dimArr.length === 1 && dimArr[0] !== "dim_2" && true || false;

				this.publicDim = publicDim;

				//获取分类好了的指标数组
				const zbObj = !publicDim && dimArr.map((key) => {
					const dimId = key.split("_")[1];
					const zbArr = values.filter(node => {
						return res[key].includes(node.kpi_id);
					});

					let dimName = null;

					if (dimId != "2") {
						const dimWd = this.findDimData(dimId);
						dimName = dimWd.dim_name;
					}

					const dimItem = zbArr.map(val => this.renderZb(val, {
						key,
						dimName
					}));

					return `<div class="dim-item" dim-id="${dimId}" dim-name="${dimName}">
										${dimItem.join("")}
							  </div>`;
				}) || values.map(val => this.renderZb(val, {
					key: "dim_2",
					dimName: ""
				}));


				const htmlStr = !publicDim ? zbObj.join("") : `<div class="publicDim dim-item" >${zbObj.join("")}</div>`;

				// 公共维度下拉框
				if (publicDim) {
					$("#publicDim").show();
					const dimId = dimArr[0].split("_")[1];
					const data = this.findDimData(dimId).sub;
					viewSetModal.dimWd.loadData(data);
					viewSetModal.wd_arr = wd_arr.slice();
					viewSetModal.yAxis.loadData(viewSetModal.wd_arr);
					viewSetModal.xAxis.loadData(viewSetModal.wd_arr);
					viewSetModal.yAxis.clearValue();
					viewSetModal.xAxis.clearValue();
				} else {
					$("#publicDim").hide();

					const AxisData = wd_arr.filter(val => {
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
				dimArr.length > 1 && $.map($(".dim-item"), val => {

					const $val = $(val);
					const dimId = $val.attr("dim-id");

					if (dimId == 2) {
						return;
					}

					const dimCombobox = $(val).find(".dimCombobox");
					const data = this.findDimData(dimId).sub;

					new SCombobox(dimCombobox, {
						data: data,
						textField: "dim_name",
						idField: "dim_value",
					});
				});

			} else {

				alert("没有数据");

			}


		})

	}

	renderZb(node, config) {

		const {
			kpi_name,
			kpi_id
		} = node;
		const {
			key,
			dimName
		} = config;

		let str = "";

		if (key !== "dim_2") {
			str = `
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
		} else {
			str = `<span class="zb-item-box">
			   			<button class="s-btn zb-name" echo-id="${kpi_id}">
	   						<i class="fa fa-times-circle del-zb"></i>
							<b>${kpi_name}</b>
					    </button>
				    </span>`;
		}

		return str;
	}



	handle() {

		const self = this;

		$("#selZb").click(function() {
			if ($zbBox.hasClass("active")) {
				return;
			}
			viewSetModal.modal.show($zbBox, "active");
		});

		$("#zbOpt").on("click", "button", function() {

			const index = $(this).index();

			switch (index) {

				case 0:

					const values = self.zbTree.getValue("all");
					const ids = values.map(val => val.kpi_id);

					if (!ids.length) {
						return;
					}
					self.classifyZb(ids, values);
					viewSetModal.modal.close($zbBox, "active");

					break;
				case 1:
					viewSetModal.modal.close($zbBox, "active");
					break;
			}

		});
		$setMd.on("click", ".del-zb", function() {
			const zb = $(this).closest(".zb-item-box");
			const id = $(this).parent().attr("echo-id");
			self.zbTree.setValue([id]);
			zb.remove();
		});
	}
}

const wd_arr = [{
	"id": "1",
	"text": "时间"
}, {
	"id": "2",
	"text": "科室"
}, {
	"id": "3",
	"text": "指标"
}, {
	"id": "4",
	"text": "维度值"
}];

class ViewSetModal {
	constructor() {

		this.viewType ="";
		this.getTreeData();
		this.handle();
		
	}

	filterAxisData(values) {

		return this.wd_arr.filter(val => {
			return !values.includes(val.id);
		});
	}

	changeComboSel(id,status){

		switch (id) {
				case "1": // 日历
					const style = status && 2 || 1;
					this.calendar.changeStyle(style);
					break;
				case "2": //科室
					this.orgWd.tree.config.checkbox = status;
					this.orgWd.tree.box.unbind();
					this.orgWd.tree.init();
					this.orgWd.clearValue();
					break;
				case "4": // 维度值
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

	upModalStatus(type){

			const icon = $(`.component-item[echo-type=${type}]`).html();
			$modalType.html(icon);

			this.viewType=type;
		    this.viewStyleBoxTnit();
		    this.upComboxStatus();
			this.modal.show($setMd);
	}

	upComboxStatus(){

		const status = this.viewType ==="table" ;

		this.xAxis.config.multiply = status;
		this.yAxis.config.multiply = status;
		this.xAxis.clearValue();
		this.yAxis.clearValue();
		this.dimWd.clearValue();
		$("#componentName").val(null);
	}

	init() {

		const self = this;
		// 模态框
		this.modal = new SModal();
		this.inp = new SInp();
		// 指标树

		const kpiTree = this.kpiTree,
			dimTree = this.dimTree;
		this.zbComponent = new ZbComponent({
			kpiTree,
			dimTree
		});
		// 日历
		this.calendar = new Calendar($(".dataTime"), $("#viewShowTime"), {
			rotate: 4,
			style: 1,
		});
		this.xAxis = new SCombobox($("#XAxis"), {
			width: 300,
			"prompt": "请选择横轴维度...",
			"multiply": true,
			clickCallback: function(node, _this, status) {
				
				const values = _this.getValue().split(",");
				const Xdata = self.filterAxisData(values);
				self.yAxis.loadData(Xdata);
				self.changeSelType(node, status, _this.config.multiply);
			}
		});

		this.yAxis = new SCombobox($("#YAxis"), {
			width: 300,
			"prompt": "请选择纵轴维度...",
			"multiply": true,
			clickCallback: (node, _this, status) => {

				const values = _this.getValue().split(",");
				const Ydata = self.filterAxisData(values);
				self.xAxis.loadData(Ydata);

				self.changeSelType(node, status, _this.config.multiply);
			
			}
		});

		const orgTree = this.orgTree;

		this.orgWd = new SComboTree($("#orgWd"), {
			"prompt": "请选择科室...",
			treeConfig: {
				"clickAndCheck": false,
				data: orgTree,
				idField: "dim_value",
				textField: "dim_name",
				childrenField: "sub",
				judgeRelation: function(val) {
					return val.type == 0;
				}
			}
		});

		this.dimWd = new SCombobox($("#dimWd"), {
			width: 300,
			"prompt": "请选择主题维度...",
			"multiply": false,
			"idField": "dim_value",
			textField: "dim_name",
		});
	}

	viewStyleBoxTnit() {

		const methodObj = {
			table: "tableInit",
			line: "lineInit",
			bar: "lineInit",
			pie: "pieInit",
			scatter: "scatterInit",
			rader: "raderInit",
		}
		const str = this[methodObj[this.viewType]]();
	}

	tableInit() {

		const htmlStr = `<div class="sel-item">
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

		new SCombobox($("#totalCombo"), {
			width: 240,
			"prompt": "可多选（非必选）",
			"multiply": true,
			validCombo: false,
			data: [{
				"text": "列字段",
				"id": "1"
			}, {
				"text": "行字段",
				"id": "2"
			}, ]
		});

	}

	lineInit() {

		const htmlStr = `<div class="sel-item">
						    <p class="s-title">横向图:</p>
						    <div>
						        <span><input type="radio" class="s-radio" name="tab-style" checked="checked" value="0"><label>是</label></span>
						        <span><input type="radio"  class="s-radio" name="tab-style" value="1"><label>否</label></span>
						    </div>
						</div>
						<div class="sel-item">
						    <p class="s-title">堆叠:</p>
						    <div>
						        <span><input type="radio" class="s-radio" name="tab-style" checked="checked" value="0"><label>是</label></span>
						        <span><input type="radio"  class="s-radio" name="tab-style" value="1"><label>否</label></span>
						    </div>
						</div>
						<div class="sel-item">
						    <p class="s-title">图例位置:</p>
						    <div>
						        <span><input type="radio" class="s-radio" name="tab-style" checked="checked" value="0"><label>是</label></span>
						        <span><input type="radio"  class="s-radio" name="tab-style" value="1"><label>否</label></span>
						    </div>
						</div>
				`
		$viewStyleBox.html(htmlStr);
	}

	pieInit() {

		const htmlStr = ` `;
		$viewStyleBox.html(htmlStr);
	}
	raderInit() {
		const htmlStr = ` `;
		$viewStyleBox.html(htmlStr);
	}
	scatterInit() {
		const htmlStr = ` `;
		$viewStyleBox.html(htmlStr);
	}

	getTreeData() {

		return Promise.all([api.dimtree(), api.kpitree(), api.orgtree()]).then((res) => {
			this.orgTree = res[2].sub;
			this.kpiTree = res[1].sub;
			this.dimTree = res[0].sub;
			this.init();
		})
	}

	getCommonValue(type) {


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
			}
		}

		const row_wd = type==="table" && this.xAxis.getValue().split(",") || this.xAxis.getValue();
		const col_wd = type==="table" && this.yAxis.getValue().split(",") || this.yAxis.getValue();

		const chartName = $("#componentName").val().trim();
		const orgs = this.orgWd.getValue("all").map(val => {
			const {dim_value: id, dim_value, dim_name: text } = val; 

			return {
				id,
				text
			}
		});

		/*time_id：时间段   
		 _0日,_1时,_2分,_3秒,_4年,_5月,_6季度
		 时间点   
		  @0日,@1时,@2分,@3秒,@4年,@5月,@6季度
		  startTime： 表示从当前时间往前推多少*/

		const timeObj = {
			1: "4",
			2: "6",
			3: "5",
			4: "0",
		};

		const tags = this.calendar.style == 2 && "_" || "@";
		const time = this.calendar.value;
		const time_id = tags + (timeObj[this.calendar.rotate]);
		const time_end = time[time.length - 1].join("");
		const time_start = 4;

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
					obj.lineType="3";

				}else if(viewType==="bar"){
					obj.refName="-无-";
					obj.lineType="4";
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
							obj.lineType="3";
						}else if(viewType==="bar"){
							obj.refName="-无-";
							obj.lineType="4";
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
							obj.lineType="3";
						}

						kpi_infos.push(obj);
						/*kpi_infos.push({
							"kpi_name": $this.children("b").text(),
							"kpi_id": $this.attr("echo-id"),
							"dim_id": dimId,
							"dim_name": dimName,
							"dim_val": dimVal,
							"dim_val_name": dimValue,
							"isRef": "0"
						});*/
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
			time_end,
			kpis,
			startTime,
			endTime,
			chartName,
		}

		common[fieldObj[type].dimZbField] = kpi_infos;
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

		return Object.assign(this.getCommonValue("table"), {
			isAdded,
			tab_style,
			total,
			isMerge,
			isDsType,
			dim_x
		});

	}

	getChartSet() {

		const chartType = "4",
			  landscape= "0",
			  stack= "0",
			  threeD= "0",
			  maxVal= "@",
			  minVal= "@",
			  legend= "1",
			  isPubDimX= true,
			  moreAxis= "0";

		return Object.assign(this.getCommonValue("chart"), {
			 chartType,
			  landscape,
			  stack,
			  threeD,
			  maxVal,
			  isPubDimX,
			  minVal,
			  legend,
			  moreAxis,
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

		api[methodType.url](object).then(node => {

			if (node.data && node.data.length) {

				api[methodType.save](object).then(res => {

					const $box = $(".view-active");
					const id = res.id,
						type = viewType,
						status = "2",
						viewTitle = object.chartName,
						index = 1;

					page.table = new View($box, {
						id,
						type,
						index,
						viewTitle
					}, node, status);

				});

			} else {
				alert("数据出错！");

			}


		});

		return [];
	}
	handle() {
		const self = this;
		// tab切换
		$setMd.on("click", ".m-tab", function() {
			const index = $(this).index();

			if (index==2) {
				const sels = self.zbComponent.zbTree.getValue("id");
				sels.length && $setMd.addClass("other") || alert("选择指标！");
			} else {
				$setMd.removeClass("other");
			}

		});

		// 模态框操作
		$("#viewSure").click(function() {
			self.getSetData();
		});
	}
}

$(window).on("click", function() {

	/*const $scomboBox=$(".s-comboBox");
	 $scomboBox.removeClass("active");
	 const $drop = $scomboBox.children(".combo-drop");
   	 $drop.hide();*/

});


class HeadOpt {
	constructor() {
		this.init();

	}

	init() {
		this.handle();
	}
	handle() {
		$("#headOpt").on("click", ".head-btn", function() {

			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
					break;
				case "style":
					viewSetModal.modal.show($globalBox, "active");


					break;
				case "pre":
					break;
				case "save-as":
					break;
				case "export":
					break;
				case "back":
					const $slide = $("#slide", window.parent.document);
					const $head = $("#content", window.parent.document);
					const width = $slide.hasClass("collapsed") && 45 || 250;
					$slide.animate({
						"width": width
					}, 500, function() {
						window.history.back();
						$head.removeClass("no-head");
					});
					break;

			}


		});

		//全局样式设置
		$("#globalOpt").on("click", ".s-btn", function() {
			const index = $(this).index();

			switch (index) {
				case 0:
					break;

				case 1:
					viewSetModal.modal.close($globalBox, "active");
					break;
			}
		});
	}

}

class ViewComponet {

	constructor() {

		this.init();
	}

	init() {

		this.handle();
	}

	handle() {

		//目标组件的拖拽事件
		
		const $eleDrags = $(".component-item");
			

		$.map($eleDrags, function(eleDrag) {

			eleDrag.onselectstart = function() {
				return false;
			};

			eleDrag.ondragstart = function(ev) {

				const type = ev.target.getAttribute("echo-type");

				console.log(type);

				ev.dataTransfer.effectAllowed = "move";
				ev.dataTransfer.setData("type", type);
				ev.dataTransfer.setDragImage(ev.target, 0, 0);
				return true;
			};
			eleDrag.ondragend = function(ev) {
				/*拖拽结束*/
				ev.dataTransfer.clearData("type");

				console.log("end");
				return false
			};
		});

		
	}
}



const viewSetModal = new ViewSetModal(),
	head = new HeadOpt(),
	viewComponet = new ViewComponet();
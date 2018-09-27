import "css/ManageViews.scss";
import "css/editTemplate.scss";

import {api } from "api/editTemplate.js";
import {SCombobox, SModal, Calendar, Tree, SComboTree, SInp } from "js/common/Unit.js";
import {View } from "js/ManageViews/view.js";


/**
 * 保存组件的数据，最后便于统一保存
 */
class DataDB {

	static index = 0 ;

	constructor(){
		this.viewData = new Map();
	}
	add(object,viewType,node){

		const id = ++ DataDB.index;

		const  $box = $(".view-active");
		const  type = viewType,
				viewTitle = object.chartName,
				index = id;

		const views = new View($box, {
			id,
			type,
			index,
			viewTitle
		}, node, "2");

		const data = {
			id,views,object,viewType
		}
		this.viewData.set($box[0],data);
	}

}


/**
 * 头部组件
 */
class HeadOpt {
	constructor() {
		this.globalBox = $("#globalBox");
		this.init();
		this.handle()
	}

	init() {
		
	}
	handle() {
		const _self = this ;
		$("#headOpt").on("click", ".head-btn", function() {
			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
					break;
				case "style":
					page.modal.show(_self.globalBox, "active");


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
					page.modal.close(_self.globalBox, "active");
					break;
			}
		});
	}

}

/**
 * 左侧所有的组件
 */
class ViewComponet {
	constructor() {
	  this.handle();
	}

	init() {
		
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
				return false
			};
		});
	}
}

/**
 * 模板组件
 */
class TemplateView {

	constructor($el,config) {
		//const {id} = config ;
	   
	   this.box = $el;
	   this.resiziEl = $("#m-resize");
	   this.gLayout =$("#g-layout");
	   this.init();
	   this.startPointX=null;
	   this.startPointY=null;

	}

	init(){

		const strArr = new Array(9).fill(`<div class="view-item" ></div>`);
		this.box.html(`<div class="view-template theme2" >${strArr.join("")}</div>`);
		this.handle();
	}

	showResizeBox($el){

		console.log($el);
		console.log(333);	
		const width = $el[0].offsetWidth;
		const height = $el[0].offsetHeight;
		const top = $el[0].offsetTop;
		const left = $el[0].offsetLeft;

		this.resiziEl.css({
			width,
			height,
			top,
			left,
		});

	}

	move(e,obj){

		const {startPointX,startPointY} = this;

		const {width,height} = obj;

		const moveX = e.clientX - startPointX ;
		const moveY = e.clientY - startPointY ;


		this.resiziEl.css({
			width:width+moveX,
			height:height+moveY,
		})
	}

	changeViewSize(){

		$(".view-active").css({
			"grid-column": "1/3"
		})
	}

	handle(){

		const _self = this;
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

				page.viewSetModal.upModalStatus(type);
			};
		});


		$("#templateBox").on("click",".view-item",function(){
			 const $this = $(this);
			 if($this.hasClass('view-active')){
			 	return ;
			 }

			
			 $this.addClass('view-active').siblings().removeClass("view-active");

			 _self.showResizeBox($this);
		});

		this.resiziEl.on("mousedown",".u-resize-icon",function(e){
			const $this= $(this);
			const type = $this.attr("sign");

			const obj={
				width:_self.resiziEl.width(),
				height:_self.resiziEl.height(),
			}

			_self.gLayout[0].onmousemove=function(e){
				
				_self.move(e,obj);
			}
		

			_self.startPointX=e.clientX;
	  		_self.startPointY=e.clientY;

			switch(type){
				case "m-right":{
						
	

				}
				break;
				default:
				break;
			}
			
		});

		_self.gLayout.on("mouseup",function(){
				console.log("up");
			_self.gLayout[0].onmousemove = null;
			
			_self.changeViewSize();

		})

		/*_self.gLayout[0].onmouseup=function(){

			console.log(222);
				_self.gLayout[0].onmousemove = null;
		}*/
		
		/*this.resiziEl.on("mouseup",".u-resize-icon",function(){
			const $this= $(this);
			const type = $this.attr("sign");
			
			console.log("up");

			//_self.gLayout[0].onmousemove=null;
		});*/


	}
}



/**
 * 指标树组件
 */
class ZbComponent {
	// 注意 表格 id:3 是指标，图形id：3是维度
	static wd_arr_common = [
					{
						"id": "1",
						"text": "时间"
					}, {
						"id": "2",
						"text": "科室"
					}
				];

	constructor(config) {

		const {
			kpiTree,
			dimTree
		} = config;

		this.kpiTree = kpiTree;
		this.dimTree = dimTree;
		this.zbBox = $("#zbTreeBox");
		this.selZbs = $("#selZbs");
		this.publicDimEl = $("#publicDim");
		this.init();
		this.handle();
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
				return val.kpi_type === "0";
			}
		});
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

				const wd_arr_common = ZbComponent.wd_arr_common;
				const viewSetModal = page.viewSetModal;

				const dimArr = Object.keys(res);
				const excelDim_2 = [];
				const publicDim = dimArr.length === 1 && dimArr[0] !== "dim_2" && true || false;

				this.publicDim = publicDim;
				this.publicDimArr = dimArr;
				this.isOneZb = kpi.length > 1;

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


				const specialWd = viewSetModal.viewType === "table" ?
				   
				     [...wd_arr_common, {
											"id": "3",
											"text": "指标"
										}, {
											"id": "4",
											"text": "维度值"
										}] :
				     [...wd_arr_common, {
											"id": "3",
											"text": "维度值"
										}];

				// 公共维度下拉框
				if (publicDim) {
				
					const dimId = dimArr[0].split("_")[1];
					const dImNode = this.findDimData(dimId);
					viewSetModal.dimWd.loadData(dImNode.sub);
					viewSetModal.dimWd.clearValue();
					viewSetModal.wd_arr = specialWd;

					const yAxisData =viewSetModal.viewType !== "table" ? this.isOneZb  && [{"id":"4","text":"指标"}] || [...specialWd,{"id":"4","text":"指标"}] : specialWd;

					viewSetModal.yAxis.loadData(yAxisData);
					viewSetModal.yAxis.clearValue();
					viewSetModal.xAxis.loadData(viewSetModal.wd_arr);
					viewSetModal.xAxis.clearValue();

					this.publicDimEl.show();
					this.publicDimEl.attr("dim-id",dimId);
					this.publicDimEl.attr("dim-name",dImNode.dim_name);

				} else {
					this.publicDimEl.hide();

					specialWd.pop();
					const AxisData = specialWd;

					const yAxisData =viewSetModal.viewType !== "table" ? this.isOneZb  && [{"id":"4","text":"指标"}] || [...specialWd,{"id":"4","text":"指标"}] : specialWd;

					viewSetModal.wd_arr = AxisData;
					viewSetModal.yAxis.loadData(yAxisData);
					viewSetModal.xAxis.loadData( AxisData);
					viewSetModal.yAxis.clearValue();
					viewSetModal.xAxis.clearValue();
				}

				//渲染分类
				this.selZbs.html(htmlStr);
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

	sureBtnHandle(){
		const values = this.zbTree.getValue("all");
		const ids = values.map(val => val.kpi_id);

		if (!ids.length) {
			return;
		}
		this.classifyZb(ids, values);
		page.modal.close(this.zbBox, "active");
	}


	handle() {

		const self = this;


		/**
		 * [指标模态框句柄]
		 */
		$("#selZb").click(function() {

			const $zbBox = self.zbBox;
			if ($zbBox.hasClass("active")) {
				return;
			}
			page.modal.show($zbBox, "active");
		});


		/**
		 * [指标模态框操作]
		 */
		$("#zbOpt").on("click", "button", function() {

			const index = $(this).index();

			switch (index) {

				case 0: //确定

					self.sureBtnHandle();

					break;
				case 1: // 取消
					page.modal.close(self.zbBox, "active");
					break;
			}

		});
		
	}
}

/**
 * 模态框组件
 */
class ViewSetModal {

	constructor() {
		this.setMd = $("#setComponentMd");
		this.modalType = $("#modalType");
		this.viewStyleBox = $("#viewStyleBox");
		this.viewType ="";
		this.wd_arr = null;
		this.getTreeData();
		this.handle();
		
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

	upModalStatus(type){

			const icon = $(`.component-item[echo-type=${type}]`).html();
			this.modalType.html(icon);

			this.viewType=type;
		    this.viewStyleBoxTnit();
		    this.upComboxStatus();
			page.modal.show(this.setMd);
			this.zbComponent.sureBtnHandle();
			
	}

	upComboxStatus(){

		const status = this.viewType ==="table" ;

		this.xAxis.config.multiply = status;
		this.yAxis.config.multiply = status;
		this.dimWd.config.multiply = false;
		this.xAxis.clearValue();
		this.yAxis.clearValue();
		this.dimWd.clearValue();
		$("#componentName").val(null);
	}

	init() {

		const self = this;
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
		this.viewStyleBox.html(htmlStr);

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

		const htmlStr = `
						<div class="sel-item">
							<div class="sel-item">
							    <span class="s-title">横向图:</span>
							    <label class="s-switch-2">
										<input type="checkbox" class="landscape" name="landscape">
										<span class="switch-ball"></span>
						    	</label>
							</div>
							<div class="sel-item">
								<span class="s-title">堆叠:</span>
							    <label class="s-switch-2">
										<input type="checkbox" class="stack" name="stack">
										<span class="switch-ball"></span>
						    	</label>
							</div>
						</div>
						<div class="sel-item">
						    <p class="s-title">图例位置:</p>
						    <div>
						        <span><input type="radio" class="s-radio legend-place" name="legend-place" checked="checked" value="1"><label>上</label></span>
						        <span><input type="radio"  class="s-radio legend-place" name="legend-place" value="2"><label>下</label></span>
						        <span><input type="radio"  class="s-radio legend-place" name="legend-place" value="3"><label>左</label></span>
						        <span><input type="radio"  class="s-radio legend-place" name="legend-place" value="4"><label>右</label></span>
						        <span><input type="radio"  class="s-radio legend-place" name="legend-place" value="5"><label>无</label></span>
						    </div>
						</div>
				`
		this.viewStyleBox.html(htmlStr);
	}

	pieInit() {
		const htmlStr = ` `;
		this.viewStyleBox.html(htmlStr);
	}
	raderInit() {
		const htmlStr = ` `;
		this.viewStyleBox.html(htmlStr);
	}
	scatterInit() {
		const htmlStr = ` `;
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

		const chartName = $("#componentName").val().trim();
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
					obj.lineType="3";
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
							obj.lineType="3";
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

		switch(viewType){
			case "pie":
				chartType = "5";
				const roseType= "0",	
					  rowDim = "4";
				flagObj = {roseType,rowDim};

				break;
			case "scatter":
				chartType = "7";
				break;
			case "rader":
				chartType = "6";
				const area= "1";
				flagObj = {area};

				break;
			default:{
				chartType = "4" ;
				const landscape= $(".landscape")[0].checked && "1" || "0",
					  stack= $(".stack")[0].checked && "1" || "0",
					  threeD= "0",
					  maxVal= "@",
					  minVal= "@",
					  moreAxis= "0";
				flagObj = {landscape,stack,threeD,maxVal,minVal,moreAxis}
				break;
			}
		};


	 	const dimId = this.zbComponent.publicDimArr[0]!=="dim_2";

		return Object.assign(this.getCommonValue("chart",dimId),flagObj,{
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

		api[methodType.url](object).then(node => {

			if (node.data && node.data.length) {

					page.viewData.add(object,viewType,node);

				/*api[methodType.save](object).then(res => {

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

				});*/

			} else {
				
				alert("数据出错！");

			}


		});

		return [];
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
		$("#viewSure").click(function() {

			const noFill = $setMd.find(".no-fill:visible");
			if(noFill.length){
				
				alert("请填完必填项！");
				return ;

			}
			self.getSetData();
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


class Page{
	constructor(g){

		// 模态框
		this.modal = new SModal();
		this.inp = new SInp();
		this.viewSetModal = new ViewSetModal();
		this.viewComponet = new ViewComponet();
		this.viewData = new DataDB();
	    new HeadOpt(); 
	    new TemplateView($("#templateBox"));
	}
}


const page = new Page();


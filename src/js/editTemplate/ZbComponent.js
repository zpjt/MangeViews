import {SCombobox, Tree } from "js/common/Unit.js";
import {api } from "api/editTemplate.js";
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

		const {kpiTree, dimTree, modal ,getViewModal,unit} = config;

		this.dimTree = dimTree;
		this.getViewModal = getViewModal;
		this.modal = modal;
		this.zbBox = $("#zbTreeBox");
		this.selZbs = $("#selZbs");
		this.publicDimEl = $("#publicDim");
		this.init(kpiTree);
		this.handle();
	}


	init(kpiTree) {

		this.zbTree = new Tree($("#zbTree"), {
			"clickAndCheck": false,
			"checkbox": true,
			data: kpiTree,
			idField: "kpi_id",
			textField: "kpi_name",
			"childIcon":"sicon sicon-kpi",
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

	/**
	 * [重新加载XY轴，注意饼图只有X选择]
	 * @return {[type]} [description]
	 */
	relaodXYCombo(viewSetModal,specialWd,yAxisData,commonObj){

		viewSetModal.wd_arr = specialWd; // 用于在 viewSetModal类里使用

			let yData ,xData ;
		
		if(commonObj){//是修改回填
						
		
		
			if(viewSetModal.viewType !== "pie"){
				const {xAxis,yAxis} = commonObj ;
				yData = yAxisData.filter(val=>!xAxis.includes(val.id));
				xData = viewSetModal.wd_arr.filter(val=>!yAxis.includes(val.id))
		
			}else{
				yData = yAxisData;
				xData = viewSetModal.wd_arr;
			}

			viewSetModal.yAxis.loadData(yData);
			viewSetModal.xAxis.loadData(xData);
			this.setCommonVal(commonObj,viewSetModal);
	
		}else{//是新建 和再次修改



			if(viewSetModal.viewType !== "pie"){

				const wd_id = viewSetModal.viewType === "table" && "4" || "3";
				const yAxis = viewSetModal.yAxis.selValue;
		  	const xAxis = viewSetModal.xAxis.selValue;
				yData = yAxisData.filter(val=>!xAxis.includes(val.id));
				xData = viewSetModal.wd_arr.filter(val=>!yAxis.includes(val.id));

				if(yAxis.includes(wd_id) && !yData.includes(wd_id)){
					viewSetModal.yAxis.clearValue();
				}

				if(xAxis.includes(wd_id) && !xData.includes(wd_id)){
						viewSetModal.xAxis.clearValue();
				}
		
			}else{

				yData = yAxisData;
				xData = viewSetModal.wd_arr;
				const yAxis = viewSetModal.yAxis.selValue;

				if(yAxis.includes("3") && !yData.includes("3")){
						viewSetModal.yAxis.clearValue();
				}

			}

			viewSetModal.yAxis.loadData(yData);
			viewSetModal.xAxis.loadData(xData);

			

			

		}
	}
	/**
	 * [classifyZb description]
	 * @param  {[type]} kpi          [选择的指标id]
	 * @param  {[type]} values       [选择的指标对象节点]
	 * @param  {[type]} viewSetModal [组件模态框类]
	 * @param  {Array}  dimVals      [有主题维度的指标所选择的主题维度值]
	 * @param  {[type]} commonObj    [公共设置：xAxis:x轴，yAxis:y轴，日历：{
	 * 			time_start:结束时间,
				time_id：开始时间,}，orgs:科室，主题维度下拉框值：pubDimValue]
	 * @return {[type]}              [description]
	 */
	
	classifyZb(kpi, values,viewSetModal,dimVals=[],commonObj) {

		api.GroupKpiByDim({
			kpi
		}).then(res => {

			if (res) {

				const wd_arr_common = ZbComponent.wd_arr_common;

				const dimArr = Object.keys(res);
				const excelDim_2 = [];

				const publicDim = dimArr.length === 1 && dimArr[0] !== "dim_2" && true || false;



				this.publicDim = publicDim;
				this.publicDimArr = dimArr;
				this.isOneZb = kpi.length > 1;

				// 只有table 类型的x轴维度才可以选择指标
				const specialWd = viewSetModal.viewType === "table" ?
				     [...wd_arr_common, {"id": "3", "text": "指标"}, {"id": "4", "text": "维度值"}] :
				     [...wd_arr_common, { "id": "3", "text": "维度值" }];

				!publicDim &&	 specialWd.pop();//去掉维度值选项,让yAxisData与它同步

				
				let yAxisData = viewSetModal.viewType !== "table" ?
					 this.isOneZb ? [{"id":"4","text":"指标"}] : [...specialWd,{"id":"4","text":"指标"}]
					 : specialWd;

			

				//获取分类好了的指标数组
				let htmlStr;
				
				if(!publicDim){
					const zbObj = dimArr.map((key) => {
					
								const dimId = key.split("_")[1];
								const zbArr = values.filter(node => {
									return res[key].includes(node.kpi_id);
								});

								let dimName = null;

								if (dimId != "2") {
									const dimWd = this.findDimData(dimId);
									dimName = dimWd.dim_name;
								}

								const dimItem = zbArr.map(val => this.renderZb(val, {key, dimName}));
								const dimClass = dimId !== "2" && "dim-wdItem" || "";
								return `<div class="dim-item ${dimClass}" dim-id="${dimId}" dim-name="${dimName}">
													${dimItem.join("")}
										  </div>`;
					});
					 htmlStr = zbObj.join("") ;

				 	 this.publicDimEl.hide();
					 this.relaodXYCombo(viewSetModal,specialWd,yAxisData,commonObj);//重新加载下拉框
				
				}else{
					const zbObj = values.map(val => this.renderZb(val,{key:"dim_2", dimName: ""}));
					 htmlStr = `<div class="publicDim dim-item" >${zbObj.join("")}</div>`;

					const dimId = dimArr[0].split("_")[1];
					const dImNode = this.findDimData(dimId);
					viewSetModal.dimWd.loadData(dImNode.sub);
					viewSetModal.dimWd.clearValue();

					this.relaodXYCombo(viewSetModal,specialWd,yAxisData,commonObj);//重新加载下拉框

					this.publicDimEl.show();
					this.publicDimEl.attr("dim-id",dimId);
					this.publicDimEl.attr("dim-name",dImNode.dim_name);

				}
				

				//渲染分类
				this.selZbs.html(htmlStr);
				// 渲染每个有主题维度的指标下拉框
				this.renderDimBox(dimVals,dimArr);

			} else {

				this.unit.tipToast("获取数据出错！",0);

			}


		})
	}
	/**
	 * [设置属性值，下拉框的]
	 * @param {[type]} commonObj    [description]
	 * @param {[type]} viewSetModal [description]
	 */
	setCommonVal(commonObj,viewSetModal){

		const {xAxis,yAxis,orgs,time_start,time_id,pubDimValue} = commonObj;

		let arr = null ,
			sel_arr = null;

		if(viewSetModal.viewType==="table"){

			viewSetModal.yAxis.setValue(yAxis);
			viewSetModal.xAxis.setValue(xAxis);
			 sel_arr = xAxis.concat(yAxis);
			 arr = ["1","2","3","4"].filter(val=>!sel_arr.includes(val));
	
		}else{
			viewSetModal.yAxis.setValue(yAxis);
			viewSetModal.viewType !=="pie" && viewSetModal.xAxis.setValue(xAxis);

			sel_arr = viewSetModal.viewType==="pie" && [yAxis] || [xAxis,yAxis];
			 arr = ["1","2","3","4"].filter(val=>!sel_arr.includes(val));
		}


		const wd_id = viewSetModal.viewType === "table" ? "4" : "3" ;
		/**
		 * arr：没有选择的维度 ，sel_arr：已经选择的维度
		 * @param  {Array} arr [没有选的就是单选]
		 * @return {[Array]} ，sel_arr    [选了的就是多选]
		 */	
		arr.forEach(val=>{

				switch (val) {
					case "1": // 日历
						viewSetModal.calendar.changeStyle(1,[time_id]);
						break;
					case "2": //科室
						viewSetModal.orgWd.changeType(false,orgs[0]);
						break;
					case wd_id:{ // 维度值
						 viewSetModal.dimWd.config.multiply = false;
						 pubDimValue.length && viewSetModal.dimWd.setValue(pubDimValue[0]);
						}
						break;
				}
		});
	
		sel_arr.forEach(val=>{

			switch (val) {
				case "1": // 日历
					viewSetModal.calendar.changeStyle(2,[time_id,time_start]);
					break;
				case "2": //科室
					viewSetModal.orgWd.changeType(true,orgs);
					break;
				case wd_id:{ // 维度值
				   	 viewSetModal.dimWd.config.multiply = true;
					 viewSetModal.dimWd.setValue(pubDimValue);
					}
					break;
			}
		});
	}
	
	renderDimBox(dimVals,dimArr){

		if(dimVals.length){

					dimVals.map(val=>{
						const {dimVal,kpiId,dimId} = val ;
						const dimCombobox = $(`#selZbs .dimCombobox[kpi_id=${kpiId}]`);
						const data = this.findDimData(dimId).sub;
						new SCombobox(dimCombobox, {
											data: data,
											textField: "dim_name",
											idField: "dim_value",
											defaultVal:dimVal,
											width:300,
										});
					});	
				
				}else{

					dimArr.length > 1 && $.map($("#selZbs .dim-item"), val => {

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
											width:300,
										});
									});

				}

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
					<div class=" zb-item-box">
						<div >
							<span class="s-btn zb-name dim-zb" echo-id="${kpi_id}">
								<i class="fa fa-times-circle del-zb"></i>
								<b>${kpi_name}</b>
							</span>
						</div>
						<div class="sel-item zb-dim-combobox" >
							<span >${dimName}:</span>
							<div class="s-comboBox dimCombobox" kpi_id="${kpi_id}">
						  </div>
						</div>
					</div>
					`;
		} else {
			str = `<span class="zb-item-box">
			   			<span class="s-btn zb-name" echo-id="${kpi_id}">
	   						<i class="fa fa-times-circle del-zb"></i>
							<b>${kpi_name}</b>
					    </span>
				    </span>`;
		}

		return str;
	}

	setZbTree(viewType,object){

		let selID = null ,commonObj = null , dim_vals = [];

		if(viewType==="table"){
			const {kpi_infos=[],kpis,dim_x,time_start,time_id,orgs,row_wd,col_wd,pub_dim_vals=[]} = object ;
			const id_1= kpis.map(val=>val.id);
			const id_2= kpi_infos.map(val=>{

				const {kpi_id,dim_val,dim_id} = val ;
				
					dim_vals.push({dimVal:dim_val,kpiId:kpi_id,dimId:dim_id});

					return kpi_id ;
			});

			selID = id_1.concat(id_2);
			commonObj = {
				time_start,
				time_id,
				orgs:orgs.map(val=>val.id),
				xAxis:row_wd,
				yAxis:col_wd,
				pubDimValue:pub_dim_vals.map(val=>val.id),
			}
	
		}else {
			const {kpisDimX=[],kpis,dim_x,time_start,time_id,orgs,contrastDim,rowDim,pubDimValue=[]} = object ;
			const id_1= kpis.map(val=>val.id);
			const id_2= kpisDimX.map(val=>{
				
				const {kpiId,dimVal,dimId} = val ;
				
					dim_vals.push({dimVal,kpiId,dimId});
				return kpiId;

			});
			selID = id_1.concat(id_2);
			commonObj = {
				time_start,
				time_id,
				orgs:orgs.map(val=>val.id),
				xAxis:rowDim,
				yAxis:contrastDim,
				pubDimValue:pubDimValue.map(val=>val.id)
			};
		};
		// 设置指标树选中的
		selID && this.zbTree.setValue(selID);

		return {commonObj,dim_vals};
	}

	sureBtnHandle(viewSetModal,object={},viewType=""){
		
		const {commonObj,dim_vals} = viewType && this.setZbTree(viewType,object) || {commonObj:null,dim_vals:[]};


		const values = this.zbTree.selArr,
			   ids = values.map(val => val.kpi_id);
		
		if (!ids.length) {
			return;
		}
		this.classifyZb(ids,values,viewSetModal,dim_vals,commonObj);
		this.modal.close(this.zbBox, "active");
	}


	handle() {

		const self = this;
        const viewSetModal = this.getViewModal();

		/**
		 * [指标模态框句柄]
		 */
		$("#selZb").click(function() {

			const $zbBox = self.zbBox;
			if ($zbBox.hasClass("active")) {
				return;
			}
			self.modal.show($zbBox, "active");
		});

		/**
		 * [删除已经选择的指标]
		 */
		this.selZbs.on("click", ".del-zb", function() {
			const $this = $(this);
			const zb = $this.closest(".zb-item-box");
			const id = $this.parent().attr("echo-id");
			self.zbTree.box.find(`.child-checkinp[value=${id}]`).click();
			zb.remove();
			self.sureBtnHandle(viewSetModal);
		});


		/**
		 * [指标模态框操作]
		 */
		$("#zbOpt").on("click", ".s-btn", function() {

			const index = $(this).index();
			switch (index) {
				case 0: //确定
					self.sureBtnHandle(viewSetModal);
					break;
				case 1: // 取消
					self.modal.close(self.zbBox, "active");
					break;
			}

		});
		
	}
}


export {ZbComponent} ;
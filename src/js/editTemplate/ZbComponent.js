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

		const {kpiTree, dimTree, modal ,viewModal} = config;

		this.kpiTree = kpiTree;
		this.dimTree = dimTree;
		this.modal = modal;
		this.zbBox = $("#zbTreeBox");
		this.selZbs = $("#selZbs");
		this.publicDimEl = $("#publicDim");
		this.init();
		this.handle(viewModal);
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

	classifyZb(kpi, values,viewSetModal) {

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

					let yAxisData =viewSetModal.viewType !== "table" ? this.isOneZb  && [{"id":"4","text":"指标"}] || [...specialWd,{"id":"4","text":"指标"}] : specialWd;

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

					let yAxisData =viewSetModal.viewType !== "table" ? this.isOneZb  && [{"id":"4","text":"指标"}] || [...specialWd,{"id":"4","text":"指标"}] : specialWd;

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

	sureBtnHandle(viewSetModal){
		const values = this.zbTree.getValue("all");
		const ids = values.map(val => val.kpi_id);

		if (!ids.length) {
			return;
		}
		this.classifyZb(ids, values,viewSetModal);
		this.modal.close(this.zbBox, "active");
	}


	handle(viewSetModal) {

		const self = this;


		/**
		 * [指标模态框句柄]
		 */
		$("#selZb").click(function() {

			console.log(self,"fsaf");

			const $zbBox = self.zbBox;
			if ($zbBox.hasClass("active")) {
				return;
			}
			self.modal.show($zbBox, "active");
		});


		/**
		 * [指标模态框操作]
		 */
		$("#zbOpt").on("click", "button", function() {

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